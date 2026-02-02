

# Popravek podatkov za uporabnika kujavec.robert@gmail.com

## Trenutno stanje

| Seja ID | Datum | session_number | Status | Posnetki v Storage |
|---------|-------|----------------|--------|-------------------|
| d3742796-ad32-4880-90b3-f89767dfdb33 | 23.1.2026 | 1 | completed | Seja-1 (0 posnetkov - testna) |
| fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03 | 28.1.2026 | 2 | pending | Seja-2 (60 posnetkov) |

## Problem

Admin portal pregleduje sejo od 23.1. (`session_number=1`) in išče posnetke v mapi `Seja-1`, ki je prazna. Dejanski posnetki (60) so v mapi `Seja-2`.

## Rešitev

### Korak 1: Izbriši testno sejo od 23.1.

Izbriši staro testno sejo, ki ne bi smela obstajati:

```sql
DELETE FROM articulation_evaluations 
WHERE session_id = 'd3742796-ad32-4880-90b3-f89767dfdb33';

DELETE FROM articulation_test_sessions 
WHERE id = 'd3742796-ad32-4880-90b3-f89767dfdb33';
```

### Korak 2: Posodobi pravo sejo od 28.1.

Posodobi sejo od 28.1. tako da bo imela `session_number=1`:

```sql
UPDATE articulation_test_sessions 
SET session_number = 1
WHERE id = 'fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03';
```

### Korak 3: Premakni posnetke iz Seja-2 v Seja-1

Ker hook `useSessionReview.ts` zdaj uporablja `session_number` za določitev mape, moram premakniti posnetke iz `Seja-2` v `Seja-1`:

```
Iz: uporabniski-profili/{userId}/{childId}/Preverjanje-izgovorjave/Seja-2/
V:  uporabniski-profili/{userId}/{childId}/Preverjanje-izgovorjave/Seja-1/
```

To se naredi ročno v Supabase Storage dashboardu ali z skripto, ker Supabase Storage nima direktne "premakni" funkcije - potrebno je kopirati in izbrisati.

### Korak 4 (alternativa): Posodobi logiko, da bere iz Seja-2

Namesto premikanja datotek, lahko posodobim `session_number` na 2, da se ujema s storage mapo:

```sql
-- Alternativa: ohrani posnetke kjer so in nastavi session_number=2
UPDATE articulation_test_sessions 
SET session_number = 2
WHERE id = 'fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03';

-- Izbriši testno sejo
DELETE FROM articulation_evaluations 
WHERE session_id = 'd3742796-ad32-4880-90b3-f89767dfdb33';

DELETE FROM articulation_test_sessions 
WHERE id = 'd3742796-ad32-4880-90b3-f89767dfdb33';
```

Tako bo admin portal za sejo od 28.1. iskal posnetke v `Seja-2` kjer dejansko so.

## Priporočena rešitev

**Opcija B** (Korak 4) je boljša, ker:
- Ne zahteva premikanja 60 datotek v storage
- Ohrani konsistentnost (session_number se ujema z imenom mape)
- Je hitrejša in varnejša

## Rezultat po popravku

Po izvedbi migracije:
- V bazi bo samo ena seja za otroka Žak (od 28.1.2026)
- Ta seja bo imela `session_number=2`
- Admin portal bo prikazal sejo z vsemi 60 posnetki v pravilnem vrstnem redu
- URL za pregled bo: `/admin/tests/fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03`

