

## Plan: Popravi izračun pokala — uporabi `total_stars` namesto `completion_count`

### Problem

`TrophyContext.tsx` (vrstica 46-48) in `useEnhancedProgress.ts` (vrstica 79-84) oba uporabljata `a.completion_count` za izračun skupnih zvezdic. RPC `get_child_activity_summary` vrača tudi `a.total_stars` (= SUM of `stars_earned`), ki je pravo število zvezdic.

Ker motorika vaje podelijo 2 zvezdici na zaključek, se zgodi:
- Uporabnik vidi na zaslonu 214 zvezdic (iz `total_stars`)
- Pokal pa se sproži ko `completion_count` doseže 200 — kar je pri 214+ vidnih zvezdicah

### Popravek

**Datoteka 1: `src/contexts/TrophyContext.tsx` (vrstici 46-47)**
```ts
// PREJ:
const gamesTotalCompletions = gameActivities.reduce((sum, a) => sum + a.completion_count, 0);
const exercisesTotalCompletions = exerciseActivities.reduce((sum, a) => sum + a.completion_count, 0);

// POTEM:
const gamesTotalStars = gameActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);
const exercisesTotalStars = exerciseActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);
const totalStars = gamesTotalStars + exercisesTotalStars;
```

**Datoteka 2: `src/hooks/useEnhancedProgress.ts` (vrstici 79-84)**
```ts
// PREJ:
const gamesTotalCompletions = gameActivities.reduce((sum, a) => sum + a.completion_count, 0);
const exercisesTotalCompletions = exerciseActivities.reduce((sum, a) => sum + a.completion_count, 0);
const totalStars = gamesTotalCompletions + exercisesTotalCompletions;

// POTEM:
const gamesTotalStars = gameActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);
const exercisesTotalStars = exerciseActivities.reduce((sum, a) => sum + (a.total_stars || 0), 0);
const totalStars = gamesTotalStars + exercisesTotalStars;

// completion_count obdržimo za prikaz "Skupaj opravljenih"
const gamesTotalCompletions = gameActivities.reduce((sum, a) => sum + a.completion_count, 0);
const exercisesTotalCompletions = exerciseActivities.reduce((sum, a) => sum + a.completion_count, 0);
```

### Rezultat
- Pokal se sproži natančno pri 100, 200, 300... **dejanskih zvezdicah**
- Prikaz zvezdic, zmajčkov in pokalov je usklajen z dejanskim številom
- "Skupaj opravljenih" še vedno kaže število zaključkov (ne zvezdic)

### Obseg
- 2 datoteki, ~6 vrstic spremenjenih v vsaki

