

## Plan: Popravi generiranje novega načrta po novem preverjanju (nov cikel)

### Problem

Ko po 90 sklopih izvedeš novo preverjanje in ocenjevanje, `auto_evaluate_and_report` pokliče `generate-monthly-plan` z `mode: "report_update"`. V tem načinu funkcija:

1. Najde **stari aktivni plan** (ki ima 30 completed tracking zapisov)
2. Ga **posodobi in-place** — zamenja `report_id`, ohrani vse stare tracking zapise
3. Rezultat: UI vidi 30/30 opravljenih sklopov, ker stari tracking zapisi še vedno obstajajo

**Pravilno vedenje**: Ko se začne nov cikel (nov `report_id`), mora stari plan biti **arhiviran** in ustvarjen **nov plan brez starih tracking zapisov**.

### Sprememba

**`supabase/functions/generate-monthly-plan/index.ts`** — v `report_update` veji (vrstica 583):

Dodaj preverjanje: če ima obstoječi plan **drug `report_id`** kot novi, ga ne posodobi in-place, ampak:
1. Arhiviraj stari plan
2. Ustvari nov plan (tako kot pri `renewal`, ampak brez `setOffset`)

```text
if (existingPlan) {
  // Preveri ali je isti report_id
  const existingPlanFull = ... (že se pridobi na vrstici 597)
  
  if (existingPlan ima drug report_id kot novi reportId) {
    → arhiviraj stari plan
    → ustvari nov plan z setOffset=0, nov report_id
  } else {
    → obstoječa logika (update in-place, merge sets)
  }
}
```

Konkretno: na vrstici 597 že pridobimo `existingPlanFull`. Dodamo preverjanje:

```ts
// Pridobi report_id starega plana
const { data: existingPlanFull } = await supabase
  .from("child_monthly_plans")
  .select("plan_data, report_id")  // dodaj report_id
  .eq("id", existingPlan.id)
  .single();

// Če je nov report_id → nov cikel, arhiviraj starega in ustvari novega
if (existingPlanFull?.report_id !== reportId) {
  await supabase
    .from("child_monthly_plans")
    .update({ status: "archived" })
    .eq("id", existingPlan.id);
  
  // Ustvari nov plan (brez setOffset, ker je nov cikel)
  const { data: newPlan } = await supabase
    .from("child_monthly_plans")
    .insert({
      child_id: childId,
      report_id: reportId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      start_date: startDateStr,
      focus_letters: targetLetters,
      status: "active",
      plan_data: planData, // čist nov plan, setOffset=0
      expires_at: expiresAt,
    })
    .select("id")
    .single();
  
  planRecord = newPlan;
} else {
  // Obstoječa logika: isti report, merge sets
  ...
}
```

### Obseg
- 1 Edge funkcija (`generate-monthly-plan`) — ~20 vrstic dodanih v `report_update` vejo
- Po popravku: ponastavi cikel in testiraj znova

