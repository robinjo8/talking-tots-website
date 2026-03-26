

## Plan: Obvestilo staršem ob generiranju novega osebnega načrta

### Problem
Ko se generira nov osebni načrt (prvič ali ob renewal-u), starš ne dobi nobenega obvestila. Načrt se tiho pojavi na `/moji-izzivi`.

### Rešitev
Na koncu Edge funkcije `generate-monthly-plan`, po uspešnem zapisu načrta, vstavimo obvestilo v tabelo `user_notifications` in pošljemo email prek Resend API.

### Spremembe

**1. `supabase/functions/generate-monthly-plan/index.ts`**

Po vrstici 654 (po uspešnem generiranju), dodamo:

- Poiščemo `parent_id` iz tabele `children` (že imamo `child` objekt z `parent_id`)
- Določimo tip obvestila glede na `mode`:
  - `report_update` → tip `plan_new`, naslov: "Nov osebni načrt je pripravljen!"
  - `renewal` → tip `plan_renewed`, naslov: "Osebni načrt je bil podaljšan!"
- INSERT v `user_notifications` (user_id, child_id, type, title, message, link `/moji-izzivi`)
- Pošljemo email prek Resend API z obstoječim vzorcem (fetch na `https://api.resend.com/emails`)

Email vsebina:
- **Nov načrt**: "Za otroka {ime} je bil pripravljen nov osebni načrt vaj. Odprite aplikacijo in začnite z vajami!"
- **Podaljšanje**: "Osebni načrt za otroka {ime} je bil podaljšan z novimi vajami. Nadaljujte z vajami!"

**2. `src/hooks/useUserNotifications.ts`**

Ni sprememb — hook že bere vse zapise iz `user_notifications` tabele, novi tipi (`plan_new`, `plan_renewed`) se bodo avtomatsko prikazali.

**3. `src/components/header/UserNotificationBell.tsx`**

- Dodamo prepoznavo novih tipov `plan_new` in `plan_renewed` v funkciji `isTestReminder` (ali nova funkcija `isPlanNotification`)
- Ikona: uporabimo `Calendar` namesto `ClipboardCheck`
- Ob kliku navigacija na `/moji-izzivi`

### Tehnični detajli

- Email pošiljanje: direkten `fetch` na Resend API z `RESEND_API_KEY` (že obstaja med secrets)
- Deduplikacija: za `renewal` preverimo ali obvestilo za ta `child_id` + `plan_renewed` že obstaja v zadnjih 24 urah (preprečimo dvojna obvestila ob ponovnem klicu)
- `parent_id` je že dostopen iz `children` query-ja v Edge funkciji

