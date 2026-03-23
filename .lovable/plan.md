

## Popravek logike sklopov + vizualna nadgradnja za otroke + admin pregled

### Problem
1. `nextSetNumber` preskoči potekle sklope (otrok ne more ponoviti sklopa 1)
2. `startSet` ne podpira ponovnega zagona poteklega sklopa
3. Gumb "Začni sklop" je preprost, brez otroški privlačne animacije
4. Admin portal nima pregleda otrokovega arhiva sklopov

### Spremembe

#### 1. `src/hooks/usePlanProgress.ts` — popravek logike
- **`nextSetNumber` premik v hook ali popravek v MojiIzzivi**: preskoči samo `completed` in `active` sklope (ne `expired`)
- **`startSet`**: če obstaja `expired` zapis za ta sklop, ga posodobi nazaj na `active` (update namesto insert), ponastavi `expired_at` na null in `total_stars` na 0

#### 2. `src/pages/MojiIzzivi.tsx` — vizualna nadgradnja
- Popravek `nextSetNumber` logike: `filter(e => e.status === "completed" || e.status === "active")`
- Nov state `showUnboxAnimation` za animacijo odpiranja paketa
- Ko otrok klikne "Odpri sklop":
  1. Prikaže se animiran "paket" (gift box) z barvitim gradient ozadjem
  2. Ob kliku se paket "odpre" s framer-motion animacijo (scale + rotate)
  3. Konfeti/zvezdice se razletijo (CSS particles ali canvas-confetti)
  4. Po 1.5s se prikažejo kartice aktivnosti s staggered fade-in
- Gumb za začetek: velik, barvit, otrokom prijazen (gradient oranžno-rumena, zaobljeni robovi, ikona darila, velik tekst)

#### 3. Nova komponenta `src/components/plan/SetUnboxAnimation.tsx`
- Animirana škatla/paket z zvezdami
- Framer-motion: začetno stanje = zaprta škatla, klik = odpiranje + confetti
- Po animaciji pokliče `onComplete` callback ki sproži `handleStartSet`

#### 4. Admin portal — pregled otrokovega arhiva
- Nova komponenta `src/components/admin/ChildPlanArchive.tsx`:
  - Prikaže koledar (podoben MojiIzziviArhiv) z barvnimi dnevi
  - Statistika: skupno opravljenih sklopov, skupno zvezdic, povprečje zvezdic/sklop
  - Seznam sklopov z aktivnostmi (katere igre je odigral)
- Vključitev v `AdminLogopedistChildDetail.tsx` kot nov accordion razdelek "Osebni načrt — arhiv"
- Prebere `plan_set_tracking` in `plan_activity_completions` za ta `child_id` (potreben query z logopedist_children -> child mapping ali direkten ID)

#### 5. RLS politike (če potrebno)
- Preveriti ali logopedisti lahko berejo `plan_set_tracking` in `plan_activity_completions` — če ne, dodati SELECT politike za logopediste

### Tehnični koraki
1. Popravek `startSet` v `usePlanProgress.ts` (upsert logika za expired)
2. Popravek `nextSetNumber` v `MojiIzzivi.tsx`
3. Ustvari `SetUnboxAnimation.tsx` komponento
4. Posodobi `MojiIzzivi.tsx` z novo animacijo in otroški gumbom
5. Ustvari `ChildPlanArchive.tsx` za admin portal
6. Dodaj razdelek v `AdminLogopedistChildDetail.tsx`
7. Po potrebi dodaj RLS politike za logopedistov dostop do tracking tabel

### Datoteke
- `src/hooks/usePlanProgress.ts` — startSet popravek
- `src/pages/MojiIzzivi.tsx` — nextSetNumber + animacija
- `src/components/plan/SetUnboxAnimation.tsx` — nova
- `src/components/admin/ChildPlanArchive.tsx` — nova
- `src/pages/admin/AdminLogopedistChildDetail.tsx` — nov accordion
- Morebitna DB migracija za RLS

