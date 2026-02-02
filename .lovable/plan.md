

# Načrt: Sistem za upravljanje sej preverjanja izgovorjave

## Razumljiva razlaga problema

### Trenutno stanje (kako deluje zdaj)

Predstavljaj si, da imaš mapo "Seja-1" kamor shranjuješ posnetke otroka. Trenutni sistem deluje tako:

1. **Ko začneš test**: Sistem pogleda koliko map "Seja-X" že obstaja in uporabi naslednjo
2. **Med testom**: Vsak posnetek se shrani v trenutno mapo (npr. Seja-1)
3. **Progress (kje je otrok ostal)**: Shranjeno v brskalnik (localStorage) - če zamenjaš računalnik ali brskalnik, se podatek izgubi
4. **Ko končaš test**: Ni nobene oznake da je seja "zaključena"

### Problem

Ker sistem ne ve, ali je seja dokončana (vseh 60 besed) ali ne, se lahko zgodi:
- Začneš test, otrok izgovori 5 besed, potem zapreš
- Naslednjič se lahko zgodi, da sistem ustvari novo mapo "Seja-2" ali pa nadaljuje v Seja-1 - odvisno od tega ali si na istem brskalniku

To je povzročilo, da je "PAJEK" (iz starega testa) ostal v isti mapi kot novi posnetki "R".

---

## Kako bo delovalo po popravku

### Nov tok delovanja

```text
┌─────────────────────────────────────────────────────────┐
│                    ZAČETEK TESTA                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Ali obstaja nedokončana│
              │ seja za tega otroka?   │
              │ (preveri v BAZI)       │
              └─────────────────────────┘
                     │           │
                    DA          NE
                     │           │
                     ▼           ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ Nadaljuj        │  │ Ustvari NOVO    │
        │ obstoječo sejo  │  │ sejo v bazi     │
        │ od zadnje       │  │ (status:        │
        │ shranjene besede│  │  "in_progress") │
        └─────────────────┘  └─────────────────┘
                     │           │
                     └─────┬─────┘
                           ▼
              ┌─────────────────────────┐
              │ Otrok izgovarja besede  │
              │ (1, 2, 3... do 60)     │
              │                         │
              │ Ob vsaki besedi se v   │
              │ BAZO shrani napredek   │
              │ (current_word_index)   │
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ Ali je bila izgovorjena│
              │ 60. beseda (zadnja)?   │
              └─────────────────────────┘
                     │           │
                    DA          NE
                     │           │
                     ▼           ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ Seja se označi  │  │ Seja ostane     │
        │ kot ZAKLJUČENA  │  │ "in_progress"   │
        │ (status:        │  │                 │
        │  "completed")   │  │ Naslednjič se   │
        │                 │  │ nadaljuje       │
        │ Naslednji test  │  │ od te besede    │
        │ = Seja-2        │  └─────────────────┘
        └─────────────────┘
```

### Ključna pravila

1. **Seja se ne more "pomešati"**: Ko je seja zaključena (60 besed), se zaklene - nobeni novi posnetki ne morejo več priti vanjo
2. **Progress v bazi**: Namesto v brskalnik se progress shranjuje v bazo - deluje na vseh napravah
3. **Avtomatsko nadaljevanje**: Če prekinete test, boste naslednjič avtomatsko nadaljevali od zadnje besede
4. **Nova seja samo po zaključku**: Seja-2 se začne ŠELE ko je Seja-1 popolnoma dokončana

---

## Tehnična implementacija

### 1. Sprememba sheme baze podatkov

Dodati nova polja v tabelo `articulation_test_sessions`:

| Polje | Tip | Namen |
|-------|-----|-------|
| `current_word_index` | integer | Shranjuje napredek (0-59) |
| `total_words` | integer | Število besed v testu (60) |
| `is_completed` | boolean | Ali je seja zaključena |

