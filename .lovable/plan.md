

# Dvostopenjska verifikacija (2FA) za portal "Za organizacije"

## Povzetek
Po uspešni prijavi z geslom bo vsak logoped prejel 6-mestno kodo na svoj email. Šele po vnosu te kode bo dobil dostop do admin portala. Za starše (navadne uporabnike) se ne bo nič spremenilo.

## Kako bo delovalo

```text
Logoped vnese email + geslo
        |
        v
  Geslo pravilno?
    Ne --> Napaka
    Da --> Generiraj 6-mestno kodo
        |
        v
  Pošlji kodo na email (Edge Function + Resend)
        |
        v
  Prikaži zaslon za vnos kode
        |
        v
  Koda pravilna in ni potekla (10 min)?
    Ne --> Napaka / ponoven poskus
    Da --> Dostop do admin portala
```

## Kaj bomo naredili

### 1. Nova tabela v bazi: `mfa_codes`
Shranjevala bo generirane kode za vsakega logopeda:
- `id` - primarni ključ
- `user_id` - ID uporabnika (brez FK na auth.users)
- `code` - 6-mestna koda (hash, ne plain text)
- `expires_at` - veljavnost (10 minut)
- `attempts` - stevec neuspelih poskusov (max 5)
- `used` - ali je bila koda ze porabljena
- `created_at` - cas nastanka

RLS politike: tabela bo dostopna samo preko Edge Funkcij (service_role), navadni uporabniki je ne bodo videli.

### 2. Nova Edge Function: `send-mfa-code`
- Prejme `user_id` in `email`
- Preveri, da je uporabnik logoped (query na `logopedist_profiles`)
- Generira nakljucno 6-mestno kodo
- Shrani hash kode v `mfa_codes` tabelo
- Pošlje email s kodo preko Resend API (z domeno tomitalk.si)
- Omeji pogostost posiljanja (max 1 koda na 60 sekund)

### 3. Nova Edge Function: `verify-mfa-code`
- Prejme `user_id` in `code`
- Preveri kodo proti hashirani vrednosti v bazi
- Preveri, da ni potekla (10 min) in ni bila ze uporabljena
- Omeji stevilo poskusov na 5 (varnost pred brute-force)
- Ce je koda pravilna, vrne success
- Ce je napacna, poveca stevec poskusov

### 4. Nova stran: MFA vnos kode
Nova komponenta, ki se prikaže po uspešni prijavi z geslom:
- Polje za vnos 6-mestne kode (z uporabo input-otp knjiznice, ki je ze namesccena)
- Odstevalnik casa do poteka kode
- Gumb "Posli novo kodo" (z rate limitom 60 sekund)
- Jasna sporocila o napakah

### 5. Spremembe v AdminLogin.tsx
Po uspesni prijavi z geslom:
- Namesto takojsnjega preusmerjanja na `/admin` se poklice `send-mfa-code`
- Prikaze se zaslon za vnos kode
- Sele po uspesni verifikaciji kode se uporabnik preusmeri na `/admin`

### 6. Spremembe v AdminAuthContext.tsx
- Dodano stanje `mfaVerified` - ali je bila 2FA opravljena
- `AdminLayout` bo preverjal, da je `mfaVerified = true`
- Stanje `mfaVerified` se shrani v sessionStorage (velja do zaprtja zavihka)

## Tehnicni detajli

### Varnostni ukrepi
- Kode so hashirane v bazi (ne plain text)
- Maksimalno 5 poskusov na kodo
- Koda potece po 10 minutah
- Rate limit: 1 nova koda na 60 sekund
- Stare neuporabljene kode se oznacijo kot neuporabljene
- Brute-force zascita z zaklepanjem po prevec poskusih

### Datoteke, ki se bodo spremenile/dodale
- **Nova tabela**: `mfa_codes` (SQL migracija)
- **Nova Edge Function**: `supabase/functions/send-mfa-code/index.ts`
- **Nova Edge Function**: `supabase/functions/verify-mfa-code/index.ts`
- **Sprememba**: `supabase/config.toml` (dodaj obe novi funkciji)
- **Nova komponenta**: `src/components/admin/MfaVerification.tsx`
- **Sprememba**: `src/pages/admin/AdminLogin.tsx` (dodaj MFA korak)
- **Sprememba**: `src/contexts/AdminAuthContext.tsx` (dodaj mfaVerified stanje)
- **Sprememba**: `src/components/admin/AdminLayout.tsx` (preveri mfaVerified)

### Obstojecci resursi, ki jih ze imate
- **RESEND_API_KEY** - ze konfiguriran, isti API kljuc se uporabi za posiljanje MFA kod
- **Domena tomitalk.si** - ze verificirana v Resend
- **input-otp** knjiznica - ze namescena za vnos kode
- **mfa_enabled** polje v `logopedist_profiles` - ze obstaja v bazi (trenutno neuporabljeno)

## Kaj se ne spremeni
- Prijava za starse (navadne uporabnike) ostane enaka - brez 2FA
- Registracija logopedov ostane enaka
- Potrjevanje cllanstva (Super Admin odobritev) ostane enako

