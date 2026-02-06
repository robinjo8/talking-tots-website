

# Plan: AI mesecni nacrt vaj na podlagi logopedskega porocila

## Povzetek

Ko logopedinja shrani PDF porocilo, se avtomatsko poklice edge funkcija `generate-monthly-plan`, ki na podlagi porocila, ocen glasov in starosti otroka generira personaliziran 4-tedenski nacrt vaj in iger. Nacrt se prikaze staršem na strani `/moji-izzivi` kot interaktiven koledar s povezavami do iger.

Trenutno stanje: **nic od tega ne obstaja** - ni edge funkcije, ni tabele v bazi, ni prikaza na uporabniski strani. Stran `/moji-izzivi` je prazna kartica brez logike.

---

## A. Podatkovna baza

### Nova tabela: `child_monthly_plans`

| Stolpec | Tip | Opis |
|---------|-----|------|
| id | uuid PK | ID nacrta |
| child_id | uuid FK -> children | Otrok |
| report_id | uuid FK -> logopedist_reports | Porocilo ki je sprozilo nacrt |
| plan_data | jsonb | Strukturiran mesecni nacrt (4 tedni x 7 dni x 3-4 aktivnosti) |
| focus_letters | text[] | Glasovi na katere se nacrt osredotoca |
| month | integer | Mesec (1-12) |
| year | integer | Leto |
| status | text | 'generating', 'active', 'archived' |
| created_at | timestamptz | Cas ustvarjanja |
| updated_at | timestamptz | Cas posodobitve |

### RLS politike

- **SELECT za starse**: `auth.uid() = (SELECT parent_id FROM children WHERE id = child_id)`
- **SELECT za logopedinje**: prek `is_logopedist(auth.uid())` ali `is_internal_logopedist(auth.uid())`
- **INSERT/UPDATE**: samo prek service role (edge funkcija) - ni direktnega uporabniskega dostopa za pisanje

### Struktura `plan_data` (JSONB)

```text
{
  "summary": "Nacrt se osredotoca na glasove S in Z...",
  "targetLetters": ["S", "Z"],
  "childAge": 9,
  "ageGroup": "9-10",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Uvajanje glasov S in Z",
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Ponedeljek",
          "activities": [
            {
              "type": "motorika",
              "title": "Vaje motorike govoril",
              "description": "Izvedite 5 minut vaj za ustnice in jezik",
              "path": "/govorno-jezikovne-vaje/vaje-motorike-govoril",
              "duration": "5 min"
            },
            {
              "type": "igra",
              "title": "Sestavljanke - crka S",
              "description": "Sestavi sestavljanko in izgovori besede",
              "path": "/govorne-igre/sestavljanke/s910",
              "letter": "S",
              "duration": "10 min"
            },
            {
              "type": "igra",
              "title": "Labirint - crka Z",
              "description": "Poisci pot skozi labirint",
              "path": "/govorne-igre/labirint/z",
              "letter": "Z",
              "duration": "10 min"
            }
          ]
        }
        // ... 7 dni
      ]
    }
    // ... 4 tedni
  ]
}
```

---

## B. Edge funkcija: `generate-monthly-plan`

### Tok izvajanja

1. Prejme `reportId` kot parameter
2. Iz baze nalozi:
   - Porocilo (`logopedist_reports`) -> `recommended_letters`, `session_id`
   - Ocene glasov (`articulation_evaluations` prek `session_id`) -> vse crke ki nimajo `acquired`
   - Otroka (`children` prek `articulation_test_sessions.child_id`) -> `birth_date` za izracun starosti
3. Iz `birth_date` izracuna starost in doloci starostno skupino (3-4, 5-6, 7-8, 9-10)
4. Doloci ciljne crke:
   - Primarno iz `recommended_letters` (kar je logopedinja izbrala v porocilu)
   - Sekundarno iz `articulation_evaluations` ki nimajo `acquired` oznake
   - Odstrani duplikate
5. Sestavi prompt za OpenAI API z:
   - Seznamom ciljnih crk
   - Starostno skupino
   - Kompletnim katalogom razpolozljivih iger z dejanskimi URL-ji
6. Poklice OpenAI API (`gpt-4.1`, isti model kot chat-assistant) s **tool calling** za strukturiran izhod
7. Arhivira morebitni prejsnji aktivni nacrt (status -> 'archived')
8. Shrani nov nacrt v `child_monthly_plans`

### Katalog iger za AI (dejanske poti iz kode)

AI dobi ta katalog in SME dodeliti samo igre iz tega seznama za crke ki so v njem podprte:

