import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-01-27.basil",
});

// Safe timestamp conversion to handle potential invalid values
const safeTimestamp = (ts: number | null | undefined): string | null => {
  if (!ts || typeof ts !== 'number' || isNaN(ts)) return null;
  try {
    return new Date(ts * 1000).toISOString();
  } catch {
    return null;
  }
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Map Stripe product IDs to plan IDs (2-tier model: Start + Pro)
const productToPlan: Record<string, string> = {
  'prod_TuvCF2Vlvmvp3M': 'start',
  'prod_TmbZ19RhCaSzrp': 'pro',   // stari Pro produkt (za nazaj)
  'prod_TwXXpvPhSYVzvN': 'pro'    // novi Pro produkt
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Helper: find user_id by Stripe customer email
async function findUserIdByCustomerId(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted || !('email' in customer) || !customer.email) {
      logStep("Customer not found or deleted", { customerId });
      return null;
    }
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === customer.email);
    if (user) {
      logStep("Found user by email fallback", { email: customer.email, userId: user.id });
      return user.id;
    }
    logStep("No user found for email", { email: customer.email });
    return null;
  } catch (err) {
    logStep("Error in findUserIdByCustomerId", { error: String(err) });
    return null;
  }
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!signature || !webhookSecret) {
    logStep("Missing signature or secret");
    return new Response("Missing signature or secret", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    logStep("Webhook signature verification failed", { error: String(err) });
    return new Response("Invalid signature", { status: 400 });
  }

  logStep("Event received", { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    logStep("Error processing event", { error: String(error) });
    return new Response("Webhook handler failed", { status: 500 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  logStep("Processing checkout.session.completed", { sessionId: session.id });
  
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  
  if (!userId && !session.customer_email) {
    logStep("No userId in metadata and no customer_email, cannot process");
    return;
  }

  // Find user_id if not in metadata
  let targetUserId = userId;
  if (!targetUserId && session.customer_email) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === session.customer_email);
    if (user) {
      targetUserId = user.id;
    } else {
      logStep("Could not find user by email", { email: session.customer_email });
      return;
    }
  }

  // Use upsert to ensure record exists (creates if missing, updates if exists)
  const { error } = await supabase
    .from("user_subscriptions")
    .upsert({ 
      user_id: targetUserId,
      stripe_customer_id: customerId,
      status: 'inactive', // Will be overridden by subscription.created webhook
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

  if (error) {
    logStep("Error upserting customer ID", { error: error.message });
  } else {
    logStep("Customer ID upserted", { userId: targetUserId, customerId });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  logStep("Processing subscription update", { 
    subscriptionId: subscription.id, 
    status: subscription.status 
  });
  
  const customerId = subscription.customer as string;
  
  // 1. Try to find user by stripe_customer_id
  const { data: existingRecord } = await supabase
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  let targetUserId = existingRecord?.user_id;

  // 2. Fallback: find user by Stripe customer email
  if (!targetUserId) {
    logStep("No record found by stripe_customer_id, trying email fallback", { customerId });
    targetUserId = await findUserIdByCustomerId(customerId);
  }

  if (!targetUserId) {
    logStep("Could not find user for subscription update", { customerId });
    return;
  }

  // Get product ID and map to plan
  const productId = subscription.items.data[0]?.price?.product as string;
  const planId = productToPlan[productId] || null;

  // If cancel_at_period_end is true, user has canceled but subscription is still active until period end
  const effectiveStatus = subscription.cancel_at_period_end ? 'canceled' : subscription.status;

  // Use upsert to handle both existing and missing records
  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: targetUserId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_product_id: productId,
    plan_id: planId,
    status: effectiveStatus,
    current_period_start: safeTimestamp(subscription.current_period_start) || new Date().toISOString(),
    current_period_end: safeTimestamp(subscription.current_period_end) || new Date().toISOString(),
    trial_end: safeTimestamp(subscription.trial_end),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });

  if (error) {
    logStep("Error upserting subscription", { error: error.message });
    throw error;
  }

  logStep("Subscription upserted successfully", { 
    userId: targetUserId, 
    planId, 
    status: effectiveStatus 
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logStep("Processing subscription deletion", { subscriptionId: subscription.id });
  
  const customerId = subscription.customer as string;

  const { error } = await supabase.from("user_subscriptions")
    .update({
      status: "inactive",
      stripe_subscription_id: null,
      plan_id: null,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString()
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    logStep("Error deleting subscription", { error: error.message });
    throw error;
  }

  logStep("Subscription marked as inactive", { customerId });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  logStep("Processing payment failure", { invoiceId: invoice.id });
  
  const customerId = invoice.customer as string;

  const { error } = await supabase.from("user_subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString()
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    logStep("Error updating subscription to past_due", { error: error.message });
    throw error;
  }

  logStep("Subscription marked as past_due", { customerId });
}
