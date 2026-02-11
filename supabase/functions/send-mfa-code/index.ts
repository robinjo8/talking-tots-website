import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin) || (origin.startsWith("https://") && origin.endsWith(".lovable.app"));
  const allowOrigin = isAllowed ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1000000).padStart(6, "0");
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    // Verify JWT
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { user_id, email } = await req.json();

    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: "Manjka user_id ali email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await supabase
      .from("logopedist_profiles")
      .select("id, first_name, last_name, is_verified")
      .eq("user_id", user_id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("Profile check failed:", profileError);
      return new Response(
        JSON.stringify({ error: "Uporabnik ni logoped" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profile.is_verified) {
      return new Response(
        JSON.stringify({ error: "Članstvo ni potrjeno" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentCodes } = await supabase
      .from("mfa_codes")
      .select("id, created_at")
      .eq("user_id", user_id)
      .gte("created_at", sixtySecondsAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentCodes && recentCodes.length > 0) {
      const lastCodeTime = new Date(recentCodes[0].created_at).getTime();
      const secondsRemaining = Math.ceil((lastCodeTime + 60000 - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: "Prekratek čas med pošiljanjem kod",
          seconds_remaining: Math.max(0, secondsRemaining),
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase
      .from("mfa_codes")
      .update({ used: true })
      .eq("user_id", user_id)
      .eq("used", false);

    const plainCode = generateCode();
    const hashedCode = await hashCode(plainCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from("mfa_codes").insert({
      user_id,
      code: hashedCode,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("Failed to insert MFA code:", insertError);
      return new Response(
        JSON.stringify({ error: "Napaka pri shranjevanju kode" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firstName = profile.first_name || "Uporabnik";
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "TomiTalk <noreply@tomitalk.si>",
        to: [email],
        subject: "Vaša potrditvena koda za prijavo - TomiTalk",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px; font-weight: 800; color: #22c55e;">TOMI</span>
              <span style="font-size: 28px; font-weight: 800; color: #f97316;">TALK</span>
            </div>
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 8px;">Potrditvena koda za prijavo</h2>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
              Pozdravljeni, ${firstName}! Vaša potrditvena koda za prijavo v portal za organizacije je:
            </p>
            <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e293b;">${plainCode}</span>
            </div>
            <p style="color: #64748b; font-size: 13px; margin-bottom: 8px;">
              Koda velja <strong>10 minut</strong>. Če niste zahtevali te kode, prezrite to sporočilo.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              TomiTalk – Portal za organizacije
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error("Resend error:", errorBody);
      return new Response(
        JSON.stringify({ error: "Napaka pri pošiljanju emaila" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`MFA code sent to ${email} for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Koda poslana na email",
        expires_in_seconds: 600,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-mfa-code error:", err);
    return new Response(
      JSON.stringify({ error: "Nepričakovana napaka" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