```text
KOLO BESED (brez starostnih variant):
  /govorne-igre/kolo-srece/{urlKey}
  Crke: S(s), Z(z), C(c), S(sh), Z(zh), C(ch), K(k), L(l), R(r)

BINGO (brez starostnih variant):
  /govorne-igre/bingo/{urlKey}
  Crke: S(s), Z(z), C(c), S(sh), Z(zh), C(ch), K(k), L(l), R(r)

SPOMIN (brez starostnih variant):
  /govorne-igre/spomin/spomin-{urlKey}
  Crke: S(s), Z(z), C(c), S(sh), Z(zh), C(ch), K(k), L(l), R(r)

SESTAVLJANKE (s starostnimi varianti):
  /govorne-igre/sestavljanke/{urlKey}      (3-4)
  /govorne-igre/sestavljanke/{urlKey}56    (5-6)
  /govorne-igre/sestavljanke/{urlKey}78    (7-8)
  /govorne-igre/sestavljanke/{urlKey}910   (9-10)
  Crke: S(s), Z(z), C(c), S(sh), Z(zh), C(ch), K(k), L(l), R(r)

DRSNA IGRA (s starostnimi varianti - enako kot sestavljanke):
  /govorne-igre/drsna-sestavljanka/{urlKey}{ageKey}
  Crke: C(c), C(ch), K(k), L(l), R(r), S(s), S(sh), Z(z), Z(zh)

ZAPOREDJA (s starostnimi varianti - enako):
  /govorne-igre/zaporedja/{urlKey}{ageKey}
  Crke: C(c), C(ch), K(k), L(l), R(r), S(s), S(sh), Z(z), Z(zh)

IGRA UJEMANJA (s starostnimi varianti):
  /govorne-igre/igra-ujemanja/{urlKey}{ageKey}
  Crke: C(c), C(ch), K(k), L(l), R(r), S(s), S(sh), Z(z), Z(zh)

LABIRINT (brez starostnih variant):
  /govorne-igre/labirint/{urlKey}
  Crke: C(c), C(ch), K(k), L(l), R(r), S(s), S(sh), Z(z), Z(zh)

SMESNE POVEDI (brez starostnih variant):
  /govorne-igre/met-kocke/{urlKey}
  Crke: S(s), Z(z), C(c), S(sh), Z(zh), C(ch), L(l), R(r), K(k)

PONOVI POVED (brez starostnih variant):
  /govorne-igre/ponovi-poved/{urlKey}
  Crke: K(k), L(l), R(r), S(s), Z(z), C(c), S(sh), Z(zh), C(ch)

MOTORIKA GOVORIL (brez crk):
  /govorno-jezikovne-vaje/vaje-motorike-govoril
```

### Pretvorba crk v URL kljuce

```text
Crka -> urlKey:
C -> c   | C -> ch  | S -> sh  | Z -> zh
K -> k   | L -> l   | R -> r   | S -> s
Z -> z   | P,B,M,T,D,G,N,H,V,J,F -> nimajo iger
```

Za crke brez razpolozljivih iger (P, B, M, T, D, G, N, H, V, J, F) AI dodeli samo motoriko govoril in splosne vaje brez specificne crke.

### Starostne skupine za igre

```text
3-4 let -> ageKey "" (samo urlKey brez stevilke, npr. /sestavljanke/s)
5-6 let -> ageKey "56" (npr. /sestavljanke/s56)
7-8 let -> ageKey "78"
9-10 let -> ageKey "910"
```

### Strukturiran izhod (Tool Calling)

Namesto prostega JSON-a se uporabi OpenAI tool calling:

```text
tool: create_monthly_plan
parameters:
  summary: string
  weeks: array (4 tedni) of {
    weekNumber: number
    theme: string
    days: array (7 dni) of {
      dayNumber: number
      dayName: string (Ponedeljek-Nedelja)
      activities: array (3-4 aktivnosti) of {
        type: "motorika" | "igra"
        title: string
        description: string
        path: string (MORA biti iz kataloga)
        letter: string (opcijsko)
        duration: string
      }
    }
  }
```

### Pravila za AI

- Vsak dan se zacne z motoriko govoril (5 min)
- Sledita 2-3 igre (po 10 min), razporejene enakomerno med ciljnimi crkami
- Igre se razlikujejo med dnevi (ne ista igra vsak dan)
- Skupno trajanje dneva: 25-35 min
- 7 dni na teden, 4 tedni
- Poti morajo biti iz kataloga - AI ne sme izmisliti poti

---

## C. Prozenje iz admin portala

Po uspesnem insertu porocila v `handleGeneratePdf` se doda klic edge funkcije. To se doda v **dveh datotekah**:

### AdminUserDetail.tsx (vrstica ~433)

Po uspesnem insertu v `logopedist_reports`:

