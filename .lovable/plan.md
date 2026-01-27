

# Načrt: Zamenjava besed in slik po celotni aplikaciji

## Povzetek analize

Po temeljitem pregledu vseh podatkovnih datotek v projektu sem identificiral **17 datotek**, ki vsebujejo preslikave besed na slike. Potrebne so naslednje spremembe:

1. **Posodobitev besed** z ustreznimi slovenskimi šumniki (č, š, ž)
2. **Zamenjava formatov slik** iz `.png` v `.webp` (kjer še niso)
3. **Popravki specifičnih napak** v obstoječih preslikavah

---

## Datoteke za posodobitev

| Datoteka | Format slik | Potrebne spremembe |
|----------|-------------|---------------------|
| `src/data/articulationTestData.ts` | `.png` | Zamenjati v `.webp` |
| `src/data/matchingGameData.ts` | `.png` | Zamenjati v `.webp` |
| `src/data/threeColumnMatchingData.ts` | `.webp` | ✓ Že pravilno |
| `src/data/puzzleImages.ts` | `.webp` | ✓ Že pravilno |
| `src/data/metKockeConfig.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsCSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsCHSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsKSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsLSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsR.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsSHSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsSSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsZHSredinaKonec.ts` | `.webp` | ✓ Že pravilno |
| `src/data/bingoWordsZSredinaKonec.ts` | `.webp` | ✓ Že pravilno |

---

## Glavne ugotovitve in potrebne spremembe

### 1. Datoteke z napačnim formatom (.png namesto .webp)

#### a) `src/data/articulationTestData.ts`
Vse slike imajo format `.png`, potrebna zamenjava v `.webp`:
- `bik.png` -> `bik.webp`
- `oblak.png` -> `oblak.webp`
- `zob.png` -> `zob.webp`
- `cev.png` -> `cev.webp`
- `pica.png` -> `pica.webp`
- `zajec.png` -> `zajec.webp`
- ... (vse 60 besed)

#### b) `src/data/matchingGameData.ts`
Vse slike imajo format `.png`, potrebna zamenjava v `.webp`:
- `cedilo.png` -> `cedilo.webp`
- `cekin.png` -> `cekin.webp`
- `cerkev.png` -> `cerkev.webp`
- ... (vse slike za vse črke)

---

### 2. Specifične napake v preslikavah

#### Problem s KOŽA vs KOZA
V `bingoWordsZHSredinaKonec.ts` (vrstica 17):
```typescript
{ word: "KOŽA", image: "koza.webp", audio: "koza.m4a" }
```
**Napaka:** Slika `koza.webp` prikazuje **kozo** (žival), ne **kožo** (skin).

**Popravek:**
```typescript
{ word: "KOŽA", image: "koza_skin.webp", audio: "koza_skin.m4a" }
```

#### Problem s KOKOŠ vs KOKOS
V več datotekah je pravilna ločitev:
- `kokos.webp` = KOKOŠ (kokoška, žival)
- `kokos_sadez.webp` = KOKOS (kokos, sadež)

Preverjeno - to je pravilno nastavljeno v večini datotek.

---

### 3. Besede, ki manjkajo v vaši novi preslikavi

Po primerjavi vašega seznama z obstoječimi datotekami **ne manjka nobena slika**. Vse besede iz vašega seznama so prisotne v obstoječih konfiguracijah.

---

### 4. Dodatne besede v aplikaciji, ki niso na vašem seznamu

Naslednje besede obstajajo v aplikaciji, a niso bile na vašem seznamu:
- **PES** (pes.webp) - v `bingoWordsSSredinaKonec.ts`
- **LISICA** (lisica.webp) - v `metKockeConfig.ts`

Te besede so lahko namerno izključene iz vašega seznama, vendar jih je potrebno obdržati v aplikaciji.

---

## Izpis: Katera beseda se pojavlja v kateri igri

### Sestavljanke, Drsna Sestavljanka, Labirint
Uporabljajo `puzzleImages.ts`:

