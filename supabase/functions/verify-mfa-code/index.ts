import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, code } = await req.json();

    if (!user_id || !code) {
      return new Response(
        JSON.stringify({ error: "Manjka user_id ali code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: "Neveljavna oblika kode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Get the latest unused, non-expired code for this user
    const { data: mfaCode, error: fetchError } = await supabase
      .from("mfa_codes")
      .select("*")
      .eq("user_id", user_id)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch MFA code:", fetchError);
      return new Response(
        JSON.stringify({ error: "Napaka pri preverjanju kode" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!mfaCode) {
      return new Response(
        JSON.stringify({
          error: "Koda je potekla ali ne obstaja. Zahtevajte novo kodo.",
          expired: true,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check attempt limit (max 5)
    if (mfaCode.attempts >= 5) {
      // Mark code as used (locked out)
      await supabase
        .from("mfa_codes")
        .update({ used: true })
        .eq("id", mfaCode.id);

      return new Response(
        JSON.stringify({
          error: "Preveč neuspelih poskusov. Zahtevajte novo kodo.",
          locked: true,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Hash the submitted code and compare
    const hashedSubmitted = await hashCode(code);

    if (hashedSubmitted !== mfaCode.code) {
      // Increment attempts
      const newAttempts = mfaCode.attempts + 1;
      await supabase
        .from("mfa_codes")
        .update({ attempts: newAttempts })
        .eq("id", mfaCode.id);

      const remainingAttempts = 5 - newAttempts;
      return new Response(
        JSON.stringify({
          error: `Napačna koda. Preostali poskusi: ${remainingAttempts}`,
          remaining_attempts: remainingAttempts,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Code is correct! Mark as used
    await supabase
      .from("mfa_codes")
      .update({ used: true })
      .eq("id", mfaCode.id);

    console.log(`MFA verified successfully for user ${user_id}`);

    return new Response(
      JSON.stringify({ success: true, message: "Koda potrjena" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-mfa-code error:", err);
    return new Response(
      JSON.stringify({ error: "Nepričakovana napaka" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
