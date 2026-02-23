

## Simulacija preverjanja izgovorjave - gumb "Izvedi test"

### Kaj bo narejeno

Na strani `/profile` v sekciji "Preverjanje izgovorjave" bosta dodana dva gumba v obstojecem razdelku "Testne seje (za razvoj)":

1. **Izvedi test (simulacija)** - simulira celotno preverjanje izgovorjave (60 besed) z uporabo testnih posnetkov `test_1.m4a` do `test_60.m4a` iz bucketa `zvocni-posnetki`
2. **Ponastavi test** - obstojecim gumb, ki ostane kjer je

### Kako deluje simulacija

Simulacija bo ustvarila realno sejo v bazi, kot da bi uporabnik dejansko govoril besedo po besedo:

1. Ustvari novo sejo v `articulation_test_sessions` (status: pending, is_completed: false)
2. Za vsako od 60 besed:
   - Kopira testni posnetek (`test_X.m4a`) iz bucketa `zvocni-posnetki` v bucket `uporabniski-profili` pod pravilno pot (`userId/childId/Preverjanje-izgovorjave/Seja-X/...`)
   - Vstavi zapis v `articulation_word_results` z dejanskimi podatki (letter, position, target_word, audio_url, ai_accepted: true)
   - Posodobi `current_word_index` na seji
3. Oznaci sejo kot dokoncano (is_completed: true, status: pending)
4. Shrani rezultat v `articulation_test_results`

### Tehnicni nacrt

#### 1. Nova Edge funkcija: `simulate-articulation-test`

**`supabase/functions/simulate-articulation-test/index.ts`**

- Sprejme: `childId` v body-ju
- Uporabi service role key za polni dostop
- Preveri avtentikacijo uporabnika
- Pridobi seznam 60 besed iz `articulationTestData` konfiguracije (hardcodirane v funkciji)
- Za vsako besedo:
  - Prebere testni posnetek `test_X.m4a` iz `zvocni-posnetki` (public bucket)
  - Naloži posnetek v `uporabniski-profili` pod pravilno pot
  - Vstavi word result v bazo
- Oznaci sejo kot dokoncano
- Vrne uspeh/napako

#### 2. Posodobitev komponente: `ArticulationTestProfileSection.tsx`

- Doda gumb "Izvedi test (simulacija)" z ikono `Zap` (lightning)
- Gumb klice edge funkcijo `simulate-articulation-test`
- Med izvajanjem prikaze loading stanje z napredkom
- Po uspesnem zakljucku osvezi status testa

#### 3. Podatki o besedah v edge funkciji

Edge funkcija bo vsebovala hardcodiran seznam 60 besed v foneticnem vrstnem redu (P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, S, Z, C, R) z ustreznimi podatki (letter, position label, target_word), da pravilno zapolni `articulation_word_results`.

### Pricakovani rezultat

Po kliku na "Izvedi test (simulacija)":
- V bazi bo nova seja z 60 word results
- V storage-u bo 60 audio posnetkov pod pravilno strukturo map
- Seja bo vidna v admin portalu za logopede
- Status na profilu bo pokazal "Test je bil opravljen"
- Celoten proces traja priblizno 30-60 sekund (kopiranje 60 datotek)
