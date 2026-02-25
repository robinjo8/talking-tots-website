

## Popravki za "Glas R - začetne vaje" -- slike in naslovi

### Problem 1: Slike v Spomin in Zaporedja ne delujejo

Tabela `memory_cards_r_zacetek` vsebuje **relativna imena datotek** (npr. `drevo1.webp`, `drevo.m4a`), medtem ko vse ostale tabele (npr. `memory_cards_r`) vsebujejo **polne URL-je** (npr. `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/drevo1.webp`).

**Popravek:** Supabase migracija, ki posodobi vseh 18 vrstic -- za `image_url` doda prefix `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/`, za `audio_url` pa `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/`.

### Problem 2: Napacni naslovi v igrah

Tri igre prikazujejo napacen naslov za r-zacetek:

| Igra | Trenutni naslov | Pravilen naslov |
|------|----------------|-----------------|
| Spomin | "Spomin - Glas R" | "Spomin - Glas R - začetne vaje" |
| Labirint | "LABIRINT - R" | "LABIRINT - R - začetne vaje" |
| Zaporedja | "ZAPOREDJA - R-zacetek" | "ZAPOREDJA - R - začetne vaje" |

Ostale igre (Bingo, Kolo besed, Smesne povedi) ze uporabljajo `{title}` iz konfiguracije, kjer je naslov pravilno nastavljen.

### Tehnicne spremembe

#### 1. Supabase migracija
Nova SQL migracija za popravek URL-jev:
```text
UPDATE memory_cards_r_zacetek
SET image_url = 'https://...supabase.co/.../slike/' || image_url,
    audio_url = 'https://...supabase.co/.../zvocni-posnetki/' || audio_url;
```

#### 2. SpominConfig -- dodaj displayName
**Datoteka:** `src/data/spominConfig.ts`

Dodaj opcijsko polje `displayName` v `SpominConfig` interface. Za `r-zacetek` nastavi `displayName: 'R - začetne vaje'`. Ostali vnosi ga nimajo in se uporabi privzeti `displayLetter`.

#### 3. GenericSpominGame.tsx -- uporabi displayName
**Datoteka:** `src/components/games/GenericSpominGame.tsx` (vrstica 314)

Spremeni iz:
```text
Spomin - Glas {displayLetter}
```
v:
```text
Spomin - Glas {displayName || displayLetter}
```
Hook `useGenericMemoryGame` mora vrniti tudi `displayName` iz configu.

#### 4. LabirintConfig -- dodaj displayName
**Datoteka:** `src/data/labirintConfig.ts`

Za `r-zacetek` vnos spremeni `displayLetter: 'R'` v `displayLetter: 'R - začetne vaje'` (ali dodaj loceno polje).

#### 5. GenericLabirintGame.tsx -- pogojni naslov
**Datoteka:** `src/components/games/GenericLabirintGame.tsx` (vrstica 343)

Naslov ze uporablja `config.displayLetter`, zato popravek v configu zadostuje.

#### 6. ZaporedjaConfig -- popravek letter polja
**Datoteka:** `src/data/zaporedjaConfig.ts`

Za `r-zacetek` configs spremeni `letter: 'R-zacetek'` v ustrezno obliko za prikaz.

#### 7. GenericZaporedjaGame.tsx -- pogojni naslov
**Datoteka:** `src/components/games/GenericZaporedjaGame.tsx` (vrstica 358)

Spremeni iz:
```text
ZAPOREDJA - {config.letter}
```
v:
```text
ZAPOREDJA - {config.letter === 'R-zacetek' ? 'R - začetne vaje' : config.letter}
```

### Skupaj sprememb
- 1 Supabase migracija (popravek URL-jev)
- 5 datotek (spominConfig, GenericSpominGame, useGenericMemoryGame, labirintConfig/GenericLabirintGame, GenericZaporedjaGame)

