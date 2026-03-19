

## Analiza: Zakaj ne delujejo zvočni posnetki

### Ugotovitev
Zvočne datoteke v Supabase bucketu `vaje-motorike-govoril` so shranjene kot **`.m4a`** (1.m4a, 2.m4a, ... 27.m4a), koda v `SequentialExerciseGrid.tsx` (vrstica 72) pa sestavlja URL s končnico **`.mp3`**.

To pomeni, da koda išče `1.mp3`, ki ne obstaja — v bucketu je `1.m4a`. Slike (`.jpg`) delujejo pravilno.

### Popravek

**Datoteka: `src/components/exercises/SequentialExerciseGrid.tsx`**

Vrstica 72 — spremeniti `.mp3` v `.m4a`:
```typescript
// Prej:
return `.../${cardNumber}.mp3`;
// Potem:
return `.../${cardNumber}.m4a`;
```

To je celoten popravek — ena vrstica, ena datoteka.

