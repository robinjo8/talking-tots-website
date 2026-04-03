

## Plan: Popravi pot do slik ustnic v LipsImageButton

### Problem

`LipsImageButton.tsx` (vrstica 6) kaže na napačen bucket:
```
const SUPABASE_SLIKE_URL = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike';
```

Slike `Glas_*.png` pa so shranjene v bucketu **`slike-ostalo`** (to potrjuje `VizualniPrikazUstnic.tsx`, ki pravilno prikazuje iste slike iz `slike-ostalo`).

### Popravek

**1 datoteka: `src/components/games/LipsImageButton.tsx`**

Vrstica 6 — zamenjaj `slike` z `slike-ostalo`:
```typescript
const SUPABASE_SLIKE_URL = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo';
```

### Obseg
- 1 datoteka, 1 vrstica spremenjena
- Nobena druga sprememba ni potrebna — vsa ostala logika (mapiranje črk, prikaz gumba) je pravilna

