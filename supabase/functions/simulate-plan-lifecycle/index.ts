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

      // Also insert articulation_test_results record
      const { error: testResultError } = await supabase
        .from("articulation_test_results")
        .insert({
          child_id: childId,
          completed_at: new Date().toISOString(),
        });

      if (testResultError) {
        console.error("Insert test result error:", testResultError);
      }

      result = { 
        sessionCreated: true, 
        sessionId: simResult.sessionId || simResult.id,
        testResultInserted: !testResultError,
        note: "Seja ustvarjena s 60 besedami + test result dodan. Logoped lahko oceni na admin portalu."
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
