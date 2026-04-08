

## Plan: Selitev klepeta na Azure EU

### Pristop
Dokumenti (300KB / ~75K tokenov) se vgradijo neposredno v system prompt. Brez dodatnih storitev, brez mesečnih stroškov.

### Predpogoj (vaša naloga)
1. Izvozite vsebino 6 dokumentov iz OpenAI Vector Store (kopirajte besedilo)
2. Naložite jih v Supabase Storage bucket (npr. `chat-documents`) kot `.txt` datoteke ali eno združeno datoteko

### Spremembe

**1. `supabase/functions/chat-assistant/index.ts`** (glavna sprememba)

- Odstrani: OpenAI Responses API, `file_search`, `OPENAI_VECTOR_STORE_ID`, `OPENAI_API_KEY`
- Uporabi: Azure Chat Completions API z obstoječima secretoma `AZURE_OPENAI_API_KEY` in `AZURE_OPENAI_ENDPOINT`
- Endpoint: `https://tomitalk-eu.openai.azure.com/openai/deployments/gpt-5-mini/chat/completions?api-version=2024-06-01`
- Ob zagonu prebere dokumente iz Supabase Storage in jih vključi v system prompt
- Auth header: `api-key` namesto `Authorization: Bearer`
- System prompt ostane enak, le na konec se doda `\n\nDOKUMENTI:\n{vsebina}`
- J↔R/L detekcija ostane enaka
- childContext logika ostane enaka
- SSE stream format se spremeni iz OpenAI Responses v standardni Chat Completions format
- Odstrani TransformStream za file_search logging (ni več potreben)

**2. `src/hooks/useChatAssistant.ts`** (parsing sprememba)

- Spremeni SSE parsing iz OpenAI Responses formata (`response.output_text.delta`) v Chat Completions format (`choices[0].delta.content`)
- Vrstica 198: `parsed.type === "response.output_text.delta"` se zamenja s `parsed.choices?.[0]?.delta?.content`
- `[DONE]` signal ostane enak
- Odstrani `response.completed` handling (vrstice 206-219) — ni potreben pri Chat Completions
- Vse ostalo (shranjevanje sporočil, UI, conversation management) ostane nespremenjeno

### Kaj ostane enako
- System prompt (vsa navodila za Tomi-ja)
- J↔R/L detekcija in augmentacija
- childContext (podatki o otroku)
- Shranjevanje pogovorov v bazo
- UI klepeta
- CORS konfiguracija
- JWT avtentikacija

### Kaj ni več potrebno
- `OPENAI_API_KEY` — samo če ga ne uporabljate za nič drugega
- `OPENAI_VECTOR_STORE_ID` — ne več
- Dokumenti na platform.openai.com — lahko jih izbrišete po migraciji

### Stroški
- ~$0.012 na sporočilo (namesto ~$0.001)
- Pri 1000 sporočilih/mesec ≈ $12/mesec
- Brez fiksnih mesečnih stroškov za dodatne storitve

### Obseg
- 2 datoteki
- 0 novih secretov (uporabi obstoječa `AZURE_OPENAI_API_KEY` in `AZURE_OPENAI_ENDPOINT`)
- 0 novih storitev
- Potrebno: uporabnik izvozi in naloži dokumente v Supabase Storage

