
# Obsežna prenova sistema za pregled artikulacijskih preverjanj

## Povzetek projekta

Ta načrt zajema obsežno prenovo admin portala za logopede. Vključuje:
1. Preoblikovanje strani za pregled sej (`/admin/tests/:sessionId`)
2. Razširitev podrobnosti uporabnika (`/admin/users/:parentId/:childId`)
3. Nova stran "Poročila" za arhiv vseh generiranih poročil logopeda
4. Sistem opozarjanja pri neshranjenih spremembah
5. Gumb "Popravi" za zaključene preglede

---

## FAZA 1: Preoblikovanje strani za pregled seje

### 1.1 Header prenova

**Trenutno stanje:**
- Naslov "Pregled preverjanja"
- Prikaz: ime otroka, spol, starost, "Oddano: datum"

**Novo stanje:**
- Naslov spremeni v "Pregled preverjanja izgovorjave"
- Odstrani "Oddano" iz header-ja (bo prikazano znotraj posamezne seje)

**Datoteke:**
- `src/components/admin/SessionReviewHeader.tsx`

---

### 1.2 Struktura sejin (Seja-1 do Seja-5)

Trenutno so črke prikazane direktno pod header-jem. Nova struktura zahteva vmesno raven - seje.

```text
┌─────────────────────────────────────────────────────────────┐
│  Pregled preverjanja izgovorjave                             │
│  Otrok: Žak (Fant) • 5 let                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▶ Seja-1  •  Oddano: 23. 1. 2026                            │
│  ────────────────────────────────────────────────────────    │
│    ▶ Črka P (3 posnetkov)                                    │
│    ▶ Črka B (3 posnetkov)                                    │
│    ...                                                       │
│    [Shrani ocene za Seja-1]                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▶ Seja-2  •  Predvideno: 23. 4. 2026                        │
│  (prazno - še ni podatkov)                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▶ Seja-3  •  Predvideno: 23. 7. 2026                        │
│  (prazno)                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▶ Seja-4  •  Predvideno: 23. 10. 2026                       │
│  (prazno)                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▶ Seja-5  •  Predvideno: 16. 1. 2027  (1 teden pred koncem) │
│  (prazno)                                                    │
└─────────────────────────────────────────────────────────────┘

[Zaključi pregled]
```

**Logika izračuna datumov:**
- Seja-1: dejanski datum oddaje (iz `submitted_at`)
- Seja-2: +3 mesece od Seja-1
- Seja-3: +6 mesecev od Seja-1
- Seja-4: +9 mesecev od Seja-1
- Seja-5: 1 teden pred iztekom enega leta (11 mesecev + 3 tedni)

**Nova komponenta:**
- `src/components/admin/SessionAccordion.tsx` - zavihek za posamezno sejo

---

### 1.3 Prenova predvajalnika zvoka

Trenutni predvajalnik ima gumba Play/Stop. Novo oblikovanje po vzoru slike uporabnika:

```text
┌──────────────────────────────────────────────────────────┐
│  ▶   0:00 ─────────────────────────────────────── 🔊      │
└──────────────────────────────────────────────────────────┘
```

**Funkcionalnosti:**
- Play/Pause gumb
- Časovna vrstica s kazalcem napredka
- Ikona za glasnost

**Datoteke:**
- `src/components/admin/RecordingPlayer.tsx` - popolna prenova

---

### 1.4 Shranjevanje po črkah

Znotraj vsake črke dodaj gumb "Shrani" za takojšnje shranjevanje te specifične ocene.

**Datoteke:**
- `src/components/admin/LetterAccordion.tsx`
- `src/components/admin/EvaluationCheckboxes.tsx`

---

### 1.5 Opozorilo ob neshranjenih spremembah

Ko ima uporabnik neshranjene spremembe in poskuša zapustiti stran:
1. Browser `beforeunload` event za osvežitev/zapiranje
2. React Router `useBlocker` za navigacijo znotraj aplikacije

