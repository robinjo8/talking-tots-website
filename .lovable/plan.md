

## Plan: Odjava od obvestil in link na /kontakt

### Problem
Vsi emaili trenutno uporabljajo `mailto:podpora@tomitalk.si` za odjavo, kar ni pravi unsubscribe mehanizem.

### Rešitev — dva tipa footerjev

**1. Sistemski/auth emaili** (registracija, MFA koda, sprememba gesla):
- Footer link "se lahko odjavite" zamenjamo z linkom na stran `/kontakt`
- Besedilo: "Če imate vprašanja, nas kontaktirajte na [strani za kontakt](https://tomitalk.com/kontakt)."
- Te emaile uporabnik NE MORE onemogočiti (so obvezni za delovanje računa)

**2. Obvestilni emaili** (opomniki za preverjanje, obvestila o načrtu):
- Footer link vodi na novo stran `/odjava-obvestil`
- Stran omogoča dejansko odjavo od email obvestil

### Spremembe

**Nova tabela `email_preferences`:**
```
- id (uuid)
- user_id (uuid, FK auth.users)
- notifications_enabled (boolean, default true)
- created_at, updated_at
```
RLS: uporabnik lahko bere/ureja samo svoje nastavitve.

**Nova stran `/odjava-obvestil`:**
- Preprosta stran z besedilom "Odjava od email obvestil"
- Sprejme query parameter `?token=...` (JWT z user_id)
- Ob kliku na gumb "Potrdi odjavo" nastavi `notifications_enabled = false`
- Prikaz potrditve "Uspešno ste se odjavili od obvestil"
- Možnost ponovne prijave

**Token za odjavo:**
- Edge funkcije ob pošiljanju obvestilnih emailov generirajo JWT token z `user_id` in `exp` (30 dni)
- Token se doda v URL: `https://tomitalk.com/odjava-obvestil?token=xxx`
- Na strani `/odjava-obvestil` se token verificira in uporabnik odjavi

**Spremembe v Edge funkcijah:**

| Datoteka | Tip | Sprememba footerja |
|---|---|---|
| `send-signup-confirmation/_templates/signup-confirmation.tsx` | Auth | Link → `/kontakt` |
| `send-mfa-code/index.ts` | Auth | Link → `/kontakt` |
| `check-test-reminders/_templates/test-reminder.tsx` | Obvestilo | Link → `/odjava-obvestil?token=xxx` |
| `generate-monthly-plan/index.ts` | Obvestilo | Link → `/odjava-obvestil?token=xxx` |

**Preverjanje pred pošiljanjem:**
- V `check-test-reminders/index.ts` in `generate-monthly-plan/index.ts` pred pošiljanjem emaila preverimo `email_preferences.notifications_enabled`
- Če je `false`, email ne pošljemo (in-app obvestilo v `user_notifications` se še vedno ustvari)

### Datoteke

| Datoteka | Akcija |
|---|---|
| SQL migracija: `email_preferences` tabela | Nova |
| `src/pages/OdjavaObvestil.tsx` | Nova stran |
| `src/App.tsx` | Dodaj route `/odjava-obvestil` |
| `supabase/functions/send-signup-confirmation/_templates/signup-confirmation.tsx` | Spremeni footer → `/kontakt` |
| `supabase/functions/send-mfa-code/index.ts` | Spremeni footer → `/kontakt` |
| `supabase/functions/check-test-reminders/_templates/test-reminder.tsx` | Spremeni footer → `/odjava-obvestil?token=xxx` |
| `supabase/functions/check-test-reminders/index.ts` | Dodaj generiranje tokena + preverjanje preferenc |
| `supabase/functions/generate-monthly-plan/index.ts` | Dodaj generiranje tokena + preverjanje preferenc |

