
## Redesign: KaceLestveSettingsModal

### Summary of Changes

Only **one file** needs to be changed for the full redesign: `src/components/games/KaceLestveSettingsModal.tsx`.  
The `kaceLestveConfig.ts` also gets a minor update to remove the unused avatar array.

---

### What needs to change

#### 1. Avatar logic — only 2 choices (modri / rdeči zmajček)

Currently: 9 avatars in a grid.  
New: Only `Zmajcek_modra_figura_1.webp` (blue) and `Zmajcek_rdeca_figura_1.webp` (red).

- **1 player**: Player picks blue or red. Default = blue. The choice appears right after the "1 IGRALEC / 2 IGRALCA" buttons.
- **2 players**: Player 1 picks. Player 2 is automatically assigned the other color. No choice for Player 2.
- `DRAGON_AVATARS` constant in `kaceLestveConfig.ts` updated to just these 2 avatars.
- `DEFAULT_AVATARS` in `KaceLestveGame.tsx` updated accordingly.

#### 2. Remove the X close button from the Dialog

The `DialogContent` from Radix renders an X button by default. We need to suppress it.  
Solution: pass `hideCloseButton` or use a custom `DialogContent` without the close icon (using `[&>button]:hidden` class).

#### 3. Difficulty section redesign — matches ArticulationSettingsDialog style

Currently: colored square badges + highlight with matching color.  
New: radio-button style matching `/artikulacijski-test`:
- `RadioGroup` + `RadioGroupItem` components
- Each option: bordered card (`border-2 rounded-lg p-3`)
- Selected: `border-teal-500 bg-teal-50`
- Unselected: `border-gray-200 hover:border-gray-300`
- Layout: vertical single column (no recording duration column needed)
- Labels in normal case (not all-caps), descriptions in small muted text

Difficulty options adapted for the game:
- **Lahka** — Lažja igra (+2 polji za pravilno besedo)
- **Srednja (priporočeno)** — Za večino otrok (+1 polje za pravilno besedo)
- **Težka** — Strožje (+0 polj za pravilno besedo)

Section heading style: `font-medium text-sm uppercase tracking-wide text-muted-foreground`

#### 4. Overall modal header redesign

Currently: centered emoji title.  
New: matches `/artikulacijski-test` style:
- `DialogHeader` with `DialogTitle` containing a game icon + "Nastavitve igre"
- `DialogDescription`: "Izberite število igralcev, zmajčka in težavnost igre."
- No X button visible

#### 5. Buttons at bottom

- **Primary button**: "🎲 ZAČNI IGRO" / "✓ POTRDI" — teal/green (`bg-teal-500 hover:bg-teal-600`) aligned right, matching the "Shrani" button in ArticulationSettingsDialog
- **Secondary button**: "← NAZAJ" — shown only when NOT in-game (initial settings screen). Calls `navigate(-1)` or `navigate(backPath)`. Uses `useNavigate` — but this is a prop-less modal, so `backPath` needs to be passed as a prop.
- The exit confirmation dialog (`MemoryExitConfirmationDialog`) triggers on "NAZAJ" click.

#### 6. Props change for NAZAJ button

`KaceLestveSettingsModal` needs two new props:
- `onBack: () => void` — called when NAZAJ is clicked (shows exit confirmation)
- Already handled by `KaceLestveGame.tsx` which controls `showExitDialog`

In `KaceLestveGame.tsx`: when the settings modal (initial) calls `onBack`, we show the `MemoryExitConfirmationDialog`.

---

### Technical Details

**`src/data/kaceLestveConfig.ts`**:
```typescript
// Change from 9 avatars to 2:
export const DRAGON_AVATARS = [
  "Zmajcek_modra_figura_1.webp",
  "Zmajcek_rdeca_figura_1.webp",
];
```

**`src/components/games/KaceLestveSettingsModal.tsx`** — full redesign:
- Import `RadioGroup`, `RadioGroupItem` from `@/components/ui/radio-group`
- Import `Label` from `@/components/ui/label`  
- Import `Settings` or a game icon from `lucide-react`
- Import `DialogHeader`, `DialogTitle`, `DialogDescription`
- Remove colored square badges
- Replace difficulty buttons with RadioGroup cards (teal border when selected)
- Avatar section: 2 buttons side-by-side (blue / red dragon images), selected = teal border
- 2-player: show only Player 1 choice, Player 2 auto-assigned
- Add `onBack` prop, render NAZAJ button below ZAČNI IGRO (only when `!isInGame`)
- Hide dialog X button via `[&>button:first-child]:hidden` on `DialogContent`

**`src/components/games/KaceLestveGame.tsx`**:
- Pass `onBack={() => setShowExitDialog(true)}` to the initial `KaceLestveSettingsModal`
- `MemoryExitConfirmationDialog` already handles the confirmation and navigates to `backPath`

---

### Layout of the redesigned modal (initial)

```text
┌─────────────────────────────────────┐
│  🎮  Nastavitve igre                 │
│  Izberite igralce, zmajčka in       │
│  težavnost igre.                    │
│                                     │
│  ŠTEVILO IGRALCEV                   │
│  [  1 IGRALEC  ] [  2 IGRALCA  ]    │
│                                     │
│  IZBERI ZMAJČKA                     │
│  [ 🔵 Modri ] [ 🔴 Rdeči ]          │
│  (if 2 players: Player 2 auto)      │
│                                     │
│  TEŽAVNOST IGRE                     │
│  ○ Lahka         +2 polji            │
│  ● Srednja       +1 polje  ← teal   │
│  ○ Težka         Brez bonusa        │
│                                     │
│  [  ← NAZAJ  ]  [  🎲 ZAČNI IGRO  ] │
└─────────────────────────────────────┘
```

### Files to modify

| File | Changes |
|------|---------|
| `src/data/kaceLestveConfig.ts` | DRAGON_AVATARS reduced to 2 entries |
| `src/components/games/KaceLestveSettingsModal.tsx` | Full redesign: header, avatars, difficulty, buttons |
| `src/components/games/KaceLestveGame.tsx` | Pass `onBack` prop, update DEFAULT_AVATARS |
