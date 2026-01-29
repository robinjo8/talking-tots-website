

## Popravek manjkajočih slik v igri Spomin - Črka R

### Ugotovljen problem

V tabeli `memory_cards_r` imajo 4 slike **napačne URL-je s šumniki**, ki jih brskalnik ne more najti. Dejanske datoteke v bucketu `slike` uporabljajo ASCII znake (brez šumnikov).

### Seznam napačnih URL-jev

| Beseda | Napačen URL | Pravilen URL |
|--------|-------------|--------------|
| Ribič | `ribič1.webp` | `ribic1.webp` |
| Riž | `riž1.webp` | `riz1.webp` |
| Rokometaš | `rokometaš1.webp` | `rokometas1.webp` |
| Roža | `roža1.webp` | `roza1.webp` |

### Stanje ostalih tabel

Preveril sem vse ostale tabele za igro Spomin in nobena nima enakih težav:
- `memory_cards_c` - OK
- `memory_cards_Č` - OK
- `memory_cards_K` - OK
- `memory_cards_l` - OK
- `memory_cards_S` - OK
- `memory_cards_z` - OK
- `memory_cards_Š_duplicate` - OK
- `memory_cards_Ž` - OK

### Rešitev

Potrebno je posodobiti 4 zapise v tabeli `memory_cards_r` z naslednjimi SQL ukazi:

```sql
-- Popravek URL-jev za slike s šumniki v tabeli memory_cards_r
UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/ribic1.webp' 
WHERE word = 'Ribič';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/riz1.webp' 
WHERE word = 'Riž';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/rokometas1.webp' 
WHERE word = 'Rokometaš';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/roza1.webp' 
WHERE word = 'Roža';
```

### Vizualni prikaz

```text
PREJ (napačno):                         POTEM (pravilno):
┌─────────────────────────┐            ┌─────────────────────────┐
│  ribič1.webp ❌          │            │  ribic1.webp ✅          │
│  riž1.webp ❌            │   ────>    │  riz1.webp ✅            │
│  rokometaš1.webp ❌      │            │  rokometas1.webp ✅      │
│  roža1.webp ❌           │            │  roza1.webp ✅           │
└─────────────────────────┘            └─────────────────────────┘
```

### Koraki za implementacijo

1. Ustvari SQL migracijo za popravek 4 URL-jev
2. Zaženi migracijo

### Testiranje

Po implementaciji preverite:
1. Odprite igro Spomin - Črka R (`/govorne-igre/spomin/spomin-r`)
2. Vse kartice morajo prikazati slike (nobena več ne sme prikazati "Spominska kartica")
3. Odigrajte igro do konca za potrditev delovanja

