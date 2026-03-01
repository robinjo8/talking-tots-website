

# Razsiritev sistema porocil in osebnega nacrta

## Pregled zahtev

Zahtevanih je 5 med seboj povezanih funkcionalnosti:

1. **Avtomatsko polnjenje UGOTOVITEV** iz ocen logopeda (ocene iz pregleda seje se prenesejo v polje "Ugotovitve" v porocilu)
2. **Razsiritev "Priporocamo igre in vaje za"** z izbiro pozicije glasu (zacetek / sredina-konec)
3. **Nov razdelek "Priporocamo vaje za motoriko govoril"** s frekvenco vadbe
4. **Nov razdelek "Priporocamo ogled video navodil za glas"** z izbiro glasov
5. **Prilagoditev osebnega nacrta** glede na vse zgornje izbire

---

## 1. Avtomatsko polnjenje UGOTOVITEV

### Kako deluje
Ko logoped na strani pregleda seje (npr. `/admin/tests/{sessionId}`) za glas P oznaci "Glas je izpuscen", se to ob odprtju porocila na strani podrobnosti uporabnika avtomatsko pojavi v polju UGOTOVITVE.

### Tehnicna izvedba
- Na straneh `AdminUserDetail.tsx` in `AdminLogopedistChildDetail.tsx` ze obstaja hook `useChildEvaluations` (za parent otroke) oz. se doda ekvivalent za logopedist otroke
- Ko logoped izbere sejo v porocilu (handleSessionChange), se iz baze preberejo ocene (`articulation_evaluations`) za to sejo
- Za vsak glas, ki ima izbrano karkoli razen "acquired" (Glas je usvojen), se sestavi besedilo:
  - "Glas P je izpuscen." (ce je izbrana opcija `omitted`)
  - "Glas P ni usvojen." (ce je izbrana opcija `not_acquired`)
  - "Glas P je neustrezno usvojen (popacen)." (ce je izbrana opcija `distorted`)
  - "Glas P ni avtomatiziran." (ce je izbrana opcija `not_automated`)
  - "Glas P je zamenjan z drugim glasom." (ce je izbrana opcija `substituted`)
- Ce ima glas vec izbranih opcij, se vse izpisejo v locenih vrsticah
- To besedilo se PREDIZPOLNI v polje `ugotovitve` v `reportData`
- Logoped lahko besedilo se vedno rocno ureja/dopolni

### Datoteke za spremembo
- `src/pages/admin/AdminUserDetail.tsx` -- dodati logiko za avtomatsko polnjenje ugotovitev ob izbiri seje
- `src/pages/admin/AdminLogopedistChildDetail.tsx` -- enako (potreben nov hook za logopedist child evaluations)
- `src/hooks/useChildEvaluations.ts` -- razsiriti za podporo logopedist_child_id

---

## 2. Razsiritev "Priporocamo igre in vaje za" s pozicijo glasu

### Kako deluje
Ko logoped izbere glas (npr. P), mora nato dolociti se pozicijo: "Zacetek" ali "Sredina/konec". Brez te izbire porocila ni mogoce generirati.

### Igre po poziciji
- **Zacetek**: Kolo besed, Igra ujemanja, Zaporedja, Spomin, Labirint, Sestavljanka
- **Sredina/konec**: Zabavna pot, Bingo, Ponovi poved, Smesne povedi

**Pravilo za osebni nacrt**: Ce logoped izbere "Zacetek" -> nacrt vkljuci samo igre za zacetek. Ce izbere "Sredina/konec" -> nacrt vkljuci VSE igre (zacetek + sredina/konec).

### Tehnicna izvedba
- Spremeniti `ReportData` interface -- `recommendedLetters: string[]` zamenjati z `recommendedLetters: { letter: string; position: 'start' | 'middle-end' }[]`
- Spremeniti `LetterSelector` komponento -- po izbiri glasu prikazati dropdown/toggle za pozicijo
- Spremeniti `formatRecommendedLettersText()` -- vkljuciti pozicijo v besedilo, npr. "Priporocamo igre in vaje za glas P na zacetku besed in za glas R na sredini/koncu besed."
- Posodobiti validacijo v `handleGeneratePdf` -- preveriti da ima vsak izbrani glas doloceno pozicijo
- Posodobiti `generateReportPdf.ts` za prikaz v PDF
- Posodobiti `logopedist_reports.recommended_letters` v bazi -- spremeniti iz `text[]` v `jsonb` (ali ohraniti text[] in dodati novo polje `recommended_positions jsonb`)

