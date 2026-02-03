
# Načrt: Napredek otroka v admin portalu - enako kot na uporabniškem portalu

## Povzetek problema

Trenutna stran `/admin/children/:id/progress` prikazuje samo seznam opravljenih aktivnosti in osnovno statistiko. Uporabniški portal (`/moja-stran`) pa ima popoln vizualen sistem nagrajevanja z zvezdicami, zmajčki, pokali in grafom napredka.

**Cilj:** Admin portal mora prikazovati napredek logopedistovega otroka **natanko enako** kot uporabniški portal, vendar strogo ločeno od podatkov uporabnikov (staršev).

---

## Ključne razlike v podatkovnem modelu

| Uporabniški portal | Admin portal |
|--------------------|--------------|
| `progress.child_id` | `progress.logopedist_child_id` |
| `useAuth().selectedChild` | `useLogopedistChild(childId)` |
| `get_child_activity_summary(child_uuid)` | **NOVA:** `get_logopedist_child_activity_summary(logopedist_child_uuid)` |

---

## Spremembe

### 1. Nova RPC funkcija v bazi

Ustvari novo RPC funkcijo, ki je identična `get_child_activity_summary`, vendar uporablja `logopedist_child_id`:

```sql
CREATE OR REPLACE FUNCTION public.get_logopedist_child_activity_summary(logopedist_child_uuid uuid)
RETURNS TABLE(
  activity_type activity_type,
  activity_subtype text,
  completion_count bigint,
  total_stars bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.activity_type,
    p.activity_subtype,
    COUNT(*) as completion_count,
    SUM(COALESCE(p.stars_earned, 1)) as total_stars
  FROM public.progress p
  WHERE p.logopedist_child_id = logopedist_child_uuid
  GROUP BY p.activity_type, p.activity_subtype
  ORDER BY p.activity_type, p.activity_subtype;
$$;
```

### 2. Nov hook: `useLogopedistProgress.ts`

Nov hook za pridobivanje napredka logopedistovega otroka, ki:
- Prejme `logopedistChildId` kot parameter
- Kliče novo RPC funkcijo `get_logopedist_child_activity_summary`
- Vrne enako strukturo podatkov kot `useEnhancedProgress`

```typescript
interface LogopedistProgressSummary {
  totalStars: number;
  currentStars: number;      // 0-9 proti naslednjemu zmajčku
  totalDragons: number;
  currentDragons: number;    // 0-9 proti naslednjemu pokalu
  totalTrophies: number;
  starsToNextDragon: number;
  dragonsToNextTrophy: number;
}
```

### 3. Posodobi `AdminChildProgress.tsx`

Zamenjaj trenutni preprosti prikaz z novo komponento, ki uporablja:
- `UnifiedProgressDisplay` (obstoječa komponenta)
- Nov hook `useLogopedistProgress`
- Ohrani zavihek "Zgodovina aktivnosti" pod prikazom napredka

Struktura strani:
1. Glava z imenom otroka in gumbom "Nazaj"
2. **UnifiedProgressDisplay** (pokali, zmajčki, zvezdice - identično kot /moja-stran)
3. Zgodovina aktivnosti (obstoječi seznam)
4. Gumb "Začni delo z otrokom"

### 4. Posodobi `UnifiedProgressDisplay.tsx`

Dodaj prop za skrivanje testnih gumbov:
```typescript
interface UnifiedProgressDisplayProps {
  progressData: EnhancedProgressSummary;
  recordCompletion?: (type: 'game' | 'exercise', subtype?: string) => void;
  showTestButtons?: boolean;  // NOVO - privzeto false
}
```

### 5. Sistem pokalov za admin portal (opcijsko)

Za enako izkušnjo bi morali dodati še:
- `LogopedistTrophyContext` - preveri za nove pokale ob shranjevanju napredka
- Vendar to ni kritično za prvi korak

---

## Tok podatkov

```text
AdminChildProgress
      │
      ▼
useLogopedistProgress(childId)
      │
      ▼
get_logopedist_child_activity_summary(logopedist_child_uuid)
      │
      ▼
progress tabela WHERE logopedist_child_id = :id
      │
      ▼
LogopedistProgressSummary (enaka struktura kot uporabniški portal)
      │
      ▼
UnifiedProgressDisplay
      │
      ▼
├── ProgressChart (pokali)
├── DragonDisplay (zmajčki)
└── StarDisplay (zvezdice)
```

---

## Seznam datotek

| Datoteka | Akcija |
|----------|--------|
| `supabase/migrations/xxx_add_logopedist_activity_summary.sql` | Nova RPC funkcija |
| `src/integrations/supabase/types.ts` | Posodobi generirane tipe (avtomatsko) |
| `src/hooks/useLogopedistProgress.ts` | **NOVA** - hook za napredek logopedistovega otroka |
| `src/pages/admin/AdminChildProgress.tsx` | Posodobi - uporabi UnifiedProgressDisplay |
| `src/components/progress/UnifiedProgressDisplay.tsx` | Dodaj prop `showTestButtons` |

---

## Vizualni rezultat

Po implementaciji bo stran `/admin/children/:id/progress` prikazovala:

1. **POKALI** - Graf z 10 stolpci, zmajček napreduje, cilj je pokal
2. **ZMAJČKI** - 10 zmajčkov v mreži (osvetljeni/neosvetljeni)
3. **IGRE IN VAJE** - 10 zvezdic v mreži (osvetljene/neosvetljene)
4. **Zgodovina aktivnosti** - seznam preteklih sej (kot zdaj)

Vse brez testnih gumbov ("+1 zvezdica" itd.), saj je to prikaz za logopeda, ne za testiranje.
