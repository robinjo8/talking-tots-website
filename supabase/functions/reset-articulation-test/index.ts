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
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { childId } = await req.json();
    if (!childId) {
      return new Response(JSON.stringify({ error: "childId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for full access
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify child belongs to this parent
    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, parent_id")
      .eq("id", childId)
      .eq("parent_id", user.id)
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

    // 1. Find all sessions for this child
    const { data: sessions } = await supabase
      .from("articulation_test_sessions")
      .select("id")
      .eq("child_id", childId)
      .eq("parent_id", user.id);

    const sessionIds = (sessions || []).map((s: { id: string }) => s.id);

    // 2. Delete word results for all sessions
    if (sessionIds.length > 0) {
      const { error: wordError } = await supabase
        .from("articulation_word_results")
        .delete()
        .in("session_id", sessionIds);

      if (wordError) {
        console.error("Error deleting word results:", wordError);
      }
    }

    // 3. Delete all sessions
    const { error: sessionError } = await supabase
      .from("articulation_test_sessions")
      .delete()
      .eq("child_id", childId)
      .eq("parent_id", user.id);

    if (sessionError) {
      console.error("Error deleting sessions:", sessionError);
    }

    // 4. Delete test results
    const { error: resultError } = await supabase
      .from("articulation_test_results")
      .delete()
      .eq("child_id", childId);

    if (resultError) {
      console.error("Error deleting test results:", resultError);
    }

    // 5. Delete audio files from storage
    const storagePath = `${user.id}/${childId}/Preverjanje-izgovorjave`;
    const { data: folders } = await supabase.storage
      .from("uporabniski-profili")
      .list(storagePath);

    if (folders && folders.length > 0) {
      for (const folder of folders) {
        const folderPath = `${storagePath}/${folder.name}`;
        const { data: files } = await supabase.storage
          .from("uporabniski-profili")
          .list(folderPath);

        if (files && files.length > 0) {
          const filePaths = files.map(
            (f: { name: string }) => `${folderPath}/${f.name}`
          );
          await supabase.storage
            .from("uporabniski-profili")
            .remove(filePaths);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        deletedSessions: sessionIds.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Reset error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