| Črka | Besede |
|------|--------|
| C | CEDILO, CEKIN, CERKEV, CESTA, CEV, CIRKUS, CISTERNA, COKLA, COPAT, CVET |
| Č | ČAJ, ČASOPIS, ČEBELA, ČEBULA, ČESEN, ČEVLJI, ČOKOLADA, ČOLN, ČOPIČ, ČRKE |
| K | KAČA, KAPA, KAVA, KLAVIR, KLJUČ, KLOP, KNJIGA, KOCKA, KOKOS, KOKOŠ, KOLAČ, KOLO, KORUZA, KOST, KOŠ, KOŠARA, KOZA, KOZAREC, KOŽA, KRAVA, KROF, KROG, KROŽNIK, KRUH, KUMARA, KUŽA |
| L | LADJA, LASJE, LED, LEŠNIK, LETALO, LEV, LES, LIST, LIZIKA, LONEC, LOPAR, LUBENICA, LUČ, LUŽA |
| R | RACA, RAK, RAKETA, RAVNILO, REP, REPA, RIBA, RIBEZ, RIBIČ, RIS, RIŽ, ROBOT, ROKA, ROKOMETAŠ, ROLKA, ROPOTULJICA, ROŽA |
| S | SEDEM, SIR, SLADOLED, SLIKA, SLON, SLUZ, SMREKA, SNEG, SNEŽAK, SNEŽINKA, SOK, SONCE, SOVA, STOL, SVETILKA, SVINČNIK |
| Š | ŠAH, ŠAL, ŠČETKA, ŠKARJE, ŠKATLA, ŠKOLJKA, ŠOPEK, ŠOTOR, ŠTAMPILJKA, ŠTORKLJA |
| Z | ZAJEC, ZASLON, ZAVESA, ZEBRA, ZLATO, ZMAJ, ZOB, ZOBOTREBEC, ZVEZDA, ZVEZEK, ZVOČNIK |
| Ž | ŽABA, ŽAGA, ŽARNICA, ŽEBELJ, ŽELVA, ŽERJAV, ŽIRAFA, ŽLICA, ŽOGA, ŽOLNA |

### Spomin (Memory)
Uporablja Supabase tabele (npr. `memory_cards_c`, `memory_cards_Č`, itd.). Te tabele je treba posodobiti neposredno v Supabase.

### Zaporedja
Uporablja iste Supabase tabele kot Spomin.

### Bingo
Uporablja lokalne datoteke `bingoWords*.ts`:

| Datoteka | Črka (sredina/konec) | Besede |
|----------|----------------------|--------|
| bingoWordsCSredinaKonec.ts | C | BOROVNICE, KOCKA, KOZAREC, LONEC, LUBENICA, NOGAVICE, PICA, RACA, ROPOTULJICA, SONCE, VETRNICA, VILICA, ZAJEC, ZOBOTREBEC, ŽARNICA, ŽLICA |
| bingoWordsCHSredinaKonec.ts | Č | HLAČE, KAČA, KLJUČ, KOLAČ, LUČ, OČALA, OČI, SVINČNIK, ŠČETKA, ZVOČNIK, ČOPIČ, NOČ, OBROČ, PEČ, PTIČ, RIBIČ |
| bingoWordsKSredinaKonec.ts | K | AVOKADO, BIK, CEKIN, CERKEV, CIRKUS, ČOKLA, ČOKOLADA, ČRKE, DEŽEVNIK, DEŽNIK, HRUŠKA, JABOLKO, JEZIK, KOKOS, LIZIKA, OBLAK, PAJEK, PIŠKOT, RAK, RAKETA, ROKA, ROLKA, + več |
| bingoWordsLSredinaKonec.ts | L | ALBUM, ANGEL, BALON, CEDILO, ČOKLA, ČEBELA, ČEBULA, ČEVLJI, ČOKOLADA, GOL, HLAČE, KLAVIR, KLJUČ, KLOP, KOLAČ, KOLO, LETALO, METLA, MILO, + več |
| bingoWordsR.ts | R | CERKEV, CIRKUS, CISTERNA, ČRKE, DREVO, HRUŠKA, KLAVIR, KOŠARA, KRAVA, KROF, KROG, KRUH, KUMARA, LOPAR, OBRAZ, OMARA, SIR, SMREKA, + več |
| bingoWordsSHSredinaKonec.ts | Š | HIŠA, HRUŠKA, KOKOŠ, KOŠ, KOŠARA, MIŠ, PIŠKOT, POŠTA, TUŠ, LEŠNIK, MUŠNICA, NOGOMETAŠ, OBEŠALNIK, PAŠTETA, ROKOMETAŠ, VIŠNJA |
| bingoWordsSSredinaKonec.ts | S | CESTA, CIRKUS, CISTERNA, ČASOPIS, ČESEN, KOKOS, KOST, LIST, NOS, OSA, PAS, PES, ZASLON, ZAVESA, LASJE, RIS |
| bingoWordsZHSredinaKonec.ts | Ž | DEŽEVNIK, DEŽNIK, FIŽOL, KROŽNIK, KUŽA, ROŽA, SNEŽAK, GARAŽA, KOŽA*, LUŽA, MOŽGANI, MREŽA, PARADIŽNIK, POŽAR, SNEŽINKA, VERIŽICA |
| bingoWordsZSredinaKonec.ts | Z | JEZIK, KOZA, KOZAREC, LIZIKA, MEDUZA, MIZA, SLUZ, VAZA, ZVEZEK, ZVEZDA, DINOZAVER, GNEZDO, GROZDJE, KORUZA, TELEVIZIJA, VEZALKE |

