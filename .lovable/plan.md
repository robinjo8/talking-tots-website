
# Plan: Popravek gumba X v pogovornih oknih iger

## Povzetek težave

V igri Labirint (in več drugih igrah) gumb **X** v zgornjem desnem kotu pop-up okna ne dela ničesar. Težava je v tem, da je `onOpenChange` nastavljen na prazno funkcijo `() => {}`, ki ne izvede nobenega dejanja.

## Prizadeta okna

| Komponenta | Igra | Problem |
|------------|------|---------|
| StarCollectDialog.tsx | Labirint | X gumb ne dela |
| BingoSuccessDialog.tsx | Bingo | X gumb ne dela |
| BingoCongratulationsDialog.tsx | Bingo | X gumb ne dela |
| WheelSuccessDialog.tsx (BRAVO del) | Kolo besed | X gumb ne dela |
| StarEarnedDialog.tsx | Met kocke | X gumb je skrit |
| ArticulationResumeDialog.tsx | Preverjanje izgovorjave | X gumb ne dela |

## Pravilno delovanje (vzor)

Komponenta **MatchingCompletionDialog** pravilno implementira logiko:

```text
┌─────────────────────────────────────────┐
│  Uporabnik klikne X                     │
├─────────────────────────────────────────┤
│  Ali so vse naloge opravljene?          │
│     │                                   │
│     ├── NE → Prikaži opozorilo          │
│     │        "Ali res želite zapret?"   │
│     │        [DA] [NE]                  │
│     │                                   │
│     └── DA → Zapri okno                 │
└─────────────────────────────────────────┘
```

## Rešitev

### 1. StarCollectDialog.tsx (Labirint)

Dodati:
- State za prikaz potrditvenega dialoga
- Funkcijo `handleClose` ki preveri, če je snemanje končano
- ConfirmDialog komponento z vprašanjem

### 2. BingoSuccessDialog.tsx

Dodati:
- State za prikaz potrditvenega dialoga
- Funkcijo `handleClose` ki preveri, če je snemanje končano
- ConfirmDialog komponento

### 3. BingoCongratulationsDialog.tsx

Dodati:
- State za prikaz potrditvenega dialoga
- Funkcijo `handleClose` ki preveri, če uporabnik ni prejel zvezdice
- ConfirmDialog komponento

### 4. WheelSuccessDialog.tsx (BRAVO del)

Dodati:
- V "BRAVO" delu dialoga (vrstica 200) zamenjati `onOpenChange={() => {}}` z ustrezno funkcijo
- Prikazati opozorilo če uporabnik ni prejel zvezdice

### 5. StarEarnedDialog.tsx

- Odstraniti skriti X gumb (`[&>button]:hidden`)
- Dodati potrditveni dialog

### 6. ArticulationResumeDialog.tsx

- Ta dialog je poseben primer - uporabnik mora izbrati med "Nadaljuj" in "Začni znova"
- X gumb bi moral zapreti dialog brez dejanja (vrnitev na prejšnjo stran)

## Tehnične podrobnosti

Za vsako komponento bo potrebno:

1. Uvoziti `ConfirmDialog` in `useState`:
```typescript
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
```

2. Dodati state:
```typescript
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
```

3. Implementirati `handleClose`:
```typescript
const handleClose = () => {
  if (!recordingComplete) {
    setShowConfirmDialog(true);
  } else {
    onOpenChange(false);
  }
};
```

4. Zamenjati `onOpenChange={() => {}}` z `onOpenChange={handleClose}`

5. Dodati ConfirmDialog v JSX:
```typescript
<ConfirmDialog
  open={showConfirmDialog}
  onOpenChange={setShowConfirmDialog}
  title="OPOZORILO"
  description="ALI RES ŽELITE ZAPRET OKNO? NE BOSTE PREJELI ZVEZDICE."
  confirmText="DA"
  cancelText="NE"
  onConfirm={() => {
    setShowConfirmDialog(false);
    onOpenChange(false);
  }}
  onCancel={() => setShowConfirmDialog(false)}
/>
```

## Spremembe datotek

| Datoteka | Sprememba |
|----------|-----------|
| src/components/games/StarCollectDialog.tsx | Dodati potrditveni dialog |
| src/components/bingo/BingoSuccessDialog.tsx | Dodati potrditveni dialog |
| src/components/bingo/BingoCongratulationsDialog.tsx | Dodati potrditveni dialog |
| src/components/wheel/WheelSuccessDialog.tsx | Popraviti BRAVO del |
| src/components/dice/StarEarnedDialog.tsx | Pokazati X in dodati potrditveni dialog |
| src/components/articulation/ArticulationResumeDialog.tsx | Omogočiti X za zaprtje |

## Besedilo opozoril (v slovenščini, VELIKE ČRKE)

- **StarCollectDialog**: "ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
- **BingoSuccessDialog**: "ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
- **BingoCongratulationsDialog**: "ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
- **WheelSuccessDialog**: "ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
- **StarEarnedDialog**: "ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
