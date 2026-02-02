
# Načrt: Dodajanje RLS politik za storage pot logopedist-children

## Problem

Ko logoped ustvari otroka na strani `/admin/children`, se dokumenti (opis govornih težav in osnovni vprašalnik) ne naložijo v storage bucket `uporabniski-profili`.

**Napaka v konzoli:**
```json
{
  "statusCode": "403",
  "error": "Unauthorized", 
  "message": "new row violates row-level security policy"
}
```

## Analiza vzroka

Pot za shranjevanje dokumentov otrok logopeda je:
```
logopedist-children/{logopedist_id}/{child_id}/Dokumenti/
```

Obstoječe RLS politike za bucket `uporabniski-profili`:

| Politika | Dovoljeno | Pot |
|----------|-----------|-----|
| Users can upload | Uporabniki | `{auth.uid()}/...` |
| Logopedists can upload reports | Logopedi | `.../.../Porocila/...` |
| Logopedists can upload generated | Logopedi | `.../.../Generirana-porocila/...` |

**Manjka politika za pot `logopedist-children/`!**

---

## Rešitev

Ustvariti nove RLS politike, ki bodo logopedom dovolile:
1. **Nalaganje** datotek v svojo mapo `logopedist-children/{logopedist_id}/...`
2. **Branje** datotek iz svoje mape
3. **Posodabljanje** datotek v svoji mapi
4. **Brisanje** datotek iz svoje mape

### Varnostna logika

Logoped lahko dostopa SAMO do datotek, kjer:
- Pot se začne z `logopedist-children/`
- Drugi del poti (`logopedist_id`) se ujema z ID-jem logopedovega profila

```sql
-- Preveri, da je uporabnik logoped in da je drugi del poti njegov ID
bucket_id = 'uporabniski-profili'
AND (storage.foldername(name))[1] = 'logopedist-children'
AND (storage.foldername(name))[2] = (
  SELECT id::text FROM logopedist_profiles 
  WHERE user_id = auth.uid()
)
```

---

## Tehnične podrobnosti

### Nova migracija SQL

```sql
-- 1. Logopedi lahko nalagajo v svojo mapo logopedist-children
CREATE POLICY "Logopedists can upload to own logopedist-children folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 2. Logopedi lahko berejo iz svoje mape logopedist-children
CREATE POLICY "Logopedists can view own logopedist-children folder"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 3. Logopedi lahko posodabljajo v svoji mapi
CREATE POLICY "Logopedists can update own logopedist-children folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 4. Logopedi lahko brišejo iz svoje mape
CREATE POLICY "Logopedists can delete own logopedist-children folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);
```

---

## Rezultat po implementaciji

| Akcija | Pred | Po |
|--------|------|-----|
| Ustvarjanje otroka | Dokumenti se ne naložijo (403 error) | Dokumenti se uspešno naložijo |
| Pregled dokumentov | Prazna lista | Prikazani dokumenti |
| Brisanje dokumentov | Ni mogoče | Deluje |

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `supabase/migrations/XXXXXXXX_logopedist_children_storage_policies.sql` | Nova migracija z RLS politikami za pot `logopedist-children/` |

### Časovni okvir
- Enostavna sprememba - samo ena nova SQL migracija
