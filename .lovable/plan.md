

# Uskladitev seznamov besed za vse igre na začetku

## Analiza problema

Igre, ki vadijo besede na **začetku**, uporabljajo 4 različne podatkovne vire. Ti viri niso usklajeni -- nekatere besede manjkajo v posameznih igrah:

### Podatkovni viri po igrah

| Igra | Podatkovni vir | Tip |
|------|----------------|-----|
| Kolo besed | `artikulacijaVajeConfig.ts` | Lokalni podatki |
| Igra ujemanja (3-4) | `matchingGameData.ts` | Lokalni podatki |
| Igra ujemanja (5-6) | `threeColumnMatchingData.ts` | Lokalni podatki |
| Igra ujemanja (7-8+) | `fourColumnMatchingData` (v istem) | Lokalni podatki |
| Drsna sestavljanka | `puzzleImages.ts` | Lokalni podatki |
| Sestavljanka | `puzzleImages.ts` | Lokalni podatki |
| Labirint | `puzzleImages.ts` (prek labirintConfig) | Lokalni podatki |
| Zaporedja | Supabase tabele (`memory_cards_*`) | Baza, `.limit(20)` |
| Spomin | Supabase tabele (`memory_cards_*`) | Baza, brez limita |

### Manjkajoce besede po datotekah

**1. `artikulacijaVajeConfig.ts` (Kolo besed) -- 20 besed manjka:**

| Crka | Manjkajoce besede |
|------|-------------------|
| K (ima 23, rabi 27) | KOKOS (sadez), KOS (ptica), KORUZA, KOZA |
| L (ima 10, rabi 17) | LES, LASJE, LESNIK, LUZA, LOS, LISICA, LOVEC |
| C (ima 10, rabi 12) | CEBELAR, CAROVNIK |
| S (ima 15, rabi 16) | SNEZINKA |
| S (ima 10, rabi 11) | SOFER |
| R (ima 12, rabi 17) | RIBEZ, RIZ, RIBIC, RIS, ROKOMETAS |

**2. `puzzleImages.ts` (Drsna sestavljanka, Sestavljanka, Labirint) -- 2 besedi manjkata:**
- K: KOS (ptica) -- `kos_ptica1.webp`
- L: LOS -- `los1.webp`

**3. `matchingGameData.ts` (Igra ujemanja 3-4) -- 2 besedi manjkata:**
- K: KOS (ptica)
- L: LOS

**4. `threeColumnMatchingData.ts` (Igra ujemanja 5-6) -- 2 besedi manjkata:**
- K: KOS (ptica)
- L: LOS

**5. `fourColumnMatchingData` (Igra ujemanja 7-8+) -- 5 besed manjka:**
- K: KOS (ptica)
- L: LOS, LISICA, LOVEC
- S: SOFER

**6. Zaporedja -- `.limit(20)` v kodi:**
- `SequenceGame56Base.tsx` in `SequenceGameBase.tsx` imata `.limit(20)`, kar pomeni, da se za crke z vec besedami (K=27, L=17, R=17) ne uporabljajo vse slike iz baze. Limit je treba odstraniti.

---

## Tehnicni koraki

### Korak 1: Posodobitev `artikulacijaVajeConfig.ts`
Dodati manjkajoce besede v `wordsData` sezname:
- `wordsDataCH`: +CEBELAR, +CAROVNIK
- `wordsDataK`: +KOKOS (kokos_sadez1.webp, Kokos_sadez.mp3), +KOS (kos_ptica1.webp, Kos_ptica.mp3), +KORUZA, +KOZA (koza_skin1.webp, Koza_cutilo.mp3)
- `wordsDataL`: +LES, +LASJE, +LESNIK, +LUZA, +LOS, +LISICA, +LOVEC
- `wordsDataR`: +RIBEZ, +RIZ, +RIBIC, +RIS, +ROKOMETAS
- `wordsDataS`: +SNEZINKA
- `wordsDataSH`: +SOFER

### Korak 2: Posodobitev `puzzleImages.ts`
- `kImages`: Dodati KOS (ptica) -- `{ filename: 'kos_ptica1.webp', word: 'KOS', audio: 'Kos_ptica.mp3' }`
- `lImages`: Dodati LOS -- `{ filename: 'los1.webp', word: 'LOS' }`

### Korak 3: Posodobitev `matchingGameData.ts`
- K seznam: Dodati KOS (ptica) z ustreznim audio/image URL
- L seznam: Dodati LOS z ustreznim audio/image URL

### Korak 4: Posodobitev `threeColumnMatchingData.ts`
- `threeColumnMatchingDataK`: Dodati KOS (ptica) z senca sliko
- `threeColumnMatchingDataL`: Dodati LOS z senca sliko
- `fourColumnMatchingDataK`: Dodati KOS (ptica)
- `fourColumnMatchingDataL`: Dodati LOS, LISICA, LOVEC
- `fourColumnMatchingDataS`: Dodati SOFER (Sah -> ze obstaja, samo SOFER manjka)

Opomba: `fourColumnMatchingDataS` je za crko S. SOFER spada pod S ali SH? SOFER = sofer = S? Ne, SOFER = SOFER zacne na S. Ampak SOFER je pod SH (crka S)... Pravzaprav SOFER je SOFER in zacne na S. SOFER kot beseda se pise SOFER, ampak prikazuje se kot SOFER kar je SLO za SOFER=voznik. Glas S je SOFER... ne, SOFER zacne na S ne na S. SOFER = sofer. Hmm, user navedel SOFER pod Š (Šofer). Torej gre za fourColumnMatchingDataŠ, ne S. Popravek: `fourColumnMatchingDataŠ` manjka ŠOFER.

### Korak 5: Odstranitev `.limit(20)` v Zaporedja igrah
- `SequenceGame56Base.tsx`: Odstraniti `.limit(20)` iz Supabase poizvedbe
- `SequenceGameBase.tsx`: Odstraniti `.limit(20)` iz Supabase poizvedbe

To zagotovi, da se vse slike iz baze uporabljajo (naključno izbrane med igro).

### Opomba glede Supabase tabel (Zaporedja + Spomin)
Igri Zaporedja in Spomin pridobivata slike iz Supabase tabel (npr. `memory_cards_K`, `memory_cards_l`). Ce v tabelah manjkajo nekatere besede, jih bo treba dodati neposredno v bazo. Koda sama bo po odstranitvi limita prikazovala vse, kar je v tabeli.

