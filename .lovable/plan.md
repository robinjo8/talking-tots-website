

## Dodajanje "GLAS R - začetne vaje" za vseh 11 iger

### Pregled

Za vseh 11 iger na strani `/govorne-igre` se doda nova kartica "Glas R - začetne vaje" z URL kljucem `r-zacetek`. Vsaka igra bo uporabljala istih 18 besed s soglasniškimi skupinami (TR, BR, DR, PR):

**Besede:** DREVO, TROBENTA, TRI, TRIKOTNIK, TRAVA, TRAK, BRISAČA, BRIKETI, BRESKEV, BRADA, BROKOLI, BRUSNICE, BREZA, DRES, DRAGULJ, DRON, PRINC, PRESTA

**Slike:** `[beseda]1.webp` v bucketu `slike`
**Zvoki:** `[beseda].m4a` v bucketu `zvocni-posnetki`

---

### Tehnicni nacrt sprememb

#### 1. Podatkovne datoteke (config)

**`src/data/puzzleImages.ts`** -- nova `rZacetekImages: PuzzleImage[]` z 18 besedami (za Labirint, Drsno sestavljanko, Sestavljanke)

**`src/data/artikulacijaVajeConfig.ts`** -- dodaj:
- `wordsDataRZacetek: WordData[]` (18 besed za Kolo besed)
- `bingoDataRZacetek: BingoWordData[]` (18 besed za Bingo)
- V `artikulacijaConfigs` dodaj kluca `'r-zacetek'` (wheel) in `'r-zacetek-zacetek'` (bingo)
- Posodobi `getWheelConfig()` in `getBingoConfig()` da prepoznata `r-zacetek` brez dodajanja `-sredina-konec` sufiksa (poseben primer)

**`src/data/labirintConfig.ts`** -- dodaj nov config za `r-zacetek` z `rZacetekImages`

**`src/data/drsnaSestavljankaConfig.ts`** -- dodaj `{ letter: 'R-zacetek', urlKey: 'r-zacetek', images: rZacetekImages }` v `letterConfigs`

**`src/data/sestavljankeGameConfig.ts`** -- enako kot zgoraj

**`src/data/igraUjemanjaConfig.ts`** -- dodaj `r-zacetek` v `letterConfigs`

**`src/data/zaporedjaConfig.ts`** -- dodaj `r-zacetek` v `letterConfigs` s `tableName: 'memory_cards_r_zacetek'`

**`src/data/spominConfig.ts`** -- dodaj vnos `'r-zacetek'` s `tableName: 'memory_cards_r_zacetek'`

**`src/data/kaceLestveConfig.ts`** -- dodaj `KACE_WORDS_R_ZACETEK: KaceLestveWord[]` z 18 besedami in `acceptedVariants`. Posodobi `getRandomWord()` da sprejme parameter za izbiro nabora besed.

**`src/data/metKockeConfig.ts`** -- dodaj `metKockeRZacetek: MetKockeLetterConfig` s 6 bitji, povedki in predmeti iz nabora 18 besed. Dodaj v `metKockeConfigs` in `metKockeLetters`.

**`src/data/ponoviPovedConfig.ts`** -- dodaj `ponoviPovedRZacetek: PonoviPovedConfig` s 4 povedmi (3 besede vsaka) iz nabora 18 besed. Dodaj v `configMap`.

#### 2. Supabase migracija

Ustvari tabelo `memory_cards_r_zacetek` z 18 vrsticami (za Spomin in Zaporedja):
```text
CREATE TABLE memory_cards_r_zacetek (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: public read
-- INSERT 18 vrstic
```

#### 3. Strani za izbiro crk (letter selection pages) -- dodaj kartico

Vseh 11 strani dobi novo kartico "Glas R - začetne vaje":

