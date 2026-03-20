

## Problem

Gumb "Izbriši" pod "Shranjena poročila" prikaže uspešno obvestilo, vendar datoteka **ni dejansko izbrisana**. 

### Vzrok

RLS politike za bucket `uporabniski-profili` na `storage.objects`:
- **SELECT** → logopedi imajo dostop (migracija `20260116092422`)
- **INSERT** → logopedi lahko nalagajo v mapo `Porocila` ✅
- **UPDATE** → logopedi lahko posodabljajo v mapi `Porocila` ✅  
- **DELETE** → **NI POLITIKE** za logopede ❌

Supabase Storage `.remove()` **ne vrne napake** pri RLS zavrnitvi — vrne prazen rezultat. Zato koda misli, da je brisanje uspelo, prikaže "Poročilo izbrisano", nato `refetchReports()` ponovno naloži (nezbrisano) datoteko.

### Popravek

**1. Nova SQL migracija** — dodaj DELETE politiko za logopede:

```sql
CREATE POLICY "Logopedists can delete reports in Porocila folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[3] = 'Porocila'
);
```

**2. Boljša detekcija napake v `AdminUserDetail.tsx`** — po `.remove()` preveri, ali je datoteka res izbrisana, preden prikaže uspešno obvestilo:

```typescript
const { data, error } = await supabase.storage
  .from('uporabniski-profili')
  .remove([report.path]);
if (error) throw error;
// Preveri, ali je bila datoteka dejansko izbrisana
if (!data || data.length === 0) {
  throw new Error('Datoteka ni bila izbrisana — preverite dovoljenja');
}
```

### Obseg
- 1 nova SQL migracija (ena CREATE POLICY)
- 1 manjša sprememba v `src/pages/admin/AdminUserDetail.tsx` (boljša validacija rezultata brisanja)

