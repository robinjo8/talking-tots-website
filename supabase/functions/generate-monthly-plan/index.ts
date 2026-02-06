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

// Letters that have games available
const SUPPORTED_LETTERS = Object.keys(LETTER_URL_MAP);

// Age group to age key mapping for games with age variants
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

function buildGameCatalog(targetLetters: string[], ageGroup: string): string {
  const ageKey = getAgeKey(ageGroup);
  const supportedTargets = targetLetters.filter((l) => SUPPORTED_LETTERS.includes(l));

  let catalog = `RAZPOLOŽLJIVE IGRE IN VAJE:\n\n`;
  catalog += `MOTORIKA GOVORIL (brez črk, za vsakodnevno ogrevanje):\n`;
  catalog += `  Pot: /govorno-jezikovne-vaje/vaje-motorike-govoril\n\n`;

  if (supportedTargets.length === 0) {
    catalog += `Za izbrane črke ni specifičnih iger. Uporabi samo motoriko govoril.\n`;
    return catalog;
  }

  const urlKeys = supportedTargets.map((l) => ({
    letter: l,
    urlKey: LETTER_URL_MAP[l],
  }));

  // Games without age variants
  const noAgeGames = [
    { name: "KOLO BESED", pathTemplate: "/govorne-igre/kolo-srece/{urlKey}" },
    { name: "BINGO", pathTemplate: "/govorne-igre/bingo/{urlKey}" },
    { name: "SPOMIN", pathTemplate: "/govorne-igre/spomin/spomin-{urlKey}" },
    { name: "LABIRINT", pathTemplate: "/govorne-igre/labirint/{urlKey}" },
    { name: "SMEŠNE POVEDI", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
    { name: "PONOVI POVED", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
  ];

  // Games with age variants
  const ageGames = [
    { name: "SESTAVLJANKE", pathTemplate: `/govorne-igre/sestavljanke/{urlKey}${ageKey}` },
    { name: "DRSNA IGRA", pathTemplate: `/govorne-igre/drsna-sestavljanka/{urlKey}${ageKey}` },
    { name: "ZAPOREDJA", pathTemplate: `/govorne-igre/zaporedja/{urlKey}${ageKey}` },
    { name: "IGRA UJEMANJA", pathTemplate: `/govorne-igre/igra-ujemanja/{urlKey}${ageKey}` },
  ];

  for (const game of noAgeGames) {
    catalog += `${game.name} (brez starostnih variant):\n`;
    for (const { letter, urlKey } of urlKeys) {
      const path = game.pathTemplate.replace("{urlKey}", urlKey);
      catalog += `  Črka ${letter}: ${path}\n`;
    }
    catalog += `\n`;
  }

  for (const game of ageGames) {
    catalog += `${game.name} (starostna skupina ${ageGroup}):\n`;
    for (const { letter, urlKey } of urlKeys) {
      const path = game.pathTemplate.replace("{urlKey}", urlKey);
      catalog += `  Črka ${letter}: ${path}\n`;
    }
    catalog += `\n`;
  }

  return catalog;
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
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Fetch report
    const { data: report, error: reportError } = await supabase
      .from("logopedist_reports")
      .select("id, session_id, recommended_letters, pdf_url")
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
    let childBirthDate: string | null = null;

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
      // Path format: parentId/childId/...
      const parts = report.pdf_url.split("/");
      if (parts.length >= 2) {
        // Try the second segment as childId (UUID format)
        const potentialChildId = parts[1];
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(potentialChildId)) {
          // Verify this child exists
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

    childBirthDate = child.birth_date;
    const childAge = childBirthDate ? calculateAge(childBirthDate) : (child.age || 5);
    const ageGroup = getAgeGroup(childAge);

    // 4. Determine target letters
    let targetLetters: string[] = [];

    // Primary: from recommended_letters in report
    if (report.recommended_letters && Array.isArray(report.recommended_letters)) {
      targetLetters = [...report.recommended_letters];
    }

    // Secondary: from articulation evaluations (non-acquired)
    if (report.session_id) {
      const { data: evaluations } = await supabase
        .from("articulation_evaluations")
        .select("letter, selected_options")
        .eq("session_id", report.session_id);

      if (evaluations) {
        for (const eval_ of evaluations) {
          // Check if letter is NOT acquired (rating indicates issues)
          const options = eval_.selected_options || [];
          const isAcquired = options.includes("acquired") || options.includes("Usvojeno");
          if (!isAcquired && !targetLetters.includes(eval_.letter)) {
            targetLetters.push(eval_.letter);
          }
        }
      }
    }

    // Remove duplicates
    targetLetters = [...new Set(targetLetters)];

    if (targetLetters.length === 0) {
      console.log("No target letters found, skipping plan generation");
      return new Response(JSON.stringify({ message: "No target letters, plan not generated" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Create placeholder record with 'generating' status
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Archive any existing active plans for this child
    await supabase
      .from("child_monthly_plans")
      .update({ status: "archived" })
      .eq("child_id", childId)
      .eq("status", "active");

    // Also clean up any stuck 'generating' plans
    await supabase
      .from("child_monthly_plans")
      .update({ status: "archived" })
      .eq("child_id", childId)
      .eq("status", "generating");

    const { data: planRecord, error: planInsertError } = await supabase
      .from("child_monthly_plans")
      .insert({
        child_id: childId,
        report_id: reportId,
        month: currentMonth,
        year: currentYear,
        focus_letters: targetLetters,
        status: "generating",
        plan_data: {},
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

    // 6. Build prompt and call OpenAI
    const gameCatalog = buildGameCatalog(targetLetters, ageGroup);
    const supportedTargets = targetLetters.filter((l) => SUPPORTED_LETTERS.includes(l));
    const unsupportedTargets = targetLetters.filter((l) => !SUPPORTED_LETTERS.includes(l));

    const systemPrompt = `Si logopedski asistent, ki ustvarja mesečne načrte vaj za otroke z govornimi težavami. Tvoj cilj je ustvariti raznolik, zabaven in učinkovit 4-tedenski načrt vaj.

PRAVILA:
- Vsak dan se ZAČNE z motoriko govoril (5 min): pot /govorno-jezikovne-vaje/vaje-motorike-govoril
- Po motoriki sledita 2-3 igre (po 10 min vsaka)
- Igre razporedi ENAKOMERNO med ciljnimi črkami
- RAZLIKUJ igre med dnevi - ne ponavljaj iste igre vsak dan
- Skupno trajanje dneva: 25-35 min
- 7 dni na teden (Ponedeljek-Nedelja), 4 tedni
- POTI MORAJO BITI TOČNO IZ KATALOGA - ne izmišljuj poti!
- Vsak teden naj ima tematski naslov v slovenščini
- Opisi aktivnosti naj bodo kratki in v slovenščini, napisani za starše
${unsupportedTargets.length > 0 ? `- Za črke ${unsupportedTargets.join(", ")} NI specifičnih iger - za te črke dodeli SAMO motoriko govoril` : ""}
${supportedTargets.length > 0 ? `- Za črke ${supportedTargets.join(", ")} uporabi igre iz kataloga spodaj` : ""}

${gameCatalog}`;

    const userPrompt = `Ustvari 4-tedenski mesečni načrt vaj za otroka:
- Ime: ${child.name}
- Starost: ${childAge} let (starostna skupina: ${ageGroup})
- Ciljne črke za vadbo: ${targetLetters.join(", ")}
${supportedTargets.length > 0 ? `- Črke s podporo iger: ${supportedTargets.join(", ")}` : ""}
${unsupportedTargets.length > 0 ? `- Črke brez specifičnih iger (samo motorika): ${unsupportedTargets.join(", ")}` : ""}

Ustvari raznolik načrt, kjer se igre razlikujejo med dnevi in tedni.`;

    const toolDefinition = {
      type: "function",
      function: {
        name: "create_monthly_plan",
        description: "Ustvari strukturiran mesečni načrt vaj za otroka",
        parameters: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "Kratek povzetek načrta v slovenščini (1-2 stavka)",
            },
            weeks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  weekNumber: { type: "number" },
                  theme: { type: "string", description: "Tematski naslov tedna v slovenščini" },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        dayNumber: { type: "number" },
                        dayName: {
                          type: "string",
                          enum: ["Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
                        },
                        activities: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: { type: "string", enum: ["motorika", "igra"] },
                              title: { type: "string" },
                              description: { type: "string" },
                              path: { type: "string" },
                              letter: { type: "string" },
                              duration: { type: "string" },
                            },
                            required: ["type", "title", "description", "path", "duration"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["dayNumber", "dayName", "activities"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["weekNumber", "theme", "days"],
                additionalProperties: false,
              },
            },
          },
          required: ["summary", "weeks"],
          additionalProperties: false,
        },
      },
    };

    console.log(`Calling OpenAI for child ${child.name}, letters: ${targetLetters.join(",")}, age: ${childAge}`);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [toolDefinition],
        tool_choice: { type: "function", function: { name: "create_monthly_plan" } },
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, errorText);

      // Mark plan as failed (archive it)
      await supabase
        .from("child_monthly_plans")
        .update({ status: "archived" })
        .eq("id", planRecord.id);

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await openaiResponse.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "create_monthly_plan") {
      console.error("Unexpected AI response format:", JSON.stringify(aiResult));
      await supabase
        .from("child_monthly_plans")
        .update({ status: "archived" })
        .eq("id", planRecord.id);

      return new Response(JSON.stringify({ error: "Invalid AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let planData;
    try {
      planData = JSON.parse(toolCall.function.arguments);
    } catch {
      console.error("Failed to parse AI response arguments");
      await supabase
        .from("child_monthly_plans")
        .update({ status: "archived" })
        .eq("id", planRecord.id);

      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 7. Enrich plan_data with metadata
    const fullPlanData = {
      ...planData,
      targetLetters,
      childAge,
      ageGroup,
    };

    // 8. Update plan record with generated data
    const { error: updateError } = await supabase
      .from("child_monthly_plans")
      .update({
        plan_data: fullPlanData,
        status: "active",
      })
      .eq("id", planRecord.id);

    if (updateError) {
      console.error("Failed to update plan:", updateError);
      return new Response(JSON.stringify({ error: "Failed to save plan" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Monthly plan generated successfully for child ${child.name} (${planRecord.id})`);

    return new Response(
      JSON.stringify({
        success: true,
        planId: planRecord.id,
        targetLetters,
        ageGroup,
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
