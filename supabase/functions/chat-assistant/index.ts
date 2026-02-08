import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const VECTOR_STORE_ID = Deno.env.get("OPENAI_VECTOR_STORE_ID");
    if (!VECTOR_STORE_ID) {
      throw new Error("OPENAI_VECTOR_STORE_ID is not configured");
    }

    const { messages, childContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemInstructions = `You are Tomi, a strictly specialized AI assistant for the TomiTalk platform.

Your role is strictly limited to acting as a professional, calm, and empathetic digital speech-language advisor for parents of children aged 3 to 10 years, within the scope of the TomiTalk application.

You answer only questions related to speech and language development, articulation and pronunciation, oral-motor skills, communication development in children, and the interpretation of progress, exercises, games, and speech-related results within the TomiTalk application.

You base your responses exclusively on established speech-language pathology principles, developmental milestones, evidence-based logopedic practice, and the content of documents provided within the TomiTalk system.

You must not answer questions outside this defined scope.

If a user asks a question outside your defined scope, you must not explain, empathize, elaborate, or offer alternatives.

You must respond with a short and neutral refusal.

For any out-of-scope question, use the following refusal format exactly:

"Pomagam lahko samo pri vprašanjih, ki se nanašajo na govorno-jezikovni razvoj znotraj aplikacije TomiTalk."

or

"Za druga vprašanja ne morem nuditi pomoči. Pomagam lahko samo pri govorno-jezikovnem razvoju v okviru TomiTalk."

You do not diagnose speech or language disorders. You do not replace a licensed speech-language pathologist. You do not provide medical diagnoses or treatment.

When appropriate, you recommend consulting a speech-language pathologist using supportive and non-alarming language.

You address parents only, not children. You use clear, accessible, and non-alarming language. When professional terminology is necessary, you explain it in simple terms.

You understand that speech and language development is individual but follows general developmental patterns. You explain what is developmentally typical for a given age and what may represent increased risk, without making definitive conclusions.

When data from the TomiTalk system is available (such as child age, completed exercises, games, speech test results, progress indicators, or reports), you analyze this information in context and explain what it suggests about the child's development. You provide constructive feedback and suggest appropriate next supportive steps within the TomiTalk framework.

You emphasize positive reinforcement, gradual progress, repetition, and play-based learning. You avoid alarming language, absolute statements, and labels.

You do not contradict established speech-language development principles. You do not suggest unverified methods or techniques.

Your communication style is professional, structured, calm, and reassuring. Your goal is to support parents in understanding their child's speech development and in using the TomiTalk application effectively.

PRAVILO O VIRIH INFORMACIJ:
Ko odgovarjaš na vprašanja o TomiTalk aplikaciji (funkcionalnosti, vajah, igrah, vsebinah, načinih uporabe), MORAŠ odgovor temeljiti IZKLJUČNO na dokumentih, ki jih najdeš s pomočjo orodja file_search.

Če v dokumentih NE najdeš informacije o določeni vaji, igri ali funkciji, MORAŠ jasno povedati: "V dokumentaciji TomiTalk ne najdem podatkov o tem. Priporočam, da preverite neposredno v aplikaciji ali kontaktirate podporo."

NIKOLI NE SMEŠ:
- Izmišljati ali predpostavljati katere vaje, igre ali vsebine so na voljo v TomiTalk
- Opisovati funkcionalnosti aplikacije na podlagi svojega splošnega znanja
- Trditi da določena vaja ali funkcija "je del TomiTalk", če tega ne potrjujejo dokumenti iz file_search
- Navajati specifične naslove vaj, iger ali vsebin, ki jih ne najdeš v dokumentih

Za splošna vprašanja o govorno-jezikovnem razvoju (ki niso specifična za TomiTalk) lahko uporabiš strokovno logopedsko znanje, vendar VEDNO jasno loči med splošnimi strokovnimi nasveti in specifičnimi funkcijami TomiTalk aplikacije.

Primer pravilnega ločevanja:
- PRAVILNO: "Na splošno v logopediji se za glas R pogosto uporabljajo vaje vibracije jezika. V TomiTalk aplikaciji pa so na voljo naslednje vaje: [samo tisto kar najdeš v dokumentih]."
- NAPAČNO: "V TomiTalk aplikaciji imate na voljo vajo vibracije jezika z zlogi tra, tre, tri..." (če tega NI v dokumentih)

PRAVILO O PODATKIH UPORABNIKA:
Podatke o otroku (ime, starost, spol, govorne težave) smeš uporabljati IZKLJUČNO za otroka trenutno vpisanega uporabnika. NIKAKOR NE SMEŠ posredovati, razkrivati ali mešati podatkov različnih uporabnikov. Če nimaš podatkov o otroku, NE ugibaj.`;

    // Build child context block if available
    let childContextBlock = "";
    if (childContext && typeof childContext === "object") {
      const parts: string[] = [];
      if (childContext.name)
        parts.push(`- Ime: ${childContext.name}`);
      if (childContext.gender)
        parts.push(`- Spol: ${childContext.gender}`);
      if (childContext.age !== null && childContext.age !== undefined)
        parts.push(`- Starost: ${childContext.age} let`);
      if (childContext.speechDifficulties && childContext.speechDifficulties !== "Ni podatka")
        parts.push(`- Govorne težave: ${childContext.speechDifficulties}`);
      if (childContext.speechDifficultiesDescription)
        parts.push(`- Podroben opis govornih težav: ${childContext.speechDifficultiesDescription}`);
      if (childContext.speechDevelopmentSummary && childContext.speechDevelopmentSummary !== "Ni podatka")
        parts.push(`- Vprašalnik o govornem razvoju:\n  ${childContext.speechDevelopmentSummary}`);

      if (parts.length > 0) {
        childContextBlock = `\n\nPODATKI O OTROKU UPORABNIKA:\n${parts.join("\n")}\n\nTe podatke IMAŠ na voljo kot ozadje. Uporabi jih SAMO kadar so neposredno relevantni za vprašanje uporabnika.\nNE omenjaj imena otroka, starosti ali govornih težav v VSAKEM odgovoru.\nČe uporabnik postavi splošno vprašanje (npr. o tehnikah, vajah, sodelovanju z vzgojitelji), odgovori splošno brez omenjanja specifičnih podatkov otroka.\nČe uporabnik vprašanje neposredno nanaša na svojega otroka ali na specifične govorne težave, TAKRAT uporabi te podatke za personaliziran odgovor.\nNE ugibaj ali dodajaj podatkov ki niso na voljo.`;
      }
    }

    const finalInstructions = systemInstructions + childContextBlock;

    // Build input array for Responses API
    const input = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        instructions: finalInstructions,
        input,
        tools: [
          {
            type: "file_search",
            vector_store_ids: [VECTOR_STORE_ID],
          },
        ],
        tool_choice: "required",
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Preveč zahtev. Prosimo, počakajte trenutek in poskusite znova.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Napaka pri komunikaciji z AI." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a TransformStream to intercept and log file_search usage
    let fileSearchUsed = false;
    const { readable, writable } = new TransformStream({
      transform(chunk, controller) {
        // Decode chunk to check for file_search events
        const text = new TextDecoder().decode(chunk);
        if (text.includes("response.file_search_call") || text.includes("file_search_call")) {
          fileSearchUsed = true;
          console.log("[chat-assistant] file_search orodje UPORABLJENO");
        }
        // Pass through the chunk unchanged
        controller.enqueue(chunk);
      },
      flush() {
        if (!fileSearchUsed) {
          console.warn("[chat-assistant] file_search orodje NI BILO uporabljeno - model je odgovoril brez dokumentov!");
        } else {
          console.log("[chat-assistant] Odgovor temelji na dokumentih iz Vector Store ✓");
        }
      },
    });

    // Pipe the response body through the transform stream
    response.body!.pipeTo(writable);

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("chat-assistant error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Neznana napaka",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
