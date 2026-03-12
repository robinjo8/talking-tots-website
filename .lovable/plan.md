

# Natancna analiza celotnega toka preverjanja izgovorjave

---

## ODGOVORI NA TVOJA VPRAŠANJA (1-12)

### 1. Seja-1 in nadaljevanje

**Kako zdaj deluje:** Pravilno. Ko otrok začne preverjanje, se ustvari seja v bazi (`articulation_test_sessions`). Če vmes zapusti in se vrne, sistem najde obstoječo nedokončano sejo (`is_completed = false`) in jo nadaljuje od zadnje besede (`current_word_index`). Vse ostane pod isto sejo (istim `session_id`).

**Problem:** Če otrok popolnoma zapusti test in ga začne "od začetka" (ne nadaljuje), se lahko ustvari nova seja z istim `session_number = 1`. Stara prazna seja ostane v bazi. To je razlog za "podvojene" zapise. Trenutni filter to rešuje - prazne seje (`word_count = 0`, `is_completed = false`, `status = pending`) se skrijejo.

**Tu ni potreben popravek.**

---

### 2. Zakaj 67 besed namesto 60?

**Razlog:** Gumb "Ponovi besedo" v preverjanju izgovorjave omogoča otroku, da **ponovi snemanje** iste besede. Vsaka ponovitev ustvari nov zapis v tabeli `articulation_word_results`. Lea je torej izgovorila 60 besed, ampak je 7 besed ponovila (skupaj 67 zapisov v bazi).

**Koda v `useAdminTests.ts` vrstica 106:** `supabase.from('articulation_word_results').select('session_id').in('session_id', sessionIds)` — ta preprosto prešteje VSE zapise, vključno s ponovljenimi.

**Popravek potreben:** Prikazovati moramo unikatne besede (60), ne vseh zapisov (67). Potrebna je deduplikacija po `target_word` ali pa omejitev na unikatne kombinacije `(session_id, letter, position)`.

---

### 3. Seja-1 se prikaže na admin portalu

**Kako zdaj deluje:** Pravilno. Ko otrok zaključi preverjanje (`is_completed = true`), se seja prikaže:
- Na strani **Vsa preverjanja** (`/admin/all-tests`) — v seznamu vseh preverjanj
- V zavihku **V čakanju** (`/admin/pending`) — če `status = 'pending'` in `assigned_to IS NULL`

**Tu ni potreben popravek.**

---

### 4. Logoped prevzame primer

**Kako zdaj deluje:** Pravilno. Logoped klikne na sejo, nato klikne "Prevzemi primer". To nastavi `assigned_to` na ID logopedovega profila. Primer se prestavi iz "V čakanju" v "Moji pregledi".

**Tu ni potreben popravek.**

---

### 5. Ogled in ocenjevanje

**Kako zdaj deluje:** Pravilno. Na strani `AdminSessionReview` (`/admin/tests/{sessionId}`) logoped posluša posnetke za vsak glas in izbere oceno.

**Tu ni potreben popravek.**

---

### 6. Prikaz sej in datumov naslednjih preverjanj

**Kako zdaj deluje:** Na strani pregleda seje so prikazane seje (Seja-1 do Seja-5).

**Datumi predvidenih naslednjih preverjanj** — TO NI IMPLEMENTIRANO. Nikjer v kodi ni logike za izračun ali prikaz datumov naslednjih preverjanj. To je nova funkcionalnost, ki jo je treba dodati.

---

### 7. Avtomatski zapis ocen v polje UGOTOVITVE

**Kako zdaj deluje:** Funkcija `generateAutoUgotovitve` v `useChildEvaluations.ts` DELUJE. Ko logoped izbere oceno za glas (npr. "Glas je izpuščen" za P), se ta ocena zapiše v polje UGOTOVITVE v formatu:
```
Glas P je izpuščen.
Glas B ni avtomatiziran.
```

**AMPAK** — to se zgodi šele ob nalaganju strani za poročilo (`AdminUserDetail.tsx`, vrstica 240-248) ali ob spremembi seje. Ne zgodi se samodejno ob kliku "Zaključi pregled Seja-1" na strani `AdminSessionReview`. Logoped mora ročno odpreti stran poročila, da se ugotovitve napolnijo.

**Popravek potreben:** Po kliku "Zaključi pregled Seja-1" bi se morale ocene avtomatsko zapisati v polje ugotovitve poročila (ali vsaj osvežiti ob naslednjem obisku strani poročila). Trenutno to že deluje ob obisku — `refetchOnMount: 'always'` zagotavlja sveže podatke.

