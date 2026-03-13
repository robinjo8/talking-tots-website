

# Analiza in popravek preverjanja izgovorjave

## Zakaj je prišlo do katastrofalnih napak

### Glavni vzrok: Whisper API ima znane omejitve za slovenščino

1. **Whisper hallucinate (halucinira)** — to je znan problem OpenAI Whisper modela. Ko dobi kratke posnetke (3-4 sekunde) z ozadnjim šumom ali tihim govorom, Whisper **izmisli besedilo**, ki ga ni nihče izrekel. Primeri:
   - "juha ki jo je držala" — Whisper je iz kratkega zvoka "juha" dodal kontekst, ki ga ni bilo
   - "voda v okuzaciu" — halucinacija iz šuma
   - "hvala david.los" — izmišljen kontekst
   - "pizda" — Whisper včasih generira neprimerne besede iz šuma (znan bug)
   - "raz in hrvats" — halucinacija iz posnetka za "krof"

2. **Prompt parameter ne omejuje dovolj** — Whisper dobi `prompt: targetWord` kot namig, ampak to ni dovolj za omejitev. Whisper lahko vrne cele stavke namesto ene besede.

3. **`acceptedVariants` + Levenshtein sta preširoki** — Ko Whisper vrne "hiška" za "hiša", ima Levenshteinova podobnost 0.80, kar je nad pragom 0.75 za "visoko" zahtevnost pri 4-črknih besedah → zato je bilo sprejeto kot pravilno. "HIŠKA" bi morala biti ZAVRNJENA (dodana je v acceptedVariants, kar je napaka).

4. **Ni filtra za dolžino/relevantnost transkripcije** — Whisper vrne "juha ki jo je držala" (5 besed), sistem pa preveri Levenshtein nad tem celotnim nizom. To seveda ne ujema, ampak problem je da se takšen odgovor sploh prikaže uporabniku.

---

## Načrt popravkov

### 1. Filtriranje transkripcije na edge function nivoju (transcribe-articulation)

**Kaj:** Dodaj stroge filtre PRED primerjavo z `isWordAccepted`:
- **Filter dolžine**: Če transkripcija vsebuje več kot 2 besedi → zavrni kot "ni zaznano"
- **Filter kletvic**: Seznam prepovedanih besed (profanity filter) — če transkripcija vsebuje katerokoli, jo zamenjaj s praznim stringom
- **Filter relevantnosti**: Če transkripcija nima nobene podobnosti > 0.3 s targetWord → zavrni

**Datoteka:** `supabase/functions/transcribe-articulation/index.ts`

### 2. Popravek acceptedVariants — odstrani napačne variante

**Kaj:** Iz `articulationTestData.ts` odstrani variante ki niso legitimne napake izgovorjave:
- "HIŠKA" pri HIŠA — to ni sprejemljivo, to je napačna beseda
- "KRUHEK" pri KRUH — ni v seznamu, ampak Levenshtein ga sprejme
- Preglej vse variante in odstrani tiste ki so napačne besede (ne le fonetične variacije)

**Datoteka:** `src/data/articulationTestData.ts`

### 3. Spremenjen prikaz napak — "Beseda ni bila dobro zaznana"

**Kaj:** Ko transkripcija ni sprejeta, namesto da se prikaže "Slišano: [kletvica ali nesmisel]", prikaži generično sporočilo: **"BESEDA NI BILA DOBRO ZAZNANA, PROSIMO PONOVITE"**

Ne prikazuj nikoli surove transkripcije uporabniku! To prepreči prikaz kletvic in nesmiselnih halucinacij.

**Datoteke:**
- `src/components/articulation/ArticulationRecordButton.tsx` — odstrani prikaz `wrongWord`
- `src/pages/ArtikuacijskiTest.tsx` — ne posreduj `transcribedText` kot `wrongWord`
- `src/pages/admin/AdminArtikulacijskiTest.tsx` — enako

### 4. Samodejno predvajanje zvočnega posnetka ob prikazu slike

**Kaj:** Ko se prikaže nova beseda (slika), po 1 sekundi samodejno predvajaj zvočni posnetek te besede iz bucketa `zvocni-posnetki`. Gumb "Izgovori besedo" postane aktiven šele ko se predvajanje zaključi.

**Implementacija:**
- V `useArticulationTestNew.ts` dodaj logiko za auto-play audio ob spremembi besede
- Dodaj state `isAudioPlaying` ki blokira gumb za snemanje
- Audio URL: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${word.audio}`

**Datoteke:**
- `src/hooks/useArticulationTestNew.ts` — dodaj audio playback logiko
- `src/pages/ArtikuacijskiTest.tsx` — posreduj `isAudioPlaying` kot `disabled`

### 5. Gumb zvočnika za ponovno predvajanje

**Kaj:** Nad gumbom "Izgovori besedo" dodaj gumb z ikono zvočnika (Volume2) ki ob kliku ponovno predvaja zvočni posnetek besede.

**Datoteke:**
- `src/pages/ArtikuacijskiTest.tsx` — dodaj gumb zvočnika nad record button
- `src/pages/admin/AdminArtikulacijskiTest.tsx` — enako

### 6. Profanity filter (kritično)

**Kaj:** Na edge function nivoju dodaj seznam prepovedanih besed (slovenščina + angleščina). Če Whisper vrne katerokoli od teh, odgovor obravnavaj kot "ni zaznano" in nikoli ne shrani ali vrni te besede.

**Datoteka:** `supabase/functions/transcribe-articulation/index.ts`

---

## Datoteke za spremembo:

1. **`supabase/functions/transcribe-articulation/index.ts`** — profanity filter, filter dolžine, filter relevantnosti
2. **`src/data/articulationTestData.ts`** — čiščenje acceptedVariants (odstrani "HIŠKA" ipd.)
3. **`src/components/articulation/ArticulationRecordButton.tsx`** — zamenjaj prikaz wrongWord z generičnim sporočilom
4. **`src/pages/ArtikuacijskiTest.tsx`** — auto-play audio, gumb zvočnika, ne posreduj transcribedText
5. **`src/hooks/useArticulationTestNew.ts`** — audio playback logika, isAudioPlaying state
6. **`src/pages/admin/AdminArtikulacijskiTest.tsx`** — enake spremembe kot user test

