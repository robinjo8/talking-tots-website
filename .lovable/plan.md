

# Plan: Popravki strani /moji-izzivi (7 tezav)

## Vzrok problemov

Trenutni nacrt v bazi uporablja **staro strukturo** (`weeks` z `dayNumber` namesto `days` z dejanskimi datumi). Edge funkcija je bila posodobljena, a nacrt za testnega otroka ni bil ponovno generiran. Poleg tega ima stari nacrt samo 2 igri na dan brez polja `gameId`, kar povzroca vecino vizualnih napak.

---

## Popravki

### 1. Regeneracija nacrta

Po vseh popravkih se bo za testnega otroka Zak sprozen nov klic edge funkcije, da se ustvari nacrt z novo strukturo (dejanski datumi, 5 aktivnosti, gameId polja).

### 2. Edge funkcija - strožja validacija (generate-monthly-plan)

Dodati post-processing korak, ki po odgovoru AI-ja preveri in popravi:
- Ce ima dan manj kot 4 igre, doda manjkajoce iz kataloga
- Ce se gameId ponovi na isti dan, zamenja ponavljajocega z drugimi iz kataloga
- Ce naslov ze vsebuje crko (npr. "Kolo besed S"), se polje `letter` ne podvoji v naslovu

To zagotovi, da tudi ce AI naredi napako, se podatki pred shranjevanjem popravijo.

### 3. PlanDayCard - format glave kartice

Sprememba iz "9. februar - Ponedeljek" v **"PONEDELJEK, 9.2.2026"**:

```text
// PREJ:  "9. februar - Ponedeljek"
// POTEM: "PONEDELJEK, 9.2.2026"
```

### 4. PlanDayCard - odprava dvojne crke v naslovu

Trenutno se prikaze "Kolo besed S - S" ker:
- AI nastavi `title: "Kolo besed S"` (ze vsebuje crko)
- PlanDayCard doda `- {activity.letter}` (se enkrat doda crko)

Popravek: ce `title` ze vsebuje besedilo crke, se `letter` ne prikaze dodatno.

### 5. PlanDayCard - slika za motoriko = otrokov avatar

Za aktivnost tipa "motorika" se namesto genericne slike uporabi slika zmajcka, ki ga ima otrok izbranega kot avatar. MojiIzzivi bo posredoval `avatarUrl` iz `selectedChild` v PlanDayCard.

### 6. PlanDayCard - dejanske slike iger iz GameImageMap

Ce aktivnost nima polja `gameId` (stari format), se ga izloci iz polja `path`:
- `/govorne-igre/kolo-srece/sh` -> gameId = `kolo-srece`
- `/govorne-igre/bingo/zh` -> gameId = `bingo`
- `/govorne-igre/spomin/spomin-sh` -> gameId = `spomin`

To zagotovi pravilne slike tudi za stare nacrte.

### 7. Zložljive kartice - samo danes odprt

- Vsak dan je **zlozen (collapsed)** razen ce je danes
- Danasnji dan je samodejno razprt in ima oznako "Danes"
- Pretekli dnevi z 10+ zvezdicami: zelena obroba, zlozen
- Pretekli dnevi brez 10 zvezdic: osivljeni, zlozeni
- Prihodnji dnevi: osivljeni, zlozeni
- Gumb "Igraj" je **onemogocen** za vse dni razen danasnjega (otrok ne more igrati iger za drug dan)
- Ob kliku na glavo kartice se kartica razpre/zlozi (za pregled, ne za igranje)

Vizualni prikaz:

```text
+--[zelena obroba]------------------------------+
| SREDA, 4.2.2026   [*][*][*][*][*]...[*] (10) |  <- zlozen, 10 zvezdic
+------------------------------------------------+

+--[zelena obroba]------------------------------+
| CETRTEK, 5.2.2026 [*][*][*][*][*]...[*] (10) |  <- zlozen, 10 zvezdic
+------------------------------------------------+

+--[modra obroba, odprt, Danes]------------------+
| PETEK, 6.2.2026   [*][*][*][ ][ ]...[ ] (3)   |
| -----------------------------------------------+
| [avatar] Vaje za motoriko govoril    [Igraj]   |
| [slika]  Kolo besed              [kljukica]    |
| [slika]  Bingo                       [Igraj]   |
| [slika]  Labirint                    [Igraj]   |
| [slika]  Sestavljanke               [Igraj]   |
+-------------------------------------------------+

+--[siva obroba]---------------------------------+
| SOBOTA, 7.2.2026   [ ][ ][ ][ ][ ]...[ ] (0)  |  <- zlozen, prihodnji
+------------------------------------------------+
```

---

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `supabase/functions/generate-monthly-plan/index.ts` | Post-processing validacija (4 unikatne igre, brez podvajanja gameId) |
| `src/components/plan/PlanDayCard.tsx` | Zložljive kartice, nov format glave, popravek dvojne crke, avatar za motoriko, onemogocen gumb za ne-danasnje dni |
| `src/components/plan/GameImageMap.ts` | Nova funkcija `deriveGameIdFromPath()` za stare nacrte brez gameId |
| `src/pages/MojiIzzivi.tsx` | Posredovanje avatarUrl v PlanDayCard, izboljsana legacy pretvorba z dejanskimi datumi |
| `src/hooks/useMonthlyPlan.ts` | Brez sprememb |

