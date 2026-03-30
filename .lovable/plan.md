

## Plan: Preoblikuj "Simuliraj zamudo" — pravilna logika

### Problem

Trenutna logika `simulate_delayed_test` **premakne datum zadnjega testa v preteklost**, kar je narobe. Uporabnik želi simulirati, da je **zamudil z naslednjim preverjanjem za X dni** — torej da naslednji test opravi X dni pozneje kot bi moral.

**Pravilen pomen**: Če je bil naslednji test predviden za `lastTest + 90 dni`, zamuda 50 dni pomeni, da bo naslednji test opravljen šele čez `90 + 50 = 140 dni` po zadnjem testu. To vpliva na:
- Vse kasnejše cooldown datume (se zamaknejo naprej)
- Zadnji test pred potekom naročnine (ali se še stisne v 7-dnevno okno)
- Osebni načrt (ki teče naprej neodvisno od zamude — sklopi se nadaljujejo)

### Trenutno stanje

`simulate-articulation-test` ima `calculateVirtualDate()` ki izračuna naslednji datum na podlagi zadnjega testa + 90 dni (z smart cooldown). **Ta logika je pravilna za normalen potek.**

Za zamudo moramo tej funkciji povedati: "dodaj X ekstra dni poleg normalnega cooldowna."

### Spremembe

**1. `supabase/functions/simulate-plan-lifecycle/index.ts` — akcija `simulate_delayed_test`**

Namesto da premika datum zadnjega testa, naj pokliče `simulate-articulation-test` z **dodatnim parametrom** `delayDays`:

```ts
} else if (action === "simulate_delayed_test") {
  const delayDays = body.daysAgo || 50;
  
  // Call simulate-articulation-test with delay parameter
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const simResponse = await fetch(
    `${supabaseUrl}/functions/v1/simulate-articulation-test`, {
    method: "POST",
    headers: {
      "Authorization": authHeader!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ childId, delayDays }),
  });
  
  const simResult = await simResponse.json();
  result = { ...simResult, delayDays, note: "Test ustvarjen z zamudo" };
}
```

**2. `supabase/functions/simulate-articulation-test/index.ts` — dodaj `delayDays` parameter**

- Sprejmi `delayDays` iz request body (default 0)
- V `calculateVirtualDate` dodaj parameter `delayDays`
- Po izračunu normalnega cooldowna dodaj zamudo: `nextDate.setDate(nextDate.getDate() + delayDays)`

```ts
// In calculateVirtualDate:
function calculateVirtualDate(
  existingTestDates: string[],
  subscriptionEnd: string | null,
  delayDays: number = 0,  // NEW
): Date {
  // ... existing logic ...
  // After calculating nextDate:
  if (delayDays > 0) {
    nextDate.setDate(nextDate.getDate() + delayDays);
  }
  return nextDate;
}
```

In request parsing:
```ts
const { childId, delayDays } = await req.json();
// ...
const virtualDate = calculateVirtualDate(existingTestDates, subscriptionEnd, delayDays || 0);
```

**3. `src/components/profile/PlanLifecycleTools.tsx` — popravi label**

Spremeni "Simuliraj zamudo" label in placeholder iz "Dni nazaj" v "Dni zamude", ker ne gre za premik v preteklost ampak za zamudo pri naslednjem testu.

**4. Cooldown predogled — brez sprememb**

`calculate_cooldown_preview` že pravilno računa na podlagi dejanskih datumov v bazi. Ko `simulate_delayed_test` ustvari novo sejo z zamaknjenim datumom, bo predogled samodejno prikazal pravilne datume.

**5. Ročni popravek za Testni otrok**

Trenutno ima Testni otrok 3 teste z datumi 30.3., 28.6. in 26.9. Ker je bil zadnji test ustvarjen s staro (napačno) logiko, je potrebno:
- Preveriti ali je datum 26.9. pravilen (zadnji test po 2× complete_all_sets + simulate_full_test + auto_evaluate)
- Če ne, popraviti s SQL

### Vpliv na osebni načrt

Osebni načrt (`complete_all_sets`) že uporablja `planStartDate = lastTestResult.completed_at` za izračun virtualnih datumov sklopov. Ko bo naslednji test ustvarjen z zamudo, bo imel kasnejši `completed_at`, kar bo avtomatsko zamaknilo datume sklopov v naslednjem načrtu. **Ni potrebnih dodatnih sprememb.**

### Obseg
- `supabase/functions/simulate-plan-lifecycle/index.ts` — zamenjaj ~20 vrstic
- `supabase/functions/simulate-articulation-test/index.ts` — dodaj 5 vrstic
- `src/components/profile/PlanLifecycleTools.tsx` — label sprememba (2 vrstici)
- Deploy obeh edge funkcij

