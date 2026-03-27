

## Plan: Popravi "Unauthorized" pri generiranju načrta + čiščenje poročil pri resetu

### Problem 1: `planGenerated: {"error":"Unauthorized"}`

V `simulate-plan-lifecycle` (vrstica 500-506) se `generate-monthly-plan` kliče z uporabnikovim JWT tokenom (`authHeader`). Funkcija `generate-monthly-plan` (vrstica 313-323) validira ta token z `getClaims()`. Ker je uporabnik **starš** (ne logoped), ali pa je token medtem potekel, `getClaims` vrne napako → "Unauthorized".

Rešitev: `generate-monthly-plan` že podpira klic s service role key (vrstica 311: `isServiceRoleCall = token === serviceRoleKey`). Namesto uporabnikovega tokena pošljemo service role key.

### Problem 2: Poročila ostanejo po resetu

`reset_full_lifecycle` (vrstica 654-673) briše datoteke iz `Porocila/` in `Preverjanje-izgovorjave/`, ampak **ne briše** mape `Generirana-porocila/`. Ker `auto_evaluate_and_report` shranjuje poročila v obe mapi, ostanejo kopije v `Generirana-porocila/`.

### Spremembe

**`supabase/functions/simulate-plan-lifecycle/index.ts`:**

1. **Vrstica 499-506** — zamenjaj `authHeader` s service role key pri klicu `generate-monthly-plan`:
```ts
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const planResponse = await fetch(`${supabaseUrl}/functions/v1/generate-monthly-plan`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ reportId: insertedReport.id, mode: "report_update" }),
});
```

2. **Isto za renewal klic v `complete_all_sets`** — tudi tam se kliče `generate-monthly-plan` z `authHeader`, zamenjaj s service role key.

3. **Vrstica 658-673 (`reset_full_lifecycle`)** — dodaj brisanje mape `Generirana-porocila/`:
```ts
// Delete Generirana-porocila folder
const { data: genFiles } = await supabase.storage
  .from("uporabniski-profili")
  .list(`${basePath}/Generirana-porocila`);
if (genFiles && genFiles.length > 0) {
  await supabase.storage
    .from("uporabniski-profili")
    .remove(genFiles.map(f => `${basePath}/Generirana-porocila/${f.name}`));
}
```

### Obseg
- 1 Edge funkcija, 3 popravki (~15 vrstic spremenjenih)

