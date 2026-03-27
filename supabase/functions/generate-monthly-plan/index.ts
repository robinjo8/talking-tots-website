import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const LETTER_URL_MAP: Record<string, string> = {
  S: "s", Z: "z", C: "c", Š: "sh", Ž: "zh", Č: "ch", K: "k", L: "l", R: "r",
};

const SUPPORTED_LETTERS = Object.keys(LETTER_URL_MAP);
const TOTAL_SETS = 30;

// Games split by position
const START_GAMES = [
  { name: "Kolo besed", gameId: "kolo-srece", pathTemplate: "/govorne-igre/kolo-srece/{urlKey}" },
  { name: "Spomin", gameId: "spomin", pathTemplate: "/govorne-igre/spomin/spomin-{urlKey}" },
  { name: "Labirint", gameId: "labirint", pathTemplate: "/govorne-igre/labirint/{urlKey}" },
  { name: "Ponovi poved", gameId: "ponovi-poved", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
  { name: "Smešne povedi", gameId: "met-kocke", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
];

const START_AGE_GAMES = [
  { name: "Sestavljanke", gameId: "sestavljanke", pathTemplate: "/govorne-igre/sestavljanke/{urlKey}{ageKey}" },
  { name: "Zaporedja", gameId: "zaporedja", pathTemplate: "/govorne-igre/zaporedja/{urlKey}{ageKey}" },
  { name: "Igra ujemanja", gameId: "igra-ujemanja", pathTemplate: "/govorne-igre/igra-ujemanja/{urlKey}{ageKey}" },
  { name: "Drsna igra", gameId: "drsna-sestavljanka", pathTemplate: "/govorne-igre/drsna-sestavljanka/{urlKey}{ageKey}" },
];

const MIDDLE_END_GAMES = [
  { name: "Zabavna pot", gameId: "kace", pathTemplate: "/govorne-igre/kace/{urlKey}" },
  { name: "Bingo", gameId: "bingo", pathTemplate: "/govorne-igre/bingo/{urlKey}" },
  { name: "Ponovi poved", gameId: "ponovi-poved", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
  { name: "Smešne povedi", gameId: "met-kocke", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
];

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
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface LetterPosition {
  letter: string;
  position: "start" | "middle-end" | "initial-exercises";
}

interface GameDef {
  name: string;
  gameId: string;
  pathTemplate: string;
}

interface GameCombination {
  gameId: string;
  gameName: string;
  letter: string;
  path: string;
}

function buildGameCombinations(letterPositions: LetterPosition[], ageGroup: string): GameCombination[] {
  const ageKey = getAgeKey(ageGroup);
  const combinations: GameCombination[] = [];

  // Group positions by letter to handle combined start + middle-end
  const letterPositionMap = new Map<string, Set<string>>();
  for (const lp of letterPositions) {
    if (!SUPPORTED_LETTERS.includes(lp.letter)) continue;
    if (!letterPositionMap.has(lp.letter)) {
      letterPositionMap.set(lp.letter, new Set());
    }
    letterPositionMap.get(lp.letter)!.add(lp.position);
  }

  for (const [letter, positions] of letterPositionMap) {
    const hasStart = positions.has("start");
    const hasMiddleEnd = positions.has("middle-end");
    const hasInitialExercises = positions.has("initial-exercises");

    // Determine URL key: initial-exercises for R uses r-zacetek
    const baseUrlKey = LETTER_URL_MAP[letter];

    // Build game list based on positions
    let games: GameDef[] = [];
    const addedGameIds = new Set<string>();

    const addGames = (gamesToAdd: GameDef[]) => {
      for (const g of gamesToAdd) {
        if (!addedGameIds.has(g.gameId)) {
          addedGameIds.add(g.gameId);
          games.push(g);
        }
      }
    };

    if (hasInitialExercises) {
      // All games with r-zacetek URL
      addGames(START_GAMES);
      addGames(START_AGE_GAMES);
      addGames(MIDDLE_END_GAMES);
    } else if (hasStart && hasMiddleEnd) {
      // Union of all games (11 unique)
      addGames(START_GAMES);
      addGames(START_AGE_GAMES);
      addGames(MIDDLE_END_GAMES);
    } else if (hasStart) {
      addGames(START_GAMES);
      addGames(START_AGE_GAMES);
    } else if (hasMiddleEnd) {
      addGames(MIDDLE_END_GAMES);
    }

    const urlKey = hasInitialExercises ? "r-zacetek" : baseUrlKey;

    const allAgeGameIds = new Set(START_AGE_GAMES.map(g => g.gameId));

    for (const game of games) {
      const isAgeGame = allAgeGameIds.has(game.gameId);
      const path = game.pathTemplate
        .replace("{urlKey}", urlKey)
        .replace("{ageKey}", isAgeGame ? ageKey : "");
      combinations.push({ gameId: game.gameId, gameName: game.name, letter, path });
    }
  }
  return combinations;
}

interface MotorikaConfig {
  type: "daily" | "weekly" | "monthly" | "custom" | null;
  count?: number | null;
  unit?: "day" | "week" | "month" | null;
}

/**
 * Determine if motorika should be included in a given set.
 * For set-based system: 
 * - daily = every set
 * - weekly = every 7th set (sets 0, 7, 14, 21, 28)
 * - monthly = only set 0
 * - custom = spread across sets
 */
function shouldIncludeMotorikaInSet(setIndex: number, motorika: MotorikaConfig): boolean {
  if (!motorika.type || motorika.type === "daily") return true;
  if (motorika.type === "weekly") return setIndex % 7 === 0;
  if (motorika.type === "monthly") return setIndex === 0;
  if (motorika.type === "custom" && motorika.count && motorika.unit) {
    if (motorika.unit === "day") return true;
    if (motorika.unit === "week") {
      const interval = Math.max(1, Math.floor(7 / motorika.count));
      return setIndex % interval === 0;
    }
    if (motorika.unit === "month") {
      const interval = Math.max(1, Math.floor(30 / motorika.count));
      return setIndex % interval === 0;
    }
  }
  return true;
}

interface PlanSetActivity {
  type: "motorika" | "igra";
  title: string;
  path: string;
  letter?: string;
  gameId?: string;
}

interface PlanSet {
  setNumber: number;
  activities: PlanSetActivity[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSetBasedPlan(totalSets: number, combinations: GameCombination[], motorika: MotorikaConfig): PlanSet[] {
  const sets: PlanSet[] = [];
  // Shuffle combinations for unique plan per generation
  const shuffledCombinations = shuffleArray(combinations);
  let combinationIndex = 0;

  for (let i = 0; i < totalSets; i++) {
    const activities: PlanSetActivity[] = [];
    const includeMotorikaInThisSet = shouldIncludeMotorikaInSet(i, motorika);
    
    // Determine how many games to include
    // With motorika: 1 motorika + 4 games = 5 activities
    // Without motorika: 5 games
    const targetGames = includeMotorikaInThisSet ? 4 : 5;

    if (includeMotorikaInThisSet) {
      activities.push({ 
        type: "motorika", 
        title: "Vaje za motoriko govoril", 
        path: "/govorno-jezikovne-vaje/vaje-motorike-govoril" 
      });
    }

    if (shuffledCombinations.length > 0) {
      const usedGameIds = new Set<string>();
      let attempts = 0;
      const maxAttempts = shuffledCombinations.length * 2;

      while (activities.filter(a => a.type === "igra").length < targetGames && attempts < maxAttempts) {
        const combo = shuffledCombinations[combinationIndex % shuffledCombinations.length];
        combinationIndex++;
        attempts++;
        if (!usedGameIds.has(combo.gameId)) {
          usedGameIds.add(combo.gameId);
          activities.push({ 
            type: "igra", 
            title: combo.gameName, 
            path: combo.path, 
            letter: combo.letter, 
            gameId: combo.gameId 
          });
        }
      }

      // Fill remaining slots if needed
      if (activities.filter(a => a.type === "igra").length < targetGames) {
        for (const combo of shuffledCombinations) {
          if (activities.filter(a => a.type === "igra").length >= targetGames) break;
          if (!usedGameIds.has(combo.gameId)) {
            usedGameIds.add(combo.gameId);
            activities.push({ 
              type: "igra", 
              title: combo.gameName, 
              path: combo.path, 
              letter: combo.letter, 
              gameId: combo.gameId 
            });
          }
        }
      }
      
      // If still not enough (fewer unique games than slots), reuse combinations
      if (activities.filter(a => a.type === "igra").length < targetGames) {
        let fillIdx = 0;
        while (activities.filter(a => a.type === "igra").length < targetGames && fillIdx < shuffledCombinations.length) {
          const combo = shuffledCombinations[fillIdx];
          fillIdx++;
          activities.push({ 
            type: "igra", 
            title: combo.gameName, 
            path: combo.path, 
            letter: combo.letter, 
            gameId: combo.gameId 
          });
        }
      }
    }

    // Shuffle game activities within set (motorika stays first)
    const motorikaActs = activities.filter(a => a.type === "motorika");
    const gameActs = shuffleArray(activities.filter(a => a.type === "igra"));
    sets.push({ setNumber: i + 1, activities: [...motorikaActs, ...gameActs] });
  }

  return sets;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Check if this is a service role / admin override call
    const token = authHeader.replace("Bearer ", "");
    const isServiceRoleCall = token === serviceRoleKey;

    if (!isServiceRoleCall) {
      // Standard user JWT validation
      const authClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    console.log(`Request authorized (serviceRole: ${isServiceRoleCall})`);

    const { reportId, mode = "report_update" } = await req.json();
    if (!reportId) {
      return new Response(JSON.stringify({ error: "reportId is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: report, error: reportError } = await supabase
      .from("logopedist_reports")
      .select("id, session_id, recommended_letters, report_details, pdf_url, created_at")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      console.error("Report not found:", reportError);
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let childId: string | null = null;

    if (report.session_id) {
      const { data: session } = await supabase
        .from("articulation_test_sessions")
        .select("child_id")
        .eq("id", report.session_id)
        .single();
      if (session?.child_id) childId = session.child_id;
    }

    if (!childId && report.pdf_url) {
      const parts = report.pdf_url.split("/");
      if (parts.length >= 2) {
        const potentialChildId = parts[1];
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(potentialChildId)) {
          const { data: child } = await supabase.from("children").select("id").eq("id", potentialChildId).single();
          if (child) childId = potentialChildId;
        }
      }
    }

    if (!childId) {
      console.error("Could not determine child_id for report:", reportId);
      return new Response(JSON.stringify({ error: "Could not determine child" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: child } = await supabase
      .from("children")
      .select("id, birth_date, age, name, gender, parent_id")
      .eq("id", childId)
      .single();

    if (!child) {
      return new Response(JSON.stringify({ error: "Child not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const childAge = child.birth_date ? calculateAge(child.birth_date) : (child.age || 5);
    const ageGroup = getAgeGroup(childAge);

    // Parse report_details for position-aware letters and motorika frequency
    const reportDetails = report.report_details as any;
    let letterPositions: LetterPosition[] = [];
    let motorikaConfig: MotorikaConfig = { type: "daily" };

    if (reportDetails?.letters && Array.isArray(reportDetails.letters)) {
      for (const lp of reportDetails.letters) {
        const posArray: string[] = lp.positions || (lp.position ? [lp.position] : ["start"]);
        for (const pos of posArray) {
          letterPositions.push({ letter: lp.letter, position: pos as LetterPosition["position"] });
        }
      }
    } else if (report.recommended_letters && Array.isArray(report.recommended_letters)) {
      letterPositions = report.recommended_letters.map((l: string) => ({ letter: l, position: "start" as const }));
    }

    if (reportDetails?.motorika) {
      motorikaConfig = reportDetails.motorika;
    }

    // Also add non-acquired letters from evaluations
    if (report.session_id) {
      const { data: evaluations } = await supabase
        .from("articulation_evaluations")
        .select("letter, selected_options")
        .eq("session_id", report.session_id);

      if (evaluations) {
        for (const eval_ of evaluations) {
          const options = eval_.selected_options || [];
          const isAcquired = options.includes("acquired") || options.includes("Usvojeno");
          if (!isAcquired && !letterPositions.some(lp => lp.letter === eval_.letter)) {
            letterPositions.push({ letter: eval_.letter, position: "start" });
          }
        }
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    letterPositions = letterPositions.filter(lp => {
      const key = `${lp.letter}:${lp.position}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const targetLetters = [...new Set(letterPositions.map(lp => lp.letter))];

    // Build position-aware description per letter
    const positionLabels: Record<string, string> = {
      "start": "na začetku besed",
      "middle-end": "na sredini in koncu besed",
      "initial-exercises": "začetne vaje",
    };

    const letterDescriptions: string[] = [];
    for (const letter of targetLetters) {
      const positions = letterPositions
        .filter(lp => lp.letter === letter)
        .map(lp => positionLabels[lp.position] || lp.position);
      const uniquePositions = [...new Set(positions)];
      if (uniquePositions.length > 0) {
        const lastPos = uniquePositions.pop()!;
        const posText = uniquePositions.length > 0 
          ? uniquePositions.join(", ") + " ter " + lastPos
          : lastPos;
        letterDescriptions.push(`glas ${letter} (${posText})`);
      } else {
        letterDescriptions.push(`glas ${letter}`);
      }
    }

    let lettersFormatted: string;
    if (letterDescriptions.length === 1) {
      lettersFormatted = letterDescriptions[0];
    } else if (letterDescriptions.length === 2) {
      lettersFormatted = letterDescriptions.join(" in ");
    } else {
      lettersFormatted = letterDescriptions.slice(0, -1).join(", ") + " in " + letterDescriptions[letterDescriptions.length - 1];
    }

    const childNameCapitalized = child.name.charAt(0).toUpperCase() + child.name.slice(1);
    const isFemale = ["female", "F", "f"].includes(child.gender || "");
    const vadil = isFemale ? "vadila" : "vadil";
    const sampion = isFemale ? "prava šampionka" : "pravi šampion";
    const summary = `Hej ${childNameCapitalized}! Pripravili smo ti zabaven načrt vaj in iger, s katerimi boš ${vadil} ${lettersFormatted}. Vsak dan te čakajo nove pustolovščine – vaje za jezik in igrice! Zbiraj zvezdice in postani ${sampion}!`;

    // Build game combinations and generate sets
    const combinations = buildGameCombinations(letterPositions, ageGroup);
    const sets = generateSetBasedPlan(TOTAL_SETS, combinations, motorikaConfig);

    const now = new Date();
    const startDateStr = formatDate(now);
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const planData = {
      summary, 
      sets, 
      targetLetters, 
      childAge, 
      ageGroup, 
      totalSets: TOTAL_SETS,
    };

    // Check for existing active/generating or orphaned archived plan
    const { data: existingPlans } = await supabase
      .from("child_monthly_plans")
      .select("id, status")
      .eq("child_id", childId)
      .in("status", ["active", "generating"])
      .order("created_at", { ascending: false })
      .limit(1);

    let existingPlan = existingPlans?.[0] || null;

    // Orphan recovery: if no active plan, check for archived plan with progress
    if (!existingPlan) {
      const { data: archivedPlans } = await supabase
        .from("child_monthly_plans")
        .select("id, status")
        .eq("child_id", childId)
        .eq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(1);

      if (archivedPlans?.[0]) {
        const { count } = await supabase
          .from("plan_set_tracking")
          .select("id", { count: "exact", head: true })
          .eq("plan_id", archivedPlans[0].id)
          .eq("child_id", childId);

        if (count && count > 0) {
          console.log(`Orphan recovery: reactivating archived plan ${archivedPlans[0].id} with ${count} tracked sets`);
          existingPlan = archivedPlans[0];
        }
      }
    }

    let planRecord: { id: string } | null = null;

    if (mode === "renewal") {
      // Renewal mode: archive old, create new (used when 30/30 completed)
      // Count existing plans for this report to calculate setOffset
      const { data: plansForReport } = await supabase
        .from("child_monthly_plans")
        .select("id")
        .eq("child_id", childId)
        .eq("report_id", reportId);
      const setOffset = (plansForReport?.length || 0) * TOTAL_SETS;
      console.log(`Renewal: setOffset=${setOffset} (${plansForReport?.length || 0} existing plans for report)`);

      if (existingPlan) {
        await supabase
          .from("child_monthly_plans")
          .update({ status: "archived" })
          .eq("id", existingPlan.id);
      }

      // Add setOffset to planData
      const planDataWithOffset = { ...planData, setOffset };

      const { data: newPlan, error: planInsertError } = await supabase
        .from("child_monthly_plans")
        .insert({
          child_id: childId,
          report_id: reportId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          start_date: startDateStr,
          end_date: null,
          focus_letters: targetLetters,
          status: "active",
          plan_data: planDataWithOffset,
          expires_at: expiresAt,
        })
        .select("id")
        .single();

      if (planInsertError || !newPlan) {
        console.error("Failed to create plan record:", planInsertError);
        return new Response(JSON.stringify({ error: "Failed to create plan record" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      planRecord = newPlan;
    } else {
      // report_update mode: update in-place if existing, else create new
      if (existingPlan) {
        // Check if this is a new assessment cycle (different report_id)
        const { data: existingPlanFull } = await supabase
          .from("child_monthly_plans")
          .select("plan_data, report_id")
          .eq("id", existingPlan.id)
          .single();

        if (existingPlanFull?.report_id && existingPlanFull.report_id !== reportId) {
          // New cycle — archive old plan and create fresh one
          console.log(`New assessment cycle detected. Old report: ${existingPlanFull.report_id}, new report: ${reportId}. Archiving old plan ${existingPlan.id}`);
          
          await supabase
            .from("child_monthly_plans")
            .update({ status: "archived", updated_at: new Date().toISOString() })
            .eq("id", existingPlan.id);

          const { data: newPlan, error: planInsertError } = await supabase
            .from("child_monthly_plans")
            .insert({
              child_id: childId,
              report_id: reportId,
              month: now.getMonth() + 1,
              year: now.getFullYear(),
              start_date: startDateStr,
              end_date: null,
              focus_letters: targetLetters,
              status: "active",
              plan_data: planData, // fresh plan, setOffset=0
              expires_at: expiresAt,
            })
            .select("id")
            .single();

          if (planInsertError) {
            console.error("Failed to create new cycle plan:", planInsertError);
            return new Response(JSON.stringify({ error: "Failed to create new cycle plan" }), {
              status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          planRecord = newPlan;
          console.log(`New cycle plan created: ${newPlan?.id}`);
        } else {
          // Same report — preserve completed/in-progress sets, update plan data for future sets
          const { data: trackingData } = await supabase
            .from("plan_set_tracking")
            .select("set_number, status")
            .eq("plan_id", existingPlan.id)
            .eq("child_id", childId);

          const completedOrActiveSetNums = new Set(
            (trackingData || []).map(t => t.set_number)
          );

          const existingPlanData = existingPlanFull?.plan_data as any;
          const existingSets = existingPlanData?.sets || [];

          // Merge: keep old set data for tracked sets, use new data for untouched sets
          const mergedSets = sets.map((newSet: PlanSet) => {
            if (completedOrActiveSetNums.has(newSet.setNumber)) {
              const oldSet = existingSets.find((s: any) => s.setNumber === newSet.setNumber);
              return oldSet || newSet;
            }
            return newSet;
          });

          const mergedPlanData = { ...planData, sets: mergedSets };

          const { error: updateError } = await supabase
            .from("child_monthly_plans")
            .update({
              report_id: reportId,
              focus_letters: targetLetters,
              plan_data: mergedPlanData,
              status: "active",
              updated_at: new Date().toISOString(),
              expires_at: expiresAt,
            })
            .eq("id", existingPlan.id);

          if (updateError) {
            console.error("Failed to update plan:", updateError);
            return new Response(JSON.stringify({ error: "Failed to update plan" }), {
              status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          planRecord = { id: existingPlan.id };
          console.log(`Plan updated in-place: ${existingPlan.id} (preserved ${completedOrActiveSetNums.size} tracked sets)`);
        }
      } else {
        // No existing plan at all — create new
        const { data: newPlan, error: planInsertError } = await supabase
          .from("child_monthly_plans")
          .insert({
            child_id: childId,
            report_id: reportId,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            start_date: startDateStr,
            end_date: null,
            focus_letters: targetLetters,
            status: "active",
            plan_data: planData,
            expires_at: expiresAt,
          })
          .select("id")
          .single();

        if (planInsertError || !newPlan) {
          console.error("Failed to create plan record:", planInsertError);
          return new Response(JSON.stringify({ error: "Failed to create plan record" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        planRecord = newPlan;
      }
    }

    console.log(`30-set plan generated for ${child.name} (${planRecord.id})`);

    // --- Send notification to parent about new/renewed plan ---
    try {
      const isPlanNew = mode === "report_update";
      const notifType = isPlanNew ? "plan_new" : "plan_renewed";
      const notifTitle = isPlanNew
        ? "Nov osebni načrt je pripravljen!"
        : "Osebni načrt je bil podaljšan!";
      const notifMessage = isPlanNew
        ? `Za otroka ${child.name} je bil pripravljen nov osebni načrt vaj. Odprite aplikacijo in začnite z vajami!`
        : `Osebni načrt za otroka ${child.name} je bil podaljšan z novimi vajami. Nadaljujte z vajami!`;

      // Deduplication: check if same notification already sent in last 24h
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: existingNotif } = await supabase
        .from("user_notifications")
        .select("id")
        .eq("user_id", child.parent_id)
        .eq("child_id", childId)
        .eq("type", notifType)
        .gte("created_at", oneDayAgo)
        .limit(1);

      if (!existingNotif || existingNotif.length === 0) {
        // Insert notification
        await supabase.from("user_notifications").insert({
          user_id: child.parent_id,
          child_id: childId,
          type: notifType,
          title: notifTitle,
          message: notifMessage,
          link: "/moji-izzivi",
          is_read: false,
        });

        // Send email via Resend
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          // Check email preferences
          const { data: emailPref } = await supabase
            .from("email_preferences")
            .select("notifications_enabled")
            .eq("user_id", child.parent_id)
            .maybeSingle();

          const notificationsEnabled = emailPref?.notifications_enabled !== false;

          if (notificationsEnabled) {
            const { data: userData } = await supabase.auth.admin.getUserById(child.parent_id);
            if (userData?.user?.email) {
              // Generate unsubscribe token (simple JWT-like base64)
              const tokenPayload = { sub: child.parent_id, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 };
              const tokenBase64 = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "") + "." + btoa(JSON.stringify(tokenPayload)).replace(/=/g, "") + ".";
              const unsubscribeUrl = `https://tomitalk.com/odjava-obvestil?token=${tokenBase64}`;

              const emailSubject = isPlanNew
                ? "Nov osebni načrt je pripravljen! 🐉"
                : "Osebni načrt je bil podaljšan! 🐉";

            const emailHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: hsl(122, 39%, 95%); padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                  <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/TomiTalk_logo_22.png" alt="TomiTalk" style="max-width: 180px; height: auto;" />
                </div>
                <div style="background-color: #ffffff; padding: 30px; border: 1px solid #f0f0f0;">
                  <h2 style="color: hsl(122, 39%, 49%); font-size: 24px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">${notifTitle}</h2>
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 16px 0;">Pozdravljeni!</p>
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 16px 0;">${notifMessage}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://tomitalk.com/moji-izzivi" 
                       style="background-color: hsl(122, 39%, 49%); color: #ffffff; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">
                      Odpri moje izzive
                    </a>
                  </div>
                </div>
                <div style="background-color: hsl(122, 39%, 95%); padding: 20px; text-align: center;">
                  <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 8px 0;">S spoštovanjem,<br/>TomiTalk</p>
                </div>
                <div style="background-color: hsl(122, 39%, 95%); padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
                  <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 8px 0;">
                    To sporočilo ste prejeli, ker imate račun pri TomiTalk.<br/>
                    Če teh e-poštnih sporočil ne želite več prejemati, <a href="${unsubscribeUrl}" style="color: hsl(122, 39%, 49%);">se lahko odjavite</a>.
                  </p>
                </div>
              </div>
            `;

            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: "TomiTalk <noreply@tomitalk.si>",
                to: [userData.user.email],
                subject: emailSubject,
                html: emailHtml,
              }),
            });

            console.log(`Plan notification email sent to ${userData.user.email} (${notifType})`);
            }
          } else {
            console.log(`Email notifications disabled for user ${child.parent_id}`);
          }
        }
      } else {
        console.log(`Skipping duplicate ${notifType} notification for child ${childId}`);
      }
    } catch (notifError) {
      // Don't fail the whole request if notification fails
      console.error("Error sending plan notification:", notifError);
    }

    return new Response(
      JSON.stringify({
        success: true, 
        planId: planRecord.id, 
        targetLetters, 
        ageGroup,
        totalSets: TOTAL_SETS, 
        startDate: startDateStr,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-monthly-plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
