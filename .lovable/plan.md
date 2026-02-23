

## Popravek: Simulacija vedno ustvari Seja-1

### Problem

Edge funkcija `simulate-articulation-test` na vrstici 133 poisce zadnjo sejo (tudi nedokoncano) in nastavi `sessionNumber = zadnja + 1`. Ce je pred resetom obstajala nedokoncana Seja-1 in reset ni bil pravilno izveden (ali pa je bil poklican stari client-side reset ki brise samo `articulation_test_results`), simulacija ustvari Seja-2 namesto Seja-1.

Na screenshotu je vidno:
- V sekciji "Preverjanje izgovorjave" na admin portalu je prikazana **Seja-2** (60 posnetkov)
- V dropdownu za porocilo pa je na voljo samo **Seja-1** (ker porocilo isce sejo po `session_number = 1`)

### Resitev

Gumb "Izvedi test (simulacija)" na `/profile` je namenjen izključno **prvi seji (Seja-1)**. Funkcija mora:

1. Pred ustvarjanjem nove seje **najprej poklicati reset** - izbrisati vse obstojece seje, word results in audio datoteke za tega otroka (enaka logika kot `reset-articulation-test`)
2. Vedno ustvariti sejo s `session_number = 1`

### Spremembe

#### `supabase/functions/simulate-articulation-test/index.ts`

1. **Odstrani logiko za dolocanje session_number** (vrstice 125-133) in hardkodiraj `sessionNumber = 1`

2. **Dodaj reset logiko pred ustvarjanjem seje** - pred vrstico 136 dodaj brisanje vseh obstojecih podatkov:
   - Poisci vse obstojece seje za tega otroka (`articulation_test_sessions WHERE child_id = childId AND parent_id = userId`)
   - Izbriši vse `articulation_word_results` za te seje
   - Izbriši vse `articulation_test_sessions` za tega otroka
   - Izbriši vse `articulation_test_results` za tega otroka
   - Izbriši audio datoteke iz storage (`userId/childId/Preverjanje-izgovorjave/`)

To zagotovi, da simulacija vedno zacne s cistim stanjem in ustvari Seja-1, ne glede na prejsnje stanje v bazi.

#### Brez sprememb na frontendu

Komponenta `ArticulationTestProfileSection.tsx` ze pravilno prikaze rezultat simulacije. Gumb "Ponastavi test" ostane locen za rocno ponastavitev.

### Tehnicni detajl

Vrstice 125-133 se zamenjajo z:

```text
const sessionNumber = 1;

// Clean up any existing data before simulation
const { data: existingSessions } = await supabaseAdmin
  .from("articulation_test_sessions")
  .select("id")
  .eq("child_id", childId)
  .eq("parent_id", userId);

const existingIds = (existingSessions || []).map(s => s.id);

if (existingIds.length > 0) {
  await supabaseAdmin.from("articulation_word_results").delete().in("session_id", existingIds);
  await supabaseAdmin.from("articulation_test_sessions").delete().eq("child_id", childId).eq("parent_id", userId);
}

await supabaseAdmin.from("articulation_test_results").delete().eq("child_id", childId);

// Clean storage
const storagePath = `${userId}/${childId}/Preverjanje-izgovorjave`;
const { data: folders } = await supabaseAdmin.storage.from("uporabniski-profili").list(storagePath);
if (folders && folders.length > 0) {
  for (const folder of folders) {
    const folderPath = `${storagePath}/${folder.name}`;
    const { data: files } = await supabaseAdmin.storage.from("uporabniski-profili").list(folderPath);
    if (files && files.length > 0) {
      await supabaseAdmin.storage.from("uporabniski-profili").remove(files.map(f => `${folderPath}/${f.name}`));
    }
  }
}
```

### Vpliv

- Simulacija vedno ustvari Seja-1
- Pred simulacijo se samodejno pocisti vse prejsnje podatke
- Admin portal bo prikazal Seja-1 (ne vec Seja-2)
- Dropdown za porocilo bo pravilno nasel sejo
- Gumb "Ponastavi test" ostane nespremenjen za loceno uporabo