SQL migracija:
```sql
ALTER TABLE articulation_test_sessions 
ADD COLUMN current_word_index integer DEFAULT 0,
ADD COLUMN total_words integer DEFAULT 60,
ADD COLUMN is_completed boolean DEFAULT false;
```

### 2. Nov hook: useLogopedistSessionManager

Nadomesti trenutno logiko z novim hookom:

```typescript
// Ob začetku testa
const initializeSession = async (childId: string) => {
  // 1. Preveri če obstaja nedokončana seja
  const { data: existingSession } = await supabase
    .from('articulation_test_sessions')
    .select('*')
    .eq('logopedist_child_id', childId)
    .eq('is_completed', false)
    .single();

  if (existingSession) {
    // Nadaljuj obstoječo sejo
    return {
      sessionId: existingSession.id,
      sessionNumber: existingSession.session_number,
      startIndex: existingSession.current_word_index,
      isResume: true
    };
  }

  // 2. Določi novo številko seje
  const { data: completedSessions } = await supabase
    .from('articulation_test_sessions')
    .select('session_number')
    .eq('logopedist_child_id', childId)
    .eq('is_completed', true);
  
  const nextSessionNumber = (completedSessions?.length || 0) + 1;

  // 3. Ustvari novo sejo
  const { data: newSession } = await supabase
    .from('articulation_test_sessions')
    .insert({
      logopedist_child_id: childId,
      session_number: nextSessionNumber,
      current_word_index: 0,
      is_completed: false,
      status: 'in_progress'
    })
    .select()
    .single();

  return {
    sessionId: newSession.id,
    sessionNumber: nextSessionNumber,
    startIndex: 0,
    isResume: false
  };
};
```

### 3. Posodobitev napredka med testom

Ob vsaki uspešni izgovorjavi:

```typescript
const updateProgress = async (sessionId: string, wordIndex: number) => {
  await supabase
    .from('articulation_test_sessions')
    .update({ current_word_index: wordIndex + 1 })
    .eq('id', sessionId);
};
```

### 4. Zaključek seje

Ko otrok izgovori 60. besedo:

```typescript
const completeSession = async (sessionId: string) => {
  await supabase
    .from('articulation_test_sessions')
    .update({ 
      is_completed: true,
      status: 'pending',
      current_word_index: 60,
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);
};
```

---

## Spremembe datotek

| Datoteka | Sprememba | Status |
|----------|-----------|--------|
| SQL migracija | Dodaj `current_word_index`, `total_words`, `is_completed` | ✅ Dokončano |
| `src/hooks/useLogopedistSessionManager.ts` | Nov hook za upravljanje sej | ✅ Dokončano |
| `src/hooks/useArticulationTestNew.ts` | Uporabi nov session manager namesto storage-based logike | ✅ Dokončano |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Integracija novega session managerja | ✅ Dokončano |
| `src/components/admin/articulation/AdminArticulationCompletionDialog.tsx` | Kliče completeSession ob zaključku | ✅ Dokončano |
| `src/hooks/useLogopedistArticulationSession.ts` | Ohranjen za referenco, vendar ni več v uporabi | ⚠️ Lahko se izbriše |

---

## Rezultat po implementaciji

- **Seja-1**: Ko otrok začne preverjanje, se ustvari seja v bazi. Če prekine po 10 besedah, se shrani `current_word_index = 10`. Naslednjič nadaljuje od 11. besede. Ko izgovori 60. besedo, se seja zaklene.
- **Seja-2**: Začne se ŠELE ko je Seja-1 popolnoma zaključena (60 besed).
- **Ni mešanja**: Posnetki iz ene seje nikoli ne morejo priti v mapo druge seje.
- **Deluje na vseh napravah**: Progress je v bazi, ne v brskalniku.

---

## Opomba glede obstoječih podatkov

Obstoječi posnetek "PAJEK" v mapi Seja-1 je ostal iz prejšnjega nedokončanega testa. Po implementaciji tega sistema se takšno mešanje ne bo več dogajalo. Obstoječe posnetke bo potrebno ročno očistiti.

