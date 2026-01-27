
# Načrt: Popravek imen slik v vseh konfiguracijskih datotekah

## Identificiran problem

Slike v Supabase bucketu `slike` so poimenovane z **"1" pred končnico** (npr. `cvet1.webp`), ampak vse konfiguracijske datoteke uporabljajo napačna imena (npr. `cvet.webp` ali `cvet.png`).

### Primeri napačnih preslikav

| V kodi | V Supabase bucketu | Status |
|--------|-------------------|--------|
| `cvet.webp` | `cvet1.webp` | NAPAČNO |
| `pica.png` | `pica1.webp` | NAPAČNO |
| `kocka.webp` | `kocka1.webp` | NAPAČNO |

### Izjeme (slike brez "1")

Nekatere slike NIMAJO "1" v imenu:
- `nogometas.webp` (NE `nogometas1.webp`)
- `ptic.webp` (NE `ptic1.webp`)
- `ribic.webp` (NE `ribic1.webp`)
- `riz.webp` (NE `riz1.webp`)
- `rokometas.webp` (NE `rokometas1.webp`)
- `zmaj.webp` (NE `zmaj1.webp`)
- `zvezda.webp` (NE `zvezda1.webp`)
- `Stickman_*.webp` slike (posebne slike za Met Kocke)
- `kokos_sadez*.webp` in `koza_skin*.webp` (posebni primeri)

---

## Datoteke za posodobitev

Potrebno je posodobiti **17 konfiguracijskih datotek**:

### Skupina 1: Kolo Sreče in Bingo konfiguracija
| Datoteka | Število slik | Format |
|----------|-------------|--------|
| `src/data/artikulacijaVajeConfig.ts` | ~200 slik | `.png` -> `.webp` + dodaj "1" |

### Skupina 2: Bingo datoteke (lokalne)
| Datoteka | Število slik | Format |
|----------|-------------|--------|
| `src/data/bingoWordsCSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsCHSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsKSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsLSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsR.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsSHSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsSSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsZHSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |
| `src/data/bingoWordsZSredinaKonec.ts` | 16 slik | `.webp` -> `1.webp` |

### Skupina 3: Sestavljanke in Igre ujemanja
| Datoteka | Število slik | Format |
|----------|-------------|--------|
| `src/data/puzzleImages.ts` | ~120 slik | `.webp` -> `1.webp` |
| `src/data/matchingGameData.ts` | ~130 slik | `.webp` -> `1.webp` |
| `src/data/threeColumnMatchingData.ts` | ~170 slik | `.webp` -> `1.webp` |

### Skupina 4: Met Kocke in Artikulacijski test
| Datoteka | Število slik | Format |
|----------|-------------|--------|
| `src/data/metKockeConfig.ts` | ~80 slik | `.webp` -> `1.webp` |
| `src/data/articulationTestData.ts` | 60 slik | `.webp` -> `1.webp` |

---

## Tehnična implementacija

### Pravilo za zamenjavo

Za vsako sliko v konfiguraciji:

```
STARO: beseda.webp  ali  beseda.png
NOVO:  beseda1.webp
```

### Izjeme (NE dodaj "1"):

Te slike ohranijo originalno ime:
- `nogometas.webp`
- `ptic.webp`
- `ribic.webp`
- `riz.webp`
- `rokometas.webp`
- `zmaj.webp`
- `zvezda.webp`
- Vse `Stickman_*.webp` slike
- `kokos_sadez1.webp` -> uporabi `kokos_sadez1.webp`
- `koza_skin1.webp` -> uporabi `koza_skin1.webp`

### Primer spremembe

```typescript
// PREJ (napačno)
{ word: "CVET", image: "cvet.webp", audio: "cvet.m4a" }

// PO (pravilno)
{ word: "CVET", image: "cvet1.webp", audio: "cvet.m4a" }
```

---

## Povzetek sprememb

| Tip spremembe | Število datotek | Število slik |
|---------------|-----------------|--------------|
| `.png` -> `1.webp` | 1 | ~200 |
| `.webp` -> `1.webp` | 16 | ~750 |
| **SKUPAJ** | **17 datotek** | **~950 preslikav** |

---

## Posledice popravka

Po tej spremembi bodo vse igre pravilno prikazovale slike:
- Kolo Sreče (Kolo Besed)
- Bingo
- Spomin
- Zaporedja
- Sestavljanke
- Drsna Sestavljanka
- Povezi Pare
- Igra Ujemanja
- Met Kocke (Smešne Povedi)
- Artikulacijski Test
- Labirint

---

## Opomba o Supabase tabelah

Igre **Spomin** in **Zaporedja** uporabljajo podatke iz Supabase tabel (`memory_cards_c`, `memory_cards_Č`, itd.). Te tabele bodo prav tako potrebovale posodobitev neposredno v Supabase, kar je ločen korak po popravku konfiguracijskih datotek.
