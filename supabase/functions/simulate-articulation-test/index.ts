import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin) || (origin.startsWith("https://") && (origin.endsWith(".lovable.app") || origin.endsWith(".lovableproject.com")));
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// 60 words in phonetic order: P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R
const WORDS = [
  { letter: "P", position: "Na začetku", word: "PAJEK" },
  { letter: "P", position: "V sredini", word: "OPICA" },
  { letter: "P", position: "Na koncu", word: "REP" },
  { letter: "B", position: "Na začetku", word: "BIK" },
  { letter: "B", position: "V sredini", word: "OBLAK" },
  { letter: "B", position: "Na koncu", word: "BOBER" },
  { letter: "M", position: "Na začetku", word: "MIZA" },
  { letter: "M", position: "V sredini", word: "GUMA" },
  { letter: "M", position: "Na koncu", word: "SEDEM" },
  { letter: "T", position: "Na začetku", word: "TORBA" },
  { letter: "T", position: "V sredini", word: "STOL" },
  { letter: "T", position: "Na koncu", word: "COPAT" },
  { letter: "D", position: "Na začetku", word: "DEŽNIK" },
  { letter: "D", position: "V sredini", word: "LADJA" },
  { letter: "D", position: "Na koncu", word: "CEDILO" },
  { letter: "K", position: "Na začetku", word: "KOLO" },
  { letter: "K", position: "V sredini", word: "ROKA" },
  { letter: "K", position: "Na koncu", word: "RAK" },
  { letter: "G", position: "Na začetku", word: "GOL" },
  { letter: "G", position: "V sredini", word: "ŽOGA" },
  { letter: "G", position: "Na koncu", word: "ŽAGA" },
  { letter: "N", position: "Na začetku", word: "NOČ" },
  { letter: "N", position: "V sredini", word: "BANANA" },
  { letter: "N", position: "Na koncu", word: "VOLAN" },
  { letter: "H", position: "Na začetku", word: "HIŠA" },
  { letter: "H", position: "V sredini", word: "JUHA" },
  { letter: "H", position: "Na koncu", word: "KRUH" },
  { letter: "V", position: "Na začetku", word: "VODA" },
  { letter: "V", position: "V sredini", word: "DREVO" },
  { letter: "V", position: "Na koncu", word: "SOVA" },
  { letter: "J", position: "Na začetku", word: "JOPA" },
  { letter: "J", position: "V sredini", word: "VEJA" },
  { letter: "J", position: "Na koncu", word: "NOJ" },
  { letter: "F", position: "Na začetku", word: "FANT" },
  { letter: "F", position: "V sredini", word: "MAFIN" },
  { letter: "F", position: "Na koncu", word: "KROF" },
  { letter: "L", position: "Na začetku", word: "LEV" },
  { letter: "L", position: "V sredini", word: "MILO" },
  { letter: "L", position: "Na koncu", word: "ŠAL" },
  { letter: "S", position: "Na začetku", word: "SOK" },
  { letter: "S", position: "V sredini", word: "OSA" },
  { letter: "S", position: "Na koncu", word: "LOS" },
  { letter: "Z", position: "Na začetku", word: "ZMAJ" },
  { letter: "Z", position: "V sredini", word: "MIZA" },
  { letter: "Z", position: "Na koncu", word: "KOZA" },
  { letter: "C", position: "Na začetku", word: "CEV" },
  { letter: "C", position: "V sredini", word: "RACA" },
  { letter: "C", position: "Na koncu", word: "ZAJEC" },
  { letter: "Š", position: "Na začetku", word: "ŠOTOR" },
  { letter: "Š", position: "V sredini", word: "PIŠKOT" },
  { letter: "Š", position: "Na koncu", word: "KOŠ" },
  { letter: "Ž", position: "Na začetku", word: "ŽABA" },
  { letter: "Ž", position: "V sredini", word: "ROŽA" },
  { letter: "Ž", position: "Na koncu", word: "LUŽA" },
  { letter: "Č", position: "Na začetku", word: "ČAJ" },
  { letter: "Č", position: "V sredini", word: "OČI" },
  { letter: "Č", position: "Na koncu", word: "ČOPIČ" },
  { letter: "R", position: "Na začetku", word: "RIBA" },
  { letter: "R", position: "V sredini", word: "OMARA" },
  { letter: "R", position: "Na koncu", word: "SIR" },
];

