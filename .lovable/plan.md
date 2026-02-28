

# Izolacija podatkov med organizacijami in filtri za Clanstva

## Analiza problema

### Trenutno stanje (VARNOSTNA LUKNJA)

RLS politike na tabelah `articulation_test_sessions`, `articulation_evaluations` in `articulation_word_results` uporabljajo pogoj `is_internal_logopedist(auth.uid())`, ki daje TomiTalk logopedom (Robert, Spela, Ema) **neomejen dostop do VSEH podatkov** -- vkljucno s podatki od OS Test in vseh drugih zunanjih organizacij.

Prizadete RLS politike:

| Tabela | Politika | Problem |
|--------|----------|---------|
| `articulation_test_sessions` | "Assigned logopedists can view/update sessions" | `OR is_internal_logopedist()` = vidi VSE seje |
| `articulation_evaluations` | "Internal logopedists can create/update/read all evaluations" | Blanketni dostop do VSEH ocen |
| `articulation_word_results` | "Logopedists can view/update assigned word results" | `OR is_internal_logopedist()` = vidi VSE rezultate |

### Kaj MORAJO videti TomiTalk logopedi
- Seje iz uporabniskega portala (`source_type = 'parent'`) -- to so otroci starsev
- Seje dodeljene njim osebno (`assigned_to = moj_profil_id`)

### Kaj NE SMEJO videti TomiTalk logopedi
- Seje drugih organizacij (OS Test ipd.) z `source_type = 'logopedist'` in drugo `organization_id`

### Kaj vidijo OS Test logopedi (ze pravilno)
- Samo seje svoje organizacije (politika "Logopedists see own organization sessions" ze pravilno filtrira)

---

## Tehnicni koraki

### Korak 1: Posodobitev RLS na `articulation_test_sessions`

Zamenjati politiki "Assigned logopedists can view/update sessions":

**STARO:**
```sql
USING (
  assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  OR is_internal_logopedist(auth.uid())
)
```

**NOVO:**
```sql
USING (
  assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  OR (is_internal_logopedist(auth.uid()) AND source_type = 'parent')
)
```

To pomeni: interni logopedi vidijo samo seje starsev + seje dodeljene njim. Ce jim je dodeljena seja od OS Test, jo se vedno vidijo.

### Korak 2: Posodobitev RLS na `articulation_evaluations`

Zamenjati 3 politike za interne logopede:
- "Internal logopedists can create all evaluations"
- "Internal logopedists can update all evaluations"
- "Interni logopedi lahko berejo vse ocene"

Namesto blanketnega dostopa omejiti na ocene za seje, do katerih ima logoped dostop (source_type = 'parent' ALI assigned_to = moj profil):

```sql
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = articulation_evaluations.session_id
    AND (
      s.source_type = 'parent'
      OR s.assigned_to IN (
        SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
      )
    )
  )
  AND is_internal_logopedist(auth.uid())
)
```

### Korak 3: Posodobitev RLS na `articulation_word_results`

Enaka logika kot pri evaluations -- omejiti "Logopedists can view/update assigned word results" da interni logopedi vidijo samo rezultate za seje tipa 'parent' ali njim dodeljene:

```sql
USING (
  session_id IN (
    SELECT id FROM articulation_test_sessions
    WHERE assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  )
  OR (
    is_internal_logopedist(auth.uid())
    AND session_id IN (
      SELECT id FROM articulation_test_sessions
      WHERE source_type = 'parent'
        OR assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
    )
  )
)
```

### Korak 4: Posodobitev `useAdminCounts.ts`

Pending count mora upostevati organizacijski kontekst:
- Interni: stej samo `source_type = 'parent'` seje
- Zunanji: stej samo seje svoje organizacije

### Korak 5: Posodobitev `useAdminTests.ts`

Dodati `profile` parameter in filtrirati poizvedbo:
- Interni: samo `source_type = 'parent'` seje + njim dodeljene
- Zunanji: samo seje njihove organizacije
(RLS ze poskrbi za to, a za optimizacijo dodamo se filter v kodi)

### Korak 6: Filtri na strani "Clanstva" (`AdminMemberships.tsx`)

Dodati v sekcijo "Aktivni clani":

**Filter po organizaciji** -- dropdown z vsemi organizacijami (TomiTalk, OS Test, ...) + "Vse organizacije"

**Dodani stolpci/podatki za vsakega aktivnega clana:**
- Organizacija (ze prikazano)
- Email (ze prikazano)
- Datum registracije
- Zadnja prijava (pridobimo iz `auth.users` prek Edge funkcije ali RPC)

**Predlagani filtri:**
1. **Filter po organizaciji** -- najpomembnejsi, omogoca hitro pregledovanje clanov po solah/organizacijah
2. **Filter po vlogi/tipu organizacije** -- "Interni" vs "Zunanji" -- za locevanje TomiTalk logopedov od solskih
3. **Iskalno polje** -- ze obstaja na strani "Vsa preverjanja", dodati tudi tukaj za iskanje po imenu/emailu

### Korak 7: Prikaz "Zadnja prijava" na Clanstvih

Ustvariti RPC funkcijo `get_users_last_sign_in` (SECURITY DEFINER), ki vrne `last_sign_in_at` iz `auth.users` za podane user_id-je. Dostop omejen na super_admin.

---

## Kaj ostane NESPREMENJENO

- Stran "Clanstva" -- robert.kujavec@gmail.com se vedno vidi VSE logopede vseh organizacij (to je super admin funkcionalnost, NI varnostna luknja)
- Razdelek "Upravljanje" (Uporabniki, Porocila, Sporocila) -- se vedno viden samo internim logopedom
- OS Test logopedi -- njihov dostop ostane enak (samo svoja organizacija)
- Dodeljevanje sej -- ce robert dodeli OS Test sejo sebi, jo se vedno vidi (prek assigned_to politike)
- Vse uporabniske funkcionalnosti (igre, profil, otroci) -- nespremenjen

## Vrstni red implementacije

1. Najprej RLS migracija (koraki 1-3) -- to je kriticna varnostna popravka
2. Nato aplikacijska koda (koraki 4-5) -- za konsistentnost s klientske strani
3. Na koncu UI izboljsave (koraki 6-7) -- filtri na strani Clanstva

