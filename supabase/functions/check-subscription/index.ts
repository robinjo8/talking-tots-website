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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header, returning unsubscribed");
      return new Response(JSON.stringify({ 
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        isTrialing: false,
        trialEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      logStep("Auth failed, returning unsubscribed", { error: userError?.message });
      return new Response(JSON.stringify({ 
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        isTrialing: false,
        trialEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // PRIMARY: Check database first (synced by webhooks)
    const { data: sub, error: subError } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (sub && sub.status !== 'inactive') {
      logStep("Found subscription in database", { 
        status: sub.status, 
        planId: sub.plan_id 
      });
      
      // Determine if still subscribed (active, trialing, or canceled but in period)
      const isActive = sub.status === 'active' || sub.status === 'trialing';
      const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
      const isStillInPeriod = periodEnd && periodEnd > new Date();
      const isSubscribed = isActive || (sub.status === 'canceled' && isStillInPeriod);

      return new Response(JSON.stringify({
        subscribed: isSubscribed,
        productId: sub.stripe_product_id,
        subscriptionEnd: sub.current_period_end,
        isTrialing: sub.status === 'trialing',
        trialEnd: sub.trial_end
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // FALLBACK: Check Stripe directly (for users not yet in database)
    logStep("No subscription in database, checking Stripe as fallback");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY not set, returning unsubscribed");
      return new Response(JSON.stringify({ 
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        isTrialing: false,
        trialEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning unsubscribed");
      return new Response(JSON.stringify({ 
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        isTrialing: false,
        trialEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });
    
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
      
      if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      }
      
      if (isTrialing && subscription.trial_end && typeof subscription.trial_end === 'number') {
        trialEnd = new Date(subscription.trial_end * 1000).toISOString();
      }
      
      const subscriptionItem = subscription.items?.data?.[0];
      if (subscriptionItem?.price?.product) {
        const product = subscriptionItem.price.product;
        productId = typeof product === 'string' ? product : product?.id || null;
      }

      // Sync to database for future lookups
      await supabaseClient.from("user_subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        stripe_product_id: productId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: subscriptionEnd,
        trial_end: trialEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      
      logStep("Synced Stripe subscription to database");
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
