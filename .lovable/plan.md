

# Načrt: Popravek slik za vse igre (končni popravek)

## Identificirana problema

### Problem 1: Supabase tabele za Spomin/Zaporedja uporabljajo NAPAČEN bucket in format

Tabele `memory_cards_*` vsebujejo **stare URL-je** z napačnim bucketom in formatom:

| Tabela | Trenutni URL primer | Pravilni URL |
|--------|---------------------|--------------|
| `memory_cards_c` | `.../slike/cedilo.png` | `.../slike/cedilo1.webp` |
| `memory_cards_r` | `.../zaporedja/r/raca.png` | `.../slike/raca1.webp` |

**To je glavni vzrok zakaj Spomin in Zaporedja ne prikazujeta slik!**

### Problem 2: Konfiguracijske datoteke še vedno uporabljajo stara imena za 7 izjem

Ker si dodal nove slike s sufiksom "1" za:
- `nogometas1.webp`
- `ptic1.webp`
- `ribic1.webp`
- `riz1.webp`
- `rokometas1.webp`
- `zmaj1.webp`
- `zvezda1.webp`

Je potrebno posodobiti konfiguracijske datoteke, ki še uporabljajo stara imena.

---

## Datoteke za posodobitev (lokalne konfiguracije)

| Datoteka | Slike za popravek |
|----------|-------------------|
| `src/data/artikulacijaVajeConfig.ts` | `ptic.webp`, `ribic.webp`, `nogometas.webp`, `rokometas.webp`, `zmaj.webp`, `zvezda.webp` |
| `src/data/metKockeConfig.ts` | `ptic.webp`, `ribic.webp`, `nogometas.webp`, `rokometas.webp`, `zmaj.webp`, `zvezda.webp` |
| `src/data/puzzleImages.ts` | `ribic.webp`, `riz.webp`, `rokometas.webp`, `zmaj.webp`, `zvezda.webp` |
| `src/data/matchingGameData.ts` | `ribic.webp`, `riz.webp`, `rokometas.webp`, `zmaj.webp`, `zvezda.webp` |
| `src/data/threeColumnMatchingData.ts` | `ribic.webp`, `riz.webp`, `rokometas.webp` |
| `src/data/bingoWordsSHSredinaKonec.ts` | `nogometas.webp`, `rokometas.webp` |

---

## Supabase tabele za posodobitev (Spomin in Zaporedja)

### 9 tabel za posodobitev:

1. `memory_cards_c`
2. `memory_cards_Č`
3. `memory_cards_K`
4. `memory_cards_l`
5. `memory_cards_r`
6. `memory_cards_S`
7. `memory_cards_Š_duplicate`
8. `memory_cards_z`
9. `memory_cards_Ž`

### Potrebna sprememba v vsaki tabeli:

Zamenjati `image_url` iz:
```
https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/beseda.png
```
ali
```
https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/beseda.png
```

V:
```
https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/beseda1.webp
```

---

## Povzetek vseh zamenjav za konfiguracijske datoteke

| Staro ime | Novo ime |
|-----------|----------|
| `ptic.webp` | `ptic1.webp` |
| `ribic.webp` | `ribic1.webp` |
| `riz.webp` | `riz1.webp` |
| `nogometas.webp` | `nogometas1.webp` |
| `rokometas.webp` | `rokometas1.webp` |
| `zmaj.webp` | `zmaj1.webp` |
| `zvezda.webp` | `zvezda1.webp` |

---

## Tehnični koraki

### Korak 1: Posodobitev lokalnih konfiguracijskih datotek

6 datotek z zamenjavami za 7 slik (ptic, ribic, riz, nogometas, rokometas, zmaj, zvezda).

### Korak 2: Posodobitev Supabase tabel

Za vsako od 9 tabel bom pripravil SQL UPDATE stavke, ki bodo:
1. Zamenjale bucket iz `zaporedja/*` v `slike`
2. Zamenjale format iz `.png` v `.webp`
3. Dodale sufiks `1` pred končnico

Primer SQL za tabelo `memory_cards_c`:
```sql
UPDATE memory_cards_c 
SET image_url = REPLACE(
  REPLACE(image_url, '.png', '1.webp'),
  '/slike/', '/slike/'
);
```

Za tabele kot `memory_cards_r` ki uporabljajo bucket `zaporedja`:
```sql
UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/' 
  || LOWER(word) || '1.webp';
```

---

## Vrstni red implementacije

1. Najprej popravim 6 lokalnih konfiguracijskih datotek
2. Nato posodobim 9 Supabase tabel z SQL UPDATE stavki

Po tej spremembi bodo delovale vse igre:
- Kolo Sreče (Kolo Besed)
- Bingo
- Spomin
- Zaporedja
- Sestavljanke
- Povezi Pare
- Met Kocke
- Artikulacijski Test