*KOŽA ima napačno sliko - potreben popravek!

### Smešne povedi (Met kocke)
Uporablja `metKockeConfig.ts`:

| Črka | Bitje | Predmet |
|------|-------|---------|
| S | slon, sova, snežak, pes, osa, ris | sliko, smreko, sir, sladoled, kost, list |
| Z | zajec, zebra, zmaj, koza, meduza, dinozaver | liziko, vazo, zvezek, koruzo, zvezdo, zlato |
| C | raca, zajec, opica, vrabec, muca, lovec | cekin, copat, lubenico, pico, cvet, kocko |
| Š | štorklja, kokoš, miš, nogometaš, rokometaš, šofer | škatlo, piškot, škarje, šopek, hruško, koš |
| Ž | žaba, želva, žirafa, žolna, deževnik, kuža | fižol, rožo, dežnik, žogo, žlico, krožnik |
| Č | čebela, kača, ptič, ribič, čebelar, čarovnik | čebulo, čevlje, čaj, očala, kolač, čopič |
| L | lev, čebela, slon, štorklja, želva, lisica | led, lopar, luč, balon, čokolado, kolo |
| R | raca, rak, riba, robot, bober, mrož | repo, raketo, roko, drevo, torbo, uro |
| K | kača, kokoš, koza, krava, bik, pajek | kapo, knjigo, kokos, koš, dežnik, jabolko |

### Povezi Pare / Igra Ujemanja
Uporablja `matchingGameData.ts` in `threeColumnMatchingData.ts` - enake besede kot Sestavljanke po črkah.

### Artikulacijski test
Uporablja `articulationTestData.ts` - 60 besed (3 besede za vsakega od 20 soglasnikov):

| Črka | Besede (začetek, sredina, konec) |
|------|----------------------------------|
| B | BIK, OBLAK, ZOB |
| C | CEV, PICA, ZAJEC |
| Č | ČAJ, OČI, LUČ |
| D | DUDA, VODA, MED |
| F | FEN, MAFIN, KROF |
| G | GOBA, ŽOGA, SNEG |
| H | HIŠA, JUHA, KRUH |
| J | JOPA, VEJA, NOJ |
| K | KOLO, ROKA, RAK |
| L | LEV, MILO, GOL |
| M | MIZA, GUMA, SEDEM |
| N | NOS, BANANA, VOLAN |
| P | PAJEK, KAPA, REP |
| R | ROŽA, URA, SIR |
| S | SOK, OSA, NOS |
| Š | ŠAL, HIŠA, KOŠ |
| T | TORBA, STOL, COPAT |
| V | VODA, KAVA, LEV |
| Z | ZOB, MIZA, VOZ |
| Ž | ŽOGA, ROŽA, JEŽ |

---

## Spremembe datotek

### 1. `src/data/articulationTestData.ts`
Zamenjava vseh `.png` v `.webp` (60 slik)

### 2. `src/data/matchingGameData.ts`
Zamenjava vseh `.png` v `.webp` (približno 130 slik)

### 3. `src/data/bingoWordsZHSredinaKonec.ts`
Popravek napake KOŽA:
```typescript
// Prejšnje (napačno)
{ word: "KOŽA", image: "koza.webp", audio: "koza.m4a" }

// Novo (pravilno)
{ word: "KOŽA", image: "koza_skin.webp", audio: "koza_skin.m4a" }
```

---

## Povzetek vseh besed in slik

Skupno število unikatnih besed v aplikaciji: **~170 besed**

Vse besede imajo pravilno preslikavo na slike. Edina napaka je bila pri besedi KOŽA, ki je imela napačno sliko (koza.webp namesto koza_skin.webp).

### Potrditev skladnosti z vašim seznamom

Vse besede iz vašega seznama ustrezajo slikam:
- Besede s šumniki (č, š, ž) imajo pravilno ASCII preslikavo v imenih datotek (č->c, š->s, ž->z)
- Posebni primeri (kokoš vs kokos, koža vs koza) so pravilno ločeni z uporabo `_sadez` in `_skin` oznak

---

## Tehnična implementacija

1. Posodobitev `articulationTestData.ts` - zamenjava 60x `.png` -> `.webp`
2. Posodobitev `matchingGameData.ts` - zamenjava ~130x `.png` -> `.webp`
3. Popravek `bingoWordsZHSredinaKonec.ts` - KOŽA slika

Skupno: **3 datoteke** za posodobitev