```text
// Po uspesnem insertu porocila:
if (!insertError) {
  // Pridobi ID vstavljenega porocila
  // Spremeniti insert v .insert(...).select('id').single()
  
  // Fire-and-forget klic za generiranje mesecnega nacrta
  supabase.functions.invoke('generate-monthly-plan', {
    body: { reportId: insertedReportId }
  }).then(res => {
    if (res.error) console.error('Monthly plan generation failed:', res.error);
  });
  
  toast.success('Porocilo shranjeno. Mesecni nacrt se generira...');
}
```

### AdminLogopedistChildDetail.tsx (vrstica ~333)

Enaka logika. Tukaj je `session_id: null`, zato mora edge funkcija znati najti otroka tudi brez session_id - prek `pdf_url` poti ki vsebuje child_id, ali pa dodamo `child_id` parameter v klic.

---

## D. Uporabniska stran `/moji-izzivi`

### Celoten preobrazba MojiIzzivi.tsx

1. Pridobi `selectedChild` iz AuthContext
2. Poizvedba v `child_monthly_plans` za aktivni nacrt tega otroka
3. Ce nacrt ne obstaja: prikazi sporocilo "Tvoj osebni nacrt bo na voljo po prvem preverjanju izgovorjave pri logopedu."
4. Ce nacrt se generira (status = 'generating'): spinner z "Nacrt se pripravlja..."
5. Ce nacrt obstaja (status = 'active'): prikazi mesecni koledar

### Vizualni prikaz

```text
+--------------------------------------------------+
|  MOJ OSEBNI NACRT                                |
|  Vadimo glasove: S, Z                            |
+--------------------------------------------------+
|  [Teden 1]  [Teden 2]  [Teden 3]  [Teden 4]    |
+--------------------------------------------------+
|                                                   |
|  PONEDELJEK                                       |
|  +--------------------------------------------+  |
|  | Vaje motorike govoril      5 min   [Igraj] |  |
|  +--------------------------------------------+  |
|  | Sestavljanke - glas S     10 min   [Igraj] |  |
|  +--------------------------------------------+  |
|  | Labirint - glas Z         10 min   [Igraj] |  |
|  +--------------------------------------------+  |
|                                                   |
|  TOREK                                            |
|  +--------------------------------------------+  |
|  | Vaje motorike govoril      5 min   [Igraj] |  |
|  +--------------------------------------------+  |
|  | Kolo besed - glas S       10 min   [Igraj] |  |
|  +--------------------------------------------+  |
|  | Bingo - glas Z            10 min   [Igraj] |  |
|  +--------------------------------------------+  |
|  ...                                              |
+--------------------------------------------------+
```

- 4 zavihki za tedne (Teden 1-4) s preklapljanjem
- Za vsak dan (Pon-Ned) seznam aktivnosti
- Vsaka aktivnost je kartica z ikono, naslovom, trajanjem in gumbom "[Igraj]" ki odpre igro

### Nov hook: `useMonthlyPlan.ts`

```text
// Pridobi aktivni nacrt za otroka
const { data: plan, isLoading } = useQuery({
  queryKey: ['monthly-plan', childId],
  queryFn: async () => {
    const { data } = await supabase
      .from('child_monthly_plans')
      .select('*')
      .eq('child_id', childId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }
});
```

---

## E. Posodobitev `supabase/config.toml`

```text
[functions.generate-monthly-plan]
verify_jwt = false
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| SQL migracija | Nova | Tabela `child_monthly_plans` z RLS politikami |
| `supabase/functions/generate-monthly-plan/index.ts` | Nova | Edge funkcija ki poklice OpenAI in generira nacrt |
| `supabase/config.toml` | Sprememba | Dodaj novo funkcijo |
| `src/pages/MojiIzzivi.tsx` | Sprememba | Celoten UI za prikaz mesecnega nacrta |
| `src/hooks/useMonthlyPlan.ts` | Nova | Hook za nalaganje nacrta iz baze |
| `src/pages/admin/AdminUserDetail.tsx` | Sprememba | Klic edge funkcije po shranjevanju porocila (+ `.select('id').single()`) |
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Sprememba | Enako kot zgoraj |

---

## Tehnicne podrobnosti

- **OpenAI model**: gpt-4.1 (isti kot za chat-assistant, ze konfiguriran OPENAI_API_KEY)
- **Metoda**: Tool calling za zanesljiv strukturiran JSON izhod
- **Cas generiranja**: ~10-20 sekund (asinhrono - logopedinja ne caka)
- **Stroski**: ~0.01-0.05 EUR na generiran nacrt
- **Izolacija**: RLS na nivoju otroka, edge funkcija prek service_role_key
- **Arhiviranje**: Ob vsakem novem porocilu se prejsnji nacrt arhivira (status -> 'archived')
- **Testni primer**: Otrok Zak (9 let, skupina 9-10), crke S in Z iz `recommended_letters`, dodane bodo se crke iz ocen ki nimajo `acquired` oznake (Ž in Š)

