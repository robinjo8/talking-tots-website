

## Celostni pregled: Preverjanje izgovorjave + Dodatno preverjanje

### Kako trenutno deluje

**1. Redno preverjanje izgovorjave (uporabniški portal)**
- Uporabnik odpre `/artikulacijski-test`, izbere nastavitve (20 ali 60 besed, zahtevnost)
- `useArticulationTestNew` naloži 20 glasov × wordsPerLetter besed iz `articulationData`
- `useUserSessionManager` ustvari/nadaljuje sejo v `articulation_test_sessions`
- Ob snemanju `useTranscription` pošlje audio na edge funkcijo `transcribe-articulation`, ki shrani posnetek v Storage (`uporabniski-profili/{userId}/{childId}/Preverjanje-izgovorjave/Seja-{n}/`) in rezultat v `articulation_word_results`
- Ob zaključku se seja označi kot `is_completed = true`, status `pending`
- **Deluje pravilno.**

**2. Dodatno preverjanje (uporabniški portal)**
- Logoped dodeli besede prek `AdditionalTestAssignDialog` → `additional_test_assignments` + `additional_test_words`
- Na uporabniškem portalu se prikaže kartica "Dodatno preverjanje" (`ActivityOptions.tsx`)
- Uporabnik odpre `/dodatno-preverjanje`, `useAdditionalTestSession` ustvari sejo z `additional_assignment_id`
- `useArticulationTestNew` prejme `customWordData` iz dodeljenih besed
- Snemanje in transkripcija delujeta enako kot pri rednem testu
- Ob zaključku se seja in assignment označita kot completed
- **Deluje pravilno** (po popravku slik).

**3. Admin stran — Moji pregledi (`/admin/my-reviews`)**
- `useMyReviews` pridobi seje dodeljene logopedu, vključno z `additional_assignment_id`
- UI prikazuje badge "Dodatno" ali "Preverjanje" za razlikovanje
- **Deluje pravilno.**

**4. Admin stran — Pregled seje (`/admin/tests/{sessionId}`)**
- `useSessionReview` pravilno loči med rednim in dodatnim testom za pridobivanje posnetkov (signed URLs iz `articulation_word_results` za dodatno, Storage listing za redno)
- **Tu pa sta dva KRITIČNA problema:**

---

### Ugotovljene težave

#### BUG 1 (KRITIČEN): SessionAccordion prikaže 5 sej in 20 glasov za dodatno preverjanje

`AdminSessionReview.tsx` (vrstica 321) vedno prikaže 5 sej (`[1,2,3,4,5].map(...)`) — tudi za dodatno preverjanje, ki ima samo 1 sejo. Poleg tega `SessionAccordion.tsx` (vrstica 129) vedno iterira čez `PHONETIC_ORDER` (vseh 20 glasov), namesto da prikaže samo glasove iz dejanskih posnetkov. Za dodatno preverjanje z npr. 4 besedami (vse na glas B) bi logoped videl 20 praznih glasov in 4 prazne seje.

**Popravek:**
- V `AdminSessionReview.tsx`: ko je `data.session.additionalAssignmentId` nastavljen, prikaži samo 1 sejo (brez Seja-2…5)
- V `SessionAccordion.tsx` ali `AdminSessionReview.tsx`: posreduj dejanski seznam glasov (iz `recordingsByLetter.keys()`) namesto fiksnega `PHONETIC_ORDER`, ko gre za dodatno preverjanje

#### BUG 2 (SREDNJE KRITIČEN): Naslov pregleda ne razlikuje tipa testa

`AdminSessionReview.tsx` ne prikaže nikjer ali gre za "Preverjanje izgovorjave" ali "Dodatno preverjanje". Logoped ne ve kakšen test pregleduje.

**Popravek:**
- Dodati naslov/badge na vrhu review strani ki jasno razlikuje tip testa

#### BUG 3 (MANJŠI): completeSession pošlje napačno notifikacijo

V `useAdditionalTestSession.ts` (vrstica 187) je prazen query za child: `.eq('id', sessionInfo.sessionId ? '' : '')` — to nikoli ne vrne rezultata. Sicer je child name nato pravilno pridobljen iz sessionData, vendar je mrtva koda ki jemlje čas.

#### BUG 4 (MANJŠI): Audio URL-ji v AdditionalTestSection se morda ne osvežijo pravilno

`useEffect` dependency je `JSON.stringify(sessionIds)` — to deluje, ampak je fragilen pristop. Če se `sessionRecordings` spremenijo brez spremembe sessionIds, se signed URLs ne osvežijo. V praksi to ni kritično, ker se sessionIds ne spreminjajo brez polne osvežitve.

---

### Plan popravkov

**Datoteka: `src/pages/admin/AdminSessionReview.tsx`**
1. Preveriti `data.session.additionalAssignmentId` — če je nastavljen:
   - Prikazati samo 1 sejo namesto 5
   - Dodati naslov "Dodatno preverjanje" z badge-om na vrhu
   - Skriti gumb "Dodeli dodatno preverjanje" (ne smeš dodeliti dodatnega preverjanja iz dodatnega preverjanja)
2. Posredovati seznam glasov iz `recordingsByLetter` v `SessionAccordion`

**Datoteka: `src/components/admin/SessionAccordion.tsx`**
3. Dodati prop `letterOrder?: string[]` — ko je podan, uporabi ta seznam namesto `PHONETIC_ORDER`
4. Ko je `letterOrder` podan, iterirati samo čez te glasove

**Datoteka: `src/hooks/useAdditionalTestSession.ts`**
5. Odstraniti mrtvo kodo za pridobivanje child na vrstici 186-188

Skupaj ~5 sprememb v 3 datotekah. Jedro popravka je v AdminSessionReview + SessionAccordion.

