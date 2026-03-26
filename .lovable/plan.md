

## Plan: Logo slika in footer za vse Resend emaile

### Problem
- Vsi emaili uporabljajo besedilni logo ("Tomi" + "Talk" s CSS barvami) namesto dejanske slike logotipa `TomiTalk_logo_22.png`
- MFA koda in obvestilo o načrtu (inline HTML) nimata ustreznega footerja z odjavnim besedilom
- "Odjavite" link v footerju ne vodi nikamor

### Potrebna informacija
Moram vedeti v katerem Supabase storage bucket-u se nahaja `TomiTalk_logo_22.png`. Predvidevam `slike-ostalo` — torej URL: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/TomiTalk_logo_22.png`. Če je v drugem bucketu, mi sporoči.

### Spremembe (4 datoteke)

**1. `supabase/functions/send-mfa-code/index.ts`**
- V inline HTML zamenjam besedilni logo z `<img>` tagom za `TomiTalk_logo_22.png` (centriran, max-width 180px)
- Na koncu emaila dodam footer: "Če niste ustvarili računa pri TomiTalk..." + "S spoštovanjem, TomiTalk" + "To sporočilo ste prejeli..." z linkom za odjavo
- Footer oblikovan enako kot v `signup-confirmation.tsx`

**2. `supabase/functions/generate-monthly-plan/index.ts` (vrstica 699-711)**
- Zamenjam inline HTML z enakim vzorcem: `<img>` logo zgoraj, zelena glava
- Dodam enak footer kot zgoraj

**3. `supabase/functions/check-test-reminders/_templates/test-reminder.tsx`**
- V header sekciji zamenjam `<span>` logo z `<Img>` React Email komponento za `TomiTalk_logo_22.png`
- Dodam import `Img` iz `@react-email/components`
- V footerju "se lahko odjavite" dodaj link na email nastavitve (uporabim `mailto:` ali link na stran za odjavo)

**4. `supabase/functions/send-signup-confirmation/_templates/signup-confirmation.tsx`**
- V header sekciji zamenjam `<span>` logo z `<Img>` React Email komponento
- `Img` je že importiran

### Footer tekst (enak povsod)
```
Če niste ustvarili računa pri TomiTalk, lahko to sporočilo varno prezrete.

S spoštovanjem,
TomiTalk

To sporočilo ste prejeli, ker ste se prijavili v TomiTalk.
Če teh e-poštnih sporočil ne želite več prejemati, se lahko odjavite.
```

### Odjava link
Za "se lahko odjavite" uporabim `mailto:podpora@tomitalk.si?subject=Odjava od obvestil` — ker projekt nima dedicirane unsubscribe strani. Alternativno lahko ustvarimo preprosto stran `/odjava-obvestil`, če želiš pravi unsubscribe mehanizem.

### Deployment
Po spremembah deplojiram vse tri Edge funkcije: `send-mfa-code`, `generate-monthly-plan`, `check-test-reminders`. Funkcija `send-signup-confirmation` se prav tako deploja.

