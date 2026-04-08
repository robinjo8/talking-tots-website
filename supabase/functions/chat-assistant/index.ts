import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed =
    allowedOrigins.includes(origin) ||
    (origin.startsWith("https://") && origin.endsWith(".lovable.app")) ||
    (origin.startsWith("https://") && origin.endsWith(".lovableproject.com"));
  const allowOrigin = isAllowed ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

let cachedDocuments: string | null = null;

type AzureEndpointKind = "openai" | "foundry";

function normalizeAzureEndpoint(endpoint: string) {
  const trimmed = endpoint.trim();

  try {
    const url = new URL(trimmed);
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname
      .replace(/\/+$/, "")
      .replace(/\/openai\/v1$/i, "")
      .replace(/\/openai$/i, "")
      .replace(/\/models\/chat\/completions$/i, "")
      .replace(/\/models$/i, "");
    return url.toString().replace(/\/+$/, "");
  } catch {
    return trimmed
      .replace(/\/+$/, "")
      .replace(/\/openai\/v1$/i, "")
      .replace(/\/openai$/i, "")
      .replace(/\/models\/chat\/completions$/i, "")
      .replace(/\/models$/i, "");
  }
}

function detectAzureEndpointKind(endpoint: string): AzureEndpointKind {
  try {
    const hostname = new URL(endpoint).hostname.toLowerCase();
    if (hostname.endsWith(".services.ai.azure.com")) {
      return "foundry";
    }
  } catch {
    // Ignore parsing failure; validation happens separately.
  }

  return "openai";
}

function validateAzureEndpoint(endpoint: string): string | null {
  try {
    const hostname = new URL(endpoint).hostname.toLowerCase();

    if (hostname === "ai.azure.com" || (hostname.endsWith(".ai.azure.com") && !hostname.endsWith(".services.ai.azure.com"))) {
      return "AZURE_OPENAI_ENDPOINT trenutno kaže na Azure portal/Fabric URL. Uporabiti morate runtime endpoint v obliki https://<resource>.openai.azure.com ali https://<resource>.services.ai.azure.com.";
    }

    if (
      !hostname.endsWith(".openai.azure.com") &&
      !hostname.endsWith(".services.ai.azure.com") &&
      !hostname.endsWith(".cognitiveservices.azure.com")
    ) {
      return "AZURE_OPENAI_ENDPOINT ni veljaven Azure AI runtime endpoint. Uporabiti morate resource endpoint, ne URL-ja iz Azure portala.";
    }

    return null;
  } catch {
    return "AZURE_OPENAI_ENDPOINT ni veljaven URL. Uporabiti morate celoten https:// endpoint za vaš Azure resource.";
  }
}

async function loadDocuments(): Promise<string> {
  if (cachedDocuments) return cachedDocuments;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: files, error: listError } = await supabaseAdmin.storage
    .from("chat-documents")
    .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

  if (listError) {
    console.error("Error listing chat-documents:", listError);
    return "";
  }

  if (!files?.length) {
    console.warn("No documents found in chat-documents bucket");
    return "";
  }

  const docs: string[] = [];

  for (const file of files) {
    if (!file.name.endsWith(".txt")) continue;

    const { data, error } = await supabaseAdmin.storage
      .from("chat-documents")
      .download(file.name);

    if (error) {
      console.error(`Error downloading ${file.name}:`, error);
      continue;
    }

    docs.push(`--- ${file.name} ---\n${await data.text()}`);
  }

  cachedDocuments = docs.join("\n\n");
  console.log(`[chat-assistant] Loaded ${docs.length} documents (${cachedDocuments.length} chars)`);
  return cachedDocuments;
}

type BasicMessage = { role: string; content: string };

type AzureAttempt = {
  label: string;
  url: string;
  body: Record<string, unknown>;
};

