

## Dodajanje kratkih navodil nad igro za Ujemanje, Bingo in Labirint

### Pregled

Nad vsako igro se doda kratko navodilo (instrukcija) v obliki belega/polprosojnega traku z velikimi tiskanimi crkami. Navodila se prikazejo stalno med igro in ne vplivajo na logiko igre.

### Navodila po igrah

**Igra ujemanja** (GenericIgraUjemanjaGame.tsx):
- Starost 3-4: "POISCI ENAKI SLIKI."
- Starost 5-6: "POVEZI POSNETEK Z USTREZNO SENCO IN SLIKO."
- Starost 7-8 in 9-10: "POVEZI POSNETEK Z USTREZNO BESEDO, SENCO IN SLIKO."

**Bingo** (GenericBingoGame.tsx):
- "KLIKNI 'ZAVRTI' IN POISCI ENAKE SLIKE."

**Labirint** (GenericLabirintGame.tsx):
- "POBERI VSE ZVEZDICE IN POJDI DO CILJA."

### Tehnicne spremembe

#### 1. GenericIgraUjemanjaGame.tsx

Dodaj navodilo med ozadjem in igro (vrstica ~265, nad `renderGame()`). Navodilo se doloci glede na `config.requiredAgeGroup`:

```text
const instructionText = useMemo(() => {
  switch (config.requiredAgeGroup) {
    case '3-4': return 'POISCI ENAKI SLIKI.';
    case '5-6': return 'POVEZI POSNETEK Z USTREZNO SENCO IN SLIKO.';
    default: return 'POVEZI POSNETEK Z USTREZNO BESEDO, SENCO IN SLIKO.';
  }
}, [config.requiredAgeGroup]);
```

Prikaz: bel polprosojen trak na vrhu zaslona (`fixed top-2 left-0 right-0 z-20 text-center`):
```text
<div className="fixed top-2 left-0 right-0 z-20 flex justify-center pointer-events-none">
  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-md">
    <p className="text-sm md:text-base font-bold text-gray-800">
      {instructionText}
    </p>
  </div>
</div>
```

Postavi ga znotraj `<>` bloka (vrstica 264), pred `renderGame()` div. Uporabi `pointer-events-none` da ne blokira klikov na igro.

#### 2. GenericBingoGame.tsx

Dodaj navodilo nad reel komponento (vrstica ~173, pred `<BingoReel>`):

```text
<div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-1.5 shadow-md">
  <p className="text-sm md:text-base font-bold text-gray-800">
    KLIKNI 'ZAVRTI' IN POISCI ENAKE SLIKE.
  </p>
</div>
```

Postavi ga znotraj flex-col kontejnerja (vrstica 172), kot prvi element pred `<BingoReel>`.

#### 3. GenericLabirintGame.tsx

Dodaj navodilo pod naslov `<h1>` (vrstica ~344, pred `<MazeGame>`):

```text
<div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-1.5 shadow-md mb-2">
  <p className="text-sm md:text-base font-bold text-gray-800">
    POBERI VSE ZVEZDICE IN POJDI DO CILJA.
  </p>
</div>
```

Postavi ga med `</h1>` (vrstica 344) in `<MazeGame>` (vrstica 346).

### Vizualni slog

Vse tri igre uporabljajo enak slog navodila:
- Belo polprosojno ozadje (`bg-white/80 backdrop-blur-sm`)
- Zaobljen okvir (`rounded-full`)
- Krepko besedilo (`font-bold`)
- Senca (`shadow-md`)
- Manjsa pisava na mobilnih napravah (`text-sm md:text-base`)

### Skupaj: 3 datoteke
- `src/components/games/GenericIgraUjemanjaGame.tsx`
- `src/components/games/GenericBingoGame.tsx`
- `src/components/games/GenericLabirintGame.tsx`

