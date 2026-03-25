

## Analiza: Starostni prehod otroka in vpliv na osebni načrt

### Trenutno stanje

**Kako deluje starost v sistemu:**
1. `calculateAge()` vedno izračuna starost **dinamično** iz `birth_date` — ob vsakem nalaganju strani
2. `getAgeGroup()` uvrsti starost v skupino: `3-4`, `5-6`, `7-8`, `9-10`
3. Edge funkcija `generate-monthly-plan` ob generiranju načrta izračuna starost in **vgradi starostno skupino v URL-je iger** (npr. `/igra-ujemanja` za 3-4, `/igra-ujemanja56` za 5-6)
4. Ti URL-ji so **shranjeni v `plan_data.sets[].activities[].path`** in se ne posodabljajo naknadno

### Kaj se zgodi, ko otrok dopolni 5 let med izvajanjem načrta?

**Scenarij:** Otrok star 4 let, načrt generiran za starostno skupino 3-4, čez 10 dni ima rojstni dan.

1. **Obstoječi načrt (sklopi 1–30):** Igre še vedno kažejo na URL-je za 3-4 (npr. `/igra-ujemanja/ch`). To je **pravilno** — otrok naj dokonča načrt s težavnostjo, za katero je bil načrt ustvarjen.
2. **Ob renewal-u (ko začne sklop 30):** Edge funkcija `generate-monthly-plan` ponovno izračuna starost → zdaj je 5 → `ageGroup = "5-6"` → novi sklopi (31–60) bodo imeli URL-je za 5-6 (npr. `/igra-ujemanja56/ch`).
3. **Artikulacijski test:** `AgeGatedRoute` dinamično preverja starost — bo takoj prilagodil dostop.
4. **Admin igre:** Dinamično berejo `child.age` in prilagodijo suffix.

### Tvoje vprašanje: Ali naj otrok dokonča obstoječi načrt?

**DA — trenutna implementacija je pravilna in optimalna:**
- Obstoječi sklopi ohranijo starostno težavnost, za katero so bili generirani
- Renewal samodejno uporabi novo starostno skupino
- Ni potrebe po ročnem posredovanju

Edini robni primer: če logoped **po rojstnem dnevu** ročno sproži nov `report_update` (ne renewal), bo ta tudi uporabil novo starost — kar je zaželeno.

### Glede evalov (evaluacij)

Evals v smislu AI/LLM testiranja **niso smiselni za tvoj projekt**. Tvoj sistem ni LLM-based produkt, ki ga moraš evalvirati. Kar ti rabiš, je:
- **Integracijsko testiranje** (ali osebni načrt pravilno upošteva starost, ali renewal deluje)
- **E2E testi** (Playwright/Cypress) za kritične tokove

To je ločena tema in jo lahko naslavljamo posebej, če želiš.

---

## Plan: Dodaj urejanje datuma rojstva na AdminUserDetail

### Zakaj
Logoped/admin mora imeti možnost popraviti datum rojstva otroka na strani `/admin/users/:userId/:childId`, ker bo urejanje na uporabniški strani onemogočeno.

### Spremembe

**1. `src/pages/admin/AdminUserDetail.tsx`**
- Poleg prikaza datuma rojstva dodaj ikono svinčnika (Pencil)
- Ob kliku odpri inline Popover s Calendar komponentno (Shadcn datepicker)
- Ob izbiri datuma: posodobi `children` tabelo (`birth_date` + preračunan `age`) prek supabase
- Osveži lokalno stanje

**2. Potreben dostop:** Super admin že ima `ALL` policy na `children` tabeli, zato ni potrebna migracija.

### Tehnični detajl

```text
[Datum rojstva: 15. 3. 2021 (4 leta)  ✏️]
                                        │
                              klik → Popover s Calendar
                                        │
                              izbira → UPDATE children
                                SET birth_date = '2021-03-15',
                                    age = calculateAge('2021-03-15')
                                WHERE id = childId
```

Obstoječi osebni načrt ostane nespremenjen (pravilno). Naslednji renewal ali report_update bo avtomatično uporabil novo starost.

