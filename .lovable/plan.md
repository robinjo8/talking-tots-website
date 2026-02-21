

## Popravek: slika LOS ne deluje

### Problem
V konfiguracijah je zapisano `los1.webp`, vendar v bucketu `slike` datoteka s tem imenom ne obstaja. Pravilno ime je `los.webp` (brez sufiksa `1`).

### Popravki

Zamenjati `los1.webp` z `los.webp` v **treh datotekah**:

| Datoteka | Sprememba |
|---|---|
| `src/data/artikulacijaVajeConfig.ts` | `los1.webp` → `los.webp` |
| `src/data/bingoWordsSSredinaKonec.ts` | `los1.webp` → `los.webp` |
| `src/data/metKockeConfig.ts` | `los1.webp` → `los.webp` |

