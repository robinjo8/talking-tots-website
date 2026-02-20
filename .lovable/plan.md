
## Tri popravke: slike/zvoki + počasnejša hop animacija

### 1. Popravek v `src/data/kaceLestveConfig.ts`

**VILICE**:
- `image`: `"vilice1.webp"` → `"vilica1.webp"`
- `audio`: `"vilice.m4a"` → ostane `"vilice.m4a"` ✓

**VETRNICA**:
- `image`: `"vetrnica1.webp"` → `"veternica1.webp"`
- `audio`: `"vetrnica.m4a"` → `"veternica.m4a"`

---

### 2. Počasnejša hop animacija v `src/components/games/KaceLestveBoard.tsx`

Trenutno je `HOP_INTERVAL_MS = 180` ms in hop duration `0.16s` — preveč hitro.

Nova vrednost — lepo, počasno skakanje:
- `HOP_INTERVAL_MS`: `180` → `500` ms med vsakim korakom
- hop `duration`: `0.16s` → `0.42s` (animacija posameznega koraka)

Za primer: zmajček pri 6 korakih porabi ~3s skupaj, kar je primerljivo s hitrostjo puščice (1.8s za skok), ampak vsak korak je jasno viden.

---

### Datoteki za spremembo

| Datoteka | Sprememba |
|---|---|
| `src/data/kaceLestveConfig.ts` | VILICE: `vilica1.webp` + `vilice.m4a`; VETRNICA: `veternica1.webp` + `veternica.m4a` |
| `src/components/games/KaceLestveBoard.tsx` | `HOP_INTERVAL_MS: 180 → 500`, hop `duration: 0.16 → 0.42` |
