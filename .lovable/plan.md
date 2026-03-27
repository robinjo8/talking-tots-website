

## Plan: Popravi stanje po 90 opravljenih sklopih

### Problem

Ko je 3×30 = 90 sklopov opravljenih, `MojiIzzivi.tsx` prikaže "Nov načrt se pripravlja..." s spinnerjem in kliče `generate-monthly-plan` z `mode: "renewal"` (vrstica 242-261). To je napačno — po 90 sklopih ni renewala, ampak je čas za **novo preverjanje izgovorjave**.

Poleg tega useEffect na vrstici 242 **vedno** sproži renewal ko zazna `allSetsCompleted`, ne glede na to, ali je bilo že 3× podaljšanje.

### Sprememba

**`src/pages/MojiIzzivi.tsx`:**

1. **Preveri število načrtov za isti `report_id`** preden sproži renewal. Če so že 3 načrti (90 sklopov), NE kliči renewal.

2. **Prikaži pravo sporočilo** glede na stanje:
   - Če so 3 načrti opravljeni → "Čestitke! Vseh 90 sklopov je opravljenih! Čas za novo preverjanje izgovorjave." + gumb "Preverjanje izgovorjave" (link na `/artikulacijski-test`)
   - Če so manj kot 3 načrti → obstoječa logika z renewalom in spinnerjem

3. **Dodaj poizvedbo** za štetje načrtov z istim `report_id`:
```ts
const { data: plansForReport } = useQuery({
  queryKey: ["plans-for-report", plan?.report_id],
  queryFn: async () => {
    const { count } = await supabase
      .from("child_monthly_plans")
      .select("id", { count: "exact", head: true })
      .eq("report_id", plan!.report_id!);
    return count || 0;
  },
  enabled: !!plan?.report_id,
});
```

4. **V useEffect za renewal** dodaj pogoj `plansForReport < 3`.

5. **V UI** zamenjaj statično sporočilo:
```tsx
{allSetsCompleted && plansForReport >= 3 ? (
  // Konec cikla — čas za novo preverjanje
  <div>
    <PartyPopper />
    <h2>Čestitke! Vseh {totalSets + setOffset} sklopov je opravljenih!</h2>
    <p>Čas za novo preverjanje izgovorjave.</p>
    <Button asChild><Link to="/artikulacijski-test">Preverjanje izgovorjave</Link></Button>
  </div>
) : allSetsCompleted ? (
  // Renewal v teku
  <div>
    <Loader2 />
    <p>Nov načrt se pripravlja...</p>
  </div>
) : ...}
```

### Kaj klikneš zdaj (po popravku)

Po 3. kliku na "Zaključi vseh 30 sklopov" boš videl sporočilo s CTA gumbom za preverjanje. V simulaciji klikneš:
1. **Simuliraj zamudo (90 dni)** — odkleni naslednji test
2. **Simuliraj celotno preverjanje** — nov test
3. **Simuliraj ocenjevanje + poročilo** — nova ocena + nov načrt
4. Ponovi 3× "Zaključi vseh 30 sklopov"

### Obseg
- 1 datoteka (`MojiIzzivi.tsx`) — ~20 vrstic spremenjenih

