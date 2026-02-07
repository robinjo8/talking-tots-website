
# Plan: Popravki strani /moji-izzivi (datumi, oznacevanje, prikaz)

## Analiza problemov

### 1. Datumi se ne ujemajo
Aktivni nacrt v bazi uporablja **staro strukturo** (`weeks` z `dayNumber`), ne nove (`days` z dejanskimi datumi). Legacy pretvorba v frontendu jih poskusa pretvoriti, a rezultat ni pravilen. **Resitev:** Regenerirati nacrt z novo edge funkcijo.

### 2. Vse se oznaci zeleno ob vrnitvi iz igre
Trenutna logika v `MojiIzzivi.tsx` (vrstice 65-83):
- Pred navigacijo v igro: shrani `{planId, dayDate, activityIndex}` v localStorage
- Ob vrnitvi: TAKOJ vstavi zapis v `plan_activity_completions` - brez preverjanja ali je otrok dejansko igral igro

Tabela `plan_activity_completions` ima UNIQUE constraint `(plan_id, child_id, day_date, activity_index)`, kar pomeni samo 1 zapis na aktivnost. Rezultat: en sam obisk igre (brez igranja) oznaci aktivnost kot opravljeno.

### 3. Samo 2 igri namesto 4
Stari nacrt v bazi ima le 3 aktivnosti na dan (1 motorika + 2 igri). **Resitev:** Regenerirati nacrt.

### 4. "DANES" pozicija
Trenutno je "Danes" oznaka levo od datuma v isti vrstici. Uporabnik zeli:
- **Desktop:** "DANES" na sredini sivega polja, datum pod njim
- **Mobil:** Brez besede "DANES", ime dneva + datum centrirano, zvezdice v drugi vrstici pod datumom

---

## A. Sprememba baze: Dovoliti vec zaključkov na aktivnost

Trenutni UNIQUE constraint `plan_activity_completions_plan_id_child_id_day_date_activit_key` dovoli le 1 zapis na aktivnost. Za igre potrebujemo 2 zapisa (2 igranji = 2 zvezdici).

Nova migracija:
- Odstrani UNIQUE constraint
- Doda stolpec `play_number INTEGER NOT NULL DEFAULT 1`
- Doda nov UNIQUE constraint na `(plan_id, child_id, day_date, activity_index, play_number)` za preprecevanje podvojenih vnosov istega igranja

---

## B. Popravek logike oznacevanja (usePlanProgress.ts + MojiIzzivi.tsx)

### Trenutna (napacna) logika:
```text
Klik na kartico -> shrani v localStorage -> navigiraj v igro
Vrnitev -> preberi localStorage -> TAKOJ oznaci kot opravljeno
```

### Nova (pravilna) logika:
```text
Klik na kartico -> shrani {planId, dayDate, activityIndex, leftAt: timestamp} -> navigiraj
Vrnitev -> preberi localStorage -> poizvedba za NOVE progress zapise po leftAt
  -> Ce najde nove zapise:
     -> Prestej koliko zvezdic je otrok zasluzil od leftAt naprej
     -> Za motoriko: ce >= 2 zvezdice, vstavi 1 completion zapis
     -> Za igre: vstavi 1 completion zapis (vsaka zvezdica = 1 igranje)
  -> Ce NE najde novih zapisov: NE oznaci kot opravljeno (otrok ni igral)
```

### Spremembe v usePlanProgress.ts:
- Nova funkcija `checkNewProgress(childId, leftAt)` ki vrne stevilo novih progress zapisov po casovnem zigu
- Sprememba `useCompleteActivity` da sprejme `play_number` parameter
- Nova poizvedba za stevilo zaključkov: namesto `Set<number>` vrne `Map<number, number>` (activity_index -> count)

### Spremembe v MojiIzzivi.tsx:
- Namesto `completionsByDay: Map<string, Set<number>>` uporabi `completionsByDay: Map<string, Map<number, number>>`
- Vrednost je stevilo igranj za vsako aktivnost
- useEffect ob vrnitvi: preveri nove progress zapise preden vstavi completion

