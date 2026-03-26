import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    let userId: string;
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      userId = payload.sub;
      if (!userId) throw new Error("No sub in token");
    } catch {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { childId, adminOverride } = await req.json();
    if (!childId) {
      return new Response(JSON.stringify({ error: "childId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Dev user email check
    const ALLOWED_EMAILS = ["qjavec@gmail.com", "kujavec.robert@gmail.com"];
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (!userData?.user?.email || !ALLOWED_EMAILS.includes(userData.user.email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify authorization
    if (adminOverride) {
      // Check if caller is a logopedist or super admin
      const { data: logProfile } = await supabase
        .from("logopedist_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const { data: adminPerm } = await supabase
        .from("admin_permissions")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "super_admin")
        .eq("is_active", true)
        .maybeSingle();

      if (!logProfile && !adminPerm) {
        return new Response(
          JSON.stringify({ error: "Not authorized as admin/logopedist" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Parent flow: verify child belongs to this parent
      const { data: child, error: childError } = await supabase
        .from("children")
        .select("id, parent_id")
        .eq("id", childId)
        .eq("parent_id", userId)
        .maybeSingle();

      if (childError || !child) {
        return new Response(
          JSON.stringify({ error: "Child not found or not yours" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 1. Find all additional test assignments for this child
    const { data: assignments } = await supabase
      .from("additional_test_assignments")
      .select("id, session_id")
      .eq("child_id", childId);

    if (!assignments || assignments.length === 0) {
      return new Response(
        JSON.stringify({ success: true, deleted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const assignmentIds = assignments.map((a: { id: string }) => a.id);
    const sessionIds = assignments
      .filter((a: { session_id: string | null }) => a.session_id)
      .map((a: { session_id: string }) => a.session_id);

    // 2. Find sessions linked via additional_assignment_id
    const { data: linkedSessions } = await supabase
      .from("articulation_test_sessions")
      .select("id")
      .in("additional_assignment_id", assignmentIds);

    const allSessionIds = [
      ...new Set([
        ...sessionIds,
        ...(linkedSessions || []).map((s: { id: string }) => s.id),
      ]),
    ];

    // 3. Delete word results for linked sessions
    if (allSessionIds.length > 0) {
      await supabase
        .from("articulation_word_results")
        .delete()
        .in("session_id", allSessionIds);

      // Delete evaluations for linked sessions
      await supabase
        .from("articulation_evaluations")
        .delete()
        .in("session_id", allSessionIds);

      // Delete the sessions themselves
      await supabase
        .from("articulation_test_sessions")
        .delete()
        .in("id", allSessionIds);
    }

    // 4. Delete additional test words
    await supabase
      .from("additional_test_words")
      .delete()
      .in("assignment_id", assignmentIds);

    // 5. Delete additional test assignments
    await supabase
      .from("additional_test_assignments")
      .delete()
      .in("id", assignmentIds);

    return new Response(
      JSON.stringify({
        success: true,
        deleted: assignments.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Reset additional test error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
