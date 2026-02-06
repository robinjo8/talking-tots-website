

# Plan: AI Klepet - kontekst otroka, premik v meni, zgodovina pogovorov

## Povzetek

Tri spremembe:
1. Chat bo vedel za tocno dolocenega otroka starsa (ime, starost, spol, govorne tezave, vprasalnik o govornem razvoju)
2. Chat se premakne iz strani "Moja stran" v Nastavitve (Profile) pod nov zavihek "AI Klepet"
3. Shranjevanje zgodovine pogovorov v bazo - prikaz zadnjih 5 pogovorov

---

## 1. Kontekst otroka

### Kaj se poslje AI-ju

Iz tabele `children` (za otroka trenutnega starsa) se preberejo podatki in posljejo edge funkciji:

| Podatek | Vir | Primer |
|---------|-----|--------|
| Ime | `child.name` | "Masa" |
| Spol | `child.gender` | "F" -> "Deklica" |
| Starost | Izracun iz `child.birth_date` | "4 leta" |
| Govorne tezave | `child.speech_difficulties` | ["articulation"] -> "Motnja izreke / artikulacije - dislalija" |
| Opis tezav | `child.speech_difficulties_description` | "R izgovarja kot L" |
| Vprasalnik | `child.speech_development` | Berljiv povzetek iz SPEECH_DEVELOPMENT_QUESTIONS modela |

### Kako deluje

- `AIChatSection` (nova komponenta) prebere `selectedChild` iz `useAuth()` (prvi otrok - en stars ima vedno samo enega otroka)
- Sestavi `childContext` objekt s prevedenimi vrednostmi (npr. "articulation" -> "Motnja izreke / artikulacije - dislalija", speech development kljuci -> slovensko besedilo vprasanj)
- Starost se izracuna iz `birth_date` v letih
- `childContext` se poslje v `useChatAssistant` hook, ki ga doda v request body ob vsakem sporocilu
- Edge funkcija vstavi kontekst v system instructions kot dodaten blok na koncu

### Primer konteksta v edge funkciji

```text
PODATKI O OTROKU UPORABNIKA:
- Ime: Masa
- Spol: Deklica
- Starost: 4 leta
- Govorne tezave: Motnja izreke / artikulacije - dislalija
- Podroben opis tezav: R izgovarja kot L
- Vprasalnik o govornem razvoju:
  * Ali druge osebe razumejo otrokov govor: Da
  * Otrok lahko rece: Vec kot 200 besed
  * Ali zna tvoriti povedi: Da
  * Ali jasno izgovarja besede: Ne
  * Pogosta vnetja uses: Ne
  * Tezave z zvecenjem: Ne
  * Ali obiskuje logopeda: Da

VEDNO uporabi te podatke. NE ugibaj starosti ali govornih tezav otroka.
Ce uporabnik sprasi o otroku, odgovarjaj na podlagi teh podatkov.
```

### Dinamicne suggested questions

Namesto fiksnega "Katere vaje so primerne za 4-letnika?" se uporabi dejanska starost otroka iz profila.

---

## 2. Premik chata v Nastavitve

### Spremembe

- **MojaStran.tsx**: Odstranitev AI chat kartice (vrstice 59-77) in neuporabljenih importov (`MessageCircle`, `Button`)
- **ProfileSidebar.tsx**: Nov meni element `{ id: "aiChat", label: "AI Klepet", icon: MessageCircle }` - dodan med "Preverjanje izgovorjave" in "Narocnina"
- **ProfileMobileTabs.tsx**: Isti element za mobilni meni
- **Profile.tsx**: Dodana sekcija `{activeSection === 'aiChat' && <AIChatSection />}`
- **AIChatSection.tsx** (nova): Wrapper komponenta ki sestavi childContext in renderira ChatInterface z ustrezno visino

Stran `/pomoc-chat` (PomocChat.tsx) in njena ruta se ohranita kot alternativni dostop.

---

## 3. Zgodovina pogovorov (zadnjih 5)

### Supabase tabele (nova migracija)

