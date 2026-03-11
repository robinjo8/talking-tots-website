

# Posodobitev dveh dialogov na strani /artikulacijski-test

Oba dialoga je treba posodobiti, da vkljucujeta informacije o prilagojeni razlicici (20 besed) in nastavljivih parametrih (zahtevnost, cas snemanja), skladno s posodobljenim besedilom na /kako-deluje.

## 1. ArticulationTestInfoDialog.tsx (Obvestilo pred zacetkom)

**Kaj manjka:**
- Omemba prilagojene razlicice za starost 3-4 let (20 besed)
- Omemba nastavitev preverjanja (zahtevnost, cas snemanja)

**Spremembe:**

- **Sekcija "Kaj se preverja?"** (vrstica 119): Dodati odstavek o prilagojeni razlicici:
  > "Za otroke v starostni skupini 3-4 let je na voljo prilagojena razlicica s 20 besedami (1 beseda na glas), ki je krajsa in manj obremenjujoca."

- **Nova sekcija "Nastavitve preverjanja"** (za sekcijo "Kako preverjanje poteka?"):
  - Opis, da lahko uporabnik pred ali med preverjanjem prilagodi nastavitve
  - Stopnja zahtevnosti: Nizka, Srednja (privzeto), Visoka
  - Cas snemanja: 3, 4 (privzeto) ali 5 sekund

## 2. ArticulationTestInstructionsDialog.tsx (Kako deluje)

**Kaj manjka:**
- Omemba prilagojene razlicice (20 besed)
- Omemba nastavitev (zahtevnost, cas snemanja)
- Hardkodirano "5 sekund" in "60 besed" namesto nastavljive vrednosti

**Spremembe:**

- **Sekcija "Struktura preverjanja"** (vrstica 52-60): Razdeliti na "Standardna razlicica" (60 besed) in "Prilagojena razlicica" (20 besed za 3-4 let), enako kot na /kako-deluje

- **Nova sekcija "Nastavitve preverjanja"** (za sekcijo "Struktura preverjanja"):
  - Stopnja zahtevnosti: Nizka, Srednja (privzeto), Visoka -- opis vpliva na strogost ocenjevanja
  - Cas snemanja: 3, 4, 5 sekund z opisi

- **Sekcija "Potek izgovorjave"** (vrstica 114): Popraviti "5 sekund" na "nastavljiv cas snemanja (3, 4 ali 5 sekund, privzeto 4 sekunde)"

- **Zakljucna vrstica** (vrstica 170): Popraviti "60 besed" na "vseh besed (60 pri standardni oz. 20 pri prilagojeni razlicici)"

### Datoteke za spremembo
- `src/components/articulation/ArticulationTestInfoDialog.tsx`
- `src/components/articulation/ArticulationTestInstructionsDialog.tsx`

