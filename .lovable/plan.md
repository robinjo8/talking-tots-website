

# Poenotenje vseh potrditvenih oken v igrah

## Trenutno stanje — vsa obvestila v igrah

Obstajata **2 različna stila** potrditvenih oken:

### Stil 1: `MemoryExitConfirmationDialog` (zeleni/rdeči gumbi, VELIKE ČRKE)
- Naslov: **OPOZORILO** (centriran, uppercase)
- Opis: **ALI RES ŽELITE PREKINITI IGRO?** (centriran)
- Gumbi: Zelen ✓ DA | Rdeč ✗ NE (z ikonami Check/X)
- **Uporablja se za**: izhod iz iger (Home gumb)

### Stil 2: `ConfirmDialog` (privzet stil, navadni gumbi)
- Naslov: navaden tekst (levo poravnan)
- Opis: navadno besedilo
- Gumbi: Outline "Ne" | Privzet "Da" (brez ikon, brez barv)
- **Uporablja se za**:

| Igra | Naslov | Opis |
|------|--------|------|
| Kolo besed | "Nova igra" | "Ali res želiš začeti novo igro? Ves napredek bo ponastavljen na začetno stanje." |
| Bingo | "Nova igra" | "Ali res želiš začeti novo igro? Ves napredek bo ponastavljen na začetno stanje." |
| Met kocke | "Nova igra" | "Ali res želiš začeti novo igro? Napredek bo izgubljen." |
| Poveži pare | "Nova igra" | "Ali res želiš začeti novo igro?" |
| Drsna sestavljanka | "Nova igra" | "Ali res želiš začeti novo igro?" |
| Sestavljanke (PuzzleSuccessDialog) | "ZAPRI IGRO" | "ČE ZAPREŠ IGRO, NE BOŠ PREJEL ZVEZDICE. ALI SI PREPRIČAN?" |

Tudi `PuzzleConfirmationDialog` ima drugačen stil (za potrditev zaključka sestavljanke): naslov "Potrditev", opis "Ali si res zaključil/a igro?" z zelenim/rdečim Da/Ne.

## Cilj
Poenotiti **vse** potrditvene dialoge znotraj iger na stil `MemoryExitConfirmationDialog`:
- Naslov centriran, **VELIKE ČRKE**
- Opis centriran
- Zeleni gumb ✓ DA | Rdeči gumb ✗ NE
- Enotno besedilo

## Spremembe

### 1. Posodobi `ConfirmDialog` (confirm-dialog.tsx)
Spremenimo stil tako da bo **vedno** kot MemoryExitConfirmationDialog:
- Naslov: centriran, uppercase
- Opis: centriran
- Gumbi: zeleni (DA z ✓) in rdeči (NE z ✗), centrirani, zaokroženi, uppercase
- Ohranimo vse obstoječe props (title, description, confirmText, cancelText itd.)

### 2. Posodobi "Nova igra" dialoge — poenoti besedilo
V vseh igrah spremenimo:
- **Naslov**: "Nova igra" → `"OPOZORILO"`
- **Opis**: → `"ALI RES ŽELIŠ ZAČETI NOVO IGRO?"`
- **confirmText**: `"DA"`, **cancelText**: `"NE"`

Igre za posodobitev:
- `GenericWheelGame.tsx` (vrstica ~229)
- `GenericBingoGame.tsx` (vrstica ~301)
- `GenericMetKockeGame.tsx` (vrstica ~366)
- `GenericPoveziPareGame.tsx` (vrstica ~299, ~356)
- `GenericDrsnaSestavljankaGame.tsx` (vrstica ~205)

### 3. Posodobi `PuzzleSuccessDialog` dialog besedilo
- Naslov: "ZAPRI IGRO" → `"OPOZORILO"`
- Opis: ostane `"ČE ZAPREŠ IGRO, NE BOŠ PREJEL ZVEZDICE. ALI SI PREPRIČAN?"` (že uppercase)
- confirmText: `"DA"`, cancelText: `"NE"`

### 4. Posodobi `PuzzleConfirmationDialog`
Spremenimo stil na enak poenoten videz:
- Naslov: "Potrditev" → `"OPOZORILO"`
- Opis: → `"ALI SI RES ZAKLJUČIL/A IGRO?"`
- Gumbi: zeleni DA / rdeči NE (že ima ta stil, le besedilo se poenoti)

### Datoteke za spremembo
- `src/components/ui/confirm-dialog.tsx` — stil gumbov in poravnava
- `src/components/games/GenericWheelGame.tsx` — besedilo Nova igra
- `src/components/games/GenericBingoGame.tsx` — besedilo Nova igra
- `src/components/games/GenericMetKockeGame.tsx` — besedilo Nova igra
- `src/components/games/GenericPoveziPareGame.tsx` — besedilo Nova igra (2x)
- `src/components/games/GenericDrsnaSestavljankaGame.tsx` — besedilo Nova igra
- `src/components/puzzle/PuzzleSuccessDialog.tsx` — besedilo
- `src/components/puzzle/PuzzleConfirmationDialog.tsx` — besedilo