| Stran | Datoteka | URL igre |
|-------|----------|----------|
| Kolo besed | `src/pages/KoloSreceGames.tsx` | `/govorne-igre/kolo-srece/r-zacetek` |
| Igra ujemanja | `src/pages/IgraUjemanja.tsx` | `/govorne-igre/igra-ujemanja/r-zacetek` |
| Zaporedja | `src/pages/Zaporedja.tsx` | `/govorne-igre/zaporedja/r-zacetek[age]` |
| Spomin | `src/pages/SpominGames.tsx` | `/govorne-igre/spomin/spomin-r-zacetek` |
| Drsna igra | `src/pages/DrsnaSestavljanka.tsx` | `/govorne-igre/drsna-sestavljanka/r-zacetek[age]` |
| Labirint | `src/pages/Labirint.tsx` | `/govorne-igre/labirint/r-zacetek` |
| Sestavljanke | `src/pages/SestavljankeGames.tsx` | `/govorne-igre/sestavljanke/r-zacetek[age]` |
| Zabavna pot | `src/pages/KaceLestveGames.tsx` | `/govorne-igre/kace/r-zacetek` |
| Bingo | `src/pages/BingoGames.tsx` | `/govorne-igre/bingo/r-zacetek` |
| Ponovi poved | `src/pages/PonoviPoved.tsx` | `/govorne-igre/ponovi-poved/r-zacetek` |
| Smesne povedi | `src/pages/MetKockeGames.tsx` | `/govorne-igre/met-kocke/r-zacetek` |

Kartica bo imela:
- Naslov: "Glas R - začetne vaje"
- Slika: `zmajcek_crka_R.png` (ista kot za Glas R)
- Gradient: `from-app-purple/20 to-app-teal/20` (enak kot R)
- Opis: prilagojen za vsako igro

#### 4. Routerji

Obstojecih routerjev ni treba spreminajti -- ze uporabljajo `:letter` dinamicni parameter in konfiguracije se resolvirajo po kljucu. Edini popravki:

- `getBingoConfig()` v `artikulacijaVajeConfig.ts` -- mora prepoznati `r-zacetek` kot poseben primer (ne dodaja `-sredina-konec`)
- `KaceLestveRouter.tsx` -- trenutno trdo preverja `letter !== "c"`, to je treba razsiriti na `["c", "s", "z", "r-zacetek"]` (oz. dinamicno preverjanje)
- URL regex vzorci v `parseUrlParam` funkcijah morajo podpirati `r-zacetek` (trenutno ujemajo samo `[a-z]{1,2}`)

#### 5. Admin portal

Vseh 11 admin strani dobi novo kartico:

| Datoteka | Nova kartica |
|----------|-------------|
| `src/pages/admin/games/AdminKoloSreceGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminIgraUjemanjaGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminZaporedjaGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminSpominGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminLabirintGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminSestavljankeGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminKaceLestveGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminBingoGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminPonoviPovedGames.tsx` | r-zacetek |
| `src/pages/admin/games/AdminMetKockeGames.tsx` | r-zacetek |

#### 6. Popravki URL parsiranja

Funkcije `parseUrlParam`, `parseZaporedjaUrlParam`, `parseDrsnaSestavljankaUrlParam`, `parseIgraUjemanjaUrlParam` trenutno uporabljajo regex `^([a-z]{1,2})(34|56|78|910)?$`. To ne ujema `r-zacetek`. Posodobim regex na `^([a-z]{1,2}(?:-zacetek)?)(34|56|78|910)?$`.

Enako za `getConfigKey()` v artikulacijaVajeConfig -- mora prepustiti `r-zacetek` brez transformacije.

---

### Vrstni red implementacije

1. Supabase migracija -- ustvari tabelo `memory_cards_r_zacetek`
2. Podatkovne datoteke -- vseh 10 config datotek + puzzleImages
3. Routerji -- popravki parsiranja URL
4. Strani za uporabnike -- 11 letter selection pages
5. Admin strani -- 11 admin game pages

### Skupaj: ~25 datotek + 1 DB migracija

