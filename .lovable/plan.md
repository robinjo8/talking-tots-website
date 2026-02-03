

# Načrt: Popravek NOT NULL constraint za tabelo progress

## Ugotovljen problem

Pri igranju igre Sestavljanka za logopedistovega otroka Tian se napredek **ne shrani** v bazo. Omrežni log jasno kaže napako:

```json
{
  "code": "23502",
  "message": "null value in column \"child_id\" of relation \"progress\" violates not-null constraint"
}
```

### Vzrok
Stolpec `child_id` v tabeli `progress` ima **NOT NULL constraint**, kar preprečuje shranjevanje napredka za logopedistove otroke, kjer je `child_id = null`.

| Stolpec | Trenutno stanje | Zahtevano stanje |
|---------|-----------------|------------------|
| `child_id` | NOT NULL | **NULLABLE** |
| `logopedist_child_id` | NULLABLE | NULLABLE |

---

## Rešitev

### 1. Migracija baze: Spremeni `child_id` v nullable

```sql
ALTER TABLE public.progress 
ALTER COLUMN child_id DROP NOT NULL;
```

### 2. Dodaj CHECK constraint za veljavnost podatkov

Zagotoviti moramo, da ima vsak zapis vsaj enega od dveh stolpcev:
- `child_id` (za uporabniški portal)
- `logopedist_child_id` (za admin portal)

```sql
ALTER TABLE public.progress
ADD CONSTRAINT progress_child_check 
CHECK (
  child_id IS NOT NULL OR logopedist_child_id IS NOT NULL
);
```

---

## Rezultat po popravku

### Pred popravkom
```
POST /rest/v1/progress
Body: { "child_id": null, "logopedist_child_id": "81135446-..." }
Response: 400 - "null value in column child_id violates not-null constraint"
```

### Po popravku
```
POST /rest/v1/progress
Body: { "child_id": null, "logopedist_child_id": "81135446-..." }
Response: 201 - Success ✅
```

---

## Datoteke za spremembo

| Datoteka | Akcija |
|----------|--------|
| `supabase/migrations/xxx_fix_progress_child_id_nullable.sql` | Nova migracija |

---

## Migracija

```sql
-- Omogoči null vrednost za child_id
-- To omogoča shranjevanje napredka za logopedistove otroke
ALTER TABLE public.progress 
ALTER COLUMN child_id DROP NOT NULL;

-- Dodaj constraint, ki zagotavlja, da ima vsak zapis 
-- vsaj child_id ALI logopedist_child_id
ALTER TABLE public.progress
ADD CONSTRAINT progress_child_check 
CHECK (
  child_id IS NOT NULL OR logopedist_child_id IS NOT NULL
);
```

---

## Varnostna analiza

Ta sprememba je **varna**, ker:

1. **Obstoječi podatki** - Vsi obstoječi zapisi imajo `child_id` nastavljen, zato CHECK constraint ne bo povzročil težav
2. **RLS politike** - RLS že ločuje dostop glede na `child_id` in `logopedist_child_id`
3. **Backward compatibility** - Uporabniški portal bo še vedno deloval enako (nastavi `child_id`, pusti `logopedist_child_id = null`)

