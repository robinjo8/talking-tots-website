import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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

    // Get request body
    const { priceId, planId } = await req.json();
    logStep("Received request", { priceId, planId });

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Get Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header provided");
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    logStep("Attempting to authenticate user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      logStep("Auth error", { error: userError.message });
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    
    const user = userData.user;
    
    if (!user?.email) {
      logStep("No user or email found", { user: user ? "exists" : "null", email: user?.email });
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this user, or create one
    let customerId: string;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create a new customer - required for Stripe Accounts V2
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = newCustomer.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Check for existing active or trialing subscriptions to prevent duplicates
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'trialing',
      limit: 1
    });

    if (existingSubscriptions.data.length > 0 || trialingSubscriptions.data.length > 0) {
      const existingSub = existingSubscriptions.data[0] || trialingSubscriptions.data[0];
      logStep("User already has active subscription", { 
        customerId, 
        subscriptionId: existingSub.id,
        status: existingSub.status
      });
      throw new Error("Že imate aktivno naročnino. Za spremembo paketa uporabite upravljanje naročnine.");
    }
    
    logStep("No existing subscriptions found, proceeding with checkout");

    logStep("Proceeding with checkout session creation");

    // Save customer ID to user_subscriptions table for webhook matching
    const { error: upsertError } = await supabaseClient.from("user_subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: 'inactive', // Will be updated by webhooks
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    
    if (upsertError) {
      logStep("Warning: Could not save customer ID to database", { error: upsertError.message });
    } else {
      logStep("Customer ID saved to database", { userId: user.id, customerId });
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "https://tomitalk.com";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: {
        userId: user.id,
        planId: planId || '',
      },
    });
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
