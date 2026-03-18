

# Problem: MFA bypass pri admin prijavi

## Vzrok

MFA stanje je shranjeno v `sessionStorage` kot preprost boolean (`tomitalk_mfa_verified = 'true'`), brez vezave na uporabnika ali časovni žig. To pomeni:

1. **Ni vezano na user ID** — če se uporabnik A verificira, se odjavi, in se uporabnik B prijavi v istem zavihku, je flag morda še vedno prisoten (čeprav signOut ga briše, obstaja tveganje pri race conditions)
2. **Ni časovne omejitve** — če se uporabnik verificira in nato osveži stran (F5), `sessionStorage` ohrani flag. Supabase auth token se samodejno obnovi, uporabnik pa obide MFA
3. **`sessionStorage` preživi osvežitve strani** — flag ostane dokler se zavihek ne zapre

## Rešitev

### `src/contexts/AdminAuthContext.tsx`

1. **Shrani user ID skupaj z MFA flagom** — namesto golega `'true'`, shrani JSON: `{ userId: "...", verifiedAt: timestamp }`
2. **Preveri ob inicializaciji**, da se `userId` ujema s trenutnim uporabnikom
3. **Dodaj časovno omejitev** (npr. 4 ure) — po preteku se zahteva nova MFA verifikacija
4. **Ob auth state change `SIGNED_IN`** — preveri ali se user ID ujema s shranjenim; če ne, ponastavi MFA na `false`

Spremembe:
- `MFA_SESSION_KEY` vrednost postane JSON objekt namesto `'true'`
- `setMfaVerified(true)` shrani `{ userId, verifiedAt: Date.now() }`
- Inicializacija `mfaVerified` stanja preveri ujemanje userId IN da ni preteklo 4 ure
- V `onAuthStateChange` callbacku: če se user ID spremeni, ponastavi MFA
- `signOut` ostane enak (briše sessionStorage)

Ta sprememba je omejena na eno datoteko in ne vpliva na ostalo logiko.