### Datoteke za spremembo
- `src/components/admin/LetterSelector.tsx` -- preoblikovati UI za pozicijo
- `src/components/admin/ReportTemplateEditor.tsx` -- posodobiti interface in prikaz
- `src/utils/generateReportPdf.ts` -- posodobiti PDF generiranje
- `src/pages/admin/AdminUserDetail.tsx` -- posodobiti validacijo
- `src/pages/admin/AdminLogopedistChildDetail.tsx` -- enako
- DB migracija -- dodati stolpec ali spremeniti format

---

## 3. Nov razdelek "Priporocamo vaje za motoriko govoril"

### Kako deluje
Logoped izbere frekvenco vadbe motorike govoril:
- Vsak dan
- Vsak teden (1x na teden)
- Vsak mesec (1x na mesec)
- Po meri: [stevilka] + [dan/teden/mesec] (npr. "3x na teden")

### Tehnicna izvedba
- Dodati nova polja v `ReportData`:
  - `motorikaFrequency: 'daily' | 'weekly' | 'monthly' | 'custom' | null`
  - `motorikaCustomCount: number | null`
  - `motorikaCustomUnit: 'day' | 'week' | 'month' | null`
- Ustvariti novo komponento `MotorikaFrequencySelector`
- Dodati v `ReportTemplateEditor` kot nov razdelek med "Predlog za igre in vaje" in "Opombe"
- V besedilu porocila: "Priporocamo vaje za motoriko govoril vsak dan." ali "Priporocamo vaje za motoriko govoril 3-krat na teden."
- V PDF dodati ta stavek v razdelek "Predlog za igre in vaje"
- Shraniti v `logopedist_reports` (v polje `findings` kot JSON ali v novo polje)

### Datoteke za spremembo
- Nova datoteka: `src/components/admin/MotorikaFrequencySelector.tsx`
- `src/components/admin/ReportTemplateEditor.tsx` -- dodati razdelek
- `src/utils/generateReportPdf.ts` -- dodati v PDF
- `src/pages/admin/AdminUserDetail.tsx` -- dodati stanje in shranjevanje
- `src/pages/admin/AdminLogopedistChildDetail.tsx` -- enako

---

## 4. Nov razdelek "Priporocamo ogled video navodil za glas"

### Kako deluje
Logoped izbere glasove za katere priporoca video navodila. Na voljo so glasovi, ki imajo video navodila: C, C, K, L, R, S, S, Z, Z (9 glasov iz `videoNavodilaConfig.ts`).

To se NE vkljuci v osebni nacrt, samo v porocilo (besedilo + PDF).

### Tehnicna izvedba
- Dodati novo polje v `ReportData`: `recommendedVideoLetters: string[]`
- Ustvariti selektor podoben `LetterSelector`, a z omejenimi glasovi (samo 9)
- Besedilo: "Priporocamo ogled video navodil za glas R in za glas S."
- Prikazati v porocilu in PDF, ne pa v osebnem nacrtu

### Datoteke za spremembo
- Nova datoteka ali razsiritev: `src/components/admin/VideoLetterSelector.tsx`
- `src/components/admin/ReportTemplateEditor.tsx` -- dodati razdelek
- `src/utils/generateReportPdf.ts` -- dodati v PDF
- `src/pages/admin/AdminUserDetail.tsx` -- dodati stanje
- `src/pages/admin/AdminLogopedistChildDetail.tsx` -- enako

---

## 5. Prilagoditev osebnega nacrta (generate-monthly-plan)

