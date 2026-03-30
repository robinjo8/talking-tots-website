

## Plan: Popravi "Simuliraj zamudo" in cooldown predogled

### Problem
`simulate_delayed_test` **doda nov zapis** v `articulation_test_results` namesto da **posodobi zadnjega**. Ko simuliraš zamudo 50 dni, se ustvari 4. zapis z datumom `2026-02-08` (danes minus 50 dni), ki se nato prikaže kot "Test 1" v predogledu.

### Spremembe

**1. `supabase/functions/simulate-plan-lifecycle/index.ts` — akcija `simulate_delayed_test` (vrstice 263-282)**

Namesto `INSERT` novega zapisa, **UPDATE** zadnjega zapisa v `articulation_test_results`:

```ts
// Poišči zadnji test result
const { data: lastResult } = await supabase
  .from("articulation_test_results")
  .select("id, completed_at")
  .eq("child_id", childId)
  .order("completed_at", { ascending: false })
  .limit(1)
  .maybeSingle();

if (!lastResult) {
  return error("Ni test rezultata za premik");
}

const testDate = new Date(lastResult.completed_at);
testDate.setDate(testDate.getDate() - daysAgo);

// UPDATE namesto INSERT
await supabase
  .from("articulation_test_results")
  .update({ completed_at: testDate.toISOString() })
  .eq("id", lastResult.id);

// Posodobi tudi submitted_at v articulation_test_sessions
const { data: lastSession } = await supabase
  .from("articulation_test_sessions")
  .select("id")
  .eq("child_id", childId)
  .order("submitted_at", { ascending: false })
  .limit(1)
  .maybeSingle();

if (lastSession) {
  await supabase
    .from("articulation_test_sessions")
    .update({ submitted_at: testDate.toISOString() })
    .eq("id", lastSession.id);
}
```

**2. Ročni popravek podatkov** — izbriši odvečni zapis za "Testni otrok"

Po deployu je potrebno izbrisati odvečni `articulation_test_results` zapis z datumom ~`2026-02-08`, ki ga je ustvarila napačna simulacija.

### Obseg
- 1 datoteka: `supabase/functions/simulate-plan-lifecycle/index.ts` — ~15 vrstic spremenjenih
- 1 ročni SQL `DELETE` za čiščenje odvečnega zapisa
- Deploy edge function

