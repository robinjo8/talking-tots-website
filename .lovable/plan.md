

## Plan: Dokonči lokalni fallback za Spomin in Zaporedja (F, G, H, V)

### Stanje

**Kljukica** — konfiguracije za Kolo besed, Labirint, Drsna sestavljanka, Igra ujemanja, Sestavljanka so bile narejene. Spomin in Zaporedja pa imata konfiguracijo (localData v `spominConfig.ts`), ampak hooks in komponente še ne podpirajo lokalnih podatkov za Zaporedja. Spomin (`useGenericMemoryGame.tsx`) že ima localData podporo.

**Spomin**: Že deluje — `useGenericMemoryGame.tsx` že preveri `config.localData` in ga uporabi namesto DB poizvedbe. Ni potrebnih sprememb.

**Zaporedja**: NE deluje za F, G, H, V. Trije problemi:

1. `zaporedjaConfig.ts` — F, G, H, V imajo placeholder `tableName: 'memory_cards_c'`. Potrebno dodati `localData` polje.
2. `useSequenceGame.ts` — vedno bere iz DB, nima localData podpore (za starostno skupino 3-4)
3. `SequenceGame56Base.tsx` in `SequenceGameBase.tsx` — vedno bereta iz DB (za starostne skupine 5-6, 7-8, 9-10)
4. `GenericZaporedjaGame.tsx` — za starostno skupino 3-4 `switch` nima case-ov za `f`, `g`, `h`, `v`, zato pade na `default` ki vrne `SequenceGameC` (napačna tabela)

---

### Spremembe

**1. `src/data/zaporedjaConfig.ts`**
- Razširi `ZaporedjaGameConfig` interface z opcijskim `localData` poljem
- Dodaj localData za F, G, H, V z istimi podatki kot v `spominConfig.ts` (polni URL-ji iz bucket slike/zvocni-posnetki)
- Odstrani placeholder tableName za te črke

**2. `src/hooks/useSequenceGame.ts`**
- Dodaj opcijski parameter `localData?: { word: string; image_url: string; audio_url: string }[]`
- Če je podan, useQuery vrne lokalne podatke pretvorjene v `SequenceImage[]` format namesto DB poizvedbe

**3. `src/components/exercises/SequenceGame56Base.tsx`**
- Dodaj opcijski prop `localData`
- Če je podan, useQuery uporabi lokalne podatke namesto DB poizvedbe

**4. `src/components/exercises/SequenceGameBase.tsx`**
- Dodaj opcijski prop `localData`
- Če je podan, useQuery uporabi lokalne podatke namesto DB poizvedbe

**5. `src/components/games/GenericZaporedjaGame.tsx`**
- V `renderGame` za starostno skupino 3-4: dodaj case-e za `f`, `g`, `h`, `v`. Ker so te igre identične ostalim (samo drug vir podatkov), ustvarim generično komponento ali pa posredujem localData v obstoječi `SequenceGameC`-like vzorec
- Za 5-6, 7-8, 9-10: posreduj `config.localData` v `SequenceGame56Base` / `SequenceGameBase`

**Pristop za 3-4**: Namesto 4 novih komponent (SequenceGameF, SequenceGameG...) razširim `SequenceGameC` da sprejme opcijski `localData` prop in `tableName` prop — če ima localData, ga posreduje v `useSequenceGame`. Nato v `GenericZaporedjaGame` za f/g/h/v uporabim isto komponento s prilagojenim podatkovnim virom.

---

### Obseg
- 5 datotek spremenjenih
- ~30 vrstic novih/spremenjenih v hookih in komponentah
- ~20 vrstic v zaporedjaConfig za localData reference
- Obstoječe igre (C, Č, K, L, R, S, Š, Z, Ž) ostanejo popolnoma nespremenjene