async function callAzureOpenAI(
  apiKey: string,
  endpoint: string,
  deploymentName: string,
  systemPrompt: string,
  messages: BasicMessage[],
) {
  const endpointValidationError = validateAzureEndpoint(endpoint);
  if (endpointValidationError) {
    console.error("[chat-assistant] Invalid Azure endpoint configuration:", endpointValidationError);
    return new Response(
      JSON.stringify({
        error: "Azure OpenAI endpoint ni pravilno nastavljen.",
        details: endpointValidationError,
      }),
      { status: 500 },
    );
  }

  const normalizedEndpoint = normalizeAzureEndpoint(endpoint);
  const endpointKind = detectAzureEndpointKind(normalizedEndpoint);

  const responseInput = messages.map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  }));

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...responseInput,
  ];

  const attempts: AzureAttempt[] = endpointKind === "foundry"
    ? [
      {
        label: "foundry-models-chat-2024-05-01-preview",
        url: `${normalizedEndpoint}/models/chat/completions?api-version=2024-05-01-preview`,
        body: {
          model: deploymentName,
          messages: chatMessages,
          stream: true,
        },
      },
      {
        label: "foundry-chat-v1",
        url: `${normalizedEndpoint}/openai/v1/chat/completions`,
        body: {
          model: deploymentName,
          messages: chatMessages,
          stream: true,
        },
      },
      {
        label: "foundry-responses-v1",
        url: `${normalizedEndpoint}/openai/v1/responses`,
        body: {
          model: deploymentName,
          instructions: systemPrompt,
          input: responseInput,
          stream: true,
        },
      },
    ]
    : [
      {
        label: "responses-v1",
        url: `${normalizedEndpoint}/openai/v1/responses`,
        body: {
          model: deploymentName,
          instructions: systemPrompt,
          input: responseInput,
          stream: true,
        },
      },
      {
        label: "chat-v1",
        url: `${normalizedEndpoint}/openai/v1/chat/completions`,
        body: {
          model: deploymentName,
          messages: chatMessages,
          stream: true,
        },
      },
      {
        label: "chat-legacy-2024-10-21",
        url: `${normalizedEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-10-21`,
        body: {
          messages: chatMessages,
          stream: true,
        },
      },
      {
        label: "chat-legacy-2024-08-01-preview",
        url: `${normalizedEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`,
        body: {
          messages: chatMessages,
          stream: true,
        },
      },
    ];

  console.log(`[chat-assistant] Azure endpoint type: ${endpointKind}`);

  let lastErrorText = "Unknown Azure OpenAI error";
  let lastStatus = 500;
  let notFoundCount = 0;

  for (const attempt of attempts) {
    const response = await fetch(attempt.url, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attempt.body),
    });

    if (response.ok) {
      console.log(`[chat-assistant] Azure request succeeded via ${attempt.label}`);
      return response;
    }

    const errorText = await response.text();
    console.error(`[chat-assistant] Azure request failed via ${attempt.label}:`, response.status, errorText);
    lastErrorText = errorText;
    lastStatus = response.status;

    if (response.status === 404) {
      notFoundCount += 1;
    }

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Preveč zahtev. Prosimo, počakajte trenutek in poskusite znova." }),
        { status: 429 },
      );
    }

    if (response.status === 401 || response.status === 403) {
      break;
    }
  }

  if (notFoundCount === attempts.length) {
    const details = endpointKind === "foundry"
      ? "Azure endpoint je dosegljiv kot Foundry resource, vendar deployment ali endpoint ni pravilen. Preverite, da AZURE_OPENAI_ENDPOINT kaže na https://<resource>.services.ai.azure.com in da AZURE_OPENAI_CHAT_DEPLOYMENT natančno ustreza imenu deploymenta."
      : "Azure endpoint ali deployment ni bil najden. Preverite, da AZURE_OPENAI_ENDPOINT kaže na https://<resource>.openai.azure.com (ali .cognitiveservices.azure.com) in da AZURE_OPENAI_CHAT_DEPLOYMENT natančno ustreza imenu deploymenta.";

    return new Response(
      JSON.stringify({
        error: "Azure OpenAI resource ni najden.",
        details,
      }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({ error: "Napaka pri komunikaciji z AI.", details: lastErrorText }),
    { status: lastStatus },
  );
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Nepooblaščen dostop. Prijavite se." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Neveljavna seja. Prijavite se znova." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Authenticated user: ${claimsData.claims.sub}`);

    const azureApiKey = Deno.env.get("AZURE_OPENAI_API_KEY");
    const azureEndpoint = Deno.env.get("AZURE_OPENAI_ENDPOINT");
    const azureDeployment = Deno.env.get("AZURE_OPENAI_CHAT_DEPLOYMENT") || "gpt-5-mini";

    if (!azureApiKey || !azureEndpoint) {
      throw new Error("Azure OpenAI credentials are not configured");
    }

    const { messages, childContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const documentsText = await loadDocuments();

    const systemInstructions = `Si Tomi, strogo specializiran AI asistent za platformo TomiTalk.

Tvoja vloga je strogo omejena na delovanje kot profesionalen, miren in empatičen digitalni govorno-jezikovni svetovalec za starše otrok, starih od 3 do 10 let, IZKLJUČNO v okviru aplikacije TomiTalk.

Odgovarjaš SAMO na vprašanja povezana z govorno-jezikovnim razvojem, artikulacijo in izgovorjavo, oralno-motoričnimi veščinami, komunikacijskim razvojem otrok ter interpretacijo napredka, vaj, iger in rezultatov preverjanja izgovorjave znotraj aplikacije TomiTalk.

Svoje odgovore osnuješ IZKLJUČNO na vsebini dokumentov ki so priloženi spodaj. NE SMEŠ uporabljati svojega splošnega znanja o logopediji, vajah, tehnikah ali metodah za generiranje odgovorov.

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
VEDNO moraš odgovarjati na podlagi priloženih dokumentov. Tudi pri splošnih vprašanjih o govorno-jezikovnem razvoju NAJPREJ poišči informacije v dokumentih.

Če v dokumentih najdeš relevantne informacije, odgovori IZKLJUČNO na podlagi teh dokumentov.

Če v dokumentih NE najdeš dovolj informacij, NE odgovarjaj iz svojega splošnega znanja. Namesto tega daj KRATEK odgovor (največ 3-4 stavke) in uporabnika usmeri na:
1. Preverjanje neposredno v aplikaciji TomiTalk
2. Posvet z logopedom

NIKOLI NE SMEŠ napisati dolgih seznamov vaj, tehnik ali metod iz svojega splošnega znanja. Če nimaš podatkov v dokumentih, odgovori KRAJŠE in usmeri uporabnika na logopeda ali na aplikacijo TomiTalk.

NIKOLI NE SMEŠ trditi da TomiTalk "vsebuje" ali "ponuja" določeno funkcionalnost, če tega ne potrjujejo dokumenti. Namesto tega reci: "Priporočam, da preverite neposredno v aplikaciji TomiTalk."

Če dokumenti NE vsebujejo informacij relevantnih za vprašanje uporabnika, obravnavaj to ENAKO kot da dokumentov ni. NE uporabi rezultatov kot "inspiracijo" za generiranje lastnega odgovora.

NE SMEŠ nikoli napisati seznama z več kot 2 točkama, če vsebina NI dobesedno iz dokumentov.

NIKOLI NE SMEŠ:
- Izmišljati ali predpostavljati katere vaje, igre ali vsebine so na voljo v TomiTalk
- Opisovati funkcionalnosti aplikacije na podlagi svojega splošnega znanja
- Trditi da določena vaja ali funkcija "je del TomiTalk", če tega ne potrjujejo dokumenti
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
Podatke o otroku (ime, starost, spol, govorne težave) smeš uporabljati IZKLJUČNO za otroka trenutno vpisanega uporabnika. NIKAKOR NE SMEŠ posredovati, razkrivati ali mešati podatkov različnih uporabnikov. Če nimaš podatkov o otroku, NE ugibaj.

KRITIČNO PRAVILO – ZAMENJAVA GLASOV R ALI L Z GLASOM J:
Če uporabnik omeni, da otrok glas R ali glas L zamenjuje z glasom J (npr. "izgovarja J namesto R", "reče J namesto L", "zamenjuje R z J", "govori J namesto R/L"), moraš v odgovor VEDNO vključiti naslednji stavek, NE GLEDE NA STAROST OTROKA:

"Če otrok glas L ali glas R zamenjuje z glasom J, je potreben obisk logopeda, ne glede na starost otroka."

To pravilo ima NAJVIŠJO PRIORITETO in velja tudi če v dokumentih ne najdeš neposrednega ujemanja. V tem primeru NE uporabi generičnega odgovora o vajah, ampak VEDNO vključi zgornji stavek.`;

    let childContextBlock = "";
    if (childContext && typeof childContext === "object") {
      const parts: string[] = [];
      if (childContext.name) parts.push(`- Ime: ${childContext.name}`);
      if (childContext.gender) parts.push(`- Spol: ${childContext.gender}`);
      if (childContext.age !== null && childContext.age !== undefined) parts.push(`- Starost: ${childContext.age} let`);
      if (childContext.speechDifficulties && childContext.speechDifficulties !== "Ni podatka") parts.push(`- Govorne težave: ${childContext.speechDifficulties}`);
      if (childContext.speechDifficultiesDescription) parts.push(`- Podroben opis govornih težav: ${childContext.speechDifficultiesDescription}`);
      if (childContext.speechDevelopmentSummary && childContext.speechDevelopmentSummary !== "Ni podatka") parts.push(`- Vprašalnik o govornem razvoju:\n  ${childContext.speechDevelopmentSummary}`);

      if (parts.length > 0) {
        childContextBlock = `\n\nPODATKI O OTROKU UPORABNIKA:\n${parts.join("\n")}\n\nTe podatke IMAŠ na voljo kot ozadje. Uporabi jih SAMO kadar so neposredno relevantni za vprašanje uporabnika.\nNE omenjaj imena otroka, starosti ali govornih težav v VSAKEM odgovoru.\nČe uporabnik postavi splošno vprašanje (npr. o tehnikah, vajah, sodelovanju z vzgojitelji), odgovori splošno brez omenjanja specifičnih podatkov otroka.\nČe uporabnik vprašanje neposredno nanaša na svojega otroka ali na specifične govorne težave, TAKRAT uporabi te podatke za personaliziran odgovor.\nNE ugibaj ali dodajaj podatkov ki niso na voljo.`;
      }
    }

    const documentsBlock = documentsText ? `\n\nDOKUMENTI:\n${documentsText}` : "";
    const finalSystemPrompt = systemInstructions + childContextBlock + documentsBlock;

    const lastUserMsg = messages[messages.length - 1];
    const jReplacementPattern = /j\s*namesto\s*(r|l)|zamenjuje\s*(r|l)\s*(z|za)\s*j|(r|l)\s*(z|za)\s*j|izgovarja\s*j\s*namesto|(r|l)\s*namesto.*j|j\s*za\s*(r|l)/i;
    const detectedJPattern = lastUserMsg?.role === "user" && jReplacementPattern.test(lastUserMsg.content);

    if (detectedJPattern) {
      console.log("[chat-assistant] ⚠️ Zaznan vzorec J↔R/L v vprašanju uporabnika");
    }

    const preparedMessages = messages.map((message: BasicMessage, idx: number) => {
      if (detectedJPattern && idx === messages.length - 1 && message.role === "user") {
        return {
          role: "user",
          content: `${message.content}\n\n[Sistemska opomba: zamenjava glasu R ali L z glasom J, obisk logopeda ne glede na starost otroka]`,
        };
      }

      return {
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      };
    });

    const azureResponse = await callAzureOpenAI(
      azureApiKey,
      azureEndpoint,
      azureDeployment,
      finalSystemPrompt,
      preparedMessages,
    );

    if (!azureResponse.ok) {
      const errorBody = await azureResponse.text();
      return new Response(
        errorBody,
        {
          status: azureResponse.status >= 400 ? azureResponse.status : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(azureResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("chat-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Neznana napaka" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
