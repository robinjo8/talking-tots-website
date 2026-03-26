

## Plan: Popravi simulacijo za pravilen letni cikel (3×30 = 90 sklopov med testi)

### Pravilna logika sistema

Med dvema preverjanjema (90 dni) otrok opravi **90 sklopov**:
1. Začetnih 30 sklopov → ko so vsi zaključeni, se sproži **renewal** → nov načrt z 30 sklopi
2. Drugih 30 sklopov → renewal → nov načrt z 30 sklopi  
3. Tretjih 30 sklopov → konec obdobja, čas za novo preverjanje

Renewal v produkciji sproži `MojiIzzivi.tsx` (vrstica 240-260) ko zazna `allSetsCompleted`. Simulacija tega ne naredi.

### Problem

Gumb **"Zaključi vseh 30 sklopov"** označi 30/30 kot opravljene, ampak **ne sproži renewal**. Zato ni novih 30 sklopov. Uporabnik mora klikniti 3× "Zaključi vseh 30 sklopov" (vsakič po renewalu), ne samo enkrat.

### Sprememba

**`supabase/functions/simulate-plan-lifecycle/index.ts`** — akcija `complete_all_sets`:

Po tem ko označi vseh 30 sklopov kot completed, **avtomatsko sproži renewal** (kliče `generate-monthly-plan` z `mode: "renewal"`). To ustvari nov načrt z novimi 30 sklopi, tako kot bi se zgodilo v produkciji.

Logika:
```text
1. Najdi aktiven načrt
2. Označi vseh 30 sklopov kot completed
3. Kliči generate-monthly-plan z mode: "renewal" in reportId iz načrta
4. Vrni: { completed: 30, renewed: true, newPlanId: "..." }
```

To pomeni, da je po enem kliku na "Zaključi vseh 30 sklopov" takoj na voljo novih 30 sklopov (sklopi 31-60 za uporabnika).

### Posodobljen postopkovnik za 1 leto

Po **"Ponastavi celoten cikel"**:

**Cikel 1 (meseci 1-3):**

| # | Gumb | Kaj naredi |
|---|------|------------|
| 1 | Simuliraj celotno preverjanje | Ustvari test sejo |
| 2 | Simuliraj ocenjevanje + poročilo | Oceni + generira načrt (30 sklopov) |
| 3 | Zaključi vseh 30 sklopov | 30/30 + renewal → nov načrt (sklopi 31-60) |
| 4 | Zaključi vseh 30 sklopov | 30/30 + renewal → nov načrt (sklopi 61-90) |
| 5 | Zaključi vseh 30 sklopov | 30/30 (brez renewala — čas za novo preverjanje) |
| 6 | Simuliraj zamudo (90 dni) | Odkleni naslednji test |

**Cikel 2 (meseci 4-6):**

| # | Gumb | Kaj naredi |
|---|------|------------|
| 7 | Simuliraj celotno preverjanje | Nov test |
| 8 | Simuliraj ocenjevanje + poročilo | Nova ocena + nov načrt |
| 9-11 | Zaključi vseh 30 sklopov (3×) | 90 sklopov |
| 12 | Simuliraj zamudo (90 dni) | Odkleni naslednji test |

**Cikel 3 in 4:** Ponovi korake 7-12.

Zadnji cikel (4) brez zamude na koncu.

**Skupaj:** 4× preverjanje, 4× ocenjevanje, 12× zaključi sklope, 3× zamuda = **23 klikov** za celotno leto.

### Podrobnost: Kdaj renewal, kdaj ne?

Tretji klik "Zaključi vseh 30 sklopov" v vsakem ciklu **ne sme** sprožiti renewala, ker je čas za novo preverjanje. Logika:
- Preštej koliko renewalov je bilo že narejenih za ta report (koliko načrtov obstaja z istim `report_id`)
- Če je bilo že 2 renewala (3 načrti skupaj), NE sproži renewala — vrni sporočilo "Čas za novo preverjanje"
- Sicer sproži renewal

Alternativno, enostavnejše: vedno sproži renewal, uporabnik pa sam ve kdaj klikniti "Simuliraj zamudo" + novo preverjanje. To je bolj fleksibilno za testiranje.

### Obseg
- 1 Edge funkcija posodobljena (~15 vrstic dodanih v `complete_all_sets`)

