

# Popravek dvojnega potrditvenega okna pri izhodu iz igre

## Problem
Ko uporabnik v nastavitvah klikne "Nazaj", se prikaze potrditveno okno ("Ali res zelis zapustiti igro?"). Ko potrdi z "DA", se odpre SE ENO potrditveno okno -- torej mora dvakrat klikniti "DA".

## Vzrok
- `KaceLestveSettingsModal` ima SVOJE potrditveno okno (vrstica 227-234)
- Ko uporabnik potrdi, se poklice `onBack()`, ki pa v `KaceLestveGame.tsx` odpre SE DRUGO potrditveno okno (`setShowExitDialog(true)`)

## Resitev
V `KaceLestveGame.tsx` spremeniti `onBack` prop iz `() => setShowExitDialog(true)` v `() => navigate(backPath)`, ker potrditev ze opravi modal sam.

## Sprememba

### `src/components/games/KaceLestveGame.tsx`
- Vrstica 354: Zamenjati `onBack={() => setShowExitDialog(true)}` z `onBack={() => navigate(backPath)}`

To je edina sprememba -- ena vrstica.

