

# Plan: Popravek RLS politike na tabeli `progress` za organizacijsko vidnost

## Povzetek problema

Logopedi v isti organizaciji (npr. OŠ Test) lahko zdaj vidijo otroka, ki ga je dodal kolega, vendar **ne morejo videti njegovega napredka (progress)**. To pomeni:
- Na strani "Napredek" (`/admin/children/{childId}/progress`) vidijo prazen seznam
- Zgodovina aktivnosti je prazna
- Statistika zvezdic/zmajev ni vidna

## Analiza trenutnega stanja

### Trenutne RLS politike na tabeli `progress`

| Politika | Ukaz | Pogoj |
|----------|------|-------|
| Logopedists can manage own children progress | ALL (*) | `logopedist_child_id` pripada otroku, kjer je `lp.user_id = auth.uid()` |
| Parents can view their children's progress | SELECT | `child_id` pripada staršu |
| Parents can add progress | INSERT | `child_id` pripada staršu |

**Problem:** Politika za logopede preverja samo `logopedist_id = auth.uid()`, ne pa organizacijske pripadnosti.

### Kako deluje pridobivanje napredka

```text
AdminChildProgress.tsx
├── useLogopedistProgress(childId)
│   └── RPC: get_logopedist_child_activity_summary  ← SECURITY DEFINER ✓
│       └── Obide RLS, deluje pravilno
│
└── Direktna poizvedba na 'progress' tabelo  ← BLOKIRANA za org otroke ✗
    └── SELECT ... WHERE logopedist_child_id = childId
```

**Ugotovitev:**
- `useLogopedistProgress` uporablja RPC funkcijo z `SECURITY DEFINER`, ki obide RLS → **DELUJE**
- Direktna poizvedba v `AdminChildProgress.tsx` za zgodovino → **BLOKIRANA**

## Kaj je potrebno popraviti

Potrebno je posodobiti RLS politiko za `SELECT` na tabeli `progress`, da dovoli branje tudi za otroke iz iste organizacije.

## Nova RLS politika

### Politika za branje (SELECT)

```sql
-- Odstrani staro politiko
DROP POLICY IF EXISTS "Logopedists can manage own children progress" ON public.progress;

-- Nova SELECT politika z organizacijsko vidnostjo
CREATE POLICY "Logopedists can view org children progress"
ON public.progress FOR SELECT
USING (
  -- Dovoli če je logopedist_child_id NULL (parent progress)
  logopedist_child_id IS NULL
  OR
  -- ALI če je logopedist lastnik otroka
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
  OR
  -- ALI če je logopedist v isti organizaciji z aktivno licenco
  logopedist_child_id IN (
    SELECT lc.id
    FROM logopedist_children lc
    JOIN logopedist_profiles owner_lp ON lc.logopedist_id = owner_lp.id
    JOIN logopedist_profiles my_lp ON my_lp.user_id = auth.uid()
    JOIN organization_licenses ol ON ol.organization_id = my_lp.organization_id
    WHERE owner_lp.organization_id = my_lp.organization_id
      AND ol.status = 'active'
  )
);
```

### Politiki za pisanje (INSERT, UPDATE, DELETE) - ostanejo restriktivne

```sql
-- INSERT: samo za lastne otroke
CREATE POLICY "Logopedists can insert own children progress"
ON public.progress FOR INSERT
WITH CHECK (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- UPDATE: samo za lastne otroke
CREATE POLICY "Logopedists can update own children progress"
ON public.progress FOR UPDATE
USING (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- DELETE: samo za lastne otroke
CREATE POLICY "Logopedists can delete own children progress"
ON public.progress FOR DELETE
USING (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);
```

## Kaj se spremeni

| Scenarij | Prej | Potem |
|----------|------|-------|
| Logoped A vidi napredek svojega otroka | ✓ Deluje | ✓ Deluje |
| Logoped A vidi napredek otroka kolega B (ista org) | ✗ Prazen seznam | ✓ Vidi napredek |
| Logoped A dodaja napredek za otroka kolega B | ✗ Blokirano | ✗ Še vedno blokirano |
| Logoped A briše napredek otroka kolega B | ✗ Blokirano | ✗ Še vedno blokirano |
| Logoped iz druge organizacije | ✗ Blokirano | ✗ Še vedno blokirano |

## Varnostna analiza

| Vidik | Status | Razlaga |
|-------|--------|---------|
| Branje tujega napredka | Omejeno na org | Samo člani iste organizacije z aktivno licenco |
| Pisanje v tuj napredek | Blokirano | INSERT/UPDATE/DELETE zahtevajo lastništvo |
| Brez organizacije | Blokirano | Če ni `organization_licenses` z `status = 'active'` |

## Datoteke za spremembo

| Tip | Datoteka/Lokacija | Sprememba |
|-----|-------------------|-----------|
| SQL Migracija | Nova migracija | Posodobi RLS politike na `progress` tabeli |

## Koraki implementacije

1. Ustvari SQL migracijo, ki:
   - Odstrani obstoječo politiko "Logopedists can manage own children progress"
   - Doda novo SELECT politiko z organizacijsko vidnostjo
   - Doda ločene INSERT/UPDATE/DELETE politike za lastništvo

2. Preveri, da politike za starše ostanejo nespremenjene

## Testiranje po implementaciji

1. Prijavi se kot logoped v organizaciji OŠ Test (ne Janez Novak)
2. Odpri otroka Tian na strani "Napredek"
3. Preveri, da:
   - Vidiš statistiko zvezdic/zmajev (UnifiedProgressDisplay)
   - Vidiš zgodovino aktivnosti (če obstaja)
4. Poskusi dodati napredek za tujega otroka - mora biti blokirano

