

## Sprememba: Kolo besed - 10 ponovitev za 1 zvezdico

### Trenutno stanje
- Uporabnik zavrti kolo, dobi besedo, jo ponovi 3x, dobi zvezdico za to besedo
- Napredek se sledi **per-word** (3 krogi na besedo)
- `ProgressCircles` prikazuje 3 kroge v success dialogu
- `ProgressModal` prikazuje napredek vseh besed

### Novo delovanje
- Uporabnik zavrti kolo, dobi besedo, jo ponovi **1x**, krog se obarva (1/10)
- Po **10 uspešnih ponovitvah** (lahko 10 različnih besed ali ista beseda večkrat) se prikaže BRAVO dialog z gumbom "VZEMI ZVEZDICO"
- Na vrhu zaslona (pod naslovom) je **10 krogov** (enako kot pri igri Spomin - `MemoryProgressIndicator`)
- Po pobiranju zvezdice se krogi ponastavijo in igra se nadaljuje (nova runda)

### Spremembe po datotekah

**1. `src/components/games/GenericWheelGame.tsx`**
- Zamenjati `useWordProgress` z enostavnim `useState` za skupni counter (0-10)
- Dodati `MemoryProgressIndicator` pod naslov (10 krogov)
- Ko counter doseže 10, prikazati BRAVO dialog (obstoječi vzorec iz WheelSuccessDialog)
- `handleRecordComplete`: incrementira skupni counter namesto per-word progress
- `handleStarClaimed`: ponastavi counter na 0, pokliče `recordExerciseCompletion`
- Odstraniti `ProgressModal` in gumb zanj (spodaj desno) -- ni več relevanten
- Odstraniti `useWordProgress` import

**2. `src/components/wheel/WheelSuccessDialog.tsx`**
- Spremeniti prag iz 3 na 1 ponovitev -- po 1 snemanju se dialog zapre
- Odstraniti `ProgressCircles` iz dialoga (krogi so zdaj na glavnem zaslonu)
- Po uspešnem snemanju se dialog samodejno zapre (kot zdaj pri count < 3)
- Odstraniti BRAVO/star-claim logiko iz tega dialoga -- to bo v GenericWheelGame
- Props: odstraniti `pronunciationCount`, `onStarClaimed`; ohraniti `onRecordComplete`

**3. `src/components/games/GenericWheelGame.tsx` - BRAVO dialog**
- Ko `totalRepetitions >= 10`, prikazati BRAVO dialog z:
  - Naslov "BRAVO!"
  - Slika zmajčka (`Zmajcek_11.webp`)
  - Gumb "VZEMI ZVEZDICO"
  - Gumb X z `ConfirmDialog` opozorilom

### Vizualni prikaz

Pod naslovom "Kolo besed - Glas S" bo vrstica 10 krogov:
- Prazni krogi: beli (`bg-white/80`)
- Zapolnjeni krogi: oranžni z gradient in animacijo (enako kot pri Spomin)
- Ko se vseh 10 zapolni, se prikaže BRAVO dialog

### Tehnični detajli

- `MemoryProgressIndicator` se ponovno uporabi brez sprememb (samo `matchedPairs={totalRepetitions}` in `totalPairs={10}`)
- Stanje `totalRepetitions` se hrani v `useState` (ponastavitev ob novi igri ali ob pobiranju zvezdice)
- `WheelSuccessDialog` postane enostavnejši: prikaže besedo, sliko, gumb za snemanje, po 1 snemanju se zapre
- BRAVO dialog se preseli v `GenericWheelGame` (podobno kot pri drugih igrah)

### Datoteke za spremembo

| Datoteka | Sprememba |
|---|---|
| `src/components/games/GenericWheelGame.tsx` | Dodati 10-krog progress, BRAVO dialog, odstraniti per-word progress |
| `src/components/wheel/WheelSuccessDialog.tsx` | Poenostaviti na 1 ponovitev, odstraniti ProgressCircles in BRAVO |
