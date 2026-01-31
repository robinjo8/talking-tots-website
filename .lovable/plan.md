

# Plan: Popravek zvočnih posnetkov za igro Spomin

## Analiza problema

Po pregledu baze podatkov sem odkril, da **49 besed** v tabelah memory_cards nima nastavljenih zvočnih posnetkov (audio_url). Koda za predvajanje zvoka je pravilna, težava je v podatkih.

## Stanje tabel memory_cards

| Tabela | Besede brez zvoka |
|--------|------------------|
| memory_cards_c | 0 |
| memory_cards_Č | 2 (ČAROVNIK, ČEBELAR) |
| memory_cards_K | 16 (KAČA, KAVA, KLJUČ, KLOP, KOKOŠ, KOLAČ, KORUZA, KOŠ, KOST, KOZA, KOŽA, KOZAREC, KRAVA, KROF, KROG, KROŽNIK) |
| memory_cards_l | 6 (LASJE, LES, LEŠNIK, LISICA, LOVEC, LUŽA) |
| memory_cards_r | 17 (VSE besede nimajo zvoka!) |
| memory_cards_S | 6 (SEDEM, SIR, SLUZ, SNEG, SNEŽINKA, SOK) |
| memory_cards_Š_duplicate | 1 (ŠOFER) |
| memory_cards_z | 1 (ZVEZEK - ima napačen zvok test.m4a) |
| memory_cards_Ž | 0 |

## Dodatne težave
- ZVOČNIK v tabeli memory_cards_z ima napačen bucket: `memory-game-voices/test.m4a` namesto `zvocni-posnetki/zvocnik.m4a`

## Rešitev

Izvesti SQL UPDATE poizvedbe za vse tabele, ki nimajo pravilnih audio_url vrednosti. Zvočni posnetki so v bucketu `zvocni-posnetki` s formatom `{beseda}.m4a`, kjer so šumniki (č, š, ž) pretvorjeni v ASCII (c, s, z).

## SQL ukazi za popravek

### 1. Tabela memory_cards_r (17 besed)

```sql
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/raca.m4a' WHERE word = 'Raca';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/rak.m4a' WHERE word = 'Rak';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/raketa.m4a' WHERE word = 'Raketa';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/ravnilo.m4a' WHERE word = 'Ravnilo';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/rep.m4a' WHERE word = 'Rep';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/repa.m4a' WHERE word = 'Repa';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/riba.m4a' WHERE word = 'Riba';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/robot.m4a' WHERE word = 'Robot';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/roka.m4a' WHERE word = 'Roka';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/rolka.m4a' WHERE word = 'Rolka';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/ropotuljica.m4a' WHERE word = 'Ropotuljica';
UPDATE memory_cards_r SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/roza.m4a' WHERE word = 'Roža';
```

**Opomba:** Besede Ribez, Ribič, Ris, Riž, Rokometaš niso na uporabnikovem seznamu in nimajo zvočnih posnetkov v bucketu.

### 2. Tabela memory_cards_K (10 besed s seznama)

```sql
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kaca.m4a' WHERE word = 'KAČA';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kava.m4a' WHERE word = 'KAVA';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kljuc.m4a' WHERE word = 'KLJUČ';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/klop.m4a' WHERE word = 'KLOP';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kokos_1.m4a' WHERE word = 'KOKOŠ';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kost.m4a' WHERE word = 'KOŠ';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kosara.m4a' WHERE word = 'KOST';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/koza.m4a' WHERE word = 'KOZA';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/krava.m4a' WHERE word = 'KRAVA';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/krof.m4a' WHERE word = 'KROF';
UPDATE "memory_cards_K" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/krog.m4a' WHERE word = 'KROG';
```

**Opomba:** Besede KOLAČ, KORUZA, KOŽA, KOZAREC, KROŽNIK niso na uporabnikovem seznamu.

### 3. Tabela memory_cards_l (4 besede s seznama - Ladja je že pravilna)

```sql
-- Besede LASJE, LES, LEŠNIK, LISICA, LOVEC, LUŽA niso na uporabnikovem seznamu
-- Vse besede na seznamu (Ladja, Led, Letalo, Lev, List, Lizika, Lonec, Lopar, Lubenica, Luč) že imajo pravilne audio_url
```

### 4. Tabela memory_cards_S (3 besede s seznama)

```sql
UPDATE "memory_cards_S" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/sedem.m4a' WHERE word = 'SEDEM';
UPDATE "memory_cards_S" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/sir.m4a' WHERE word = 'SIR';
UPDATE "memory_cards_S" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/sneg.m4a' WHERE word = 'SNEG';
UPDATE "memory_cards_S" SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/sok.m4a' WHERE word = 'SOK';
```

**Opomba:** SLUZ in SNEŽINKA niso na seznamu.

### 5. Tabela memory_cards_z (popravek ZVOČNIK)

```sql
UPDATE memory_cards_z SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/zvocnik.m4a' WHERE word = 'ZVOČNIK';
```

### 6. Tabele Č in Š

Besede ČAROVNIK, ČEBELAR ter ŠOFER niso na uporabnikovem seznamu, zato jih ne posodabljam.

## Besede brez posnetkov na seznamu

Naslednje besede so na uporabnikovem seznamu, vendar nimajo zvočnih posnetkov v bucketu:
- Ribez, Ribič, Ris, Riž, Rokometaš (R)
- KOLAČ, KORUZA, KOŽA, KOZAREC, KROŽNIK (K)
- LASJE, LES, LEŠNIK, LISICA, LOVEC, LUŽA (L)
- SLUZ, SNEŽINKA (S)
- ČAROVNIK, ČEBELAR (Č)
- ŠOFER (Š)
- ZVEZEK (Z)

Te besede bodo brez zvoka, dokler se posnetki ne dodajo v bucket.

## Povzetek sprememb

| Tabela | Št. posodobitev |
|--------|----------------|
| memory_cards_r | 12 |
| memory_cards_K | 11 |
| memory_cards_S | 4 |
| memory_cards_z | 1 |
| **Skupaj** | **28 posodobitev** |

## Izvedba

Ker gre za posodobitve podatkov v bazi (ne za spremembe kode), bo potrebno izvesti SQL ukaze neposredno v Supabase Cloud View > Run SQL.

