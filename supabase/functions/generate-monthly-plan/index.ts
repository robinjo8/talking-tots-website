import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Letter to URL key mapping
const LETTER_URL_MAP: Record<string, string> = {
  S: "s",
  Z: "z",
  C: "c",
  Š: "sh",
  Ž: "zh",
  Č: "ch",
  K: "k",
  L: "l",
  R: "r",
};

const SUPPORTED_LETTERS = Object.keys(LETTER_URL_MAP);

const DAY_NAMES = ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"];

const TOTAL_PLAN_DAYS = 90;

// Game definitions
const NO_AGE_GAMES = [
  { name: "Kolo besed", gameId: "kolo-srece", pathTemplate: "/govorne-igre/kolo-srece/{urlKey}" },
  { name: "Bingo", gameId: "bingo", pathTemplate: "/govorne-igre/bingo/{urlKey}" },
  { name: "Spomin", gameId: "spomin", pathTemplate: "/govorne-igre/spomin/spomin-{urlKey}" },
  { name: "Labirint", gameId: "labirint", pathTemplate: "/govorne-igre/labirint/{urlKey}" },
  { name: "Smešne povedi", gameId: "met-kocke", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
  { name: "Ponovi poved", gameId: "ponovi-poved", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
];

const AGE_GAMES = [
  { name: "Sestavljanke", gameId: "sestavljanke", pathTemplate: "/govorne-igre/sestavljanke/{urlKey}{ageKey}" },
  { name: "Drsna igra", gameId: "drsna-sestavljanka", pathTemplate: "/govorne-igre/drsna-sestavljanka/{urlKey}{ageKey}" },
  { name: "Zaporedja", gameId: "zaporedja", pathTemplate: "/govorne-igre/zaporedja/{urlKey}{ageKey}" },
  { name: "Igra ujemanja", gameId: "igra-ujemanja", pathTemplate: "/govorne-igre/igra-ujemanja/{urlKey}{ageKey}" },
];

const ALL_GAMES = [...NO_AGE_GAMES, ...AGE_GAMES];

function getAgeKey(ageGroup: string): string {
  switch (ageGroup) {
    case "3-4": return "";
    case "5-6": return "56";
    case "7-8": return "78";
    case "9-10": return "910";
    default: return "";
  }
}

function getAgeGroup(age: number): string {
  if (age <= 4) return "3-4";
  if (age <= 6) return "5-6";
  if (age <= 8) return "7-8";
  return "9-10";
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface GameCombination {
  gameId: string;
  gameName: string;
  letter: string;
  path: string;
}

function buildGameCombinations(targetLetters: string[], ageGroup: string): GameCombination[] {
  const ageKey = getAgeKey(ageGroup);
  const supportedLetters = targetLetters.filter((l) => SUPPORTED_LETTERS.includes(l));

  if (supportedLetters.length === 0) return [];

  const combinations: GameCombination[] = [];

  for (const game of ALL_GAMES) {
    for (const letter of supportedLetters) {
      const urlKey = LETTER_URL_MAP[letter];
      const isAgeGame = AGE_GAMES.some((g) => g.gameId === game.gameId);
      const path = game.pathTemplate
        .replace("{urlKey}", urlKey)
        .replace("{ageKey}", isAgeGame ? ageKey : "");

      combinations.push({
        gameId: game.gameId,
        gameName: game.name,
        letter,
        path,
      });
    }
  }

  return combinations;
}

interface PlanDay {
  date: string;
  dayName: string;
  activities: {
    type: "motorika" | "igra";
    title: string;
    path: string;
    letter?: string;
    gameId?: string;
  }[];
}

function generateDeterministicPlan(
  startDate: Date,
  totalDays: number,
  combinations: GameCombination[]
): PlanDay[] {
  const days: PlanDay[] = [];
  let combinationIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(startDate, i);
    const dayName = DAY_NAMES[currentDate.getDay()];

    // Always start with motorika
    const activities: PlanDay["activities"] = [
      {
        type: "motorika",
        title: "Vaje za motoriko govoril",
        path: "/govorno-jezikovne-vaje/vaje-motorike-govoril",
      },
    ];

    if (combinations.length > 0) {
      // Pick 4 games with unique gameIds for this day
      const usedGameIds = new Set<string>();
      let attempts = 0;
      const maxAttempts = combinations.length * 2;

      while (activities.length < 5 && attempts < maxAttempts) {
        const combo = combinations[combinationIndex % combinations.length];
        combinationIndex++;
        attempts++;

        if (!usedGameIds.has(combo.gameId)) {
          usedGameIds.add(combo.gameId);
          activities.push({
            type: "igra",
            title: combo.gameName,
            path: combo.path,
            letter: combo.letter,
            gameId: combo.gameId,
          });
        }
      }

      // If we couldn't fill 4 unique games (rare edge case), fill remaining
      if (activities.length < 5) {
        for (const combo of combinations) {
          if (activities.length >= 5) break;
          if (!usedGameIds.has(combo.gameId)) {
            usedGameIds.add(combo.gameId);
            activities.push({
              type: "igra",
              title: combo.gameName,
              path: combo.path,
              letter: combo.letter,
              gameId: combo.gameId,
            });
          }
        }
      }
    }

    days.push({
      date: formatDate(currentDate),
      dayName,
      activities,
    });
  }

  return days;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportId } = await req.json();
    if (!reportId) {
      return new Response(JSON.stringify({ error: "reportId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Fetch report (including created_at for start date)
    const { data: report, error: reportError } = await supabase
      .from("logopedist_reports")
      .select("id, session_id, recommended_letters, pdf_url, created_at")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      console.error("Report not found:", reportError);
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Find child through session
    let childId: string | null = null;

    if (report.session_id) {
      const { data: session } = await supabase
        .from("articulation_test_sessions")
        .select("child_id")
        .eq("id", report.session_id)
        .single();

      if (session?.child_id) {
        childId = session.child_id;
      }
    }

    // Fallback: try to extract child_id from pdf_url path
    if (!childId && report.pdf_url) {
      const parts = report.pdf_url.split("/");
      if (parts.length >= 2) {
        const potentialChildId = parts[1];
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(potentialChildId)) {
          const { data: child } = await supabase
            .from("children")
            .select("id")
            .eq("id", potentialChildId)
            .single();
          if (child) childId = potentialChildId;
        }
      }
    }

    if (!childId) {
      console.error("Could not determine child_id for report:", reportId);
      return new Response(JSON.stringify({ error: "Could not determine child" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Get child data
    const { data: child } = await supabase
      .from("children")
      .select("id, birth_date, age, name")
      .eq("id", childId)
      .single();

    if (!child) {
      return new Response(JSON.stringify({ error: "Child not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const childAge = child.birth_date ? calculateAge(child.birth_date) : (child.age || 5);
    const ageGroup = getAgeGroup(childAge);

    // 4. Determine target letters
    let targetLetters: string[] = [];

    if (report.recommended_letters && Array.isArray(report.recommended_letters)) {
      targetLetters = [...report.recommended_letters];
    }

    if (report.session_id) {
      const { data: evaluations } = await supabase
        .from("articulation_evaluations")
        .select("letter, selected_options")
        .eq("session_id", report.session_id);

      if (evaluations) {
        for (const eval_ of evaluations) {
          const options = eval_.selected_options || [];
          const isAcquired = options.includes("acquired") || options.includes("Usvojeno");
          if (!isAcquired && !targetLetters.includes(eval_.letter)) {
            targetLetters.push(eval_.letter);
          }
        }
      }
    }

    targetLetters = [...new Set(targetLetters)];

    if (targetLetters.length === 0) {
      console.log("No target letters found, skipping plan generation");
      return new Response(JSON.stringify({ message: "No target letters, plan not generated" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Calculate start and end dates from report creation date
    const startDate = new Date(report.created_at);
    // Reset to start of day in UTC
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = addDays(startDate, TOTAL_PLAN_DAYS - 1);
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    console.log(`Plan period: ${startDateStr} to ${endDateStr} (${TOTAL_PLAN_DAYS} days)`);

    // 6. Build game combinations and generate plan deterministically
    const combinations = buildGameCombinations(targetLetters, ageGroup);
    const days = generateDeterministicPlan(startDate, TOTAL_PLAN_DAYS, combinations);

    console.log(`Generated ${days.length} days with ${combinations.length} game combinations`);

    // 7. Build warm, child-friendly summary
    const childNameCapitalized = child.name.charAt(0).toUpperCase() + child.name.slice(1);
    const lettersFormatted = targetLetters.length === 1 
      ? `črko ${targetLetters[0]}` 
      : targetLetters.length === 2 
        ? `črki ${targetLetters[0]} in ${targetLetters[1]}` 
        : `črke ${targetLetters.slice(0, -1).join(", ")} in ${targetLetters[targetLetters.length - 1]}`;
    const summary = `Hej ${childNameCapitalized}! 🎉 Pripravili smo ti zabaven načrt vaj in iger, s katerimi boš vadil ${lettersFormatted}. Vsak dan te čakajo nove pustolovščine – vaje za jezik in 4 igrice! Zbiraj zvezdice in postani pravi šampion! 🌟`;

    // 8. Archive existing active/generating plans
    await supabase
      .from("child_monthly_plans")
      .update({ status: "archived" })
      .eq("child_id", childId)
      .in("status", ["active", "generating"]);

    // 9. Insert new plan (instant, no "generating" status needed)
    const planData = {
      summary,
      days,
      targetLetters,
      childAge,
      ageGroup,
      totalDays: TOTAL_PLAN_DAYS,
    };

    const { data: planRecord, error: planInsertError } = await supabase
      .from("child_monthly_plans")
      .insert({
        child_id: childId,
        report_id: reportId,
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        start_date: startDateStr,
        end_date: endDateStr,
        focus_letters: targetLetters,
        status: "active",
        plan_data: planData,
      })
      .select("id")
      .single();

    if (planInsertError || !planRecord) {
      console.error("Failed to create plan record:", planInsertError);
      return new Response(JSON.stringify({ error: "Failed to create plan record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`90-day plan generated for ${child.name} (${planRecord.id}): ${startDateStr} to ${endDateStr}`);

    return new Response(
      JSON.stringify({
        success: true,
        planId: planRecord.id,
        targetLetters,
        ageGroup,
        totalDays: TOTAL_PLAN_DAYS,
        startDate: startDateStr,
        endDate: endDateStr,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("generate-monthly-plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
