import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state");
      return new Response(JSON.stringify({ 
        subscribed: false,
        productId: null,
        subscriptionEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10, // Get more to find valid ones
    });
    
    // Filter to active or trialing subscriptions that are NOT canceled
    // When user cancels, cancel_at_period_end becomes true - we treat this as unsubscribed
    const activeOrTrialingSub = subscriptions.data.find(
      sub => (sub.status === 'active' || sub.status === 'trialing') && !sub.cancel_at_period_end
    );
    
    const hasActiveSub = !!activeOrTrialingSub;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let isTrialing = false;
    let trialEnd: string | null = null;

    if (hasActiveSub && activeOrTrialingSub) {
      const subscription = activeOrTrialingSub;
      isTrialing = subscription.status === 'trialing';
      logStep("Subscription found", { 
        subscriptionId: subscription.id, 
        status: subscription.status,
        isTrialing 
      });
      
      // Safely convert timestamps
      if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
        try {
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
          logStep("Subscription end date", { subscriptionEnd });
        } catch (e) {
          logStep("Failed to parse subscription end date", { current_period_end: subscription.current_period_end });
          subscriptionEnd = null;
        }
      }
      
      // Get trial end date if trialing
      if (isTrialing && subscription.trial_end && typeof subscription.trial_end === 'number') {
        try {
          trialEnd = new Date(subscription.trial_end * 1000).toISOString();
          logStep("Trial end date", { trialEnd });
        } catch (e) {
          logStep("Failed to parse trial end date", { trial_end: subscription.trial_end });
          trialEnd = null;
        }
      }
      
      // Get product ID from the subscription
      const subscriptionItem = subscription.items?.data?.[0];
      if (subscriptionItem?.price?.product) {
        const product = subscriptionItem.price.product;
        productId = typeof product === 'string' ? product : product?.id || null;
        logStep("Determined subscription product", { productId });
      }
    } else {
      logStep("No active or trialing subscription found");
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      productId,
      subscriptionEnd,
      isTrialing,
      trialEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
