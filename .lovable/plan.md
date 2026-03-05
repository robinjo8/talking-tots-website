

# Plan: Preoblikovanje sprednje strani kartic po vzoru slike

## Kaj se spremeni

Sprednja stran flip kartic dobi dizajn kot na referenčni sliki (Kolo sreče kartice) — brez zmajčkov. Zgornja polovica kartice je pastelno gradient ozadje, spodnja polovica je bela s tekstom. Na zgornjem delu piše manjši napis "Glas", pod njim pa velika črka (npr. **K**). Vsaka kartica ima svojo barvo besedila.

## Struktura sprednje strani kartice

```text
┌──────────────────────┐
│                      │
│  bg-gradient pastel  │
│                      │
│      Glas            │  ← manjši tekst, barvni
│       K              │  ← velik tekst (3xl-5xl), barvni
│                      │
├──────────────────────┤
│   Glas K             │  ← bel spodnji del z naslovom (kot na sliki)
└──────────────────────┘
```

## Spremembe v `src/pages/VizualniPrikazUstnic.tsx`

### Sprednja stran kartice (`flip-card-front`)
- Razdelim na dva dela: zgornji gradient del (aspect-square) in spodnji beli del s tekstom
- Zgornji del: pastelni gradient ozadje, na sredini napis "Glas" (manjši) + velika črka pod njim
- Spodnji del: belo ozadje, naslov kartice (npr. "Glas K", "Glasovi C, S, Z")
- Besedilo v barvi kartice (`text-app-orange`, `text-app-purple`, itd.)
- Za kartice z več glasovi (C,S,Z in Č,Š,Ž) prikazujem glasove ločeno ali skupaj

### Barve ostanejo enake kot zdaj
- K: orange, L: purple, R: purple/teal, CSZ: green, ČŠŽ: blue

### Zadnja stran ostane nespremenjena
- Slika artikulacije + gumb za zvočna navodila

## Datoteka
- `src/pages/VizualniPrikazUstnic.tsx`

