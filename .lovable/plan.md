

## Analiza

Iz baze vidim:
- **Testni otrok** (report `0348d835...`) — ima `positions: ["start", "middle-end", "initial-exercises"]` ampak **nima načrta** (plan_id = null)
- Več drugih reportov tudi nima načrtov (nekateri nimajo niti child_id)
- **Lea** in **Tristan** že imata aktivne načrte

## Najoptimalnejša rešitev (2 dela)

### Del 1: Takojšnja generacija manjkajočih načrtov

Uporabim `supabase--curl_edge_functions` za direkten klic edge funkcije s service role ključem za vsak report brez načrta. To deluje brez JWT uporabnika.

**Problem:** Edge funkcija trenutno zahteva `getClaims()` — moram dodati alternativno avtorizacijo za service role klic (preverjanje `SUPABASE_SERVICE_ROLE_KEY` v Authorization headerju).

### Del 2: Admin gumb "Generiraj načrt" (dolgoročno)

Dodam gumb v admin portal (AdminUserDetail, AdminLogopedistChildDetail) pri vsakem poročilu, ki nima načrta. Gumb pokliče `generate-monthly-plan` z admin JWT. Tako v prihodnosti nikoli več ne bo manjkajočih načrtov.

## Spremembe

### 1. `supabase/functions/generate-monthly-plan/index.ts`
- Dodaj alternativno avtorizacijo: če `Authorization: Bearer <token>` ne uspe s `getClaims()`, preveri ali je token enak `SUPABASE_SERVICE_ROLE_KEY` — če da, dovoli dostop brez user ID-ja (admin override)
- To omogoča klic iz admin orodij in curl brez uporabniškega JWT

### 2. `src/pages/admin/AdminUserDetail.tsx`
- Dodaj gumb "Generiraj načrt" ob vsakem poročilu, ki nima aktivnega načrta
- Klic `supabase.functions.invoke('generate-monthly-plan', { body: { reportId } })`

### 3. `src/pages/admin/AdminLogopedistChildDetail.tsx`
- Enak gumb "Generiraj načrt" kot zgoraj

### 4. Po deploymentu
- Pokličem edge funkcijo za report `0348d835-fa1e-484c-8243-522b928666d7` (Testni otrok)
- Preverim loge da je načrt uspešno generiran

