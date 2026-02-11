

# Analiza in popravki: Registracija, prijava z Google, odjava

---

## UGOTOVITVE

### 1. Google prijava -- napaka "origin_mismatch" (Error 400)
**Vzrok:** V Google Cloud Console imas v "Authorized JavaScript origins" napacen URL. Dodal si `https://preview--tomitalk.lovable.app`, kar je NAPACEN format.

Pravilni URL-ji, ki morajo biti v Google Console:
- `https://tomitalk.lovable.app` (produkcija)
- `https://tomitalk.si` (custom domena, ce jo imas)
- `https://id-preview--dc6f3012-b411-4c62-93c0-292d63747df0.lovable.app` (preview za razvoj)

**To NI popravek v kodi** -- to moras sam dodati v Google Cloud Console > API Credentials > OAuth 2.0 Client ID > Authorized JavaScript origins.

### 2. Google registracija -- pravilno delovanje
Ko se uporabnik registrira z Google racunom, Supabase avtomatsko potrdi email (ker ga je Google ze verificiral). Uporabnik `qjavec@gmail.com` ima `email_confirmed_at` nastavljen na isti cas kot `created_at`. To je pravilno -- Google uporabniki NE potrebujejo potrditvenega emaila.

Trenutna koda v `Register.tsx` po uspesni Google registraciji takoj preusmeri na `/` (domov). To je OK za Google uporabnike, ker je email ze potrjen.

### 3. Email registracija -- problem z Lea Erzar
Lea se je registrirala z emailom in geslom (provider: `email`). Registracija je bila ob 21:22:49, potrditev ob 21:23:31 (42 sekund pozneje).

**Problem v kodi** (`Register.tsx`, vrstice 97-101): Ce Supabase vrne `data.session` skupaj z `data.user`, koda preusmeri na `/` in uporabnik je takoj vpisan -- BREZ potrditve emaila. To se zgodi, ce Supabase vkljuci sejo pred potrditvijo.

**Popravek:** Po email registraciji VEDNO preusmeriti na `/login` s sporocilom "Potrdite email" -- nikoli ne pustiti neposredne prijave. Sejo je treba uniciti, da se prepreci dostop brez potrditve.

### 4. Gumb "Odjava" ne deluje na telefonu (PWA)
Funkcija `signOut()` v `AuthContext.tsx` deluje pravilno na namizju. Na mobilni PWA je mozna tezava s tem, da se stanje ne pocisti pravilno v service workerju/cache-u. Gumb sam po sebi klice `signOut()` in nato `navigate("/login")` -- ce `signOut()` traja predolgo ali pa se PWA ne posodobi, uporabnik morda ne vidi spremembe, dokler ne zapre in znova odpre aplikacijo.

**Popravek:** Dodati `window.location.href = "/login"` namesto `navigate("/login")` za polni page reload, ki pocisti tudi PWA cache.

### 5. Dodajanje otroka -- napaka za Lea
Lea je imela napako pri dodajanju otroka PRED potrditvijo emaila. To je verjetno posledica tega, da `handle_new_user` trigger v bazi ni uspesno ustvaril profila (ker email se ni bil potrjen), ali pa je bil `children` INSERT zavrnjen, ker profil se ni obstajal.

Po potrditvi emaila je trigger ustvaril profil in dodajanje je delovalo. **Resitev:** Ce zagotovimo, da uporabnik ne more dostopati do aplikacije brez potrjenega emaila, se ta problem samodejno resi.

---

## PLAN POPRAVKOV

### Popravek 1: Register.tsx -- vedno zahtevaj potrditev emaila
Po email registraciji vedno uniciti sejo in preusmeriti na `/login`:

```text
// Po signUp, ne glede na to ali je session vrnjen:
if (data.user) {
  // Ce je Supabase vrnil sejo, jo unicimo
  await supabase.auth.signOut();
  toast.success("Preverite e-postni nabiralnik za potrditev racuna.");
  navigate("/login");
}
```

Google registracija ostane nespremenjena -- takoj preusmeri na `/`.

### Popravek 2: ProtectedRoute -- preveri potrditev emaila
Dodati preverjanje `user.email_confirmed_at`:

```text
// Ce email ni potrjen, preusmeri na login
if (user && !user.email_confirmed_at) {
  await supabase.auth.signOut();
  return <Navigate to="/login" replace />;
}
```

### Popravek 3: Odjava na mobilni PWA
V vseh komponentah, ki klicejo `signOut()`, zamenjati `navigate("/login")` z `window.location.href = "/login"` za polni reload:

Datoteke:
- `src/pages/MojaStran.tsx`
- `src/pages/DrsnaSestavljanka.tsx`
- `src/pages/Zaporedja.tsx`
- Vse ostale strani z `handleSignOut`

### Popravek 4: Login.tsx -- dodati sporocilo za nepotrjen email
Ce uporabnik poskusi prijavo z nepotrjenim emailom, Supabase vrne napako. Dodati jasno sporocilo:

```text
if (error.message.includes("Email not confirmed")) {
  setError("Prosimo, najprej potrdite vas email.");
}
```

---

## KAJ MORAS TI NAREDITI (v Google Cloud Console)

1. Pojdi na https://console.cloud.google.com/ > APIs & Services > Credentials
2. Klikni na tvoj OAuth 2.0 Client ID (481391137719-...)
3. V "Authorized JavaScript origins" dodaj:
   - `https://tomitalk.lovable.app`
   - `https://id-preview--dc6f3012-b411-4c62-93c0-292d63747df0.lovable.app`
   - `https://tomitalk.si` (ce uporabljas custom domeno)
4. ODSTRANI napacni URL `https://preview--tomitalk.lovable.app`
5. Shrani in pocakaj 5-10 minut da se spremembe uveljavijo

---

## POVZETEK SPREMEMB

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/Register.tsx` | Po email registraciji vedno signOut + redirect na login |
| `src/components/auth/ProtectedRoute.tsx` | Preveri email_confirmed_at |
| `src/pages/Login.tsx` | Dodaj sporocilo za nepotrjen email |
| `src/pages/MojaStran.tsx` | window.location.href namesto navigate za logout |
| `src/pages/DrsnaSestavljanka.tsx` | Enako kot zgoraj |
| `src/pages/Zaporedja.tsx` | Enako kot zgoraj |
| Google Cloud Console (rocno) | Popraviti Authorized JavaScript origins |

