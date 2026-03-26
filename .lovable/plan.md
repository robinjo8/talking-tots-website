

## Plan: Popravi "Zaključi vseh 30 sklopov" — active sklop se ne zaključi

### Problem

Ko si odprl Sklop 1 (klik na darilo), se je ustvaril zapis v `plan_set_tracking` s statusom `active`. Ko si kliknil "Zaključi vseh 30 sklopov", funkcija preveri obstoječe zapise in **preskoči** set 1 (ker že obstaja kot `active`). Vstavi le sete 2-30 kot `completed`. Rezultat: 29 completed + 1 active = **29/30 sklopov**.

### Popravek

**`supabase/functions/simulate-plan-lifecycle/index.ts`** — akcija `complete_all_sets`:

Po vstavljanju manjkajočih setov, dodaj UPDATE za vse obstoječe sete, ki imajo status `active` ali `expired`, da jih postavi na `completed`:

```ts
// Po insertu manjkajočih setov:
await supabase
  .from("plan_set_tracking")
  .update({ status: "completed", total_stars: 5, completed_at: new Date().toISOString() })
  .eq("plan_id", plan.id)
  .eq("child_id", childId)
  .in("status", ["active", "expired"]);
```

### Obseg
- 1 Edge funkcija, ~5 vrstic dodanih

---

## Postopkovnik za celotno letno simulacijo

Po resetiranju celotnega cikla ("Ponastavi celoten cikel") sledi ta vrstni red:

### Cikel 1 (mesec 0-3)

| Korak | Gumb | Kaj naredi |
|-------|------|------------|
| 1 | **Simuliraj celotno preverjanje** | Ustvari test sejo + posnetke (status: pending) |
| 2 | **Simuliraj ocenjevanje + poročilo** | Oceni glasove, generira poročilo, ustvari osebni načrt (30 sklopov) |
| 3 | **Zaključi vseh 30 sklopov** | Označi vseh 30 sklopov kot opravljene |

### Cikel 2 (mesec 3-6)

| Korak | Gumb | Kaj naredi |
|-------|------|------------|
| 4 | **Simuliraj zamudo** (90 dni) | Premakne datum zadnjega testa 90 dni nazaj → cooldown poteče |
| 5 | **Simuliraj celotno preverjanje** | Novo preverjanje izgovorjave |
| 6 | **Simuliraj ocenjevanje + poročilo** | Nov načrt (report_update ali nov plan) |
| 7 | **Zaključi vseh 30 sklopov** | Zaključi novih 30 sklopov |

### Cikel 3 in 4

Ponovi korake 4-7 še dvakrat.

**Skupaj za 1 leto**: 4× preverjanje + 4× ocenjevanje + 4× zaključi sklope = **12 klikov** (+ 3× simuliraj zamudo).

### Opomba

Gumb "Simuliraj zamudo" je potreben, ker smart cooldown drugače ne dovoli novega preverjanja prej kot čez 90 dni. Z zamudo premikaš datum zadnjega testa v preteklost, s čimer "odklenješ" naslednje preverjanje.

