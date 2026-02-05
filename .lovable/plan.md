
# Plan: Deduplikacija posnetkov - ohrani samo zadnji posnetek za vsako besedo

## Povzetek problema

Pri večkratnem testiranju preverjanja izgovorjave se za isto besedo shrani več posnetkov. Na primer za črko R v Seja-1:
- 4x ROŽA (namesto 1x)
- 2x URA (namesto 1x)
- 3x SIR (namesto 1x)

To se dogaja, ker:
1. Edge funkcija `transcribe-articulation` shrani vsak uspešen posnetek z unikatnim timestampom
2. Ni logike za preverjanje ali posnetek za to besedo že obstaja
3. Ni deduplikacije pri prikazu posnetkov

## Predlagana rešitev

**Ohranimo zadnji posnetek** za vsako besedo (najnovejši timestamp), ker predstavlja najnovejši poizkus uporabnika.

### Možnost 1: Deduplikacija pri prikazu (priporočeno)

Spremenimo `useSessionReview.ts`, da filtrira posnetke in ohrani samo **zadnji posnetek za vsak wordIndex**.

**Prednosti:**
- Ne spreminja obstoječih podatkov v Storage
- Hitrejša implementacija
- Zgodovinski posnetki ostanejo shranjeni (če bi jih kdaj potrebovali)

### Možnost 2: Preverjanje pred shranjevanjem

Spremenimo edge funkcijo, da najprej preveri če posnetek za ta wordIndex že obstaja in ga nadomesti (upsert).

**Slabosti:**
- Zahteva spremembo edge funkcije
- Potrebna dodatna logika za list + delete starih posnetkov

## Izbrana rešitev: Možnost 1

Implementiramo deduplikacijo pri prikazu v `useSessionReview.ts`.

## Spremembe v kodi

### Datoteka: `src/hooks/useSessionReview.ts`

#### Trenutna koda (vrstice 215-230)

```typescript
// 5. Grupiraj posnetke po črkah
const recordingsByLetter = new Map<string, Recording[]>();
PHONETIC_ORDER.forEach(letter => recordingsByLetter.set(letter, []));

recordings.forEach(recording => {
  const letterRecordings = recordingsByLetter.get(recording.letter) || [];
  letterRecordings.push(recording);
  recordingsByLetter.set(recording.letter, letterRecordings);
});

// Sortiraj posnetke znotraj vsake črke po wordIndex
recordingsByLetter.forEach((recs, letter) => {
  recs.sort((a, b) => a.wordIndex - b.wordIndex);
  recordingsByLetter.set(letter, recs);
});
```

#### Nova koda z deduplikacijo

```typescript
// 5. Dedupliciraj posnetke - ohrani samo ZADNJI posnetek za vsak wordIndex
// Ker imajo posnetki timestamp v imenu (npr. R-57-ROZA-2026-02-05T10-30-00-123Z.webm),
// sortiramo po imenu datoteke (timestamp) in vzamemo zadnjega za vsak wordIndex
const deduplicatedRecordings = new Map<number, Recording>();
const sortedByTimestamp = [...recordings].sort((a, b) => 
  a.filename.localeCompare(b.filename)
);
sortedByTimestamp.forEach(recording => {
  // Vedno prepiše s kasnejšim (sortirano naraščajoče po timestampu)
  deduplicatedRecordings.set(recording.wordIndex, recording);
});
const uniqueRecordings = Array.from(deduplicatedRecordings.values());

// 6. Grupiraj posnetke po črkah
const recordingsByLetter = new Map<string, Recording[]>();
PHONETIC_ORDER.forEach(letter => recordingsByLetter.set(letter, []));

uniqueRecordings.forEach(recording => {
  const letterRecordings = recordingsByLetter.get(recording.letter) || [];
  letterRecordings.push(recording);
  recordingsByLetter.set(recording.letter, letterRecordings);
});

// Sortiraj posnetke znotraj vsake črke po wordIndex
recordingsByLetter.forEach((recs, letter) => {
  recs.sort((a, b) => a.wordIndex - b.wordIndex);
  recordingsByLetter.set(letter, recs);
});
```

## Logika deduplikacije

```text
Primer posnetkov za črko R v Seja-1:

Vhod (9 posnetkov):
├── R-57-ROZA-2026-02-04T09-00-00.webm  (wordIndex: 57)
├── R-57-ROZA-2026-02-04T10-30-00.webm  (wordIndex: 57)  ← kasnejši
├── R-57-ROZA-2026-02-05T08-00-00.webm  (wordIndex: 57)  ← najnovejši ✓
├── R-57-ROZA-2026-02-05T09-15-00.webm  (wordIndex: 57)
├── R-58-URA-2026-02-04T09-01-00.webm   (wordIndex: 58)
├── R-58-URA-2026-02-05T08-01-00.webm   (wordIndex: 58)  ← najnovejši ✓
├── R-59-SIR-2026-02-04T09-02-00.webm   (wordIndex: 59)
├── R-59-SIR-2026-02-05T08-02-00.webm   (wordIndex: 59)
└── R-59-SIR-2026-02-05T09-16-00.webm   (wordIndex: 59)  ← najnovejši ✓

Izhod (3 posnetki - po 1 za vsako besedo):
├── R-57-ROZA-2026-02-05T09-15-00.webm  (zadnji ROŽA)
├── R-58-URA-2026-02-05T08-01-00.webm   (zadnji URA)
└── R-59-SIR-2026-02-05T09-16-00.webm   (zadnji SIR)
```

## Zakaj zadnji posnetek?

1. **Najnovejši poizkus**: Uporabnik je lahko popravil izgovorjavo
2. **Relevantnost**: Starejši posnetki so manj aktualni
3. **Konsistentnost**: Vedno isti pristop - zadnji zmaga

## Datoteke za spremembo

| Datoteka | Tip spremembe |
|----------|---------------|
| `src/hooks/useSessionReview.ts` | Dodaj deduplikacijo pred grupiranjem |

## Rezultat po spremembi

| Scenarij | Prej | Potem |
|----------|------|-------|
| Črka R, Seja-1 | 9 posnetkov (4+2+3) | 3 posnetki (1 ROŽA, 1 URA, 1 SIR) |
| Skupaj v seji | Podvojeni posnetki | Natanko 1 posnetek na besedo |

## Opomba glede strani `/admin/children/{childId}/details`

Ta stran uporablja `useLogopedistChildStorageFiles`, ki vrne surovo število posnetkov iz Storage. Po tej spremembi:
- **details stran**: Še vedno prikaže "10 posnetkov" (vsi v Storage)
- **tests stran**: Prikaže "3 posnetke" (deduplicirani za prikaz)

Če želiš tudi na details strani enako deduplikacijo, je potrebno posodobiti tudi `useLogopedistChildStorageFiles`. Povej, če to tudi potrebuješ.

## Testiranje po implementaciji

1. Odpri `/admin/tests/d4bb9391-21bc-4063-9db0-9eeb112164cf`
2. Preveri, da črka R prikazuje natanko 3 posnetke (ROŽA, URA, SIR)
3. Preveri, da se predvaja zadnji (najnovejši) posnetek
4. Preveri ostale črke - vsaka beseda mora imeti natanko 1 posnetek