function sanitizeForStorage(str: string): string {
  return str
    .replace(/č/gi, 'c').replace(/š/gi, 's').replace(/ž/gi, 'z')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Decode JWT to get user ID (avoids session check)
    const token = authHeader.replace("Bearer ", "");
    let userId: string;
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      userId = payload.sub;
      if (!userId) throw new Error("No sub in token");
    } catch {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { childId } = await req.json();
    if (!childId) {
      return new Response(JSON.stringify({ error: "childId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Dev user email check
    const ALLOWED_EMAILS = ["qjavec@gmail.com", "kujavec.robert@gmail.com"];
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!userData?.user?.email || !ALLOWED_EMAILS.includes(userData.user.email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Dynamically determine session number
    const { count } = await supabaseAdmin
      .from("articulation_test_sessions")
      .select("id", { count: "exact", head: true })
      .eq("child_id", childId);

    const sessionNumber = (count || 0) + 1;
    console.log(`Creating Seja-${sessionNumber} (existing sessions: ${count || 0})`);

    // 1. Create session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("articulation_test_sessions")
      .insert({
        child_id: childId,
        parent_id: userId,
        status: "pending",
        is_completed: false,
        total_words: 60,
        current_word_index: 0,
        session_number: sessionNumber,
        source_type: "parent",
        submitted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("Session creation error:", sessionError);
      return new Response(JSON.stringify({ error: "Failed to create session", details: sessionError?.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sessionId = session.id;
    const sessionFolder = `Seja-${sessionNumber}`;
    const basePath = `${userId}/${childId}/Preverjanje-izgovorjave/${sessionFolder}`;
    console.log(`Created session ${sessionId}, copying 60 files to ${basePath}`);

    // 2. Process each word
    for (let i = 0; i < WORDS.length; i++) {
      const w = WORDS[i];
      const testFileIndex = i + 1;
      const testFileName = `test_${testFileIndex}.m4a`;

      // Download test audio from public bucket
      const audioUrl = `${supabaseUrl}/storage/v1/object/public/zvocni-posnetki/${testFileName}`;
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        console.error(`Failed to download ${testFileName}: ${audioResponse.status}`);
        continue;
      }
      const audioData = await audioResponse.arrayBuffer();

      // Upload to user profile bucket
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeLetter = sanitizeForStorage(w.letter);
      const safeWord = sanitizeForStorage(w.word);
      const storagePath = `${basePath}/${safeLetter}-${i}-${safeWord}-${timestamp}.m4a`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("uporabniski-profili")
        .upload(storagePath, audioData, {
          contentType: "audio/mp4",
          upsert: false,
        });

      if (uploadError) {
        console.error(`Upload error for word ${i}:`, uploadError);
      }

      // Insert word result
      const { error: insertError } = await supabaseAdmin
        .from("articulation_word_results")
        .insert({
          session_id: sessionId,
          letter: w.letter,
          position: w.position,
          target_word: w.word,
          transcribed_text: w.word,
          audio_url: storagePath,
          ai_accepted: true,
          ai_confidence: 1.0,
          ai_match_type: "exact",
        });

      if (insertError) {
        console.error(`Insert error for word ${i}:`, insertError);
      }

      // Update current_word_index (store NEXT index)
      await supabaseAdmin
        .from("articulation_test_sessions")
        .update({ current_word_index: i + 1 })
        .eq("id", sessionId);

      if ((i + 1) % 10 === 0) {
        console.log(`Progress: ${i + 1}/60 words processed`);
      }
    }

    // 3. Mark session as completed
    await supabaseAdmin
      .from("articulation_test_sessions")
      .update({
        is_completed: true,
        current_word_index: 60,
      })
      .eq("id", sessionId);

    // 4. Save test result for status tracking
    await supabaseAdmin
      .from("articulation_test_results")
      .insert({
        child_id: childId,
        completed_at: new Date().toISOString(),
      });

    console.log(`Simulation complete! Session ${sessionId} with 60 words.`);

    return new Response(
      JSON.stringify({ success: true, sessionId, sessionNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Simulation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
