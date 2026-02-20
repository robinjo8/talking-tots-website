
## Popravki besed in upočasnitev animacije

### 1. Popravki v `src/data/kaceLestveConfig.ts`

Primerjava tvojih zahtevanih besed z trenutnim stanjem:

| Zahtevano | Trenutno `text` | Napaka? |
|---|---|---|
| Borovnice | BOROVNICE | ✓ |
| Kocka | KOCKA | ✓ |
| Kozarec | KOZAREC | ✓ |
| Lonec | LONEC | ✓ |
| Lubenica | LUBENICA | ✓ |
| Nogavice | NOGAVICE | ✓ |
| Pica | PICA | ✓ |
| Raca | RACA | ✓ |
| Ropotuljica | ROPOTULJICA | ✓ |
| Sonce | SONCE | ✓ |
| Vetrnica | VETRNICA | ✓ |
| **Vilica** | **VILICE** | ✗ → popraviti na VILICA |
| Zajec | ZAJEC | ✓ |
| Zobotrebec | ZOBOTREBEC | ✓ |
| **Žarnica** | **ZARNICA** | ✗ → popraviti na ŽARNICA |
| **Žlica** | **ZLICA** | ✗ → popraviti na ŽLICA |

Spremembe v config datoteki:

**VILICE → VILICA** (vrstica 115):
- `text`: `"VILICE"` → `"VILICA"`

**ZARNICA → ŽARNICA** (vrstice 133-136):
- `text`: `"ZARNICA"` → `"ŽARNICA"`
- `image`: `"zarnica1.webp"` → `"žarnica1.webp"` (ali ostane z/brez strešice, odvisno od datoteke v Supabase — ker pa sta slika in avdio poimenovana brez strešice, ju pustimo kot sta: `zarnica1.webp` in `zarnica.m4a`)

Opomba za ŽARNICA: ker so datoteke v Supabase shranjene kot `zarnica1.webp` in `zarnica.m4a` (brez strešice), slika in zvok ostaneta enaka — samo prikazano besedilo `text` se popravi na `"ŽARNICA"`.

**ZLICA → ŽLICA** (vrstice 139-142):
- `text`: `"ZLICA"` → `"ŽLICA"`

Opomba za ŽLICA: enako kot pri ŽARNICA — datoteke ostanejo `zlica1.webp` in `zlica.m4a`, samo `text` se popravi.

---

### 2. Upočasnitev animacije v `src/components/games/KaceLestveBoard.tsx`

Trenutno:
- `HOP_INTERVAL_MS = 500` ms
- hop `duration = 0.42s`

Novo — še bolj počasno, prijetno skakanje:
- `HOP_INTERVAL_MS`: `500` → `700` ms med vsakim korakom
- hop `duration`: `0.42s` → `0.60s`

To pomeni, da bo zmajček pri 6 korakih porabil ~4.2s skupaj — vsak korak bo jasno in lepo viden.

---

### Datoteki za spremembo

| Datoteka | Sprememba |
|---|---|
| `src/data/kaceLestveConfig.ts` | `text`: VILICE→VILICA, ZARNICA→ŽARNICA, ZLICA→ŽLICA |
| `src/components/games/KaceLestveBoard.tsx` | `HOP_INTERVAL_MS: 500→700`, hop `duration: 0.42→0.60` |
