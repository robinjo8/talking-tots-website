
# Plan: Popravek zvoka v Labirintu in napake ČOKLA→COKLA

## Opis problema

### 1. Zvok ne deluje v igri Labirint
Ko uporabnik zbere zvezdico v Labirintu, se beseda ne predvaja. Problem je v funkciji `enrichImageWithAudio` v datoteki `GenericLabirintGame.tsx`:

```typescript
// Trenutna (napačna) logika:
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  const baseName = image.filename.replace('.webp', '').replace('.png', '');
  return {
    ...image,
    audio: `${baseName}.m4a`  // cokla1.webp → cokla1.m4a ❌
  };
};
```

Dejanske zvočne datoteke v storage nimajo sufiksa `1`:
- Slika: `cokla1.webp`
- Zvok: `cokla.m4a` (NE `cokla1.m4a`)

### 2. Napačno napisana beseda ČOKLA
V nekaterih konfiguracijskih datotekah je beseda napisana kot "ČOKLA" (s šumnikom), ampak pravilno mora biti "COKLA" (brez šumnika).

---

## Tehnične spremembe

### Sprememba 1: Popravek funkcije za audio v Labirintu

**Datoteka:** `src/components/games/GenericLabirintGame.tsx`

Popravljena funkcija, ki odstrani sufiks `1` iz imena datoteke:

```typescript
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  // Remove file extension
  let baseName = image.filename.replace('.webp', '').replace('.png', '');
  // Remove trailing '1' suffix (e.g., "cokla1" → "cokla")
  baseName = baseName.replace(/1$/, '');
  return {
    ...image,
    audio: `${baseName}.m4a`
  };
};
```

### Sprememba 2: Popravek besede ČOKLA → COKLA

Naslednje datoteke je potrebno popraviti:

**2a. `src/data/bingoWordsKSredinaKonec.ts`**
- Vrstica 14: `{ word: "ČOKLA"` → `{ word: "COKLA"`

**2b. `src/data/bingoWordsLSredinaKonec.ts`**
- Vrstica 13: `{ word: "ČOKLA"` → `{ word: "COKLA"`

**2c. `src/data/artikulacijaVajeConfig.ts`**
- Vrstica 212: `{ word: "ČOKLA"` → `{ word: "COKLA"`
- Vrstica 230: `{ word: "ČOKLA"` → `{ word: "COKLA"`

---

## Diagram popravka zvoka

```text
PRED POPRAVKOM (napačno):
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  puzzleImages.ts │───►│ enrichImageWith  │───►│  StarCollectDialog
│  cokla1.webp     │    │ Audio()          │    │  audio: cokla1.m4a
└──────────────────┘    │ cokla1.m4a       │    │  ❌ Datoteka ne obstaja
                        └──────────────────┘    └──────────────────┘

PO POPRAVKU (pravilno):
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  puzzleImages.ts │───►│ enrichImageWith  │───►│  StarCollectDialog
│  cokla1.webp     │    │ Audio()          │    │  audio: cokla.m4a
└──────────────────┘    │ cokla.m4a        │    │  ✅ Datoteka obstaja
                        │ (odstrani '1')   │    └──────────────────┘
                        └──────────────────┘
```

---

## Prizadete igre

### Popravek zvoka vpliva na:
- **Labirint** (vse črke: C, Č, K, L, R, S, Š, Z, Ž)
- **Sestavljanke** (vse črke) - če uporabljajo isto logiko

### Popravek besede COKLA vpliva na:
- **Bingo K sredina/konec**
- **Bingo L sredina/konec**
- **Kolo besed** (preko artikulacijaVajeConfig)

---

## Testiranje po implementaciji

1. Pojdi na `/govorne-igre/labirint/c`
2. Zberi prvo zvezdico
3. Preveri, da se beseda avtomatsko predvaja ob odprtju dialoga
4. Klikni na ikono zvočnika in preveri, da se beseda predvaja
5. Ponovi za druge črke (Č, K, L...)
6. Preveri igro Bingo K in Bingo L, da je beseda prikazana kot "COKLA" (brez šumnika)
