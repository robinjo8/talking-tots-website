

## Problem

Edge funkcija `generate-monthly-plan` ne generira osebnega načrta, ker:

1. **Format podatkov:** Baza shrani `positions: ["start", "middle-end"]` (niz), funkcija pričakuje `position: "start"` (string) → `lp.position` je `undefined` → nobena igra ni izbrana → "No target letters"
2. **Manjkajoče igre:** Drsna igra sploh ni v kodi; Ponovi poved in Smešne povedi manjkata v START naboru
3. **Napačna logika za middle-end:** Trenutno middle-end vključuje VSE igre (start + middle-end), moral bi pa vključevati SAMO 4 igre
4. **Ni podpore za `initial-exercises`:** R začetne vaje pozicija ni implementirana

---

## Celotna pravila generiranja osebnega načrta

### Struktura
- 30 sklopov (sets), ne koledarskih dni
- Vsak sklop: 5 aktivnosti (1 motorika + 4 igre ALI 5 iger)
- 1 sklop na dan, poteče po 90 dneh
- Znotraj sklopa se ista igra (gameId) NE ponovi

### Motorika
- **daily** = vsak sklop
- **weekly** = vsak 7. sklop (0, 7, 14, 21, 28)
- **monthly** = samo 1. sklop
- **custom** = razpršeno po sklopih glede na count/unit

### Nabori iger glede na pozicijo

**Začetek (start)** → 9 iger:
| Igra | gameId | URL vzorec |
|------|--------|-----------|
| Kolo besed | kolo-srece | /govorne-igre/kolo-srece/{urlKey} |
| Igra ujemanja | igra-ujemanja | /govorne-igre/igra-ujemanja/{urlKey}{ageKey} |
| Zaporedja | zaporedja | /govorne-igre/zaporedja/{urlKey}{ageKey} |
| Spomin | spomin | /govorne-igre/spomin/spomin-{urlKey} |
| Drsna igra | drsna-sestavljanka | /govorne-igre/drsna-sestavljanka/{urlKey}{ageKey} |
| Labirint | labirint | /govorne-igre/labirint/{urlKey} |
| Sestavljanke | sestavljanke | /govorne-igre/sestavljanke/{urlKey}{ageKey} |
| Ponovi poved | ponovi-poved | /govorne-igre/ponovi-poved/{urlKey} |
| Smešne povedi | met-kocke | /govorne-igre/met-kocke/{urlKey} |

**Sredina/konec (middle-end)** → 4 igre:
| Igra | gameId | URL vzorec |
|------|--------|-----------|
| Zabavna pot | kace | /govorne-igre/kace/{urlKey} |
| Bingo | bingo | /govorne-igre/bingo/{urlKey} |
| Ponovi poved | ponovi-poved | /govorne-igre/ponovi-poved/{urlKey} |
| Smešne povedi | met-kocke | /govorne-igre/met-kocke/{urlKey} |

**Začetek + Sredina/konec (obe izbrani za isti glas)** → 11 iger (unija brez podvajanja):
Vse igre iz obeh tabel.

**R - začetne vaje (initial-exercises)** → 11 iger (vse), URL ključ = `r-zacetek` namesto `r`

### Starostne igre
Sestavljanke, Zaporedja, Igra ujemanja in Drsna igra imajo starostni sufiks: "" (3-4), "56" (5-6), "78" (7-8), "910" (9-10)

---

## Spremembe

### 1 datoteka: `supabase/functions/generate-monthly-plan/index.ts`

**a) Redefiniraj nabore iger (vrstice 28-46):**

```typescript
const START_GAMES = [
  { name: "Kolo besed", gameId: "kolo-srece", pathTemplate: "/govorne-igre/kolo-srece/{urlKey}" },
  { name: "Spomin", gameId: "spomin", pathTemplate: "/govorne-igre/spomin/spomin-{urlKey}" },
  { name: "Labirint", gameId: "labirint", pathTemplate: "/govorne-igre/labirint/{urlKey}" },
  { name: "Ponovi poved", gameId: "ponovi-poved", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
  { name: "Smešne povedi", gameId: "met-kocke", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
];

const START_AGE_GAMES = [
  { name: "Sestavljanke", gameId: "sestavljanke", pathTemplate: "/govorne-igre/sestavljanke/{urlKey}{ageKey}" },
  { name: "Zaporedja", gameId: "zaporedja", pathTemplate: "/govorne-igre/zaporedja/{urlKey}{ageKey}" },
  { name: "Igra ujemanja", gameId: "igra-ujemanja", pathTemplate: "/govorne-igre/igra-ujemanja/{urlKey}{ageKey}" },
  { name: "Drsna igra", gameId: "drsna-sestavljanka", pathTemplate: "/govorne-igre/drsna-sestavljanka/{urlKey}{ageKey}" },
];

const MIDDLE_END_GAMES = [
  { name: "Zabavna pot", gameId: "kace", pathTemplate: "/govorne-igre/kace/{urlKey}" },
  { name: "Bingo", gameId: "bingo", pathTemplate: "/govorne-igre/bingo/{urlKey}" },
  { name: "Ponovi poved", gameId: "ponovi-poved", pathTemplate: "/govorne-igre/ponovi-poved/{urlKey}" },
  { name: "Smešne povedi", gameId: "met-kocke", pathTemplate: "/govorne-igre/met-kocke/{urlKey}" },
];
```

**b) Posodobi `LetterPosition` interface (vrstica 78-81):**
Dodaj `"initial-exercises"` kot veljavno pozicijo.

**c) Posodobi `buildGameCombinations` (vrstice 96-119):**
- `position === "start"` → `START_GAMES + START_AGE_GAMES` (9 iger)
- `position === "middle-end"` → samo `MIDDLE_END_GAMES` (4 igre) — NE več vseh iger
- `position === "initial-exercises"` → vse 11 iger, URL ključ = `r-zacetek`
- Dedup po `gameId` znotraj iste črke (Ponovi poved in Smešne povedi so v obeh naborih)

**d) Posodobi parsanje `reportDetails.letters` (vrstice 347-351):**
Pretvori `positions` niz v posamezne `LetterPosition` zapise:
```typescript
if (reportDetails?.letters && Array.isArray(reportDetails.letters)) {
  for (const lp of reportDetails.letters) {
    const posArray = lp.positions || [lp.position || "start"];
    for (const pos of posArray) {
      letterPositions.push({ letter: lp.letter, position: pos });
    }
  }
}
```

**e) Posodobi deduplikacijo (vrstice 375-381):**
Dedup po `letter+position` namesto samo `letter`:
```typescript
const seen = new Set<string>();
letterPositions = letterPositions.filter(lp => {
  const key = `${lp.letter}:${lp.position}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
```

**f) V `buildGameCombinations` dedup po `gameId` za isti glas:**
Ko ima en glas obe poziciji (start + middle-end), se ustvari unija vseh 11 iger brez podvajanja Ponovi poved in Smešne povedi.

### Po implementaciji
Ponovna generacija PDF-ja za testnega otroka bo sprožila nov načrt.

