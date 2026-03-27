

## Plan: Popravi prikaz po "Zaključi vseh 30 sklopov"

### Problem 1: UI prikaže stare podatke (cache)

`PlanLifecycleTools.tsx` po uspešnem klicu NE invalidira React Query cache-a. Ko greš na `/moji-izzivi`, `useMonthlyPlan` vrne stari (cached) plan namesto novega. Zato vidiš "Sklop 1, 0/30" starega plana, čeprav je bil že arhiviran.

### Problem 2: Vedno "Sklop 1" namesto kumulativno štetje

Vsak nov plan (renewal) ima sete oštevilčene 1-30. UI ne kaže, da si na 2. ali 3. seriji. Uporabnik pričakuje "Sklop 31" ali "Sklop 61", vidi pa vedno "Sklop 1".

### Spremembe

**1. `src/components/profile/PlanLifecycleTools.tsx`**
- Po uspešnem `invoke` invalidiraj ključne React Query poizvedbe:
  - `["monthly-plan", childId]`
  - `["set-tracking"]`
  - `["plan-completions"]`
- To zagotovi, da `/moji-izzivi` ob navigaciji naloži sveže podatke.

**2. `src/pages/MojiIzzivi.tsx`** — kumulativno številčenje
- Poizvedba za število arhiviranih načrtov z istim `report_id` (ali pa dodaj polje `set_offset` v `plan_data`)
- Prikaži "Sklop 31" namesto "Sklop 1" za drugi plan, "Sklop 61" za tretjega
- V napredku prikaži "30/90", "60/90" ali "61/90" namesto "0/30"

**Enostavnejši pristop za kumulativno štetje:** V Edge funkciji `generate-monthly-plan` pri renewalu dodaj `setOffset` v `plan_data` (0 za prvi plan, 30 za drugega, 60 za tretjega). UI potem prikaže `setOffset + setNumber` in `completedSetsCount + setOffset` / `totalSets * plansForReport`.

### Vprašanje glede reseta

NE — ni treba ponastaviti. Ko popraviš cache invalidacijo, bo UI ob naslednjem obisku `/moji-izzivi` pravilno naložil zadnji aktivni plan (3. serija, sklopi 61-90).

### Obseg
- 1 Edge funkcija (`generate-monthly-plan`) — dodaj `setOffset` v `plan_data` pri renewal (~3 vrstice)
- 1 UI komponenta (`PlanLifecycleTools.tsx`) — cache invalidacija po invoke (~5 vrstic)
- 1 UI stran (`MojiIzzivi.tsx`) — uporabi `setOffset` za prikaz pravilnih številk (~10 vrstic)

