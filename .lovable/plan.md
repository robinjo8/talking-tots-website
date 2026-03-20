

## Popravek: Neskončna zanka pri pošiljanju MFA kode

### Problem
Ko se useEffect v `AdminLogin.tsx` sproži za avtomatsko pošiljanje MFA kode in klic ne uspe (npr. 429 rate limit ali timeout), se `isLoading` postavi nazaj na `false`, `mfaStep` ostane `false`, kar izpolni pogoje za ponovni klic useEffecta. To ustvari neskončno zanko klicev na edge funkcijo, ki generira desetine toast napak.

### Popravek

**Datoteka: `src/pages/admin/AdminLogin.tsx`**

1. Dodati `useRef` zastavico `mfaAttempted`, ki prepreči ponovne klice po prvem poskusu:

```typescript
const mfaAttempted = useRef(false);
```

2. V useEffect dodati preverjanje `!mfaAttempted.current` v pogoj in nastaviti `mfaAttempted.current = true` pred klicem:

```typescript
if (user && isLogopedist && !mfaVerified && !mfaStep && !isLoading && !mfaAttempted.current) {
  mfaAttempted.current = true;
  // ... autoTriggerMfa
}
```

3. Resetirati `mfaAttempted.current = false` v `handleMfaCancel`, da se ob ponovni prijavi lahko spet sproži.

4. Pri napaki ob auto-trigger: namesto da pustimo uporabnika v limbu, **vseeno prikažemo MFA korak** (ker je koda morda bila uspešno poslana, le odgovor ni prišel pravočasno). Uporabnik bo lahko ročno zahteval novo kodo v MFA zaslonu.

### Obseg
Ena datoteka: `src/pages/admin/AdminLogin.tsx`

