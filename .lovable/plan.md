
# Plan: Izboljšanje kvalitete slik na /moje-aplikacije

## Problem
Na strani `/moje-aplikacije` tri kartice uporabljajo PNG slike iz bucketa `zmajcki`, ki so slabše kvalitete:
- **Moj osebni načrt**: `Zmajcek_izzivi_6.png`
- **Govorne igre**: `Zmajcek_igre_4.png`
- **Govorne vaje**: `Zmajcek_vaje_6.png`

Kartica **Video navodila** ima boljšo kvaliteto, ker uporablja sliko iz drugega bucketa (`slike-ostalo`).

## Rešitev
Zamenjal bom `.png` končnice z `.webp` za vse tri problematične slike v datoteki `ActivityOptions.tsx`. WebP format zagotavlja boljšo kvaliteto slik pri manjši velikosti datoteke.

## Spremembe

### Datoteka: `src/components/ActivityOptions.tsx`

Zamenjam tri URL-je slik:

| Aktivnost | Trenutna slika | Nova slika |
|-----------|----------------|------------|
| Moj osebni načrt | `Zmajcek_izzivi_6.png` | `Zmajcek_izzivi_6.webp` |
| Govorne igre | `Zmajcek_igre_4.png` | `Zmajcek_igre_4.webp` |
| Govorne vaje | `Zmajcek_vaje_6.png` | `Zmajcek_vaje_6.webp` |

## Tehnične podrobnosti
- WebP format je že uporabljen v `FeaturesCardsSection.tsx` za iste zmajčke, kar potrjuje, da WebP verzije obstajajo v bucketu
- PNG -> WebP zamenjava izboljša kvaliteto slike in zmanjša čas nalaganja
- Ni potrebnih sprememb v drugih datotekah
