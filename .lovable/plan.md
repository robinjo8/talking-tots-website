

# Analiza: Vse memory_cards_* tabele uporabljajo .m4a namesto .mp3

## Ugotovitev

**Vseh 10 Supabase tabel** (`memory_cards`, `memory_cards_K`, `memory_cards_c`, `memory_cards_l`, `memory_cards_S`, `memory_cards_z`, `memory_cards_Č`, `memory_cards_Š_duplicate`, `memory_cards_Ž`, `memory_cards_r_zacetek`) ima `audio_url` polja z `.m4a` končnico in malimi črkami (npr. `sneg.m4a` namesto `Sneg.mp3`).

**Skupaj 130 vnosov** je prizadetih. To vpliva na:
- **Spomin (3-4)**: 9 `useMemoryGame*.tsx` hookov
- **Zaporedja (5-6)**: `SequenceGame56Base.tsx` + `SequenceGameC56.tsx`
- **Zaporedja (3-4)**: `useSequenceGame.ts`
- **Zaporedja (7-8, 9-10)**: `SequenceGameBase.tsx`

Igre kot Bingo, Met kocke, Ponovi poved že uporabljajo pravilne `.mp3` URL-je ker podatke definirajo lokalno v kodi (ne iz baze).

## Posebni primeri v bazi

Nekatere `.m4a` datoteke imajo drugačna imena kot `.mp3` standard:
| Beseda | .m4a v bazi | Pravilen .mp3 |
|--------|-------------|---------------|
| KOKOŠ | `kokos_1.m4a` | `Kokos_zival.mp3` |
| kokos | `kokos_sadez.m4a` | `Kokos_sadez.mp3` |
| KOŽA | `koza_skin.m4a` | `Koza_cutilo.mp3` |
| KOZA | `koza.m4a` | `Koza_zival.mp3` |
| KOŠ | `kos.m4a` | `Kos_predmet.mp3` |

## Rešitev

Ker nimam možnosti poganjati UPDATE stavkov na bazi, bom dodal **runtime transformacijo** ki pretvori `.m4a` URL-je v `.mp3` ob nalaganju podatkov.

### 1. Nova utility funkcija (`src/utils/audioUtils.ts`)

Dodal bom funkcijo `normalizeAudioUrl(url)` ki:
- Zamenja `.m4a` z `.mp3`
- Kapitalizira prvo črko datoteke (npr. `sneg` → `Sneg`)
- Obravnava posebne primere s preslikavo (`kokos_1` → `Kokos_zival`, itd.)
- Če je URL že `.mp3`, ga ne spreminja

### 2. Uporaba v hookih in komponentah

Normalizacijo dodam na teh mestih (po fetchanju podatkov iz baze):
- `src/hooks/useSequenceGame.ts` — po `supabase.from(tableName).select("*")`
- `src/components/exercises/SequenceGame56Base.tsx` — po fetchanju
- `src/components/exercises/SequenceGameC56.tsx` — po fetchanju
- `src/hooks/useMemoryGameC.tsx`, `useMemoryGameK.tsx`, `useMemoryGameL.tsx`, `useMemoryGameR.tsx`, `useMemoryGameS.tsx`, `useMemoryGameZ.tsx`, `useMemoryGameČ.tsx`, `useMemoryGameŠ.tsx`, `useMemoryGameŽ.tsx` — po fetchanju
- `src/hooks/useMemoryGame.tsx` — generični hook

Na vsakem mestu dodam eno vrstico:
```ts
const normalized = data.map(item => ({
  ...item,
  audio_url: normalizeAudioUrl(item.audio_url)
}));
return normalized;
```

### Obseg sprememb
- 1 nova funkcija v obstoječi datoteki
- ~13 datotek z minimalno spremembo (dodana 1-2 vrstici po fetch klicu)
- Nobenih vizualnih sprememb, samo zvočni posnetki se bodo pravilno predvajali

