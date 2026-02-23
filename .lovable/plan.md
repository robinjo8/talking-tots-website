

## Popravek: Shranjevanje spola, starost < 1, in robne starostne skupine

### Problem 1: Spol se ne shrani

Ko Spela poskusa popraviti spol otroka "Nika Z." (rojena januar 2026), celotna posodobitev propade zaradi CHECK constraint-a na tabeli `logopedist_children`: `CHECK ((age >= 1) AND (age <= 18))`. Funkcija `calculateAge` vrne `0` za dojenčka, kar sproži napako in zato se ne shrani **nič** - niti spol.

### Problem 2: Starost < 3 in > 10

Funkcija `getAgeGroup` v `src/utils/ageUtils.ts` pokriva samo starosti 3-10. Otroci stari 1-2 leti ali 11+ let dobijo privzeto `'3-4'` skupino, a brez eksplicitnega pokritja. Enako v edge function `generate-monthly-plan`. Uporabnik zeli:
- Otroci stari **manj kot 3** --> skupina **3-4**
- Otroci stari **vec kot 10** --> skupina **9-10**

### Resitev

#### 1. `src/utils/childUtils.ts` - `calculateAge` minimum 1

Sprememba vrstice 26-29: namesto preverjanja `age < 0` preveriti `age < 1` in vrniti `1`.

```text
// PREJ:
if (age < 0) {
  console.warn('calculateAge: Negative age calculated, returning default age of 5');
  return 5;
}

// POTEM:
if (age < 1) {
  return 1; // Minimum 1 leto (DB CHECK constraint)
}
```

To odpravi napako pri shranjevanju za dojenčke, kar omogoči tudi shranjevanje spola.

#### 2. `src/utils/ageUtils.ts` - eksplicitno pokritje robnih starosti

Sprememba funkcije `getAgeGroup`:

```text
// PREJ:
export function getAgeGroup(age: number): AgeGroup {
  if (age >= 3 && age <= 4) return '3-4';
  if (age >= 5 && age <= 6) return '5-6';
  if (age >= 7 && age <= 8) return '7-8';
  if (age >= 9 && age <= 10) return '9-10';
  return '3-4'; // Default fallback
}

// POTEM:
export function getAgeGroup(age: number): AgeGroup {
  if (age <= 4) return '3-4';
  if (age <= 6) return '5-6';
  if (age <= 8) return '7-8';
  return '9-10';
}
```

Logika: otroci do vkljucno 4 let dobijo skupino 3-4, otroci 11+ let dobijo skupino 9-10. Preprosto in brez robnih primerov.

#### 3. `supabase/functions/generate-monthly-plan/index.ts` - enaka logika

Funkcija `getAgeGroup` v edge function ima ze skoraj enako logiko, a jo je treba uskladiti:

```text
// PREJ:
function getAgeGroup(age: number): string {
  if (age <= 4) return "3-4";
  if (age <= 6) return "5-6";
  if (age <= 8) return "7-8";
  return "9-10";
}
```

Ta ze pravilno pokriva robne primere - ni spremembe potrebne.

#### 4. `src/hooks/useLogopedistChildren.ts` - boljse logiranje napak

```text
// PREJ:
onError: () => {
  toast.error('Napaka pri posodabljanju');
},

// POTEM:
onError: (error: Error) => {
  console.error('Update child error:', error);
  toast.error('Napaka pri posodabljanju otroka');
},
```

### Datoteke za spremembo

- **`src/utils/childUtils.ts`** - `calculateAge` vrne min 1
- **`src/utils/ageUtils.ts`** - `getAgeGroup` pokriva vse starosti
- **`src/hooks/useLogopedistChildren.ts`** - boljse logiranje napak v `updateChild`

### Kaj ostane nespremenjeno

- `generate-monthly-plan` edge function ze pravilno pokriva robne starosti
- `useFreeGameLimit.ts` ze ima `if (childAge <= 4) return '34'` - ni spremembe
- Dodajanje, brisanje otrok, prikazovanje - vse ostane enako
- RLS politike, tabele - brez sprememb

