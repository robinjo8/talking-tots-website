

## Analiza: Migracija Whisper iz ZDA v EU (Azure OpenAI)

### Kaj trenutno uporabljate

V projektu sta **dve** Edge funkciji, ki kličeta OpenAI API v ZDA:

| Funkcija | Kaj uporablja | API endpoint | Namen |
|----------|--------------|--------------|-------|
| `transcribe-articulation` | Whisper (`whisper-1`) | `api.openai.com/v1/audio/transcriptions` | Preverjanje izgovorjave besed v artikulacijskih testih in govornih igrah |
| `chat-assistant` | GPT-4.1 + file_search (vector store) | `api.openai.com/v1/responses` | Klepet s Tomijem (AI logopedski pomočnik) |

### Kaj lahko prestavite na Azure EU

**1. Whisper (transkripcija) — DA, enostavno**

Iz slike vidim, da imate deployment `gpt-5-mini` na `tomitalk-eu.openai.azure.com`. Za Whisper boste potrebovali **dodaten deployment** modela `whisper` na istem Azure računu. Azure OpenAI podpira Whisper model.

Sprememba v kodi je minimalna — samo URL in avtentikacija:
- Trenutno: `https://api.openai.com/v1/audio/transcriptions` z `Bearer` ključem
- Azure: `https://tomitalk-eu.openai.azure.com/openai/deployments/{whisper-deployment}/audio/transcriptions?api-version=2024-06-01` z `api-key` headerjem

**Nič drugega se ne spremeni:**
- Vsi filtri (profanity, halucinacije, dolžina) ostanejo enaki
- Vse sprejemljive besede (`acceptedVariants`) ostanejo enake — te so v vaši kodi, ne pri OpenAI
- Levenshteinova primerjava, fonetični filtri — vse ostane
- Vse igre, ki uporabljajo transkripcijo, bodo delovale enako

**2. Klepet (chat-assistant) — KOMPLEKSNO**

Klepet uporablja OpenAI-jeve specifične funkcionalnosti:
- **Responses API** (`/v1/responses`) — to je OpenAI-specifičen endpoint, ki ga Azure nima
- **File Search** z **Vector Store** (`OPENAI_VECTOR_STORE_ID`) — vaši dokumenti na `platform.openai.com/storage/vector_stores/` so shranjeni tam
- Model `gpt-4.1` z `tool_choice: "required"`

Za preselitev klepeta na Azure bi morali:
- Preklopiti iz Responses API na Chat Completions API (Azure ga podpira)
- Postaviti lastno rešitev za vektorsko bazo (npr. Supabase pgvector) in naložiti dokumente tja
- Ali pa ohraniti klepet na OpenAI ZDA (ker ne pošilja biometričnih podatkov — samo besedilo)

### Predlog

**Faza 1 (ta plan): Samo Whisper → Azure EU**
- To je GDPR prioriteta, ker Whisper prejema **avdio posnetke otrok** (biometrični podatki)
- Minimalna sprememba: 1 edge funkcija, 2 nova secreta

**Faza 2 (pozneje, opcijsko): Klepet → Azure EU ali Lovable AI**
- Klepet pošilja samo besedilo (ime otroka, starost), ne avdio
- Manjše GDPR tveganje
- Zahteva več dela (vektorska baza, sprememba API-ja)

### Kaj potrebujem od vas

1. **Ustvarite Whisper deployment** na Azure portalu (`ai.azure.com`):
   - Model: `whisper` (ne gpt-5-mini, ki ga že imate)
   - Zapišite si ime deploymenta (npr. `whisper-1`)

2. **API ključ**: Ključ z Azure portala (isti kot za gpt-5-mini, viden na sliki pod "Key")

3. **Endpoint URL**: `https://tomitalk-eu.openai.azure.com` (vidno na sliki)

### Tehnične spremembe

**1 datoteka: `supabase/functions/transcribe-articulation/index.ts`**

Sprememba ~10 vrstic:
- Namesto `OPENAI_API_KEY` prebere `AZURE_OPENAI_API_KEY` in `AZURE_OPENAI_ENDPOINT`
- URL se spremeni iz `api.openai.com/v1/audio/transcriptions` v Azure endpoint
- Header se spremeni iz `Authorization: Bearer ...` v `api-key: ...`
- FormData ostane enak (file, language, prompt), le `model` polje se odstrani (model je del URL-ja pri Azure)

**2 nova secreta v Supabase:**
- `AZURE_OPENAI_API_KEY` — ključ iz Azure portala
- `AZURE_OPENAI_ENDPOINT` — `https://tomitalk-eu.openai.azure.com`

### Na kaj to vpliva

| Funkcionalnost | Vpliv |
|----------------|-------|
| Artikulacijski testi | Samo sprememba endpointa, vse ostalo enako |
| Govorne igre (Ponovi poved itd.) | Enako — isti edge function |
| Sprejemljive besede (acceptedVariants) | Brez sprememb — so v kodi, ne pri OpenAI |
| Filtri (profanity, halucinacije) | Brez sprememb |
| Klepet (Tomi) | Brez sprememb — ostane na OpenAI ZDA (za zdaj) |
| Dokumenti v Vector Store | Brez sprememb — ostanejo na OpenAI |

### Obseg
- 1 edge funkcija
- 2 nova Supabase secreta
- 0 sprememb v frontend kodi
- Zahteva: Whisper deployment na Azure (uporabnik mora ustvariti)

