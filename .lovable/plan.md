

## Plan: Gumb "Simuliraj ocenjevanje + poročilo" v Lifecycle orodjih

### Kaj bo gumb naredil (en klik = celoten postopek)

1. **Poišče zadnjo neocenjeno sejo** za tega otroka (status `pending` ali `assigned`)
2. **Oceni vse glasove**: za vse črke (P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č) označi `acquired` ("Glas je usvojen"), za črko **R** označi `not_acquired` ("Glas ni usvojen")
3. **Zaključi pregled** (status → `completed`, `reviewed_at` → now)
4. **Sestavi ugotovitve** iz ocen (enako kot `generateAutoUgotovitve`)
5. **Shrani .txt poročilo** v Storage (`{parentId}/{childId}/Porocila/porocilo-{datum}.txt`) z:
   - ANAMNEZA: "Test"
   - UGOTOVITVE: avtomatsko generirano iz ocen
   - Priporočamo igre in vaje za glas R (začetek, sredina/konec, začetne vaje)
   - Vaje za motoriko govoril: enkrat na teden
   - Ogled video navodil: R
6. **Vstavi zapis v `logopedist_reports`** z vsemi podatki
7. **Sproži `generate-monthly-plan`** za generiranje osebnega načrta

### Spremembe

**1. Edge funkcija `simulate-plan-lifecycle/index.ts`** — nova akcija `auto_evaluate_and_report`:
- Poišče sejo, logopedist profil za dev uporabnika
- Vstavi 20 `articulation_evaluations` zapisov (upsert)
- Posodobi sejo na `completed`
- Sestavi besedilo poročila server-side (anamneza, ugotovitve, priporočila)
- Naloži .txt v Storage bucket `uporabniski-profili`
- Vstavi `logopedist_reports` zapis
- Kliče `generate-monthly-plan` Edge funkcijo

**2. `PlanLifecycleTools.tsx`** — nov gumb:
- "Simuliraj ocenjevanje + poročilo" z ikono
- Kliče `invoke("auto_evaluate_and_report")`
- Prikaže toast z rezultatom

### Obseg
- 1 Edge funkcija posodobljena (nova akcija ~120 vrstic)
- 1 UI komponenta posodobljena (nov gumb)

