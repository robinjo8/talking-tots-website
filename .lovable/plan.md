

# Plan: Prenova strani /moji-izzivi

## Povzetek sprememb

Stran /moji-izzivi bo popolnoma prenovljena: namesto 4 tednov po 7 dni bo prikazovala dejanske koledarske dni meseca, vsak dan bo imel motoriko + 4 razlicne igre, zvezdice bodo prikazane namesto trajanja, aktivnosti bodo oznacene kot opravljene, in slog bo usklajen z /moja-stran.

---

## A. Spremembe edge funkcije (generate-monthly-plan)

### Struktura nacrta: dejanski dni v mesecu

Trenutno AI generira 4 tedne po 7 dni (= 28 dni). Nova logika:
- Edge funkcija izracuna stevilo dni v tekocemu mesecu (npr. februar 2026 = 28 dni, marec = 31 dni)
- AI generira nacrt za TOCNO toliko dni, kolikor jih ima mesec
- Namesto `weeks` -> `days` strukture bo flat seznam dni z dejanskimi datumi

### Nova pravila za AI

- **Motorika + 4 razlicne igre na dan** (namesto motorika + 2 igri)
- **Ista igra se NE SME ponoviti na isti dan** - npr. ne sme biti Igra ujemanja za S in Igra ujemanja za Z isti dan
- Odstranjena polja: `theme` (teme tednov), `duration` (trajanje)
- Dodano polje: `date` (dejanski datum, npr. "2026-02-07")

### Nova plan_data struktura

```text
{
  "summary": "Nacrt za februar 2026...",
  "targetLetters": ["S", "Z"],
  "childAge": 9,
  "ageGroup": "9-10",
  "totalDays": 28,
  "days": [
    {
      "date": "2026-02-01",
      "dayName": "Nedelja",
      "activities": [
        {
          "type": "motorika",
          "title": "Vaje za motoriko govoril",
          "path": "/govorno-jezikovne-vaje/vaje-motorike-govoril"
        },
        {
          "type": "igra",
          "title": "Kolo besed",
          "path": "/govorne-igre/kolo-srece/sh",
          "letter": "S",
          "gameId": "kolo-srece"
        },
        {
          "type": "igra",
          "title": "Bingo",
          "path": "/govorne-igre/bingo/zh",
          "letter": "Z",
          "gameId": "bingo"
        },
        {
          "type": "igra",
          "title": "Labirint",
          "path": "/govorne-igre/labirint/sh",
          "letter": "S",
          "gameId": "labirint"
        },
        {
          "type": "igra",
          "title": "Sestavljanke",
          "path": "/govorne-igre/sestavljanke/zh910",
          "letter": "Z",
          "gameId": "sestavljanke"
        }
      ]
    }
    // ... vsi dnevi meseca
  ]
}
```

Dodano polje `gameId` (npr. "kolo-srece", "bingo", "spomin") za prikaz pravilne slike igre na frontendu in za pravilo unikatnosti (isti gameId se ne sme ponoviti na isti dan).

---

## B. Nova tabela: `plan_activity_completions`

Za belezenje opravljenih aktivnosti iz nacrta:

| Stolpec | Tip | Opis |
|---------|-----|------|
| id | uuid PK | ID zapisa |
| plan_id | uuid FK -> child_monthly_plans | Nacrt |
| child_id | uuid FK -> children | Otrok |
| day_date | date | Datum dneva (npr. 2026-02-07) |
| activity_index | integer | Indeks aktivnosti v dnevu (0-4) |
| completed_at | timestamptz | Cas zakljucka |

RLS politike:
- SELECT/INSERT: samo stars otroka (`auth.uid() = (SELECT parent_id FROM children WHERE id = child_id)`)

S to tabelo lahko na frontendu takoj vidimo, katere aktivnosti so opravljene za vsak dan.

---

## C. Frontend: MojiIzzivi.tsx - popolna prenova

### Glava nacrta
- Odstraniti sive krogce s crkami (S, Z) - ker je ze v besedilu napisano
- Odstraniti teme tednov
- Ohraniti naslov "Moj osebni nacrt" in povzetek

### Navigacija po dnevih
- Namesto 4 tedenskih zavihkov: seznam koledarskih dni z scroll navigacijo
- Ob odprtju strani se samodejno premakne na **danasnji dan**
- Vsak dan je kartica z datumom (npr. "7. februar - Petek")

