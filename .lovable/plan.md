

## Plan: Avtomatsko obveščanje o novem preverjanju izgovorjave

### Pregled

Sistem bo uporabnika obvestil ob štirih mejnikih po opravljenem preverjanju izgovorjave:
- **Dan 83** (7 dni pred potekom 3 mesecev): "Novo preverjanje bo na voljo čez 7 dni"
- **Dan 90** (na dan poteka): "Novo preverjanje je na voljo"
- **Dan 93** (3 dni po poteku): "Opomnik: Novo preverjanje čaka"
- **Dan 97** (7 dni po poteku): "Zadnji opomnik: Prosimo, opravite preverjanje"

Obvestilo bo vidno na dva načina: (1) v uporabniškem zvončku (UserNotificationBell) in (2) kot email prek Resend API.

---

### 1. Nova tabela: `user_notifications`

Obstoječa `notifications` tabela je namenjena admin/organizacijskemu portalu (ima `organization_id` NOT NULL). Za uporabniška obvestila potrebujemo ločeno tabelo.

```sql
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'test_reminder_7d_before', 'test_available', 'test_reminder_3d_after', 'test_reminder_7d_after'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.user_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.user_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
```

### 2. Nova Edge funkcija: `check-test-reminders`

Periodična Edge funkcija (pg_cron, 1x dnevno), ki:

1. Poišče vse otroke z `articulation_test_results` — zadnji `completed_at`
2. Izračuna koliko dni je minilo od zadnjega testa
3. Za vsakega otroka preveri ali je treba poslati obvestilo na dan 83, 90, 93, 97
4. Preveri ali je obvestilo za ta mejnik že bilo poslano (po `type` + `child_id` + interval)
5. Če ne: vstavi v `user_notifications` + pošlje email prek Resend

Email pošiljanje bo sledilo obstoječemu vzorcu iz `send-signup-confirmation` (Resend SDK + React Email template).

```text
Za vsak mejnik:
  1. Query: children JOIN articulation_test_results (zadnji completed_at)
  2. Izračun: daysSinceTest = now() - completed_at
  3. Preveri: ali že obstaja user_notification z istim type + child_id
  4. Če ne obstaja IN daysSinceTest >= mejnik:
     → INSERT user_notifications
     → Resend email (iz profiles tabele dobi email prek auth.users)
```

### 3. React Email template za opomnike

Datoteka: `supabase/functions/check-test-reminders/_templates/test-reminder.tsx`

4 variante besedila glede na tip opomnika, skupen template z dinamičnim naslovom in sporočilom. Sledil bo vizualnemu slogu obstoječega `signup-confirmation` templata.

### 4. Posodobitev `useUserNotifications` hooka

Trenutno hook bere samo PDF-je iz storage-a. Razširimo ga:

1. Poleg obstoječega branja storage-ov, dodaj query na novo `user_notifications` tabelo
2. Združi oba vira obvestil v eno listo, sortirano po datumu
3. `markAsRead` za user_notifications: UPDATE `is_read = true` v bazi (namesto localStorage)
4. Za stara storage-based obvestila ohrani localStorage pristop

### 5. Posodobitev `UserNotificationBell` komponente

Dodaj nov tip obvestila z ikono (npr. `ClipboardCheck`) in prilagojenim besedilom. Ob kliku na test-reminder obvestilo navigiraj na `/artikulacijski-test`.

### 6. Prikaz datuma zadnjega preverjanja na `/moja-stran`

`ArticulationTestSection` že prikazuje datum zadnjega testa. Dodaj ta razdelek tudi na `/moja-stran` (ProgressSection ali kot ločen blok), da je informacija vidna brez navigacije na podstran.

### 7. pg_cron job za dnevno izvajanje

```sql
SELECT cron.schedule(
  'check-test-reminders-daily',
  '0 8 * * *',  -- vsak dan ob 8:00 UTC
  $$ SELECT net.http_post(...) $$
);
```

---

### Tehnični povzetek sprememb

| Datoteka / Resursa | Sprememba |
|---|---|
| Migracija SQL | Nova tabela `user_notifications` + RLS |
| `supabase/functions/check-test-reminders/index.ts` | Nova Edge funkcija (cron) |
| `supabase/functions/check-test-reminders/_templates/test-reminder.tsx` | Email template |
| `src/hooks/useUserNotifications.ts` | Razširitev: bere tudi iz `user_notifications` tabele |
| `src/components/header/UserNotificationBell.tsx` | Nov tip obvestila z ikono in navigacijo |
| `src/components/progress/ArticulationTestSection.tsx` | Brez sprememb (že prikazuje datume) |
| pg_cron job (SQL insert) | Dnevno izvajanje ob 8:00 |

### Mejniki obveščanja

| Dan | Tip | Naslov | Email |
|---|---|---|---|
| 83 | `test_reminder_7d_before` | "Novo preverjanje bo na voljo čez 7 dni" | Da |
| 90 | `test_available` | "Novo preverjanje izgovorjave je na voljo!" | Da |
| 93 | `test_reminder_3d_after` | "Opomnik: Novo preverjanje čaka" | Da |
| 97 | `test_reminder_7d_after` | "Zadnji opomnik: Prosimo, opravite preverjanje" | Da |

