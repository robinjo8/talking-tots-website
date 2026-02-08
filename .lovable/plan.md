

# Omejitev AI Klepeta Tomi na dokumente iz Vector Store

## Problem
Tomi trenutno uporablja OpenAI Responses API z orodjem `file_search`, vendar model NE uporabi vedno dokumentov iz Vector Store. Namesto tega pogosto odgovarja iz svojega splosnega znanja (npr. izmisli vaje, ki ne obstajajo v TomiTalk aplikaciji, kot so "tra, tre, tri, tro, tru" vaje za glas R).

To se dogaja ker:
1. **`tool_choice` ni nastavljen** - model sam odloci ali bo iskal po dokumentih ali ne. Ce misli da "ze ve" odgovor, preskoci file_search.
2. **System prompt ne prepoveduje eksplicitno** uporabe splosnega znanja za opise funkcionalnosti TomiTalk aplikacije.
3. **Ni logiranja** ali je model uporabil file_search ali ne - zato je tezko debugirati.

## Resitev

### 1. Prisili uporabo file_search z `tool_choice: "required"`
V Edge Function dodamo parameter `tool_choice: "required"`, ki prisili model, da VEDNO uporabi file_search orodje preden odgovori. To pomeni, da bo vsak odgovor temeljil na dokumentih iz Vector Store.

### 2. Okrepljen system prompt
Dodamo stroga navodila v system prompt:
- **NIKOLI ne smes opisovati funkcionalnosti, vaj, iger ali vsebin TomiTalk aplikacije, ki jih NE najdes v prilozenih dokumentih.**
- **Ce v dokumentih ni informacije o doloceni vaji ali funkciji, MORAS reci da te informacije nimas.**
- **NE SMES izmisljati ali predpostavljati katere vaje, igre ali vsebine so na voljo v TomiTalk.**
- Podatki o otroku (ime, starost, govorne tezave) so izrecno omejeni SAMO na vpisanega uporabnika.

### 3. Dodano logiranje v Edge Function
Pred streamingom parsiramo SSE events in logiramo:
- Ali je model poklical file_search orodje
- To pomaga pri kasnejsem debugiranju kvalitete odgovorov

## Tehnicni detajli

### Spremembe v `supabase/functions/chat-assistant/index.ts`

**a) Dodan `tool_choice: "required"` v API klic:**
```typescript
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
  tool_choice: "required",  // <-- NOVO: prisili uporabo file_search
  stream: true,
}),
```

**b) Okrepljen system prompt z novimi pravili:**
Dodani bodo naslednji odstavki v `systemInstructions`:

```
PRAVILO O VIRIH INFORMACIJ:
Ko odgovarjas na vprasanja o TomiTalk aplikaciji (funkcionalnosti, vajah, igrah, 
vsebinah, nacinih uporabe), MORAS odgovor temeljiti IZKLJUCNO na dokumentih, 
ki jih najdes s pomocjo orodja file_search.

Ce v dokumentih NE najdes informacije o doloceni vaji, igri ali funkciji, MORAS 
jasno povedati: "V dokumentaciji TomiTalk ne najdem podatkov o tem."

NIKOLI NE SMES:
- Izmisljati ali predpostavljati katere vaje, igre ali vsebine so na voljo v TomiTalk
- Opisovati funkcionalnosti aplikacije na podlagi svojega splosnega znanja
- Trditi da dolocena vaja ali funkcija "je del TomiTalk", ce tega ne potrjujejo dokumenti

Za splosna vprasanja o govorno-jezikovnem razvoju (ki niso specificna za TomiTalk) 
lahko uporabis strokovno logopedsko znanje, vendar VEDNO jasno loci med splosnimi 
strokovnimi nasveti in specificnimi funkcijami TomiTalk aplikacije.

PRAVILO O PODATKIH UPORABNIKA:
Podatke o otroku (ime, starost, spol, govorne tezave) smes uporabljati IZKLJUCNO 
za otroka trenutno vpisanega uporabnika. NIKAKOR NE SMES posredovati, razkrivati 
ali mesati podatkov razlicnih uporabnikov. Ce nimas podatkov o otroku, NE ugibaj.
```

**c) Logiranje uporabe file_search:**
Dodan bo `console.log` ki zabeleži ali je model v streamu uporabil file_search orodje (na podlagi SSE event tipov `response.file_search_call.*`).

### Datoteke ki se spremenijo
- **`supabase/functions/chat-assistant/index.ts`** - edina datoteka, ki se spremeni

### Kaj se NE spremeni
- Frontend koda ostane enaka
- Uporabniska izkusnja ostane enaka (klepet deluje isto, samo odgovori bodo bolj tocni)
- Child context logika ostane enaka

