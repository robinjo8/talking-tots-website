
# Načrt: Popravek napake pri generiranju poročila in nalaganju podatkov

## Ugotovitve

### Problem 1: Napaka pri vstavljanju v bazo
**Napaka:** `"invalid input syntax for type uuid: """`

**Vzrok:** V funkciji `handleGeneratePdf` (vrstica 383) se pošilja:
```typescript
session_id: sessionId || ''
```
Ko `sessionId` ni na voljo, se pošlje prazen string `''`, kar ni veljaven UUID. PostgreSQL zavrne prazen string kot UUID.

### Problem 2: Podatki se ne naložijo pri popravljanju
**Vzrok:** Ker vstavljanje v bazo ne uspe (zaradi napake #1), se zapis nikoli ne ustvari. Ko nato uporabnik klikne "Popravi", funkcija `handleEditGeneratedReport` išče poročilo v bazi po `pdf_url`, vendar ga ne najde, ker ni bil nikoli ustvarjen.

---

## Rešitev

### 1. Sprememba sheme baze - session_id mora biti nullable

Ustvariti SQL migracijo, ki spremeni stolpec `session_id` iz obveznega v opcijskega (nullable):

```sql
-- Spremeni session_id da dovoli NULL vrednosti
ALTER TABLE public.logopedist_reports 
ALTER COLUMN session_id DROP NOT NULL;
```

### 2. Popravek kode v AdminUserDetail.tsx

Spremeniti vrstico 383 iz:
```typescript
session_id: sessionId || '',
```

Na:
```typescript
session_id: sessionId || null,
```

S tem se pošlje `null` namesto praznega stringa, kar je veljavna vrednost za nullable UUID polje.

Prav tako je potrebno popraviti logiko pridobivanja `session_id`. Trenutna koda (vrstice 364-376) ni pravilna - pogoj `reportData.selectedSessionId` ne deluje pravilno.

**Popravljena logika za pridobivanje session_id:**
```typescript
// Find session ID - use selected session or find first session for child
let sessionId: string | null = null;
if (reportData.selectedSessionId) {
  sessionId = reportData.selectedSessionId;
} else if (recordings.length > 0) {
  // Try to find any session for this child
  const { data: sessionData } = await supabase
    .from('articulation_test_sessions')
    .select('id')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (sessionData) {
    sessionId = sessionData.id;
  }
}
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| Nova SQL migracija | Ustvari | `ALTER TABLE ... DROP NOT NULL` za session_id |
| `src/pages/admin/AdminUserDetail.tsx` | Posodobi | 1) Popravek `sessionId || null` namesto `sessionId || ''`, 2) Popravek logike za pridobivanje session_id |

---

## Diagram toka popravka

```text
PREJ (napaka):
┌─────────────────────────────────────────────────────────────┐
│  1. Generiraj PDF                                           │
│  2. Upload v Storage ✓                                      │
│  3. INSERT v bazo:                                          │
│     session_id = '' (prazen string)                         │
│     → NAPAKA: "invalid input syntax for type uuid"          │
│  4. Zapis NI ustvarjen                                      │
│  5. Popravi → išče v bazi → NE NAJDE → prazna polja        │
└─────────────────────────────────────────────────────────────┘

POTEM (popravek):
┌─────────────────────────────────────────────────────────────┐
│  1. Generiraj PDF                                           │
│  2. Upload v Storage ✓                                      │
│  3. INSERT v bazo:                                          │
│     session_id = null (veljavna vrednost)                   │
│     → USPEH ✓                                               │
│  4. Zapis JE ustvarjen                                      │
│  5. Popravi → išče v bazi → NAJDE → naloži podatke ✓       │
└─────────────────────────────────────────────────────────────┘
```

---

## Pričakovani rezultat

Po implementaciji:
1. PDF generiranje bo uspešno ustvarilo zapis v tabeli `logopedist_reports`
2. Poročila bodo vidna na strani `/admin/reports`
3. Klik na "Popravi" bo uspešno naložil vse podatke (anamneza, ugotovitve, predlog za vaje, opombe) v urejevalnik
4. Popravljeno poročilo se bo shranilo z ustreznim statusom "revised"