### Prikaz dneva

```text
+--------------------------------------------------+
| 7. FEBRUAR - PETEK                               |
| [*][*][*][*][*][*][*][*][*][*]  <- 10 zvezdic    |
+--------------------------------------------------+
| [slika] Vaje za motoriko govoril    [kljukica]   |
| [slika] Kolo besed - S              [kljukica]   |
| [slika] Bingo - Z                                |
| [slika] Labirint - S                             |
| [slika] Sestavljanke - Z                         |
+--------------------------------------------------+
```

- **10 zvezdic** v glavi vsakega dne (kot StarDisplay na /moja-stran) - sive ko se ni nic, rumene ko se osvojene
- **Dejanske slike iger** namesto ikon (iz GamesList - enake slike kot na /govorne-igre)
- **Kljukica** (checkmark) ko je aktivnost opravljena
- **Pogoj za zakljucen dan**: ko otrok zbere 10 zvezdic (celoten dan se oznaci kot zakljucen)
- Brez prikaza trajanja ("5 min" / "10 min" se odstrani)

### Mapiranje slik iger

Iz obstojecega GamesList.tsx se uporabijo iste slike:

```text
gameId -> slika:
"kolo-srece"          -> kolo_srece_nova_2.webp
"bingo"               -> bingo_nova_2.webp
"spomin"              -> spomin_nova_2.webp
"sestavljanke"        -> sestavljanka_nova_1.webp
"zaporedja"           -> zaporedja_nova_2.webp
"drsna-sestavljanka"  -> drsna_sestavljanka_nova_2.webp
"igra-ujemanja"       -> igra_ujemanja_2.webp
"labirint"            -> labirint_nova_2.webp
"met-kocke"           -> Smesne_besede_21.webp
"ponovi-poved"        -> Zmajcek_1.webp
"motorika"            -> posebna ikona ali slika za motoriko
```

### Sledenje opravljenih aktivnosti

Ko otrok klikne "Igraj" in se vrne nazaj na stran:
- Pred navigacijo se v `localStorage` shrani katera aktivnost je bila odprta (planId, dayDate, activityIndex)
- Ob vracanju na stran se preveri, ali je bil v vmesnem casu dodan nov zapis v tabelo `progress`
- Ce da, se aktivnost oznaci kot opravljena (insert v `plan_activity_completions`)
- Stran ob nalaganju poizve opravljene aktivnosti za trenutni mesec

### Stil usklajen z /moja-stran

- Enake barve, gradiente, in kartice kot na /moja-stran
- Uporaba obstojecih komponent: Card, CardContent, motion animacije
- Stil gumbov in tipografije usklajen

---

## D. Zvezdice za motoriko: iz 3 na 2

V `src/hooks/useExerciseProgress.ts` na vrstici 67:

```text
// Trenutno:
recordExerciseCompletion('vaje_motorike_govoril', 3);

// Novo:
recordExerciseCompletion('vaje_motorike_govoril', 2);
```

Ko otrok opravi vseh 27 kartic motorike govoril, dobi 2 zvezdici namesto 3.

---

## E. Dnevni zvezdice na nacrtni strani

Za prikaz zvezdic za posamezen dan (ne samo danes, ampak tudi pretekle dni):

- Nova RPC funkcija `get_child_stars_by_date` ki vrne stevilo zvezdic po dnevih za obdobje (mesec)
- Poizvedba: `SELECT completed_at::date as day, SUM(stars_earned) FROM progress WHERE child_id = X AND completed_at BETWEEN start AND end GROUP BY day`
- Na frontendu se za vsak dan prikaze 10 zvezdic (od 0 do 10 zapolnjenih)

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| SQL migracija | Nova | Tabela `plan_activity_completions` + RLS + RPC funkcija |
| `supabase/functions/generate-monthly-plan/index.ts` | Sprememba | Nova struktura (dejanski dnevi, 5 aktivnosti, brez tem/trajanja, gameId polje) |
| `src/pages/MojiIzzivi.tsx` | Sprememba | Popolna prenova UI |
| `src/hooks/useMonthlyPlan.ts` | Sprememba | Posodobitev tipov za novo strukturo |
| `src/hooks/useExerciseProgress.ts` | Sprememba | 3 zvezdice -> 2 zvezdice |
| `src/hooks/usePlanProgress.ts` | Nova | Hook za belezenje in branje opravljenih aktivnosti |

