

## Plan: Dodaj F, G, H, V podatke v Igro ujemanja

### Problem
Igra ujemanja za glasove F, G, H, V prikazuje besede na črko C, ker v dveh datotekah manjkajo podatki in switch case-i.

### Popravki

**1. `src/data/matchingGameData.ts`**

Dodaj 4 nove `LetterData` vnose za F (13 besed), G (16), H (14), V (22). Format enak obstoječim (C, Č, K...). Vsi podatki iz `artikulacijaVajeConfig.ts`:

- Slike: `faraon.webp`, `fant1.webp`, `gasilec.webp`, `goba1.webp`, `harfa.webp`, `hisa1.webp`, `vafelj.webp`, `vaza1.webp` itd.
- Zvoki: `Faraon.mp3`, `Fant.mp3`, `Gasilec.mp3`, `Goba.mp3` itd.

**2. `src/data/threeColumnMatchingData.ts`**

- Dodaj 4 `threeColumnMatchingData` arraye (F, G, H, V) z vsemi besedami
- Sence sledijo vzorcu: slika `faraon.webp` → senca `faraon_senca.png`, slika `fant1.webp` → senca `fant1_senca.png`
- Dodaj 4 `fourColumnMatchingData` arraye (F, G, H, V) z `writtenWord` poljem
- Dodaj `case 'f':`, `case 'g':`, `case 'h':`, `case 'v':` v `getLetterMatchingData()` (vrstica 353)
- Dodaj `case 'f':`, `case 'g':`, `case 'h':`, `case 'v':` v `getFourColumnLetterData()` (vrstica 379)

### Vzorec poimenovanja senc (vse naložene v bucket `slike-sence`)

| Slika | Senca |
|-------|-------|
| `faraon.webp` | `faraon_senca.png` |
| `fant1.webp` | `fant1_senca.png` |
| `gasilec.webp` | `gasilec_senca.png` |
| `goba1.webp` | `goba1_senca.png` |
| `harfa.webp` | `harfa_senca.png` |
| `hisa1.webp` | `hisa1_senca.png` |
| `vafelj.webp` | `vafelj_senca.png` |
| `vaza1.webp` | `vaza1_senca.png` |
(... enako za vse ostale besede)

### Obseg
- 2 datoteki
- ~300 vrstic dodanih (podatki za 65 besed)
- Brez sprememb logike — samo manjkajoči podatki in switch case-i
- Vse slike, zvoki in sence že obstajajo v Supabase bucketih

