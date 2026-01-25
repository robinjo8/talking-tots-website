

# Načrt: Posodobitev strani "Moji pregledi" in "Moj portal"

## Povzetek

Potrebno je posodobiti dve strani:
1. **`/admin/my-reviews`** - Dodati 4 statistične kartice za logopedove lastne preglede
2. **`/admin` (Moj portal)** - Razširiti z dvema nivojema kartic (organizacija + osebno) ter interaktivnimi grafi

---

## 1. Stran `/admin/my-reviews` - Statistične kartice

### Trenutno stanje
Stran prikazuje samo eno kartico "Aktivni pregledi" s skupnim številom.

### Nove kartice (4 kartice v vrsti)

| Kartica | Podatek | Ikona | Barva | Opis |
|---------|---------|-------|-------|------|
| **Moji pregledi** | Skupno število prevzetih primerov | User | Modra | Vsi primeri, ki ste jih prevzeli |
| **V pregledu** | Število s statusom "V obdelavi" | Clock | Oranžna | Primeri, ki jih aktivno pregledujete |
| **Pregledano** | Število s statusom "Pregledano" | CheckCircle | Vijolična | Primeri z oddanimi ocenami |
| **Zaključeno** | Število s statusom "Zaključeno" | FileCheck | Zelena | Primeri z generiranim poročilom |

### Izračun podatkov

Iz obstoječih podatkov v `useMyReviews`:
```typescript
const totalMyReviews = myReviews.length;
const inReviewCount = myReviews.filter(s => 
  s.status !== 'completed' || (!s.reviewed_at && !s.completed_at)
).length;
const reviewedCount = myReviews.filter(s => 
  (s.reviewed_at || s.status === 'completed') && !s.completed_at
).length;
const completedCount = myReviews.filter(s => !!s.completed_at).length;
```

---

## 2. Stran `/admin` (Moj portal) - Razširjena nadzorna plošča

### Nova struktura strani

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Dobrodošli, Robert Kujavec                                                 │
│  TomiTalk logoped • Preglejte status preverjanj izgovorjave                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 ORGANIZACIJA (TomiTalk logoped)                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │    12      │ │     5      │ │     4      │ │     3      │                │
│  │ Vsa prev.  │ │ V čakanju  │ │ Pregledano │ │ Zaključeno │                │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                │
│                                                                             │
│  👤 MOJE DELO                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │     4      │ │     2      │ │     1      │ │     1      │                │
│  │ Moji pregl.│ │ V pregledu │ │ Pregledano │ │ Zaključeno │                │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                │
│                                                                             │
│  📈 GRAFI                                                                   │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐    │
│  │ Statistika preverjanj          │ │ Tortni graf statusov           │    │
│  │ (Linijski graf)                │ │                                 │    │
│  │ ☑ Nova preverjanja             │ │    [Tortni diagram]             │    │
│  │ ☑ V čakanju                    │ │                                 │    │
│  │ ☐ Pregledano                   │ │                                 │    │
│  │ ☐ Zaključeno                   │ │                                 │    │
│  └─────────────────────────────────┘ └─────────────────────────────────┘    │
│                                                                             │
│  🧠 NAJPOGOSTEJŠI GOVORNI IZZIVI                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    [Tortni graf po črkah]                               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kartice za organizacijo (zgornja vrstica)

| Kartica | Podatek | Ikona | Barva | Opis |
|---------|---------|-------|-------|------|
| **Vsa preverjanja** | Število vseh preverjanj v organizaciji | ClipboardList | Modra | Skupno število opravljenih preverjanj |
| **V čakanju** | Vsi neprevzeti pregledi organizacije | Clock | Oranžna | Pregledi, ki čakajo na prevzem |
| **Pregledano** | Vsi pregledani s strani organizacije | Eye | Vijolična | Pregledi z oddanimi ocenami |
| **Zaključeno** | Vsi zaključeni v organizaciji | CheckCircle | Zelena | Pregledi z generiranimi poročili |

### Kartice za osebno delo (spodnja vrstica)

Enake kot na strani `/admin/my-reviews` (glej zgoraj).

### Interaktivni linijski graf

Graf bo imel kljukice (checkboxi) za izbiro katerih linij naj prikazuje:
- ☑ Nova preverjanja (modra)
- ☑ V čakanju (oranžna)
- ☐ Pregledano (vijolična)
- ☐ Zaključeno (zelena)

