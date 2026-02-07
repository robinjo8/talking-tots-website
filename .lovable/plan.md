
# Plan: Tri popravki za /moji-izzivi

## 1. Toplo prijazno sporocilo namesto suhega opisa

### Problem
Trenutni `summary` je suhoparen template:
"Osebni nacrt vaj za Zak (9 let) za obdobje 6. februar 2026 - 6. maj 2026. Ciljne crke: S, Z."

Prej je bil ta tekst generiran z AI, ki je napisal toplo, prijazno sporocilo za otroka.

### Resitev
V edge funkciji `generate-monthly-plan` spremeniti template za `summary` v toplo, prijazno sporocilo, ki je usmerjeno k otroku. Primer:

"Hej [ime]! Pripravili smo ti zabaven nacrt vaj in iger, s katerimi bos vadil crki [S] in [Z]. Vsak dan te cakajo nove puscovcine - vaje za jezik in 4 igrice! Zbiraj zvezdice in postani pravi sampion! 🌟"

To bo vedno ista struktura (template-based), a veliko bolj otrokom prijazna. Brez AI klica.

---

## 2. Belezenje vec igranj znotraj ene igre ("Nova igra")

### Problem
Ko otrok na strani `/moji-izzivi` klikne na igro:
1. V localStorage se shrani `{planId, dayDate, activityIndex, leftAt: timestamp}`
2. Otrok navigira v igro (npr. Labirint)
3. Otrok odigra igro, vzame zvezdico - to zapise 1x v tabelo `progress`
4. Otrok klikne "Nova igra" **znotraj igre** - igra se resetira
5. Otrok odigra se enkrat, vzame zvezdico - to zapise se 1x v tabelo `progress`
6. Otrok se vrne na `/moji-izzivi`
7. `useEffect` preveri nove `progress` zapise po `leftAt` - najde 2 zapisa
8. **TODA:** Vstavi samo 1 completion zapis (koda poklice `completeActivity.mutate()` enkrat)

Bistvo problema: `checkNewProgress` vrne `count: 2`, toda logika vstavi samo 1 completion ne glede na stevilo igranj.

### Resitev
V `MojiIzzivi.tsx` useEffect logiko spremeniti:
- Ce `count >= 1`, vstavi toliko completion zapisov, kolikor je novih progress zapisov (do max 2 za igre, max 1 za motoriko)
- Za igre: vstavi `min(count, requiredPlays - existingCompletions)` completion zapisov
- Vsak completion dobi svoj `play_number` (1, 2, ...)

Konkretno:
```text
// PREJ:
if (count > 0) {
  completeActivity.mutate({ ... }); // samo 1x
}

// POTEM:
if (count > 0) {
  const existingCount = await getActivityPlayCount(planId, childId, dayDate, activityIndex);
  const requiredPlays = activityType === "motorika" ? 1 : 2;
  const maxNewPlays = Math.min(count, requiredPlays - existingCount);
  
  for (let i = 0; i < maxNewPlays; i++) {
    await completeActivity.mutateAsync({ ... });
  }
}
```

Pomozna funkcija `getActivityPlayCount` ze obstaja v `usePlanProgress.ts` - samo izvoziti jo moram in uporabiti v MojiIzzivi.tsx.

---

## 3. Prikaz samo danasnjega dne + arhiv preteklih dni

### Problem
Trenutno so na `/moji-izzivi` vidni vsi dnevi (pretekli, danasnji, prihodnji), kar je za otroka prevec informacij.

### Resitev
Razdeliti prikaz na dva dela:

### A) Stran /moji-izzivi - samo danes

Na glavni strani prikazati:
- Glavo z naslovom "Moj osebni nacrt" in toplim sporocilom
- **Samo kartico danasnjega dne** (z vsemi 5 aktivnostmi)
- Ce danes ni v obsegu nacrta, prikazati ustrezno sporocilo
- Gumb "Pretekli dnevi" (ikona History/Clock) v vrstici z naslovom, desno poravnan

### B) Nova stran /moji-izzivi/arhiv - pretekli dnevi

Nova stran, ki prikazuje:
- Naslov "Pretekli dnevi" z nazaj-gumbom
- Seznam vseh preteklih dni (od najnovejsega navzdol)
- Vsak dan prikazan kot zlozen PlanDayCard (enak kot zdaj, z zvezdicami in aktivnostmi)
- Vsi dnevi so v "preteklem" stanju (neklikabilni, samo za pregled)
- Prihodnji dnevi NISO vidni

### Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `supabase/functions/generate-monthly-plan/index.ts` | Sprememba | Toplo prijazno sporocilo namesto suhega template-a |
| `src/hooks/usePlanProgress.ts` | Sprememba | Izvoziti `getActivityPlayCount` funkcijo za uporabo v MojiIzzivi |
| `src/pages/MojiIzzivi.tsx` | Sprememba | (a) Popraviti useEffect za vec completion-ov ob vrnitvi iz igre. (b) Prikazati samo danasnji dan. (c) Dodati gumb za arhiv. |
| `src/pages/MojiIzziviArhiv.tsx` | Nova | Nova stran za prikaz preteklih dni |
| `src/config/routes.tsx` | Sprememba | Dodati route `/moji-izzivi/arhiv` |
| `src/components/BreadcrumbNavigation.tsx` | Sprememba | Dodati breadcrumb za arhiv stran |

---

## Tehnicne podrobnosti

### Toplo sporocilo - template
```text
const childNameCapitalized = child.name.charAt(0).toUpperCase() + child.name.slice(1);
const lettersFormatted = targetLetters.join(" in ");
const summary = `Hej ${childNameCapitalized}! Pripravili smo ti zabaven načrt vaj in iger, s katerimi boš vadil črki ${lettersFormatted}. Vsak dan te čakajo nove pustolovščine – vaje za jezik in 4 igrice! Zbiraj zvezdice in postani pravi šampion! 🌟`;
```

### Vec completion-ov ob vrnitvi
Logika v useEffect:
1. Preberi localStorage tracking
2. Poklici `checkNewProgress(childId, leftAt)` - vrne `{ count, totalStars }`
3. Preberi obstoječe stevilo igranj za to aktivnost
4. Izracunaj koliko novih completion-ov vstaviti: `min(count, required - existing)`
5. Vstavi zapise zaporedno (vsak z naslednjim `play_number`)
6. Invalidiraj cache

### Arhiv stran
- Isti `useMonthlyPlan` hook za podatke
- Isti `PlanDayCard` komponenta za prikaz
- Filtriranje: prikazani samo dnevi kjer `day.date < todayStr`
- Razvrscanje: od najnovejsega navzdol (obratno od trenutnega)

### Nova igra regeneracija
Za regeneracijo nacrta z novim summary-jem klicati edge funkcijo:
- Najprej spremeniti edge funkcijo
- Potem klicati regeneracijo za aktivnega otroka (Zak)
