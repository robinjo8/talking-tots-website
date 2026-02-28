
# Izolacija podatkov med organizacijami in filtri za Članstva

## Status: IMPLEMENTIRANO ✅

### Izvedene spremembe:

1. **RLS migracija** — Posodobljene politike na 3 tabelah:
   - `articulation_test_sessions`: interni logopedi vidijo samo `source_type='parent'` + njim dodeljene seje
   - `articulation_evaluations`: 3 politike omejene na seje tipa 'parent' ali dodeljene
   - `articulation_word_results`: enaka omejitev

2. **Aplikacijska koda** — `useAdminCounts.ts` filtrira pending count po `source_type='parent'` za interne logopede

3. **AdminMemberships** — Refaktoriran v 3 komponente:
   - Filter po organizaciji (dropdown)
   - Filter po tipu (Interni/Zunanji)
   - Iskalno polje po imenu/emailu
   - Prikaz zadnje prijave (RPC `get_users_last_sign_in`)
   - Prikaz datuma registracije
