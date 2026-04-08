

## Plan: Popravek API verzije za Azure Chat

### Problem
Edge funkcija `chat-assistant` poskuša 4 različne URL poti z napačnimi API verzijami (`2024-10-21`, `2024-08-01-preview`) ali z napačnimi potmi (`/openai/v1/responses`, `/openai/v1/chat/completions`). Vaš Azure deployment zahteva verzijo `2024-12-01-preview` in deployment-based pot.

Iz vaše Azure strani je razvidno, da je pravilni URL:
```text
https://tomitalk-eu.openai.azure.com/openai/deployments/gpt-5-mini/chat/completions?api-version=2024-12-01-preview
```

### Kaj naredimo
**1 datoteka: `supabase/functions/chat-assistant/index.ts`**

- Odstranimo celoten fallback mehanizem (4 poskuse, ~100 vrstic kode)
- Uporabimo en sam, pravilen URL:
  `{endpoint}/openai/deployments/{deployment}/chat/completions?api-version=2024-12-01-preview`
- Ohranimo vse ostalo: system prompt, dokumente iz Supabase Storage, J/R/L detekcijo, CORS, avtentikacijo, streaming

### Kaj ostane nespremenjeno
- Frontend (`useChatAssistant.ts`) -- brez sprememb
- Secreti -- že pravilno nastavljeni
- Dokumenti v Supabase Storage -- brez sprememb
- System prompt -- brez sprememb

### Kaj NI potrebno na Azure
- "Assistant vector stores" in "Data files" na Azure portalu so prazni in jih NE potrebujete. Dokumenti so pravilno shranjeni v Supabase Storage bucketu `chat-documents`.

### Obseg
- 1 datoteka, poenostavitev kode (manj kode, bolj zanesljivo)