**Datoteke:**
- `src/pages/admin/AdminSessionReview.tsx`
- Nova komponenta: `src/components/admin/UnsavedChangesDialog.tsx`

---

### 1.6 Zaključitev pregleda

**Trenutno:** Gumb "Zaključi pregled" na dnu strani.

**Novo obnašanje:**
1. Preveri, če so vse ocene shranjene
2. Posodobi status v bazi na `completed`
3. Shrani poročilo v Storage (opcijsko)
4. Preusmeri na `/admin/my-reviews`

---

## FAZA 2: Gumb "Popravi" za zaključene preglede

### 2.1 Spremembe na straneh seznamov

Na straneh `/admin/all-tests` in `/admin/my-reviews`:
- Ko je status `completed`, prikaži dva gumba:
  - **Ogled** (obstoječ) - samo ogled brez urejanja
  - **Popravi** (nov) - odpre stran za urejanje

**Datoteke:**
- `src/pages/admin/AdminTests.tsx`
- `src/pages/admin/AdminMyReviews.tsx`

### 2.2 Način urejanja na strani pregleda

Ko logoped klikne "Popravi", se odpre ista stran ampak z možnostjo urejanja. Lahko uporabimo query parameter `?edit=true`.

---

## FAZA 3: Razširitev podrobnosti uporabnika

### 3.1 Integracija ocen iz pregleda

Na strani `/admin/users/:parentId/:childId` dodaj sekcijo ki prikaže ocene iz `articulation_evaluations` tabele.

**Datoteke:**
- `src/pages/admin/AdminUserDetail.tsx`

### 3.2 Razširjeno polje za poročilo

Trenutno: `max-h-[600px]` z scrollom znotraj okna.
Novo: Odstrani omejitev višine, polje se razteza glede na vsebino.

**Datoteke:**
- `src/components/admin/ReportTemplateEditor.tsx`

### 3.3 Shranjevanje na stran Poročila

Ko logoped klikne "Generiraj", se PDF shrani tudi na novo stran Poročila.

---

## FAZA 4: Nova stran "Poročila"

### 4.1 Nova ruta in komponenta

**URL:** `/admin/reports`

**Funkcionalnost:**
- Seznam vseh PDF poročil ki jih je ustvaril trenutni logoped
- Filtriranje po imenu otroka, datumu
- Možnost prenosa, ogleda, brisanja

**Datoteke:**
- Nova: `src/pages/admin/AdminReports.tsx`
- Posodobitev: `src/components/routing/AdminRoutes.tsx`

### 4.2 Shranjevanje metapodatkov poročil

Za sledenje poročil po logopedu potrebujemo tabelo v bazi:

