
# Načrt: Popravek filtriranja nedokončanih sej v "V čakanju"

## Problem

Trenutno se **nedokončane seje** preverjanja izgovorjave prikazujejo logopedom v razdelku "V čakanju", čeprav otrok še ni izgovoril vseh besed.

### Primer problematičnega scenarija:
1. Otrok začne preverjanje izgovorjave na uporabniškem portalu
2. Izgovori 10 besed od 60
3. Zapusti test (zapre aplikacijo ali navigira stran)
4. Seja z `status: 'pending'` in `is_completed: false` se takoj prikaže logopedu v "V čakanju"
5. Logoped vidi nepopolno sejo brez vseh posnetkov

### Zakaj se to dogaja:
- Seja se ustvari **takoj ob začetku testa** s `status: 'pending'` in `is_completed: false`
- Query za "V čakanju" filtrira samo po `status = 'pending'` in `assigned_to IS NULL`
- **Ne** preverja, ali je seja dejansko dokončana (`is_completed = true`)

## Rešitev

Dodaj filter `.eq('is_completed', true)` v vse query-je, ki prikazujejo seje logopedom:

1. **`usePendingTests.ts`** - seznam sej v "V čakanju"
2. **`useAdminCounts.ts`** - število v navigation badge-u
3. **`check-old-pending-tests`** Edge funkcija - obvestila o starih sejah

## Tehnične spremembe

### Datoteka 1: `src/hooks/usePendingTests.ts`

Dodaj filter za dokončane seje:

```typescript
// Trenutno (NAPAČNO):
let query = supabase
  .from('articulation_test_sessions')
  .select('...')
  .eq('status', 'pending')
  .is('assigned_to', null)
  .order('submitted_at', { ascending: true });

// Novo (PRAVILNO):
let query = supabase
  .from('articulation_test_sessions')
  .select('...')
  .eq('status', 'pending')
  .eq('is_completed', true)  // <-- DODAJ TO
  .is('assigned_to', null)
  .order('submitted_at', { ascending: true });
```

### Datoteka 2: `src/hooks/useAdminCounts.ts`

Dodaj filter v pending count query:

```typescript
// Trenutno (NAPAČNO):
const { count, error } = await supabase
  .from('articulation_test_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
  .is('assigned_to', null);

// Novo (PRAVILNO):
const { count, error } = await supabase
  .from('articulation_test_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
  .eq('is_completed', true)  // <-- DODAJ TO
  .is('assigned_to', null);
```

### Datoteka 3: `supabase/functions/check-old-pending-tests/index.ts`

Dodaj filter v Edge funkcijo za obvestila:

```typescript
// Trenutno (NAPAČNO):
const { data: oldSessions, error: sessionsError } = await supabase
  .from('articulation_test_sessions')
  .select('...')
  .eq('status', 'pending')
  .is('assigned_to', null)
  .lt('submitted_at', sevenDaysAgo.toISOString())

// Novo (PRAVILNO):
const { data: oldSessions, error: sessionsError } = await supabase
  .from('articulation_test_sessions')
  .select('...')
  .eq('status', 'pending')
  .eq('is_completed', true)  // <-- DODAJ TO
  .is('assigned_to', null)
  .lt('submitted_at', sevenDaysAgo.toISOString())
```

## Seznam datotek za spremembo

| Datoteka | Akcija |
|----------|--------|
| `src/hooks/usePendingTests.ts` | Dodaj `.eq('is_completed', true)` |
| `src/hooks/useAdminCounts.ts` | Dodaj `.eq('is_completed', true)` |
| `supabase/functions/check-old-pending-tests/index.ts` | Dodaj `.eq('is_completed', true)` |

## Rezultat

Po popravku:

1. **Nedokončane seje** (kjer je otrok izgovoril npr. 10 besed) **NE** bodo prikazane v "V čakanju"
2. **Dokončane seje** (kjer je otrok izgovoril vse besede) **BODO** prikazane v "V čakanju"
3. Navigation badge bo prikazoval samo število **pravih** sej, ki čakajo na pregled
4. Obvestila o starih sejah se bodo pošiljala samo za **dokončane** seje

## Diagram poteka

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    UPORABNIŠKI PORTAL                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Otrok začne test                                                   │
│        │                                                            │
│        ▼                                                            │
│  ┌─────────────────────────────────────────┐                        │
│  │ SEJA USTVARJENA                         │                        │
│  │ status: 'pending'                       │                        │
│  │ is_completed: FALSE                     │  ◀── NI vidna logopedu │
│  │ current_word_index: 0                   │                        │
│  └─────────────────────────────────────────┘                        │
│        │                                                            │
│        ▼                                                            │
│  Otrok izgovori besede (1...59)                                     │
│  └─► current_word_index se posodablja      │  ◀── NI vidna logopedu │
│        │                                                            │
│        ▼                                                            │
│  Otrok izgovori ZADNJO besedo (60)                                  │
│        │                                                            │
│        ▼                                                            │
│  ┌─────────────────────────────────────────┐                        │
│  │ SEJA DOKONČANA                          │                        │
│  │ status: 'pending'                       │                        │
│  │ is_completed: TRUE                      │  ◀── ZDAJ vidna logopedu│
│  │ submitted_at: [timestamp]               │                        │
│  └─────────────────────────────────────────┘                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN PORTAL (Logoped)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "V čakanju" prikazuje SAMO seje kjer:                              │
│    • status = 'pending'                                             │
│    • is_completed = TRUE   ◀── NOV FILTER                           │
│    • assigned_to IS NULL                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
