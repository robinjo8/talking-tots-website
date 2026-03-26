

## Plan: Popravi "Zaključi vseh 30 sklopov" — napačna logika + čiščenje

### Analiza problema

**Stanje v bazi:**
- 5 načrtov za "Testni otrok": 4 arhivirani + 1 aktiven (`4fe99ccd`)
- Aktiven načrt ima **0 tracking zapisov** — zato UI kaže "Sklop 1" in "0/30"
- Vsi completed tracking zapisi pripadajo starim arhiviranim načrtom

**Zakaj se to zgodi:**
1. Vsak klik na "Simuliraj ocenjevanje + poročilo" ustvari NOV načrt (kliče `generate-monthly-plan`), star načrt se arhivira
2. Ko klikneš "Zaključi vseh 30 sklopov", ta zapiše tracking za takrat aktiven načrt
3. Če potem znova klikneš "Simuliraj ocenjevanje + poročilo", se ta načrt arhivira in ustvari nov prazen
4. Rezultat: tracking zapisi na arhiviranem načrtu, aktiven načrt prazen

**Dodatna napaka v logiki `complete_all_sets`:**
- Vedno doda 30 novih sklopov od zadnjega (`startSet = max + 1`), ne glede na `totalSets`
- Če klikneš dvakrat, vstavi sklope 31-60, ki ne obstajajo v načrtu

### Spremembe

**1. Edge funkcija `simulate-plan-lifecycle/index.ts` — akcija `complete_all_sets`:**
- Omeji `endSet` na `totalSets` iz `plan_data` (ne vedno +30)
- Če so vsi sklopi že zaključeni, vrni sporočilo namesto vstavljanja duplikatov
- NE sproži renewal — to je simulacija, ne pravi potek

**2. Edge funkcija — akcija `reset_full_lifecycle`:**
- Preveri da briše tudi `plan_set_tracking` in `plan_activity_completions` za VSE načrte tega otroka (ne le aktivnega)
- Preveri da briše tudi vse `child_monthly_plans` zapise

**3. Čiščenje baze (migracija):**
- Izbriši vse osirotele `plan_set_tracking` zapise za arhivirane načrte "Testni otrok"
- Izbriši vse arhivirane `child_monthly_plans` za tega otroka (obdrži le aktiven načrt)

### Pravilna logika za `complete_all_sets`:

```text
1. Najdi aktiven načrt
2. Preberi totalSets iz plan_data (default 30)
3. Preveri obstoječe tracking zapise za TA načrt
4. Vstavi SAMO manjkajoče sklope od 1 do totalSets kot "completed"
5. NE sproži renewal
```

### Obseg
- 1 Edge funkcija posodobljena (logika `complete_all_sets` + morebitni popravki `reset_full_lifecycle`)
- 1 migracija za čiščenje obstoječih osirot
