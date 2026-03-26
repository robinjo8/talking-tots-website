import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_EMAILS = ["qjavec@gmail.com", "kujavec.robert@gmail.com"];

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
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.sub;
      if (!userId) throw new Error("No sub");
    } catch {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Email check
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (!userData?.user?.email || !ALLOWED_EMAILS.includes(userData.user.email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { childId, action } = body;

    if (!childId || !action) {
      return new Response(JSON.stringify({ error: "childId and action required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: any = {};

    if (action === "complete_all_sets") {
      // Find active plan
      const { data: plan } = await supabase
        .from("child_monthly_plans")
        .select("id, plan_data")
        .eq("child_id", childId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!plan) {
        return new Response(JSON.stringify({ error: "No active plan found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get current max set
      const { data: existing } = await supabase
        .from("plan_set_tracking")
        .select("set_number")
        .eq("plan_id", plan.id)
        .eq("child_id", childId)
        .order("set_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      const startSet = (existing?.set_number || 0) + 1;
      const endSet = startSet + 29;

      // Bulk insert set tracking
      const sets = [];
      const now = new Date();
      for (let i = startSet; i <= endSet; i++) {
        const startedAt = new Date(now.getTime() - (endSet - i) * 86400000);
        sets.push({
          plan_id: plan.id,
          child_id: childId,
          set_number: i,
          status: "completed",
          total_stars: Math.floor(Math.random() * 3) + 1,
          started_at: startedAt.toISOString(),
          completed_at: new Date(startedAt.getTime() + 3600000).toISOString(),
        });
      }

      const { error: insertError } = await supabase
        .from("plan_set_tracking")
        .insert(sets);

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      result = { completed: endSet - startSet + 1, fromSet: startSet, toSet: endSet };

    } else if (action === "simulate_age_transition") {
      // Shift birth_date 1 year back
      const { data: child } = await supabase
        .from("children")
        .select("birth_date")
        .eq("id", childId)
        .maybeSingle();

      if (!child?.birth_date) {
        return new Response(JSON.stringify({ error: "Child has no birth_date" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const original = new Date(child.birth_date);
      const shifted = new Date(original);
      shifted.setFullYear(shifted.getFullYear() - 1);

      await supabase
        .from("children")
        .update({ birth_date: shifted.toISOString().split("T")[0] })
        .eq("id", childId);

      result = {
        originalBirthDate: child.birth_date,
        newBirthDate: shifted.toISOString().split("T")[0],
      };

    } else if (action === "reset_plan") {
      // Archive active plans and delete tracking
      const { data: plans } = await supabase
        .from("child_monthly_plans")
        .select("id")
        .eq("child_id", childId)
        .in("status", ["active", "pending"]);

      if (plans && plans.length > 0) {
        const planIds = plans.map((p: { id: string }) => p.id);

        await supabase
          .from("plan_activity_completions")
          .delete()
          .in("plan_id", planIds);

        await supabase
          .from("plan_set_tracking")
          .delete()
          .in("plan_id", planIds);

        await supabase
          .from("child_monthly_plans")
          .update({ status: "archived" })
          .in("id", planIds);

        result = { archivedPlans: planIds.length };
      } else {
        result = { archivedPlans: 0 };
      }

    } else if (action === "simulate_delayed_test") {
      const daysAgo = body.daysAgo || 100;
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - daysAgo);

      const { error } = await supabase
        .from("articulation_test_results")
        .insert({
          child_id: childId,
          completed_at: testDate.toISOString(),
        });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      result = { simulatedDate: testDate.toISOString(), daysAgo };

    } else if (action === "simulate_subscription_change") {
      const subAction = body.subAction; // extend, cancel, expire
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!sub) {
        result = { error: "No subscription found", note: "user_subscriptions table may not exist or no rows" };
      } else {
        if (subAction === "extend") {
          const newEnd = new Date(sub.current_period_end);
          newEnd.setFullYear(newEnd.getFullYear() + 1);
          await supabase
            .from("user_subscriptions")
            .update({ current_period_end: newEnd.toISOString() })
            .eq("id", sub.id);
          result = { action: "extended", newEnd: newEnd.toISOString() };
        } else if (subAction === "cancel") {
          await supabase
            .from("user_subscriptions")
            .update({ cancel_at_period_end: true })
            .eq("id", sub.id);
          result = { action: "cancelled" };
        } else if (subAction === "expire") {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          await supabase
            .from("user_subscriptions")
            .update({ current_period_end: yesterday.toISOString(), status: "expired" })
            .eq("id", sub.id);
          result = { action: "expired" };
        }
      }

    } else if (action === "simulate_full_test") {
      // Call simulate-articulation-test to create a full session with 60 words
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const simResponse = await fetch(`${supabaseUrl}/functions/v1/simulate-articulation-test`, {
        method: "POST",
        headers: {
          "Authorization": authHeader!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ childId: childId }),
      });

      if (!simResponse.ok) {
        const errText = await simResponse.text();
        return new Response(JSON.stringify({ error: `simulate-articulation-test failed: ${errText}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const simResult = await simResponse.json();

      result = { 
        sessionCreated: true, 
        sessionId: simResult.sessionId || simResult.id,
        note: "Seja ustvarjena s 60 besedami + test result dodan. Logoped lahko oceni na admin portalu."
      };

    } else if (action === "auto_evaluate_and_report") {
      // 1. Find latest pending/assigned session for this child
      const { data: session } = await supabase
        .from("articulation_test_sessions")
        .select("id, child_id, parent_id, session_number")
        .eq("child_id", childId)
        .in("status", ["pending", "assigned", "in_review"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!session) {
        return new Response(JSON.stringify({ error: "Ni neocenjene seje za tega otroka" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Get logopedist profile for dev user
      const { data: logProfile } = await supabase
        .from("logopedist_profiles")
        .select("id")
        .limit(1)
        .single();

      if (!logProfile) {
        return new Response(JSON.stringify({ error: "Dev uporabnik nima logopedist profila" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 3. Evaluate all 20 letters
      const PHONETIC_ORDER = ['P','B','M','T','D','K','G','N','H','V','J','F','L','S','Z','C','Š','Ž','Č','R'];
      const evaluations = PHONETIC_ORDER.map(letter => ({
        session_id: session.id,
        letter,
        selected_options: letter === 'R' ? ['not_acquired'] : ['acquired'],
        rating: letter === 'R' ? 1 : 3,
        comment: '',
        evaluated_by: logProfile.id,
      }));

      // Delete existing evaluations for this session first
      await supabase
        .from("articulation_evaluations")
        .delete()
        .eq("session_id", session.id);

      const { error: evalError } = await supabase
        .from("articulation_evaluations")
        .insert(evaluations);

      if (evalError) {
        console.error("Eval insert error:", evalError);
        return new Response(JSON.stringify({ error: evalError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 4. Complete the session
      await supabase
        .from("articulation_test_sessions")
        .update({
          status: "completed",
          reviewed_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          assigned_to: logProfile.id,
        })
        .eq("id", session.id);

      // 5. Generate ugotovitve text
      const ugotovitve = "Glas R ni usvojen.";

      // 6. Build report text
      const timestamp = new Date().toISOString().split("T")[0];
      const reportText = [
        "===== POROČILO LOGOPEDA =====",
        "",
        "ANAMNEZA:",
        "Test",
        "",
        "UGOTOVITVE:",
        ugotovitve,
        "",
        "PRIPOROČAMO IGRE IN VAJE ZA GLAS:",
        "R - začetek, sredina/konec, začetne vaje",
        "",
        "VAJE ZA MOTORIKO GOVORIL:",
        "enkrat na teden",
        "",
        "OGLED VIDEO NAVODIL:",
        "R",
        "",
        `Datum: ${timestamp}`,
      ].join("\n");

      // 7. Upload .txt to storage
      const parentId = session.parent_id;
      const filePath = `${parentId}/${childId}/Porocila/porocilo-${timestamp}.txt`;
      const encoder = new TextEncoder();
      const reportBlob = encoder.encode(reportText);

      const { error: uploadError } = await supabase.storage
        .from("uporabniski-profili")
        .upload(filePath, reportBlob, {
          contentType: "text/plain",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
      }

      // 8. Build report details matching admin portal format
      const reportDetails = {
        letters: [{ letter: "R", positions: ["začetek", "sredina/konec"], includeBeginnerExercises: true }],
        motorika: { type: "weekly", count: 1, unit: "week" },
        videoLetters: ["R"],
      };

      // 9. Insert logopedist_reports
      const { data: insertedReport, error: reportError } = await supabase
        .from("logopedist_reports")
        .insert({
          logopedist_id: logProfile.id,
          session_id: session.id,
          summary: ugotovitve.substring(0, 200),
          findings: { anamneza: "Test", ugotovitve },
          recommendations: "",
          recommended_letters: ["R"],
          report_details: reportDetails,
          next_steps: "",
          pdf_url: filePath,
          status: "submitted",
        } as any)
        .select("id")
        .single();

      if (reportError) {
        console.error("Report insert error:", reportError);
        return new Response(JSON.stringify({ error: reportError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 10. Trigger generate-monthly-plan
      let planResult: any = null;
      if (insertedReport?.id) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const planResponse = await fetch(`${supabaseUrl}/functions/v1/generate-monthly-plan`, {
          method: "POST",
          headers: {
            "Authorization": authHeader!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reportId: insertedReport.id, mode: "report_update" }),
        });
        planResult = await planResponse.json().catch(() => null);
      }

      result = {
        sessionId: session.id,
        evaluationsInserted: 20,
        sessionCompleted: true,
        reportId: insertedReport?.id,
        reportUploaded: !uploadError,
        planGenerated: planResult,
        note: "Ocenjevanje zaključeno, poročilo shranjeno, osebni načrt generiran.",
      };

    } else if (action === "calculate_cooldown_preview") {
      // Get all completed tests for this child
      const { data: tests } = await supabase
        .from("articulation_test_results")
        .select("completed_at")
        .eq("child_id", childId)
        .order("completed_at", { ascending: true });

      // Get subscription end
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("current_period_end, plan_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const subEnd = sub?.current_period_end || null;
      const completedTests = (tests || []).map((t: { completed_at: string }) => t.completed_at);

      // Calculate upcoming test dates
      const allTests: any[] = [];
      for (const ct of completedTests) {
        allTests.push({
          date: ct.split("T")[0],
          status: "opravljen",
        });
      }

      // Project future tests
      let lastDate = completedTests.length > 0
        ? new Date(completedTests[completedTests.length - 1])
        : null;

      if (lastDate) {
        for (let i = allTests.length; i < 5; i++) {
          let nextDate = new Date(lastDate);
          nextDate.setDate(nextDate.getDate() + 90);
          let cooldownDays = 90;

          // Smart cooldown: if next test would overshoot sub end - 7 days
          if (subEnd) {
            const lastTestTarget = new Date(subEnd);
            lastTestTarget.setDate(lastTestTarget.getDate() - 7);
            if (nextDate > lastTestTarget) {
              const minNext = new Date(lastDate);
              minNext.setDate(minNext.getDate() + 30);
              if (lastTestTarget > minNext) {
                nextDate = lastTestTarget;
                cooldownDays = Math.round((nextDate.getTime() - lastDate.getTime()) / 86400000);
              } else {
                nextDate = minNext;
                cooldownDays = 30;
              }
            }
          }

          // Calculate notification dates
          const notifications = [
            { type: "-7d", date: new Date(nextDate.getTime() - 7 * 86400000).toISOString().split("T")[0] },
            { type: "0d", date: nextDate.toISOString().split("T")[0] },
            { type: "+3d", date: new Date(nextDate.getTime() + 3 * 86400000).toISOString().split("T")[0] },
            { type: "+7d", date: new Date(nextDate.getTime() + 7 * 86400000).toISOString().split("T")[0] },
          ];

          allTests.push({
            date: nextDate.toISOString().split("T")[0],
            status: "predviden",
            cooldownDays,
            notifications,
          });

          lastDate = nextDate;
        }
      }

      result = {
        tests: allTests,
        subscriptionEnd: subEnd ? subEnd.split("T")[0] : null,
        planId: sub?.plan_id || null,
      };

    } else if (action === "reset_full_lifecycle") {
      // Get all plans for this child
      const { data: plans } = await supabase
        .from("child_monthly_plans")
        .select("id")
        .eq("child_id", childId);
      const planIds = (plans || []).map((p: { id: string }) => p.id);

      // Get all sessions for this child
      const { data: sessions } = await supabase
        .from("articulation_test_sessions")
        .select("id")
        .eq("child_id", childId);
      const sessionIds = (sessions || []).map((s: { id: string }) => s.id);

      const deleted: Record<string, number> = {};

      // 1. plan_activity_completions
      if (planIds.length > 0) {
        const { data: d1 } = await supabase.from("plan_activity_completions").delete().in("plan_id", planIds).select("id");
        deleted.plan_activity_completions = d1?.length || 0;

        // 2. plan_set_tracking
        const { data: d2 } = await supabase.from("plan_set_tracking").delete().in("plan_id", planIds).select("id");
        deleted.plan_set_tracking = d2?.length || 0;

        // 3. child_monthly_plans
        const { data: d3 } = await supabase.from("child_monthly_plans").delete().in("id", planIds).select("id");
        deleted.child_monthly_plans = d3?.length || 0;
      }

      // 4-6. Session-related
      if (sessionIds.length > 0) {
        const { data: d4 } = await supabase.from("articulation_evaluations").delete().in("session_id", sessionIds).select("id");
        deleted.articulation_evaluations = d4?.length || 0;

        const { data: d5 } = await supabase.from("logopedist_reports").delete().in("session_id", sessionIds).select("id");
        deleted.logopedist_reports = d5?.length || 0;

        const { data: d6 } = await supabase.from("articulation_word_results").delete().in("session_id", sessionIds).select("id");
        deleted.articulation_word_results = d6?.length || 0;

        // 7. Sessions themselves
        const { data: d7 } = await supabase.from("articulation_test_sessions").delete().in("id", sessionIds).select("id");
        deleted.articulation_test_sessions = d7?.length || 0;
      }

      // 8. Test results
      const { data: d8 } = await supabase.from("articulation_test_results").delete().eq("child_id", childId).select("id");
      deleted.articulation_test_results = d8?.length || 0;

      // 9. Clean up storage
      const { data: child } = await supabase.from("children").select("parent_id").eq("id", childId).maybeSingle();
      if (child) {
        const basePath = `${child.parent_id}/${childId}`;
        // Delete Porocila folder
        const { data: reportFiles } = await supabase.storage.from("uporabniski-profili").list(`${basePath}/Porocila`);
        if (reportFiles && reportFiles.length > 0) {
          await supabase.storage.from("uporabniski-profili").remove(reportFiles.map((f: { name: string }) => `${basePath}/Porocila/${f.name}`));
        }
        // Delete Preverjanje-izgovorjave folder
        const { data: testFolders } = await supabase.storage.from("uporabniski-profili").list(`${basePath}/Preverjanje-izgovorjave`);
        if (testFolders && testFolders.length > 0) {
          for (const folder of testFolders) {
            const folderPath = `${basePath}/Preverjanje-izgovorjave/${folder.name}`;
            const { data: files } = await supabase.storage.from("uporabniski-profili").list(folderPath);
            if (files && files.length > 0) {
              await supabase.storage.from("uporabniski-profili").remove(files.map((f: { name: string }) => `${folderPath}/${f.name}`));
            }
          }
        }
      }

      result = { deleted, note: "Celoten cikel ponastavljen." };

    } else {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("simulate-plan-lifecycle error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
