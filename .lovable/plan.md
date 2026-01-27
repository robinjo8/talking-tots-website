
# Načrt: Vključitev vseh slik v vse igre

## Pregled problema

Po temeljiti analizi sem odkril naslednje težave:

### 1. Supabase tabele za Spomin/Zaporedja imajo premalo slik

| Tabela | Trenutno | Zahtevano |
|--------|----------|-----------|
| memory_cards_c | 10 slik | 10 slik (OK) |
| memory_cards_Č | 10 slik | 12 slik (manjka: čarovnik, čebelar) |
| memory_cards_K | 10 slik | 26 slik (manjka 16) |
| memory_cards_l | 10 slik | 16 slik (manjka: lisica, lovec, les, lesnik, lasje, luža) |
| memory_cards_r | 17 slik | 17 slik (OK) |
| memory_cards_S | 10 slik | 16 slik (manjka: sedem, sir, sluz, snežinka, sova, svinčnik) |
| memory_cards_Š | 10 slik | 11 slik (manjka: šofer) |
| memory_cards_z | 10 slik | 11 slik (manjka: zvezek) |
| memory_cards_Ž | 10 slik | 10 slik (OK) |

### 2. Hook za Spomin ima omejitev `.limit(10)`

Trenutna logika v `useGenericMemoryGame.tsx`:
```typescript
// Trenutno (napačno)
.limit(10)  // Vedno vrne prvih 10 slik
```

Igra potrebuje nalaganje VSEH slik iz tabele, nato naključno izbiro 10 za igro.

### 3. Manjkajoče slike v konfiguracijskih datotekah

Nekatere slike manjkajo v lokalnih konfiguracijah:

**matchingGameData.ts** (Povezi Pare):
- Črka L: manjkata `lisica1.webp` in `lovec1.webp`
- Črka Č: manjkata `carovnik1.webp` in `cebelar1.webp`
- Črka Š: manjka `sofer1.webp`

**threeColumnMatchingData.ts**:
- Podobne manjkajoče slike za L, Č, Š

**puzzleImages.ts** (Sestavljanke):
- Črka L: manjkata `lisica1.webp` in `lovec1.webp`
- Črka Č: manjkata `carovnik1.webp` in `cebelar1.webp`

---

## Rešitev

### Del 1: Posodobitev Supabase tabel

Dodati manjkajoče slike v tabele `memory_cards_*`:

**Tabela memory_cards_Č** - dodati 2 sliki:
```sql
INSERT INTO "memory_cards_Č" (word, image_url, audio_url) VALUES
('ČAROVNIK', 'https://...slike/carovnik1.webp', NULL),
('ČEBELAR', 'https://...slike/cebelar1.webp', NULL);
```

**Tabela memory_cards_K** - dodati 16 slik:
```sql
INSERT INTO "memory_cards_K" (word, image_url, audio_url) VALUES
('KAČA', 'https://...slike/kaca1.webp', '...kaca.m4a'),
('KAVA', 'https://...slike/kava1.webp', '...kava.m4a'),
-- ... ostale manjkajoče K slike
```

**Podobno za tabele L, S, Š, Z.**

### Del 2: Sprememba logike v useGenericMemoryGame.tsx

Namesto `.limit(10)` naložiti VSE slike, nato naključno izbrati 10:

```typescript
// NOVO (pravilno)
const { data, error } = await supabase
  .from(config.tableName as any)
  .select("*");
// Brez .limit() - naloži vse slike

// Nato v initializeGame():
const shuffled = shuffleArray([...cardData]);
const selected10 = shuffled.slice(0, 10); // Naključnih 10
```

### Del 3: Posodobitev lokalnih konfiguracij

Dodati manjkajoče slike v:
- `matchingGameData.ts` (za Povezi Pare)
- `threeColumnMatchingData.ts` (za Povezi Pare 5-6, 7-8)
- `puzzleImages.ts` (za Sestavljanke)

---

## Povzetek sprememb

| Komponenta | Vrsta spremembe | Število |
|------------|-----------------|---------|
| Supabase tabele | SQL INSERT | ~45 novih vrstic |
| useGenericMemoryGame.tsx | Odstranitev .limit(10), naključna izbira | 1 datoteka |
| matchingGameData.ts | Dodane manjkajoče slike | ~15 novih vnosov |
| threeColumnMatchingData.ts | Dodane manjkajoče slike | ~15 novih vnosov |
| puzzleImages.ts | Dodane manjkajoče slike | ~10 novih vnosov |

---

## Seznam vseh slik po črkah (za referenco)

### C (10 slik) - KOMPLETNO
cedilo, cekin, cerkev, cesta, cev, cirkus, cisterna, cokla, copat, cvet

### Č (12 slik) - MANJKATA 2
čaj, čarovnik, časopis, čebela, **čebelar**, čebula, česen, čevlji, čokolada, čoln, čopič, črke

### K (26 slik) - MANJKA 16
kača, kapa, kava, klavir, ključ, klop, knjiga, kocka, **kokos (sadež)**, kokoš, kolač, kolo, koruza, koš, košara, kost, **koza**, **koža**, kozarec, krava, krof, krog, krožnik, kruh, kumara, kuža

### L (16 slik) - MANJKA 6
ladja, lasje, led, les, lešnik, letalo, lev, **lisica**, list, lizika, lonec, lopar, **lovec**, lubenica, luč, luža

### R (17 slik) - KOMPLETNO
raca, rak, raketa, ravnilo, rep, repa, riba, ribez, ribič, ris, riž, robot, roka, rokometaš, rolka, ropotuljica, roža

### S (16 slik) - MANJKA 6
sedem, sir, sladoled, slika, slon, sluz, smreka, sneg, snežak, **snežinka**, sok, sonce, **sova**, stol, svetilka, svinčnik

### Š (11 slik) - MANJKA 1
šah, šal, ščetka, škarje, škatla, školjka, **šofer**, šopek, šotor, štampiljka, štorklja

### Z (11 slik) - MANJKA 1
zajec, zaslon, zavesa, zebra, zlato, zmaj, zob, zobotrebec, zvezda, **zvezek**, zvočnik

### Ž (10 slik) - KOMPLETNO
žaba, žaga, žarnica, žebelj, želva, žerjav, žirafa, žlica, žoga, žolna

---

## Opomba o igri Bingo

Igra Bingo uporablja **posebne slike** za besede na sredini/koncu (npr. `borovnice`, `hlače`, `pica`) in NI del tega popravka - to ostane nespremenjeno, kot zahtevano.

---

## Tehnični koraki implementacije

1. **SQL migracija** za dodajanje manjkajočih slik v Supabase tabele
2. **useGenericMemoryGame.tsx** - odstranitev `.limit(10)`, dodajanje naključne izbire 10 slik
3. **matchingGameData.ts** - dodajanje manjkajočih slik za vsako črko
4. **threeColumnMatchingData.ts** - dodajanje manjkajočih slik
5. **puzzleImages.ts** - dodajanje manjkajočih slik

Po teh spremembah bodo vse igre (razen Bingo) uporabljale celoten nabor slik, Spomin pa bo pri vsaki igri naključno izbral 10 parov izmed vseh razpoložljivih.
