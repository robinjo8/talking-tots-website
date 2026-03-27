

## Plan: Dodaj naključno razporeditev iger v osebnem načrtu

### Odgovor na vprašanja

**1. Dokumenti / Poročila**: Da, vsak klik na "Simuliraj ocenjevanje + poročilo" ustvari novo poročilo v Storage (mapa `Generirana-porocila/`), ki se prikaže pod "Dokumenti" na admin strani. Po 90 sklopih + novo preverjanje → novo poročilo. Po 180 sklopih + novo preverjanje → tretje poročilo itd. To deluje pravilno.

**2. Osebni načrt je vedno enak**: To je dejanski problem. Funkcija `generateSetBasedPlan` v `generate-monthly-plan/index.ts` (vrstica 211-291) uporablja **deterministični round-robin** za razporejanje iger po sklopih. Ni nobene naključnosti — če ima otrok isto črko (npr. R) in isto starostno skupino, dobi **identičen načrt** kot vsak drug otrok z enakimi parametri. Tudi pri renewalu (2. in 3. serija 30 sklopov) so igre v enakem vrstnem redu.

### Sprememba

**`supabase/functions/generate-monthly-plan/index.ts`** — funkcija `generateSetBasedPlan`:

1. **Premešaj `combinations` array** pred generiranjem sklopov s Fisher-Yates shuffle algoritmom
2. **Premešaj vrstni red iger znotraj vsakega sklopa** po tem ko so izbrane

Dodaj helper funkcijo:
```ts
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

V `generateSetBasedPlan` (vrstica 211):
```ts
function generateSetBasedPlan(totalSets: number, combinations: GameCombination[], motorika: MotorikaConfig): PlanSet[] {
  const shuffledCombinations = shuffleArray(combinations);
  // ... ostala logika ostane enaka, samo uporabi shuffledCombinations
```

In na koncu vsakega sklopa (pred `sets.push`):
```ts
// Premešaj igre znotraj sklopa (motorika ostane prva)
const motorikaActivities = activities.filter(a => a.type === "motorika");
const gameActivities = shuffleArray(activities.filter(a => a.type === "igra"));
sets.push({ setNumber: i + 1, activities: [...motorikaActivities, ...gameActivities] });
```

### Rezultat
- Vsak generiran načrt bo imel **unikatno zaporedje iger**, tudi za isto črko in starost
- Motorika vaj ostane vedno na prvem mestu v sklopu
- Igre so še vedno izbrane iz pravilnega nabora glede na pozicijo glasu

### Obseg
- 1 Edge funkcija — ~15 vrstic dodanih/spremenjenih