**Dejansko stanje: DELUJE PRAVILNO** — ko logoped odpre stran poročila, se ugotovitve samodejno predizpolnijo iz ocen. Ni potrebno, da se to zgodi ob "Zaključi pregled" ker logoped vseeno mora odpreti stran poročila.

---

### 8. Poročilo — posebnosti

**a) Datum preverjanja izgovorjave:** PRAVILNO implementirano. Na voljo je dropdown z datumi vseh sej (vrstica 134-149 v `ReportTemplateEditor.tsx`). Privzeto se izbere najnovejša seja.

**b) Glas R — tri opcije ("Začetek", "Sredina/konec", "Začetne vaje"):** MANJKA. Trenutno ima LetterSelector samo dve opciji za vse glasove: "Začetek" in "Sredina/konec" (vrstica 113-115). Za glas R je potrebno dodati tretjo opcijo "Začetne vaje".

**c) Motorika govoril — opcije pogostosti:** Trenutne opcije so: "Vsak dan", "Enkrat na teden", "Enkrat na mesec", "Po meri". MANJKA opcija "Ni potrebno". Popravek: dodati opcijo "Ni potrebno" (`not_needed`) in spremeniti "Enkrat na teden" v "Enkrat na teden" (brez spremembe) ter "Enkrat na mesec" v "Ni potrebno".

Torej nove opcije: **Vsak dan, Enkrat na teden, Ni potrebno, Po meri**.

---

### 9. Shranjevanje osnutka poročila

**Kako zdaj deluje:** Logoped lahko shrani osnutek kot `.txt` datoteko v storage. Ob ponovnem obisku se lahko naloži shranjeni osnutek. To deluje preko `handleSaveReport` in `handleEditReport` funkcij v `AdminUserDetail.tsx`.

**Ni jasno ali ima to kakšne probleme brez testiranja. Osnovna logika je prisotna.**

---

### 10. Generiraj poročilo — uporabniški prikaz

**Kako zdaj deluje:** Ko logoped klikne "Generiraj":
1. Ustvari se PDF poročilo (`generateReportPdf`)
2. PDF se naloži v storage: `{parentId}/{childId}/Generirana-porocila/{filename}.pdf`
3. Ustvari se zapis v tabeli `logopedist_reports`
4. Sproži se edge funkcija `generate-monthly-plan` za ustvarjanje osebnega načrta

**Uporabniški prikaz poročila:** Na strani `/profile` (zavihek "Moji dokumenti") uporabnik vidi poročila v sekciji "Poročila". Klik na "Ogled" odpre predogled znotraj majhnega območja (vgrajen `DocumentPreview`), klik na "Prenesi" pa odpre signed URL v novem zavihku.

**Problem ki ga opisuješ:** Predogled je majhen, slabo berljiv, posebej na telefonu. PDF se prikaže v majhnem okvirju znotraj kartice.

**Popravek potreben:** Namesto vgrajenega predogleda ponuditi celozaslonski pogled poročila (modal ali nova stran) z možnostjo prenosa.

---

### 11. Osebni načrt — kako deluje

**Kako deluje:**
- **Sprožitev:** Ko logoped klikne "Generiraj poročilo", se po uspešnem shranjevanju sproži edge funkcija `generate-monthly-plan` z `reportId`.
- **Kaj upošteva:** Funkcija prebere `report_details` iz poročila, ki vsebuje: izbrane glasove s pozicijami (začetek/sredina-konec), frekvenco motorike govoril, video navodila. Na podlagi teh podatkov deterministično ustvari 90-dnevni načrt.
- **Kam se shrani:** V tabelo `child_monthly_plans` z `status: 'generating'` (med ustvarjanjem) in nato `status: 'active'`.
- **Na koliko časa:** Enkrat — ob potrditvi poročila. Ni avtomatičnega ponovnega generiranja. Če logoped ustvari novo poročilo, se ustvari nov načrt.
- **Novo igro/vajo čez mesec:** Če se doda nova igra/vaja v sistem, se obstoječi aktivni načrt NE posodobi samodejno. Nov načrt se ustvari šele ob naslednjem poročilu.
- **Kaj vidi uporabnik:** Na strani `/moji-izzivi` vidi dnevne kartice z aktivnostmi (motorika + igre). Vsak dan ima 2-3 aktivnosti. Uporabnik klikne na aktivnost, igra igro, vrne se — sistem zabeleži dokončanje.

