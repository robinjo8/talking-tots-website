

## Popolna ponastavitev preverjanja izgovorjave

### Problem

Trenutni gumb "Ponastavi test" briše samo iz tabele `articulation_test_results`. Nedokoncane seje v `articulation_test_sessions` in rezultati besed v `articulation_word_results` ostanejo v bazi. Zato se ob ponovnem vstopu v test prikaze dialog za nadaljevanje z besedo MIZA, namesto da bi se test zacel od zacetka.

Dodatno: RLS politike na tabelah `articulation_test_sessions` in `articulation_word_results` ne dovoljujejo operacije DELETE za starse, zato brisanje iz klienta ni mogoce.

### Resitev

Ustvariti Edge funkcijo `reset-articulation-test`, ki z uporabo service role kljuca izvede celovito brisanje vseh podatkov preverjanja za dolocenega otroka:

1. Izbrise vse zapise iz `articulation_word_results` (ki pripadajo sejam tega otroka)
2. Izbrise vse zapise iz `articulation_test_sessions` za tega otroka
3. Izbrise vse zapise iz `articulation_test_results` za tega otroka
4. Izbrise audio posnetke iz storage bucketa `uporabniski-profili` (mapa `userId/childId/Preverjanje-izgovorjave/`)

### Spremembe

#### 1. Nova Edge funkcija: `reset-articulation-test`

**`supabase/functions/reset-articulation-test/index.ts`**

- Sprejme `childId` v body-ju
- Preveri avtentikacijo uporabnika (Bearer token)
- Preveri da je otrok res last tega starsa (preko tabele `children`)
- Z uporabo service role kljuca:
  - Poisci vse seje tega otroka (`articulation_test_sessions` WHERE `child_id = childId`)
  - Za vsako sejo izbrise vse `articulation_word_results`
  - Izbrise vse seje
  - Izbrise vse `articulation_test_results`
  - Izbrise mapo z audio posnetki iz storage
- Vrne stevilo izbrisanih sej

#### 2. Registracija v `supabase/config.toml`

Dodaj novo funkcijo z `verify_jwt = false` (validacija v kodi).

#### 3. Posodobitev `useArticulationTestStatus.ts`

Spremeni `resetTest` funkcijo, da klice novo edge funkcijo namesto direktnega brisanja samo iz `articulation_test_results`.

```text
const resetTest = async (): Promise<boolean> => {
  if (!selectedChild?.id) return false;
  
  const response = await supabase.functions.invoke("reset-articulation-test", {
    body: { childId: selectedChild.id },
  });
  
  if (response.error) return false;
  await fetchTestStatus();
  return true;
};
```

#### 4. Posodobitev `ArticulationTestProfileSection.tsx`

Gumb "Ponastavi test" mora biti vedno viden (ne samo ko je test opravljen), ker mora delovati tudi za nedokoncane seje.

### Kaj se izbrise

```text
articulation_word_results  --> vsi zapisi za seje tega otroka
articulation_test_sessions --> vse seje tega otroka (child_id)
articulation_test_results  --> vsi rezultati tega otroka
uporabniski-profili/       --> userId/childId/Preverjanje-izgovorjave/*
```

### Vpliv

- Po kliku na "Ponastavi test" bo stanje identično kot da otrok nikoli ni opravljal preverjanja
- Dialog za nadaljevanje se ne bo vec prikazal
- Admin portal ne bo vec videl starih sej
- Gumb bo viden tudi med nedokoncanim testom
