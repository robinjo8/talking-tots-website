import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-12-15.clover",
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

// Map Stripe product IDs to plan IDs
const productToPlan: Record<string, string> = {
  'prod_TmbXrf2SNJLlHM': 'start',
  'prod_TmbXaM32ndD11d': 'plus',
  'prod_TmbZ19RhCaSzrp': 'pro'
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

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
  
  // Get user_id from metadata (set during checkout creation)
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  
  if (!userId) {
    logStep("No userId in session metadata, attempting to find by email");
    
    // Try to find user by customer email
    if (session.customer_email) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find(u => u.email === session.customer_email);
      
      if (user) {
        await upsertSubscription(user.id, customerId);
        logStep("Created subscription record for user found by email", { userId: user.id });
      } else {
        logStep("Could not find user by email", { email: session.customer_email });
      }
    }
    return;
  }
  
  await upsertSubscription(userId, customerId);
  logStep("Subscription record created/updated", { userId, customerId });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  logStep("Processing subscription update", { 
    subscriptionId: subscription.id, 
    status: subscription.status 
  });
  
  const customerId = subscription.customer as string;
  
  // Find user by stripe_customer_id
  const { data: existingRecord } = await supabase
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!existingRecord) {
    logStep("No subscription record found for customer", { customerId });
    return;
  }

  // Get product ID and map to plan
  const productId = subscription.items.data[0]?.price?.product as string;
  const planId = productToPlan[productId] || null;

  // If cancel_at_period_end is true, user has canceled but subscription is still active until period end
  const effectiveStatus = subscription.cancel_at_period_end ? 'canceled' : subscription.status;

  const { error } = await supabase.from("user_subscriptions").update({
    stripe_subscription_id: subscription.id,
    stripe_product_id: productId,
    plan_id: planId,
    status: effectiveStatus,
    current_period_start: safeTimestamp(subscription.current_period_start) || new Date().toISOString(),
    current_period_end: safeTimestamp(subscription.current_period_end) || new Date().toISOString(),
    trial_end: safeTimestamp(subscription.trial_end),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString()
  }).eq("user_id", existingRecord.user_id);

  if (error) {
    logStep("Error updating subscription", { error: error.message });
    throw error;
  }

  logStep("Subscription updated successfully", { 
    userId: existingRecord.user_id, 
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

async function upsertSubscription(userId: string, customerId: string) {
  // First, check if a record already exists with an active/trialing status
  const { data: existing } = await supabase
    .from("user_subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  // If subscription is already active or trialing, don't overwrite with inactive
  if (existing && (existing.status === 'active' || existing.status === 'trialing')) {
    logStep("Subscription already active, skipping upsert to prevent overwrite", { 
      userId, 
      currentStatus: existing.status 
    });
    // Still update stripe_customer_id if needed
    await supabase.from("user_subscriptions")
      .update({ 
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);
    return;
  }

  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    status: 'inactive', // Only set if no active subscription exists
    updated_at: new Date().toISOString()
  }, { 
    onConflict: "user_id" 
  });

  if (error) {
    logStep("Error upserting subscription", { error: error.message });
    throw error;
  }
}
