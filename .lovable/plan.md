
# Načrt: Popravek podvojene slike v igri Spomin za črko K

## Ugotovljen problem

V tabeli `memory_cards_K` sta dve vrstici, ki uporabljata **isto sliko** `kokos1.webp`:

| ID | Beseda | Trenutna slika | Trenutni zvok |
|----|--------|----------------|---------------|
| `424423f9-...` | kokos (sadež) | `kokos1.webp` ❌ | `kokos_1.m4a` ❌ |
| `c1a84a3e-...` | KOKOŠ (kokoška) | `kokos1.webp` ✅ | `kokos_1.m4a` ✅ |

## Pravilne vrednosti

Na podlagi ostalih konfiguracijskih datotek (`matchingGameData.ts`, `puzzleImages.ts`, `threeColumnMatchingData.ts`):

| Beseda | Pravilna slika | Pravilni zvok |
|--------|----------------|---------------|
| **KOKOŠ** (hen) | `kokos1.webp` | `kokos_1.m4a` |
| **KOKOS** (coconut) | `kokos_sadez1.webp` | `kokos_sadez.m4a` |

## Potrebna sprememba

**Posodobitev vrstice v Supabase** za besedo "kokos" (ID: `424423f9-932d-404a-aad5-67fd80488f92`):

```sql
UPDATE "memory_cards_K"
SET 
  image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kokos_sadez1.webp',
  audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kokos_sadez.m4a'
WHERE id = '424423f9-932d-404a-aad5-67fd80488f92';
```

## Preverjanje ostalih tabel

Preveril sem vse ostale tabele za igro Spomin:
- `memory_cards_c` ✅ Brez podvojenih slik
- `memory_cards_Č` ✅ Brez podvojenih slik
- `memory_cards_l` ✅ Brez podvojenih slik
- `memory_cards_r` ✅ Brez podvojenih slik
- `memory_cards_S` ✅ Brez podvojenih slik
- `memory_cards_Š_duplicate` ✅ Brez podvojenih slik
- `memory_cards_z` ✅ Brez podvojenih slik
- `memory_cards_Ž` ✅ Brez podvojenih slik

**Edina napaka je v tabeli `memory_cards_K`** za besedo "kokos".

## Vizualni rezultat

Po popravku bodo v igri Spomin za črko K prikazane pravilne slike:

```text
┌─────────────┐     ┌─────────────┐
│  🥥 KOKOS   │     │  🐔 KOKOŠ   │
│  (sadež)    │     │  (kokoška)  │
│ kokos_sadez │     │   kokos1    │
└─────────────┘     └─────────────┘
```

## Tehnična opomba

Ta popravek je izključno v podatkovni bazi (Supabase). Koda aplikacije ne potrebuje sprememb - logika v `useGenericMemoryGame.tsx` pravilno uporablja `pairId` za ujemanje parov, slika pa se naloži iz polja `image_url` v tabeli.
