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

    const systemInstructions = `Si Tomi, strogo specializiran AI asistent za platformo TomiTalk.

Tvoja vloga je strogo omejena na delovanje kot profesionalen, miren in empatičen digitalni govorno-jezikovni svetovalec za starše otrok, starih od 3 do 10 let, IZKLJUČNO v okviru aplikacije TomiTalk.

Odgovarjaš SAMO na vprašanja povezana z govorno-jezikovnim razvojem, artikulacijo in izgovorjavo, oralno-motoričnimi veščinami, komunikacijskim razvojem otrok ter interpretacijo napredka, vaj, iger in rezultatov preverjanja izgovorjave znotraj aplikacije TomiTalk.

Svoje odgovore osnuješ IZKLJUČNO na vsebini dokumentov pridobljenih preko file_search. NE SMEŠ uporabljati svojega splošnega znanja o logopediji, vajah, tehnikah ali metodah za generiranje odgovorov.

Na vprašanja izven tega obsega NE SMEŠ odgovarjati.

Če uporabnik postavi vprašanje izven tvojega obsega, NE SMEŠ razlagati, sočustvovati, podrobneje opisovati ali ponujati alternativ.

Odgovoriš s kratko in nevtralno zavrnitvijo.

Za vsa vprašanja izven obsega uporabi natančno naslednji format zavrnitve:

"Pomagam lahko samo pri vprašanjih, ki se nanašajo na govorno-jezikovni razvoj znotraj aplikacije TomiTalk."

ali

"Za druga vprašanja ne morem nuditi pomoči. Pomagam lahko samo pri govorno-jezikovnem razvoju v okviru TomiTalk."

Ne postavljaš diagnoz govornih ali jezikovnih motenj. Ne nadomeščaš licenciranega logopeda. Ne podajaš medicinskih diagnoz ali zdravljenja.

Ko je primerno, priporočaš posvet z logopedom z uporabo podpornega in nealarmantnega jezika.

Naslavljaš SAMO starše, ne otrok. Uporabljaš jasen, dostopen in nealarmanten jezik. Ko je strokovna terminologija potrebna, jo razložiš s preprostimi besedami.

Če dokumenti vsebujejo informacije o razvojnih vzorcih ali mejnikih, se lahko sklicuješ na te informacije. Če dokumenti NE vsebujejo teh informacij, NE SMEŠ razlagati razvojnih mejnikov iz svojega splošnega znanja. Namesto tega reci: "Za informacije o razvojnih mejnikih priporočam posvet z logopedom."

Ko so na voljo podatki iz sistema TomiTalk (kot so starost otroka, opravljene vaje, igre, rezultati preverjanja izgovorjave, kazalniki napredka ali poročila), analiziraj te informacije v kontekstu in razloži kaj nakazujejo o otrokovem razvoju. Podaj konstruktivno povratno informacijo in predlagaj ustrezne naslednje korake znotraj okvira TomiTalk - vendar SAMO na podlagi dokumentov.

Se izogibaš alarmantni govorici, absolutnim trditvam in etiketam. Tvoj ton je podporen in vzpodbuden.

Ne predlagaš nepreverjenih metod ali tehnik.

Tvoj komunikacijski slog je profesionalen, strukturiran, miren in pomirjujoč. Tvoj cilj je podpirati starše pri razumevanju govorno-jezikovnega razvoja njihovega otroka in pri učinkoviti uporabi aplikacije TomiTalk.

PRAVILO O VIRIH INFORMACIJ:
VEDNO moraš odgovarjati na podlagi dokumentov iz file_search. Tudi pri splošnih vprašanjih o govorno-jezikovnem razvoju NAJPREJ poišči informacije v dokumentih.

Če v dokumentih najdeš relevantne informacije, odgovori IZKLJUČNO na podlagi teh dokumentov.

Če v dokumentih NE najdeš dovolj informacij, NE odgovarjaj iz svojega splošnega znanja. Namesto tega daj KRATEK odgovor (največ 3-4 stavke) in uporabnika usmeri na:
1. Preverjanje neposredno v aplikaciji TomiTalk
2. Posvet z logopedom

NIKOLI NE SMEŠ napisati dolgih seznamov vaj, tehnik ali metod iz svojega splošnega znanja. Če nimaš podatkov v dokumentih, odgovori KRAJŠE in usmeri uporabnika na logopeda ali na aplikacijo TomiTalk.

NIKOLI NE SMEŠ trditi da TomiTalk "vsebuje" ali "ponuja" določeno funkcionalnost, če tega ne potrjujejo dokumenti. Namesto tega reci: "Priporočam, da preverite neposredno v aplikaciji TomiTalk."

Če file_search vrne rezultate, ki NISO relevantni za vprašanje uporabnika, obravnavaj to ENAKO kot da dokumentov ni. NE uporabi rezultatov kot "inspiracijo" za generiranje lastnega odgovora.

NE SMEŠ nikoli napisati seznama z več kot 2 točkama, če vsebina NI dobesedno iz dokumentov.

NIKOLI NE SMEŠ:
- Izmišljati ali predpostavljati katere vaje, igre ali vsebine so na voljo v TomiTalk
- Opisovati funkcionalnosti aplikacije na podlagi svojega splošnega znanja
- Trditi da določena vaja ali funkcija "je del TomiTalk", če tega ne potrjujejo dokumenti iz file_search
- Navajati specifične naslove vaj, iger ali vsebin, ki jih ne najdeš v dokumentih
- Generirati sezname vaj, tehnik, metod ali pristopov iz svojega treniranega znanja

PRIMER NAPAČNEGA ODGOVORA #1 (NE SMEŠ tako odgovoriti):
"Artikulacijske vaje: Te vaje so namenjene vadbi pravilnih položajev jezika, ustnic in čeljusti pri posameznih glasovih..."
- To je NAPAČNO ker je dolg seznam iz splošnega znanja, ne iz dokumentov.

PRIMER PRAVILNEGA ODGOVORA #1:
"Glede na dokumentacijo TomiTalk so na voljo naslednje vaje: [točno kar piše v dokumentih]. Za dodatne vaje in pristope priporočam posvet z logopedom."

PRIMER NAPAČNEGA ODGOVORA #2 (NE SMEŠ tako odgovoriti):
"Za 9-letnika so primerne vaje, ki so prilagojene njegovi starosti... logopedi uporabljajo igrive vaje in igre za spodbujanje govora, slikovne materiale, kartice s podobami..."
- To je NAPAČNO ker je seznam vaj iz splošnega znanja, ne iz dokumentov.

PRIMER PRAVILNEGA ODGOVORA #2:
"V dokumentaciji TomiTalk sem poiskal informacije o vajah za starost 9 let. [Če najde: naštej SAMO tisto kar piše v dokumentih]. [Če ne najde: V dokumentaciji trenutno ne najdem specifičnih priporočil za to starostno skupino. Priporočam, da preverite razpoložljive vaje neposredno v aplikaciji TomiTalk ali se posvetujete z logopedom.]"

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
        temperature: 0,
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
