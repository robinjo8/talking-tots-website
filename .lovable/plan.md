

# Prehod Spomin in Zaporedja na lokalne podatke (bucket "slike")

## Problem

Igri **Spomin** in **Zaporedja** pridobivata slike in zvoke iz Supabase **tabel** (npr. `memory_cards_c`, `memory_cards_K`), medtem ko vse ostale igre (Kolo besed, Sestavljanka, Drsna igra, Labirint, Igra ujemanja) uporabljajo lokalne konfiguracijske datoteke z imeni datotek iz bucketa `slike`.

To povzroca:
- Dvojno vzdrzevanje podatkov (baza + lokalni config)
- Neskladnosti med igrami (baza ima `.m4a` avdio, lokalni config `.mp3`)
- Tezje dodajanje novih besed (treba posodobiti tako bazo kot config)

## Resitev

Ustvariti en skupen lokalni podatkovni vir, ki ga Spomin in Zaporedja uporabljata namesto Supabase tabel. Podatki bodo izpeljani iz ze obstojecih seznamov besed v `artikulacijaVajeConfig.ts`.

## Tehnicni koraki

### 1. Nova datoteka: `src/data/sharedWordData.ts`

Centralni modul, ki:
- Uvozi vse `wordsData*` sezname iz `artikulacijaVajeConfig.ts`
- Pretvori vsak vnos v obliko `{ id, word, image_url, audio_url }` (ista oblika kot jo vracajo DB tabele)
- Generira `id` z deterministicnim hash-em iz besede (npr. `crypto.randomUUID()` zamenjamo z `word-based-id`)
- Gradi polne URL-je: `slike/{image}` za slike, `zvocni-posnetki/{audio}` za zvok
- Izvozi funkcijo `getWordsForLetter(letter: string): SequenceImage[]`

Primer pretvorbe:
```text
Vhod (artikulacijaVajeConfig):
  { word: "CEDILO", image: "cedilo1.webp", audio: "Cedilo.mp3" }

Izhod (sharedWordData):
  { id: "cedilo-001", word: "CEDILO",
    image_url: "https://.../slike/cedilo1.webp",
    audio_url: "https://.../zvocni-posnetki/Cedilo.mp3" }
```

### 2. Posodobitev `useGenericMemoryGame.tsx` (Spomin)

- Odstraniti Supabase poizvedbo (`supabase.from(tableName).select("*")`)
- Uvoziti `getWordsForLetter` iz `sharedWordData.ts`
- Podatke pridobiti sinhrono iz lokalnega vira namesto asinhrono iz baze
- Ohraniti isto strukturo `MemoryCard` (id, word, image_url, audio_url, flipped, matched, pairId)

### 3. Posodobitev `SequenceGame56Base.tsx` in `SequenceGameBase.tsx` (Zaporedja)

- Odstraniti Supabase poizvedbo
- Uvoziti `getWordsForLetter` iz `sharedWordData.ts`
- Podatke pridobiti sinhrono namesto asinhrono
- Ohraniti isto strukturo `SequenceImage`

### 4. Posodobitev `useSequenceGame.ts`

- Enaka sprememba: zamenjati DB poizvedbo z lokalnimi podatki

### 5. Posodobitev `spominConfig.ts`

- Odstraniti `tableName` in `queryKey` polja
- Dodati `letterKey` polje, ki se uporablja za klic `getWordsForLetter(letterKey)`
- Mapiranje: `c` -> `c`, `ch` -> `ch`, `k` -> `k`, `l` -> `l`, `r` -> `r`, `s` -> `s`, `sh` -> `sh`, `z` -> `z`, `zh` -> `zh`, `r-zacetek` -> `r-zacetek`

### 6. Posodobitev `zaporedjaConfig.ts`

- Odstraniti `letterTableMap` in `tableName` polja
- Dodati `letterKey` polje za klic `getWordsForLetter()`

### 7. Posodobitev vseh starejsih SequenceGame komponent

Datoteke kot `SequenceGameC56.tsx`, `SequenceGameS910.tsx` itd., ki se prenasajo `tableName` prop, bodo namesto tega prenasale `letterKey`.

## Prednosti

- **En vir resnice**: vse igre uporabljajo iste besede iz istih datotek
- **Brez odvisnosti od baze**: hitrejse nalaganje, ni omreznih napak
- **Lazje vzdrzevanje**: za dodajanje nove besede popravis samo `artikulacijaVajeConfig.ts`
- **Konsistenten avdio format**: vse igre uporabljajo `.mp3` iz bucketa `zvocni-posnetki`

