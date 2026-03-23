

## Plan: Popravi "Izziv na kači" → "Tomijev izziv" + Popravi avatar barvo na plošči

### Problem 1: Napačen napis
V `KaceLestveWordDialog.tsx` (vrstica 242) piše "IZZIV NA KAČI!" — zamenjam z "TOMIJEV IZZIV!".

### Problem 2: Plošča ignorira izbiro avatarja
V `KaceLestveBoard.tsx` (vrstica 488) je avatar **hardkodiran**: idx 0 = modri, idx 1 = rdeči. Polje `player.avatarUrl` (ki pravilno vsebuje izbrani avatar) se sploh ne uporablja. Zato je na plošči vedno modri zmajček prvi, ne glede na izbiro v nastavitvah.

### Spremembe

**1. `src/components/games/KaceLestveWordDialog.tsx`**
- Vrstica 242: `"IZZIV NA KAČI!"` → `"TOMIJEV IZZIV!"`

**2. `src/components/games/KaceLestveBoard.tsx`**
- Vrstica 488: Zamenjam hardkodirano pot z `player.avatarUrl`:
  ```
  src={`${SUPABASE_URL}/zmajcki/${player.avatarUrl}`}
  ```

To je vse — avatar izbira v nastavitvah in `playerData` v `KaceLestveGame.tsx` že pravilno posredujeta avatarje, plošča jih le ni uporabljala.