Logoped lahko vklopi/izklopi posamezne parametre.

### Tortni graf statusov

Desno od linijskega grafa bo tortni graf z razdelitvijo:
- Nova preverjanja
- V čakanju
- V pregledu
- Pregledano
- Zaključeno

Podatki se ujemajo s karticami organizacije.

### Graf govornih izzivov

Premakne se pod glavna grafa in ostane nespremenjen.

---

## Tehnične spremembe

### Nove/posodobljene datoteke

**1. `src/hooks/useAdminStats.ts`**

Razširiti za nove statistike:
```typescript
interface AdminStats {
  // Organizacija
  orgTotalTests: number;
  orgPendingTests: number;
  orgReviewedTests: number;  // NOVO
  orgCompletedTests: number;
  
  // Osebno
  myTotalReviews: number;
  myInReviewCount: number;   // NOVO
  myReviewedCount: number;   // NOVO
  myCompletedCount: number;  // NOVO
}
```

**2. `src/hooks/useAdminChartData.ts`**

Razširiti za dodatne linije:
```typescript
interface TestsDataPoint {
  date: string;
  new: number;
  pending: number;    // NOVO
  reviewed: number;   // NOVO
  completed: number;
}

interface StatusDistribution {  // NOVO
  name: string;
  value: number;
  color: string;
}
```

**3. `src/components/admin/TestsLineChart.tsx`**

- Dodati checkboxe za vklop/izklop linij
- Uporabiti state za sledenje aktivnim linijam
- Prikazati le izbrane linije

**4. `src/components/admin/StatusPieChart.tsx`** (NOVA DATOTEKA)

Nova komponenta za tortni graf statusov.

**5. `src/pages/admin/AdminDashboard.tsx`**

- Dodati razdelek "Organizacija" z 4 karticami
- Dodati razdelek "Moje delo" z 4 karticami
- Postaviti grafe v mrežo (linijski + tortni)
- Premakniti graf govornih izzivov pod glavna grafa

**6. `src/pages/admin/AdminMyReviews.tsx`**

- Zamenjati eno kartico s 4 karticami v vrsti
- Uporabiti obstoječe podatke za izračun statistik

---

## Vizualni predogled

### Stran `/admin/my-reviews`:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Moji pregledi                                                              │
│  Preverjanja, ki ste jih prevzeli v obdelavo                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ 👤    4    │ │ 🕐    2    │ │ ✅    1    │ │ 📄    1    │                │
│  │ Moji      │ │ V pregledu │ │ Pregledano │ │ Zaključeno │                │
│  │ pregledi  │ │            │ │            │ │            │                │
│  │ Vsi       │ │ Aktivno    │ │ Ocene      │ │ Poročila   │                │
│  │ prevzeti  │ │ pregleduj. │ │ oddane     │ │ generirana │                │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                │
│                                                                             │
│  [Tabela pregledov - nespremenjena]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stran `/admin` (Moj portal) - grafi:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  📈 Statistika preverjanj           │  📊 Razdelitev statusov              │
├─────────────────────────────────────┼─────────────────────────────────────┤
│                                     │                                     │
│  Izberi prikaz:                     │         ┌──────────┐                │
│  ☑ Nova preverjanja                 │      ┌──┤V čakanju │                │
│  ☑ V čakanju                        │   ┌──┤  └──────────┘                │
│  ☐ Pregledano                       │   │  │                              │
│  ☐ Zaključeno                       │   │  └──Pregledano                  │
│                                     │   │                                 │
│  ▄▄▄▄▄                              │   └────Zaključeno                   │
│      ▄▄▄                            │                                     │
│         ▄▄▄▄                        │                                     │
│  ───────────────                    │                                     │
│                                     │                                     │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

---

## Datoteke za posodobitev

1. **`src/hooks/useAdminStats.ts`** - Razširiti s podrobnejšimi statistikami
2. **`src/hooks/useAdminChartData.ts`** - Dodati podatke za nove grafe
3. **`src/components/admin/TestsLineChart.tsx`** - Dodati interaktivne checkboxe
4. **`src/components/admin/StatusPieChart.tsx`** - Nova komponenta za tortni graf
5. **`src/pages/admin/AdminDashboard.tsx`** - Celotna prenova z dvema nivojema kartic
6. **`src/pages/admin/AdminMyReviews.tsx`** - Dodati 4 statistične kartice

