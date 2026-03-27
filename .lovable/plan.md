

## Plan: Popravi simulate-articulation-test — ne briši prejšnjih sej

### Problem

`simulate-articulation-test` (vrstica 136-152) ima **hardcoded `sessionNumber = 1`** in pred ustvarjanjem nove seje **izbriše vse obstoječe seje** za tega otroka. Zato po 2. kliku na "Simuliraj celotno preverjanje" vidiš samo 1 sejo namesto 2.

### Pravilna logika

1. **NE briši** obstoječih sej in rezultatov (odstrani vrstice 139-165)
2. **Izračunaj session_number** dinamično: preštej obstoječe seje za tega otroka in nastavi `sessionNumber = existingCount + 1`
3. **Storage mapa**: ustvari novo mapo `Seja-{sessionNumber}` namesto da briše stare

### Sprememba v `supabase/functions/simulate-articulation-test/index.ts`

**Odstrani** (vrstice 136-165):
- Hardcoded `const sessionNumber = 1`
- Brisanje obstoječih sej (`articulation_test_sessions`, `articulation_word_results`, `articulation_test_results`)
- Brisanje storage map

**Dodaj** (~5 vrstic):
```ts
// Preštej obstoječe seje za ta child
const { count } = await supabaseAdmin
  .from("articulation_test_sessions")
  .select("id", { count: "exact", head: true })
  .eq("child_id", childId);

const sessionNumber = (count || 0) + 1;
```

### Rezultat

- 1. klik → Seja 1 (60 besed)
- 2. klik (po 90 sklopih) → Seja 2 (60 besed), Seja 1 ostane
- Admin portal: pod uporabnikom se prikažeta obe seji

### Obseg
- 1 Edge funkcija posodobljena (~30 vrstic odstranjenih, ~5 dodanih)