**Tabela `chat_conversations`:**

| Stolpec | Tip | Opis |
|---------|-----|------|
| id | uuid PK (gen_random_uuid) | ID pogovora |
| user_id | uuid FK -> auth.users | Lastnik |
| title | text | Avtomatski naslov (prvih ~50 znakov prvega vprasanja) |
| created_at | timestamptz | Cas ustvarjanja |
| updated_at | timestamptz | Cas zadnjega sporocila |

**Tabela `chat_messages`:**

| Stolpec | Tip | Opis |
|---------|-----|------|
| id | uuid PK | ID sporocila |
| conversation_id | uuid FK -> chat_conversations (ON DELETE CASCADE) | Kateri pogovor |
| role | text CHECK (role IN ('user','assistant')) | Vloga |
| content | text | Vsebina |
| created_at | timestamptz | Cas |

**RLS politike:**
- `chat_conversations`: SELECT, INSERT, UPDATE, DELETE le kjer `user_id = auth.uid()`
- `chat_messages`: SELECT, INSERT le za sporocila, ki pripadajo pogovorom uporabnika (prek JOIN na `chat_conversations.user_id = auth.uid()`)

### Logika v frontend-u

`useChatAssistant` hook se razsiri:
- `conversations` - seznam zadnjih 5 pogovorov (iz baze, urejeni po `updated_at DESC`)
- `activeConversationId` - ID trenutnega pogovora (ali `null` za novega)
- `loadConversation(id)` - nalozi sporocila iz baze za izbrani pogovor
- `startNewConversation()` - ponastavi sporocila in `activeConversationId`
- Ob posiljanju prvega sporocila se ustvari nov zapis v `chat_conversations` (naslov = prvih ~50 znakov vprasanja)
- Ob vsakem poslanem/prejetem sporocilu se shrani v `chat_messages`
- Ob zakljucku asistentovega odgovora se posodobi `updated_at` na pogovoru

### UI prikaz

V `ChatInterface` se nad pogovorom doda:
- Gumb "+ Nov pogovor"
- Seznam zadnjih 5 pogovorov (naslov + datum) kot klikljivi elementi
- Ko uporabnik klikne na pogovor, se nalozijo vsa sporocila tega pogovora
- Ko uporabnik klikne "Nov pogovor", se zacne prazen pogovor

```text
+------------------------------------------+
| [+ Nov pogovor]                          |
| > Kdaj naj bi otrok izgovarjal R?  3.2. |
| > Vaje za motoriko govoril        1.2.  |
|------------------------------------------|
|          Trenutni pogovor                |
|  [sporocila...]                          |
|  [vnos sporocila]                        |
+------------------------------------------+
```

---

## Tehnicne podrobnosti - datoteke

| Datoteka | Akcija | Opis |
|----------|--------|------|
| Nova migracija SQL | Nova | Tabeli `chat_conversations` + `chat_messages` z RLS |
| `src/components/profile/AIChatSection.tsx` | Nova | Wrapper - sestavi childContext iz selectedChild, posreduje ChatInterface |
| `src/hooks/useChatAssistant.ts` | Sprememba | Doda `childContext` parameter, shranjevanje/nalaganje iz baze, conversations state |
| `src/components/chat/ChatInterface.tsx` | Sprememba | Prejme childContext, dinamicne suggested questions, seznam zgodovine pogovorov |
| `supabase/functions/chat-assistant/index.ts` | Sprememba | Sprejme `childContext` iz body in vstavi v system instructions |
| `src/components/profile/ProfileSidebar.tsx` | Sprememba | Doda "AI Klepet" meni element |
| `src/components/profile/ProfileMobileTabs.tsx` | Sprememba | Doda "AI Klepet" tab |
| `src/pages/Profile.tsx` | Sprememba | Doda prikaz AIChatSection |
| `src/pages/MojaStran.tsx` | Sprememba | Odstrani chat kartico in neuporabljene importe |
| `src/integrations/supabase/types.ts` | Sprememba | Doda tipe za novi tabeli |

