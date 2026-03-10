

# Opcijski izbor 20/60 besed za preverjanje izgovorjave

## Povzetek
Za otroke stare 5+ let dodamo možnost ročnega preklopa med 20 in 60 besedami. Privzeto ostane 60 besed. Pri izbiri 20 besed se prikaže opozorilo s potrditvijo. V info dialogu pred testom se prikaže krepko rdeče obvestilo o izbranem številu besed.

## Trenutno stanje
- `wordsPerLetter` se avtomatsko nastavi na 1 (20 besed) za otroke 3-4 let, sicer 3 (60 besed)
- Nastavitve (zahtevnost, čas snemanja) so shranjene v `localStorage` pod ključem `articulation_settings`
- Info dialog (`ArticulationTestInfoDialog`) se prikaže pred začetkom testa
- Admin portal (`AdminArtikulacijskiTest.tsx`) ima enako logiko

## Spremembe

### 1. Razširi `useArticulationSettings` hook
- Dodaj nov tip `WordCount = 20 | 60`
- Dodaj `wordCountOverride` v `ArticulationSettings` interface (shrani se v localStorage)
- Funkcije: `setWordCountOverride(childId, count)`, `getWordCountOverride(childId)` — per-child nastavitev
- Za otroke 3-4 let se override ignorira (vedno 20)

### 2. Dodaj potrditveni dialog za 20 besed
- Nova komponenta `ArticulationWordCountDialog.tsx`
- Prikaže se v `ArticulationSettingsDialog` kot tretji stolpec ali nova sekcija
- Opcije: 20 besed / 60 besed (privzeto)
- Pri izbiri 20 besed → opozorilo: "Za to starostno skupino se priporoča uporaba 60 besed. Če ima otrok večje težave z govorom, lahko uporabite 20 besed." + gumb "Potrdi"
- Nazaj na 60 → brez opozorila, le sporočilo "Za preverjanje izgovorjave se bo uporabljalo 60 besed."
- Za otroke 3-4 let se ta sekcija ne prikaže (avtomatsko 20)

### 3. Posodobi `ArticulationSettingsDialog`
- Dodaj tretjo sekcijo "Število besed" pod obstoječima dvema
- Prikaže se samo za otroke stare 5+
- RadioGroup z opcijama 20 in 60
- Opozorilni dialog (AlertDialog) pri izbiri 20

### 4. Posodobi `ArticulationTestInfoDialog`
- Dodaj nov prop: `childName: string`, `wordCount: number`
- Pred sekcijo "Kaj je preverjanje izgovorjave?" dodaj:
  ```
  <p className="font-bold text-red-600">
    Za otroka {childName} ste izbrali {wordCount} besed za preverjanje izgovorjave.
  </p>
  ```

### 5. Posodobi `ArtikuacijskiTest.tsx` (uporabniški portal)
- Iz `useArticulationSettings` preberi `wordCountOverride` za izbranega otroka
- `wordsPerLetter` logika:
  - Otrok 3-4 let → vedno 1
  - Otrok 5+ let + override 20 → 1
  - Otrok 5+ let + brez override ali 60 → 3
- Posreduj `childName` in `totalWords` (20 ali 60) v info dialog

### 6. Posodobi `AdminArtikulacijskiTest.tsx` (admin portal)
- Enaka logika kot uporabniški portal za wordCount override
- Admin ima dostop do nastavitev za izbranega otroka

### Datoteke za spremembo
- `src/hooks/useArticulationSettings.ts` — dodaj wordCount logiko (per-child)
- `src/components/articulation/ArticulationSettingsDialog.tsx` — dodaj sekcijo za število besed
- `src/components/articulation/ArticulationTestInfoDialog.tsx` — dodaj rdeče opozorilo
- `src/pages/ArtikuacijskiTest.tsx` — uporabi wordCount override
- `src/pages/admin/AdminArtikulacijskiTest.tsx` — uporabi wordCount override

### Shranjevanje
Shranjujemo v `localStorage` pod obstoječim ključem `articulation_settings` z dodanim poljem:
```json
{
  "difficulty": "srednja",
  "recordingDuration": 4,
  "wordCountOverrides": {
    "child-uuid-1": 20,
    "child-uuid-2": 60
  }
}
```
Per-child ker imajo lahko različni otroci različne potrebe.

