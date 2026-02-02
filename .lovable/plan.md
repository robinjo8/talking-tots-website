

# Načrt: Popravek napake pri shranjevanju seje za logopediste

## Problem

Pri shranjevanju preverjanja izgovorjave za otroka, ki ga upravlja logoped, se pojavi napaka:

```
insert or update on table "articulation_test_sessions" violates foreign key constraint 
"articulation_test_sessions_child_id_fkey"
```

### Vzrok napake

Tabela `articulation_test_sessions` ima dve ločeni polji:
- `child_id` (NOT NULL) → referencira tabelo `children` (otroci staršev)
- `logopedist_child_id` (nullable) → referencira tabelo `logopedist_children` (otroci logopedov)

Trenutna koda v `useLogopedistArticulationSession.ts` naredi napako na vrstici 47:

```typescript
child_id: logopedistChildId,  // NAPAKA: UUID iz logopedist_children se vstavi v child_id
```

To ne deluje, ker UUID otroka logopeda ne obstaja v tabeli `children`, kar krši foreign key constraint.

---

## Rešitev

### Možnost 1: Spremeniti shemo baze (child_id → nullable)

Spremeniti `child_id` v nullable polje:
- PRO: Čista arhitektura - seje za logopedove otroke nimajo `child_id`
- CONTRA: Potrebna migracija, lahko poruši drugo kodo

### Možnost 2: Uporabiti placeholder UUID ✅ PRIPOROČENO

Uporabiti poseben "placeholder" UUID za seje logopedov:
- PRO: Ni potrebna sprememba sheme
- PRO: Hitro za implementacijo
- CONTRA: "Hack" rešitev, vendar bo delovala

---

## Implementacija (Možnost 2)

### Datoteka: `src/hooks/useLogopedistArticulationSession.ts`

Najprej ustvarim placeholder otroka v tabeli `children` z posebnim imenom, ki označuje da je placeholder za logopedove seje. Nato uporabim ta UUID kot `child_id`.

**Sprememba:**

```typescript
// KONSTANTA - placeholder child za logopediste
const LOGOPEDIST_PLACEHOLDER_CHILD_ID = '00000000-0000-0000-0000-000000000001';

const saveSession = useCallback(async (
  logopedistChildId: string,
  sessionNumber: number
): Promise<SaveSessionResult> => {
  if (!profile || !user) {
    return { success: false, error: 'Ni prijavljenega logopeda' };
  }

  setIsSaving(true);

  try {
    const { data: sessionData, error: sessionError } = await supabase
      .from('articulation_test_sessions')
      .insert({
        // Uporabimo placeholder child_id za logopediste
        // (ta otrok mora obstajati v tabeli children)
        child_id: LOGOPEDIST_PLACEHOLDER_CHILD_ID,
        parent_id: user.id,
        logopedist_child_id: logopedistChildId,  // Pravi ID otroka
        organization_id: profile.organization_id,
        source_type: 'logopedist',
        status: 'pending',
        session_number: sessionNumber,
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    // ...
  }
}, [profile, user]);
```

### Potrebna SQL migracija

Ustvariti placeholder otroka v tabeli `children`:

```sql
-- Vstavi placeholder otroka za logopediste
INSERT INTO public.children (
  id, 
  parent_id, 
  name, 
  age, 
  gender
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',  -- System user
  '_LOGOPEDIST_PLACEHOLDER',
  0,
  NULL
) ON CONFLICT (id) DO NOTHING;
```

**OPOMBA:** Potreben bo tudi sistemski uporabnik za `parent_id` ali uporaba dejanskega auth.uid() logopeda.

---

## Alternativna implementacija (boljša dolgoročno)

Namesto placeholder-ja lahko spremenimo shemo baze:

```sql
-- Naredi child_id nullable
ALTER TABLE articulation_test_sessions 
ALTER COLUMN child_id DROP NOT NULL;
```

Nato v kodi:

```typescript
const { data: sessionData, error: sessionError } = await supabase
  .from('articulation_test_sessions')
  .insert({
    child_id: null,  // NULL za logopedove otroke
    parent_id: user.id,
    logopedist_child_id: logopedistChildId,
    // ...
  })
```

---

## Povzetek sprememb

| Datoteka/Akcija | Sprememba |
|-----------------|-----------|
| SQL migracija | Dodaj placeholder otroka ALI naredi `child_id` nullable |
| `src/hooks/useLogopedistArticulationSession.ts` | Uporabi placeholder UUID ali null za `child_id` |

## Rezultat

Po popravku:
- Logopedi bodo lahko uspešno shranjevali seje preverjanja izgovorjave
- Seje bodo pravilno označene z `logopedist_child_id` in `organization_id`
- Foreign key constraint ne bo več kršen

