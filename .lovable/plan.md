

# Načrt: Pravilna struktura 16 kamnov

## Razumevanje zahteve

- **16 kamnov** (ne 17!)
- **START = CILJ** = isti siv kamen na sredini spodaj `(x=1, y=0)`
- Zmajček začne na START, naredi U-pot in se vrne na isti kamen za ponovitev 4. povedi
- Barve: **siv → rdeč → rumen → zelen → siv → rdeč → rumen → zelen → ...** (ponavlja se)

## Trenutne napake

1. **Dva kamna na `(0, y=3)`** - zelen in siv se prekrivata = čudna mešana barva
2. **Dva kamna na `(2, y=0)`** - rdeč in siv se prekrivata = čudna mešana barva
3. **START je na `(0,0)`** namesto na sredini `(1,0)`
4. **Barve povedi 3 in 4** gredo v napačnem vrstnem redu (zelen→rumen→rdeč)

## Pravilna struktura 16 kamnov v 7 vrsticah

```text
y=6:  [ZEL]    [SIV]    [RDEČ]   ← zgornji trije
y=5:  [RUM]             [RUM]
y=4:  [RDEČ]            [ZEL]
y=3:  [SIV]             [SIV]    ← počitki (zmajček se obrne)
y=2:  [ZEL]             [RDEČ]
y=1:  [RUM]             [RUM]
y=0:  [RDEČ]   [SIV]    [ZEL]    ← spodnji trije
                 ↑
           START/CILJ
```

## Pot zmajčka (16 kamnov)

| # | Pozicija | Barva | Opis |
|---|----------|-------|------|
| 1 | (1,0) | **SIV** | START/CILJ |
| 2 | (0,0) | rdeč | Poved 1, beseda 1 |
| 3 | (0,1) | rumen | Poved 1, beseda 2 |
| 4 | (0,2) | zelen | Poved 1, beseda 3 |
| 5 | (0,3) | **SIV** | Počitek - ponovi poved 1 |
| 6 | (0,4) | rdeč | Poved 2, beseda 1 |
| 7 | (0,5) | rumen | Poved 2, beseda 2 |
| 8 | (0,6) | zelen | Poved 2, beseda 3 |
| 9 | (1,6) | **SIV** | Počitek - ponovi poved 2 |
| 10 | (2,6) | rdeč | Poved 3, beseda 1 |
| 11 | (2,5) | rumen | Poved 3, beseda 2 |
| 12 | (2,4) | zelen | Poved 3, beseda 3 |
| 13 | (2,3) | **SIV** | Počitek - ponovi poved 3 |
| 14 | (2,2) | rdeč | Poved 4, beseda 1 |
| 15 | (2,1) | rumen | Poved 4, beseda 2 |
| 16 | (2,0) | zelen | Poved 4, beseda 3 |
| → | (1,0) | **SIV** | CILJ = START - ponovi poved 4 |

**Skupaj: 16 unikatnih kamnov** (brez prekrivanja!)

## Spremembe

### 1. Popravek `STONE_POSITIONS_MOBILE`

```typescript
const STONE_POSITIONS_MOBILE: StonePosition[] = [
  // START/CILJ - sredina spodaj (zmajček začne in konča tukaj)
  { x: 1, y: 0, type: 'gray', isRest: false },
  
  // Poved 1: Levi stolpec gor (rdeč, rumen, zelen, siv)
  { x: 0, y: 0, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 0, y: 1, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 0, y: 2, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 0, y: 3, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Poved 2: Levi stolpec gor + prehod zgoraj (rdeč, rumen, zelen, siv)
  { x: 0, y: 4, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 0, y: 5, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 0, y: 6, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 1, y: 6, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Poved 3: Desni stolpec dol (rdeč, rumen, zelen, siv)
  { x: 2, y: 6, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 2, y: 5, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 4, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 2, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Poved 4: Desni stolpec dol do cilja (rdeč, rumen, zelen)
  // Zmajček se nato vrne na START (1,0) za ponovitev povedi 4
  { x: 2, y: 2, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 1, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 2, y: 0, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
];
```

### 2. Povečaj `topCardHeight` za več prostora pod karticami

```typescript
const topCardHeight = 120; // Prej 80px
```

## Povzetek

| Element | Prej | Zdaj |
|---------|------|------|
| Število kamnov | 18 (prekrivanja!) | **16 unikatnih** |
| START pozicija | (0,0) levo | **(1,0) sredina** |
| CILJ | Ločen kamen (2,0) | **= START (1,0)** |
| Barve povedi 3 in 4 | zelen→rumen→rdeč | **rdeč→rumen→zelen** |
| `topCardHeight` | 80px | **120px** |
| `rows` | 7 | 7 (ostane enako) |

## Datoteka za spremembo

`src/components/games/PonoviPovedGame.tsx`:
- Vrstice 126-153: Zamenjaj celoten `STONE_POSITIONS_MOBILE` array
- Vrstica 317: `topCardHeight = 80` → `topCardHeight = 120`

