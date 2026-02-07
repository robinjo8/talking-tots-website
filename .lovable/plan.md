

# Plan: 90-dnevni osebni nacrt (namesto mesecnega)

## Povzetek spremembe

Osebni nacrt se bo zacel na datum kreiranja logopedskega porocila in trajal natanko 90 dni. Nov nacrt se kreira sele ob novem porocilu. 90 dni aktivnosti se generira deterministicno (brez AI za vsak dan), kar je hitrejse, zanesljivejse in cenejse.

---

## A. Sprememba baze podatkov

Dodati stolpca `start_date` in `end_date` v tabelo `child_monthly_plans`:

```text
ALTER TABLE child_monthly_plans 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;
```

Stolpca `month` in `year` ostaneta za nazaj-zdruzljivost, a nista vec primarna referenca za obdobje.

---

## B. Edge funkcija: generate-monthly-plan

### Sprememba 1: Startni datum iz porocila

Namesto uporabe trenutnega meseca (`now()`), se startni datum doloci iz polja `created_at` porocila (`logopedist_reports.created_at`):

```text
// PREJ:
const now = new Date();
const currentMonth = now.getMonth() + 1;
const totalDays = getDaysInMonth(currentYear, currentMonth);

// POTEM:
const startDate = new Date(report.created_at);
const totalDays = 90;
```

### Sprememba 2: 90 dni namesto enega meseca

Generiranje seznama 90 zaporednih dni od startnega datuma:

```text
startDate = 2026-02-06
endDate   = 2026-05-06 (startDate + 89 dni)

Dnevi: 2026-02-06, 2026-02-07, ..., 2026-05-06
```

### Sprememba 3: Deterministicno generiranje aktivnosti

Trenutno OpenAI generira vse dni z igrami, kar za 90 dni (450 aktivnosti) ni prakticno. Namesto tega:

1. Zgradimo seznam vseh moznih kombinacij (gameId, letter):
   - 10 iger x N crk = do 20 kombinacij za 2 crki
2. Vsak dan dobi 1x motoriko + 4 unikatne igre
3. Igre rotiramo cez 90 dni - vsak dan 4 razlicne gameId-je
4. Crke razporedimo enakomerno

Algoritem:
```text
combinations = [(kolo-srece, S), (kolo-srece, Z), (bingo, S), (bingo, Z), ...]
for each day (0..89):
  pick motorika
  pick 4 games with unique gameIds, rotating through combinations
  ensure no gameId repeats within a day
```

### Sprememba 4: AI samo za povzetek

Namesto generiranja celotnega nacrta z AI, se AI uporabi le za kratek povzetek nacrta (1-2 stavka). To je majhen in poceni klic.

Ce se zelimo izogniti tudi temu klicu, lahko povzetek generiramo template-based:
"Osebni nacrt vaj za [ime] (starost [X] let) za obdobje [datum1] - [datum2]. Cilji: vadba crk [S, Z]."

### Sprememba 5: Shranjevanje v bazo

```text
// Insert z novimi polji:
{
  child_id: childId,
  report_id: reportId,
  month: startDate.getMonth() + 1,  // za nazaj-zdruzljivost
  year: startDate.getFullYear(),
  start_date: "2026-02-06",
  end_date: "2026-05-06",
  focus_letters: targetLetters,
  status: "active",  // ni vec "generating" ker je instant
  plan_data: { summary, days, targetLetters, childAge, ageGroup, totalDays: 90 }
}
```

Ker je generiranje deterministicno (brez cakanja na AI), se nacrt takoj shrani s statusom "active" namesto "generating".

---

## C. Frontend: useMonthlyPlan.ts

### Posodobitev tipov

```text
export interface MonthlyPlan {
  id: string;
  child_id: string;
  report_id: string | null;
  plan_data: MonthlyPlanData;
  focus_letters: string[];
  month: number;
  year: number;
  start_date: string | null;  // NOVO
  end_date: string | null;    // NOVO
  status: string;
  created_at: string;
  updated_at: string;
}
```

---

## D. Frontend: MojiIzzivi.tsx

### Sprememba 1: Datumski razpon za zvezde

Namesto izracuna iz `month`/`year` uporabi `start_date`/`end_date` iz nacrta:

```text
// PREJ:
const start = `${year}-${month}-01`;
const end = `${year}-${month}-28`;

// POTEM:
const start = plan.start_date || plan.plan_data.days?.[0]?.date;
const end = plan.end_date || plan.plan_data.days?.[plan.plan_data.days.length-1]?.date;
```

### Sprememba 2: Prikaz dneva "danes"

Danasnji dan se pravilno ujema, ker plan_data.days vsebuje dejanske datume (npr. 2026-02-07) in `todayStr` je prav tako dejanski datum.

---

## E. Regeneracija nacrta

Po vseh spremembah se sproze regeneracija za testnega otroka Zak:
- Report ID: `0494d34a-f7fe-452e-99e5-2f35631310bb` (kreiran 2026-02-06)
- Nov nacrt bo zacel 2026-02-06 in trajal do 2026-05-06 (90 dni)
- Vsak dan: 1x motorika + 4x razlicne igre
- Stari nacrt se arhivira

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| SQL migracija | Nova | Doda `start_date` in `end_date` stolpca |
| `supabase/functions/generate-monthly-plan/index.ts` | Prepisana | Startni datum iz porocila, 90 dni, deterministicno generiranje, AI samo za povzetek |
| `src/hooks/useMonthlyPlan.ts` | Sprememba | Dodan `start_date` in `end_date` v tip `MonthlyPlan` |
| `src/pages/MojiIzzivi.tsx` | Sprememba | Datumski razpon iz `start_date`/`end_date` namesto `month`/`year` |

---

## Prednosti deterministicnega pristopa

1. **Zanesljivost**: Ni vec tezav z AI halucinacijami (napacne poti, podvojeni gameId-ji)
2. **Hitrost**: Nacrt se generira v milisekundah namesto 15-20 sekund
3. **Cena**: Ni vec dragega AI klica za 450 aktivnosti
4. **Konsistentnost**: Vsak dan ima vedno natanko 5 aktivnosti s pravilnimi potmi

