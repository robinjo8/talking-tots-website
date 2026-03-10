

# Zamenjava MIZA → MED pri črki M v artikulacijskem testu

## Kaj je narobe
V `src/data/articulationTestData.ts` je pri črki M prva beseda MIZA (slika: miza1.webp, zvok: Miza.mp3). Mora biti **MED** (slika: med1.webp, zvok: Med.mp3).

## Sprememba
Ena vrstica v `src/data/articulationTestData.ts` (vrstica 36):

**Pred:**
```ts
{ text: "MIZA", image: "miza1.webp", audio: "Miza.mp3", acceptedVariants: ["MIZA", "MISA", ...] },
```

**Po:**
```ts
{ text: "MED", image: "med1.webp", audio: "Med.mp3", acceptedVariants: ["MED", "MET", "NET", "BED", "MED!", "MED?", "MEDA", "MEDU", "MEDI", "NED", "LED"] },
```

Beseda MIZA ostane pri črki Z (vrstica 144) in v evaluationOptions.ts mappingu nespremenjena, ker se wordIndex-i samodejno preračunajo.

### Datoteke
- `src/data/articulationTestData.ts` — zamenjava 1 vrstice (36)