**Obvestila za vadbo:**
- **PWA push notifications:** Tehnično MOGOČE (imate `vite-plugin-pwa`), ampak zahteva implementacijo service workerja za push obvestila, push subscription endpoint, in backend za pošiljanje. Ni trivialno.
- **Email obvestila:** Mogoče preko edge funkcij + cron job. Najpreprostejša opcija.
- **In-app opomnik:** Lahko se prikaže banner/notification ob prijavi, če uporabnik ni vadil danes.
- **SMS:** Mogoče preko Twilio ali podobnega, ampak dodatni stroški.

**Zaenkrat nobena od teh opcij NI implementirana.**

---

### 12. Puščica za razširitev na desktop pogledu

**Problem:** Na mobilnem pogledu (ozko okno) se prikaže puščica (ChevronDown) za razširitev vrstice. Na desktop pogledu (široko okno) puščica manjka ko ima otrok samo 1 sejo.

**Vzrok v kodi (vrstica 527-531 v AdminTests.tsx):**
```typescript
if (hasMutipleSessions) {
  toggleGroup(group.childKey);
} else {
  navigate(`/admin/tests/${latest.id}`);
}
```
Ko ima otrok samo 1 sejo, klik na vrstico takoj odpre sejo — ni razširitve. Puščica se prikaže samo če je `hasMutipleSessions` (vrstica 535-537). Za 1 sejo se puščica ne prikaže, kar je pravilno — gre naravnost na ogled.

**Za več sej:** Puščica (ChevronRight ki se rotira na 90°) SE prikaže na desktopu (vrstica 534-537). Če tega ne vidiš, je morda zato ker trenutno vsi otroci imajo samo 1 veljavno sejo (po filtriranju praznih).

**Resnični problem iz slike:** Na sliki 1 (mobilni pogled) se za Žaka z 1 sejo prikaže puščica in razširitev deluje. Na sliki 2 (desktop pogled) za Žaka ni puščice ker ima 1 sejo in klik pelje naravnost na ogled. TO JE NAČRTOVANO VEDENJE. Ampak razumem da bi raje vedno videl razširitev. Popravek: vedno prikazati razširljivo vrstico, tudi za 1 sejo.

---

## PLAN POPRAVKOV

### 1. Deduplikacija word_count (67 → 60)
**Datoteka:** `src/hooks/useAdminTests.ts`
Spremeniti poizvedbo za `articulation_word_results` tako, da šteje unikatne besede (deduplikacija po `target_word` ali kombinaciji `letter + position` na sejo).

### 2. Glas R — tretja opcija "Začetne vaje"
**Datoteka:** `src/components/admin/LetterSelector.tsx`
- Spremeniti tip `position` iz `'start' | 'middle-end'` v `'start' | 'middle-end' | 'initial-exercises'`
- Za glas R prikazati 3 opcije v Select: Začetek, Sredina/konec, Začetne vaje
- Za vse ostale glasove ohraniti 2 opciji
- Posodobiti `formatRecommendedLettersText` za novo opcijo

### 3. Motorika govoril — sprememba opcij
**Datoteka:** `src/components/admin/MotorikaFrequencySelector.tsx`
- Zamenjati "Enkrat na mesec" z "Ni potrebno" (`not_needed`)
- Opcije: Vsak dan, Enkrat na teden, Ni potrebno, Po meri
- Posodobiti `formatMotorikaFrequencyText` za novo opcijo

### 4. Desktop razširljive vrstice vedno vidne
**Datoteka:** `src/pages/admin/AdminTests.tsx`
- Vedno prikazati razširljivo vrstico (tudi za 1 sejo)
- Klik na vrstico vedno razširi/zapre (ne navigira naravnost)
- Gumb "Ogled" na sub-vrstici pelje na podrobnosti

### 5. Boljši prikaz poročila za uporabnika
**Datoteka:** `src/components/profile/MyDocumentsSection.tsx`
- Namesto vgrajenega majhnega predogleda: ob kliku na "Ogled" odpreti PDF v celozaslonskem modalu ali novem zavihku
- Na telefonu: odpre PDF čez celo stran z možnostjo prenosa
- Na računalniku: odpre PDF v večjem modalu ali novem zavihku

### Datoteke za spremembo:
1. `src/hooks/useAdminTests.ts` — deduplikacija word_count
2. `src/components/admin/LetterSelector.tsx` — R glas 3 opcije
3. `src/components/admin/MotorikaFrequencySelector.tsx` — nove opcije pogostosti
4. `src/pages/admin/AdminTests.tsx` — vedno razširljive vrstice
5. `src/components/profile/MyDocumentsSection.tsx` — boljši prikaz poročila