### Kako trenutno deluje
- Nacrt se generira ob kliku "Generiraj" na porocilu (fire-and-forget klic edge funkcije `generate-monthly-plan`)
- Funkcija prebere `recommended_letters` iz porocila in ocene iz seje
- Generira 90-dnevni nacrt z vsemi igrami za vse priporocene glasove
- Vsak dan ima: 1x Motorika govoril + 4 igre (razlicne kombinacije)
- Igre se ciklicno menjavajo po vseh kombinacijah (glas x igra)
- Nacrt se shrani v tabelo `child_monthly_plans`

### Kaj se mora spremeniti

#### a) Upostevanje pozicije glasu
- Ce logoped izbere "Zacetek" za glas P -> v nacrtu samo igre za zacetek: Kolo besed, Igra ujemanja, Zaporedja, Spomin, Labirint, Sestavljanka
- Ce logoped izbere "Sredina/konec" za glas P -> v nacrtu VSE igre (zacetek + sredina/konec): vse zgornje + Zabavna pot, Bingo, Ponovi poved, Smesne povedi

#### b) Upostevanje frekvence motorike govoril
- Trenutno: Motorika govoril VSAK DAN
- Novo: motorika po frekvenci iz porocila
  - "Vsak dan" -> vsak dan (kot zdaj)
  - "Vsak teden" -> 1x na teden (npr. vsak ponedeljek)
  - "Vsak mesec" -> 1x na mesec
  - "3x na teden" -> 3 razlicne dni v tednu

#### c) Video navodila se NE vkljucijo v nacrt

### Shranjevanje razsirjenih podatkov
Polje `recommended_letters` v `logopedist_reports` se bo spremenilo iz `text[]` v `jsonb`, ki bo vseboval:
```json
{
  "letters": [
    { "letter": "P", "position": "start" },
    { "letter": "R", "position": "middle-end" }
  ],
  "motorika": { "type": "custom", "count": 3, "unit": "week" },
  "videoLetters": ["R", "S"]
}
```

### Kaj se zgodi ce jutri dodate novo igro
- Igre so definirane v edge funkciji `generate-monthly-plan` v spremenljivkah `NO_AGE_GAMES` in `AGE_GAMES`
- Ce dodate novo igro, jo dodate v ustrezni seznam (zacetek ali sredina/konec)
- Obstojeci nacrti se NE spremenijo (so ze generirani)
- Novi nacrti (ob naslednjem generiranju porocila) bodo vkljucevali novo igro

### Ali se nacrt lahko kreira vsak teden za naslednji teden
- Trenutno se nacrt kreira ENKRAT ob generiranju porocila za 90 dni naprej
- Da bi se kreira vsak teden, bi potrebovali:
  1. CRON job (Supabase pg_cron ali zunanji scheduler), ki bi vsak teden klical edge funkcijo
  2. Edge funkcija bi pregledala aktivne nacrte in generirala nov tedenski nacrt
  3. To bi zahtevalo spremembo podatkovnega modela (tedenski namesto 90-dnevni nacrt)
- **Priporocilo**: To je locena funkcionalnost, ki jo lahko implementiramo pozneje. Zahteva precej drugacen pristop (scheduler, tedensko generiranje, drugacen UI za prikaz).

---

## Vrstni red implementacije

1. **DB migracija** -- dodati nova polja v `logopedist_reports` (ali spremeniti `recommended_letters` format)
2. **Nove komponente** -- `MotorikaFrequencySelector`, `VideoLetterSelector`, razsirjen `LetterSelector`
3. **ReportTemplateEditor** -- integracija novih razdelkov
4. **AdminUserDetail + AdminLogopedistChildDetail** -- avtomatsko polnjenje ugotovitev, nova stanja, validacija
5. **PDF generiranje** -- vkljucitev novih razdelkov
6. **Edge funkcija generate-monthly-plan** -- logika za pozicijo glasu in frekvenco motorike

---

## Tehnicna opomba o podatkovnem modelu

Za ohranitev zdruzljivosti s starejsimi porocili:
- Dodati NOVO polje `report_details jsonb` v tabelo `logopedist_reports` (namesto spreminjanja obstojecega `recommended_letters`)
- `recommended_letters` ostane kot je za stare zapise
- Nova porocila uporabljajo `report_details` za vse razsirjene podatke
- Edge funkcija prebere obe polji in uporabi novejse ce obstaja