```sql
CREATE TABLE logopedist_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logopedist_id UUID REFERENCES logopedist_profiles(id),
  child_id UUID REFERENCES children(id),
  parent_id UUID,
  session_id UUID REFERENCES articulation_test_sessions(id),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  report_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## FAZA 5: Posodobitev navigacije

### 5.1 Navigacija v sidebarju

Stran "Poročila" že obstaja v meniju ampak kaže na neobstoječo ruto.

**Datoteke:**
- `src/components/admin/AdminSidebar.tsx` - potrdi da `/admin/reports` obstaja

---

## Tehnična implementacija

### Nove datoteke

| Datoteka | Namen |
|----------|-------|
| `src/components/admin/SessionAccordion.tsx` | Accordion za posamezno sejo (1-5) |
| `src/components/admin/UnsavedChangesDialog.tsx` | Dialog za opozorilo ob neshranjenih spremembah |
| `src/pages/admin/AdminReports.tsx` | Nova stran za seznam poročil logopeda |
| `src/hooks/useLogopedistReports.ts` | Hook za pridobivanje poročil logopeda |

### Posodobljene datoteke

| Datoteka | Spremembe |
|----------|-----------|
| `src/pages/admin/AdminSessionReview.tsx` | Popolna prenova z sejami, opozorili, shranjevanjem |
| `src/components/admin/SessionReviewHeader.tsx` | Odstrani "Oddano", spremeni naslov |
| `src/components/admin/RecordingPlayer.tsx` | Nov dizajn z progress bar |
| `src/components/admin/LetterAccordion.tsx` | Dodaj gumb Shrani znotraj črke |
| `src/pages/admin/AdminTests.tsx` | Dodaj gumb "Popravi" za zaključene |
| `src/pages/admin/AdminMyReviews.tsx` | Dodaj gumb "Popravi" za zaključene |
| `src/pages/admin/AdminUserDetail.tsx` | Integracija ocen, razširjeno poročilo |
| `src/components/admin/ReportTemplateEditor.tsx` | Odstrani max-h omejitev |
| `src/components/routing/AdminRoutes.tsx` | Dodaj ruto za /admin/reports |
| `src/hooks/useSessionReview.ts` | Razširi za vse seje (1-5) |

### Migracija baze

```sql
-- Tabela za sledenje poročil po logopedu
CREATE TABLE IF NOT EXISTS logopedist_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logopedist_id UUID NOT NULL REFERENCES logopedist_profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL,
  session_id UUID REFERENCES articulation_test_sessions(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  report_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS politika: logoped vidi samo svoja poročila
ALTER TABLE logopedist_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logopedists can view own reports"
  ON logopedist_reports FOR SELECT
  USING (logopedist_id IN (
    SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Logopedists can insert own reports"
  ON logopedist_reports FOR INSERT
  WITH CHECK (logopedist_id IN (
    SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Logopedists can delete own reports"
  ON logopedist_reports FOR DELETE
  USING (logopedist_id IN (
    SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
  ));
```

---

## Vizualna shema komponent

```text
AdminSessionReview (stran)
├── SessionReviewHeader
│   ├── Naslov: "Pregled preverjanja izgovorjave"
│   └── Info: Ime otroka (spol) • starost
│
├── SessionAccordion (x5)
│   ├── Header: "Seja-1" • Datum (oddano/predvideno)
│   ├── LetterAccordion (x20 za vsako črko)
│   │   ├── RecordingPlayer (x3 za vsako besedo)
│   │   ├── EvaluationCheckboxes
│   │   └── [Shrani] gumb
│   └── Stanje: prazno / s podatki
│
├── [Zaključi pregled] gumb
│
└── UnsavedChangesDialog (modal ob poskusu odhoda)
```

---

## Zaporedje implementacije

1. **Migracija baze** - ustvari `logopedist_reports` tabelo
2. **SessionReviewHeader** - prenova naslova, odstrani Oddano
3. **RecordingPlayer** - nov dizajn s progress bar
4. **SessionAccordion** - nova komponenta za seje
5. **LetterAccordion** - dodaj gumb Shrani
6. **AdminSessionReview** - popolna prenova s sejami
7. **UnsavedChangesDialog** - opozorilo pri odhodu
8. **AdminReports** - nova stran za poročila
9. **AdminTests/AdminMyReviews** - gumb Popravi
10. **AdminUserDetail** - integracija ocen, razširjeno poročilo
11. **Integracija** - shranjevanje na stran Poročila

---

## Časovna ocena

| Faza | Ocenjen čas |
|------|-------------|
| Faza 1: Prenova strani za pregled | 60% dela |
| Faza 2: Gumb Popravi | 5% dela |
| Faza 3: Razširitev podrobnosti uporabnika | 15% dela |
| Faza 4: Nova stran Poročila | 15% dela |
| Faza 5: Navigacija | 5% dela |

---

## Opombe

- Vsi teksti so v slovenščini
- Oblikovanje sledi obstoječemu admin designu
- Fonetični vrstni red črk ostane nespremenjen: P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R
- Seja-5 ima poseben izračun (1 teden pred koncem leta)
- Shranjevanje ocen poteka preko obstoječega `articulation_evaluations` sistema