---

## C. Popravek prikaza v PlanDayCard.tsx

### Sprememba vmesnika:
```text
// PREJ:
completedIndices: Set<number>  // ali je opravljena ali ni

// POTEM:
completionCounts: Map<number, number>  // activity_index -> stevilo igranj
```

### Pogoji za zeleno kartico:
- **Motorika (type === "motorika"):** zelena ko `completionCounts.get(index) >= 1`
- **Igre (type === "igra"):** zelena ko `completionCounts.get(index) >= 2`

### Prikaz napredka na kartici:
Za igre se med sliko in naslovom prikaze majhen indikator "1/2" ali "2/2" da otrok vidi koliko igranj je ze opravil.

### "DANES" pozicija:

**Desktop verzija:**
```text
+------------------------------------------------------------------+
|                          DANES                                    |
|              PETEK, 7.2.2026                                     |
|              [*][*][*][ ][ ][ ][ ][ ][ ][ ]                     |
+------------------------------------------------------------------+
```
- "DANES" centrirano na sredini sivega polja, vecja pisava
- Pod njim: ime dneva in datum, centrirano
- Pod datumom: zvezdice, centrirane

**Mobilna verzija:**
```text
+------------------------------------------+
|          PETEK, 7.2.2026                  |
|     [*][*][*][ ][ ][ ][ ][ ][ ][ ]      |
+------------------------------------------+
```
- Brez besede "DANES" (ni prostora)
- Ime dneva + datum centrirano
- Zvezdice v naslednji vrstici, centrirane
- Danasnji dan se loci z mocnejso obrobo (primary barva)

### Ne-danasnji dnevi:
```text
+------------------------------------------+
|  CETRTEK, 6.2.2026    [10 zvezdic]  [v]  |
+------------------------------------------+
```
- Datum in zvezdice v eni vrstici (kompaktno, zlozeno)

---

## D. Regeneracija nacrta

Po vseh spremembah se sproži regeneracija nacrta za aktivnega otroka:
1. Arhiviranje starega nacrta v bazi
2. Klic edge funkcije `generate-monthly-plan` z obstojecim report_id
3. Nov nacrt bo imel:
   - Dejanske datume za vse dni v mesecu (februar 2026 = 28 dni)
   - 5 aktivnosti na dan (1 motorika + 4 razlicne igre)
   - Polje `gameId` za vsako igro
   - Brez podvajanja istega gameId na isti dan

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| SQL migracija | Nova | Odstrani UNIQUE constraint, doda `play_number` stolpec |
| `src/hooks/usePlanProgress.ts` | Sprememba | Nova logika za preverjanje dejanskih progress zapisov, stevec igranj namesto da/ne |
| `src/pages/MojiIzzivi.tsx` | Sprememba | `completionsByDay` kot `Map<number, number>`, popravljena useEffect logika ob vrnitvi |
| `src/components/plan/PlanDayCard.tsx` | Sprememba | `completionCounts` vmesnik, pogoji za zeleno (1 za motoriko, 2 za igre), nov layout za "DANES", indikator napredka 1/2 |

---

## Tehnicne podrobnosti

### Preverjanje novih progress zapisov
Po vrnitvi iz igre, poizvedba:
```text
SELECT COUNT(*), COALESCE(SUM(stars_earned), 0) as total_stars
FROM progress 
WHERE child_id = :childId 
AND completed_at > :leftAt
```
Ce `count > 0`, je otrok dejansko igral. Stevilo zvezdic doloci koliko completion zapisov vstavimo.

### play_number logika
Pri vstavitvi novega completion zapisa:
1. Poizvedba za max(play_number) za to aktivnost
2. Nov zapis dobi play_number = max + 1
3. UNIQUE constraint preprecuje podvojitve

### Brisanje starih napacnih completion zapisov
Ob regeneraciji nacrta se stari completion zapisi avtomatsko izbrisejo ker so vezani na stari plan_id (CASCADE DELETE).
