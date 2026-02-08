

# Popravek manjkajocih zvocnih posnetkov

## Pregled stanja

Vsi posnetki, ki jih navajam spodaj, OBSTAJAJO na Supabase (uporabnik jih je nalozil). Treba je samo popraviti kodo in bazo, da jih pravilno povezuje.

### Slike - stanje
| Slika | Se uporablja? | Komentar |
|-------|--------------|----------|
| kokos_sadez | Da | V matchingGameData, metKockeConfig, puzzleImages |
| miza | Da | V articulationTestData, bingoWordsZSredinaKonec, artikulacijaVajeConfig |
| piskot | Da | V bingoWordsKSredinaKonec, bingoWordsSHSredinaKonec, artikulacijaVajeConfig, metKockeConfig |
| moz | Ne | Nikjer v kodi |
| fant | Ne | Nikjer v kodi |

### Manjkajoci zvocni posnetki (NE obstajajo na Supabase)
- **miza.m4a** - koda ze navaja ta posnetek (v bingoWordsZSredinaKonec, artikulacijaVajeConfig), ampak datoteka ne obstaja na Supabase. Zvok ne bo deloval dokler ga ne nalozite.
- **piskot.m4a** - koda ze navaja ta posnetek (v bingoWordsKSredinaKonec, bingoWordsSHSredinaKonec, artikulacijaVajeConfig, metKockeConfig), ampak datoteka ne obstaja na Supabase. Zvok ne bo deloval dokler ga ne nalozite.

---

## Spremembe v kodi

### 1. Datoteka: `src/data/bingoWordsR.ts`
8 vnosov z `audio: null` zamenjam z ustreznimi imeni datotek:

| Vrstica | Beseda | Sprememba |
|---------|--------|-----------|
| 13 | DREVO | `null` -> `"drevo.m4a"` |
| 14 | HRUSKA | `null` -> `"hruska.m4a"` |
| 23 | OBRAZ | `null` -> `"obraz.m4a"` |
| 24 | OMARA | `null` -> `"omara.m4a"` |
| 30 | TORBA | `null` -> `"torba.m4a"` |
| 31 | TROBENTA | `null` -> `"trobenta.m4a"` |
| 32 | URA | `null` -> `"ura.m4a"` |
| 33 | VETRNICA | `null` -> `"veternica.m4a"` |

### 2. Datoteka: `src/data/artikulacijaVajeConfig.ts`
4 vnosi z `audio: null` v bloku `bingoDataRSredinaKonec`:

| Vrstica | Beseda | Sprememba |
|---------|--------|-----------|
| 249 | DREVO | `null` -> `"drevo.m4a"` |
| 250 | HRUSKA | `null` -> `"hruska.m4a"` |
| 259 | OBRAZ | `null` -> `"obraz.m4a"` |
| 260 | OMARA | `null` -> `"omara.m4a"` |

### 3. Datoteka: `src/data/matchingGameData.ts`
5 vnosov brez parametra `audio_url` - dodam ga:

| Vrstica | Beseda | Dodano |
|---------|--------|--------|
| 36 | CAROVNIK | `audio_url: .../carovnik.m4a` |
| 39 | CEBELAR | `audio_url: .../cebelar.m4a` |
| 90 | LISICA | `audio_url: .../lisica.m4a` |
| 95 | LOVEC | `audio_url: .../lovec.m4a` |
| 131 | SOFER | `audio_url: .../sofer.m4a` |

---

## Spremembe v Supabase bazi

22 vrstic v razlicnih tabelah ima `audio_url = NULL`. Za vse napisem SQL UPDATE stavke:

### Tabela `memory_cards_Č` (2 vrstici)
- CAROVNIK -> carovnik.m4a
- CEBELAR -> cebelar.m4a

### Tabela `memory_cards_K` (5 vrstic)
- KOLAC -> kolac.m4a
- KORUZA -> koruza.m4a
- KOZA (skin) -> koza_skin.m4a
- KOZAREC -> kozarec.m4a
- KROZNIK -> kroznik.m4a

### Tabela `memory_cards_l` (6 vrstic)
- LASJE -> lasje.m4a
- LES -> les.m4a
- LESNIK -> lesnik.m4a
- LISICA -> lisica.m4a
- LOVEC -> lovec.m4a
- LUZA -> luza.m4a

### Tabela `memory_cards_r` (5 vrstic)
- Ribez -> ribez.m4a
- Ribic -> ribic.m4a
- Ris -> ris.m4a
- Riz -> riz.m4a
- Rokometas -> rokometas.m4a

### Tabela `memory_cards_S` (2 vrstici)
- SLUZ -> sluz.m4a
- SNEZINKA -> snezinka.m4a

### Tabela `memory_cards_Š_duplicate` (1 vrstica)
- SOFER -> sofer.m4a

### Tabela `memory_cards_z` (1 vrstica)
- ZVEZEK -> zvezek.m4a

---

## Kaj se NE spreminja
- Nobena druga datoteka razen zgornjih treh
- Nobena logika predvajanja zvoka (ta ze deluje pravilno)
- Slike (vse so ze pravilno povezane)

## Opomba za uporabnika
Na Supabase morate se naloziti 2 zvocna posnetka, da bodo VSE besede imele zvok:
- **miza.m4a**
- **piskot.m4a**

Koda ze navaja ta dva posnetka, torej ko ju nalozite, bo vse takoj delovalo brez dodatnih sprememb v kodi.
