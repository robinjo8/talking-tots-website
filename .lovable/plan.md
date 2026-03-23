

## Linearna logika sklopov — implementirano

### Spremembe

1. **`usePlanProgress.ts`**:
   - `startSet` poenostavljen — samo insert, brez upsert logike za expired sklope
   - Odstranjena `hasCompletedSetToday` — ni več dnevne omejitve
   - Dodana `getNextSetNumber` — linearna progresija: `max(set_number) + 1`

2. **`MojiIzzivi.tsx`**:
   - `nextSetNumber` uporablja `getNextSetNumber` (linearno napredovanje)
   - `completedSetsCount` vključuje tudi `expired` sklope (oba štejeta kot "opravljeno")
   - Odstranjen blok "Danes si že opravil sklop"
   - Pri odpiranju zadnjega sklopa (30) se v ozadju sproži `generate-monthly-plan` z `mode: "renewal"`

3. **Edge funkcija `generate-monthly-plan`** — brez sprememb, `renewal` mode že pravilno arhivira star plan in ustvari novega z 30 seti.

### Logika

```
Sklop 1: odpri → 24h → arhiviraj → Sklop 2
Sklop 2: odpri → 24h → arhiviraj → Sklop 3
...
Sklop 30: odpri (sproži generacijo novega plana) → 24h → arhiviraj → nov plan
```
