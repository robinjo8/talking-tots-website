

# Bug: Dodatno preverjanje prikazuje napačne besede

## Problem

Stran `DodatnoPreverjanje.tsx` uporablja hook `useArticulationTestNew`, ki interno **vedno** uporablja `articulationData` — fiksni nabor 60 besed standardnega testa (Pajek, Opica, Rep, Bik...). Čeprav stran pravilno naloži dodeljene besede iz baze (BRADA, BRESKEV, BREZA...) v `customArticulationData`, jih **nikoli ne posreduje hooku**. Hook nima parametra za custom besede.

Zato otrok vidi Pajek, Opica itd. namesto dodeljenih besed.

## Rešitev

Razširiti `useArticulationTestNew` z opcijskim parametrom `customWordData` (articulationData-kompatibilen format). Ko je ta parameter podan, hook uporabi te besede namesto standardnih `articulationData`.

### Spremembe

**1. `src/hooks/useArticulationTestNew.ts`**
- Dodaj opcijski parameter `customWordData?: { letter: string; words: { text: string; image: string; audio?: string; acceptedVariants?: string[] }[] }[]`
- V `sortedArticulationData` uporabi `customWordData` namesto `articulationData`, kadar je podan
- Ko so custom besede, preskoči fonetično sortiranje (ohrani vrstni red iz dodelitve)

**2. `src/pages/DodatnoPreverjanje.tsx`**
- Posreduj `customArticulationData` kot zadnji parameter hooku `useArticulationTestNew`
- Odstrani neuporabljene spremenljivke (`flatWords`, `allLetters` iz lokalne računice) — te zdaj prihajajo iz hooka

To je minimalen popravek — ena nova vrstica parametra v hooku, ena spremenjena vrstica v `sortedArticulationData` memoizaciji, in posredovanje podatkov v `DodatnoPreverjanje.tsx`.

