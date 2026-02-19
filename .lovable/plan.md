

## Popravek slike za KOKOS v Bingo S

### Stanje

Po temeljitem pregledu celotne verige (podatki -> hook -> komponenta -> prikaz):

**Bingo K** - VSE PRAVILNO: Beseda je "KOKOŠ", slika je `kokos1.webp` (žival). Kar ste videli ("KOKOS") je bilo najverjetneje iz prejsnje verzije kode, ki je ze popravljena.

**Bingo S** - NAPAKA: Beseda je pravilno "KOKOS" (sadez, ker je glas S na koncu), ampak slika je napacna -- prikazuje kokos (zival) namesto kokos (sadez).

### Spremembe

Dve datoteki potrebujeta popravek slike za besedo KOKOS v Bingo S:

| Datoteka | Vrstica | Sprememba |
|----------|---------|-----------|
| `src/data/artikulacijaVajeConfig.ts` | 268 | `image: "kokos1.webp"` -> `image: "kokos_sadez1.webp"` |
| `src/data/bingoWordsSSredinaKonec.ts` | 14 | `image: "kokos1.webp"` -> `image: "kokos_sadez1.webp"` |

Beseda "KOKOS" in audio "kokos.m4a" ostaneta nespremenjena -- samo slika se zamenja, da prikazuje sadez namesto zivali.

Nobena druga igra ne potrebuje sprememb -- KOKOS/KOKOS je povsod drugje pravilno nastavljen.
