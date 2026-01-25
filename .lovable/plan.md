

# Načrt: Popravek barv v tortnih grafih

## Problem

Recharts komponente ne morejo pravilno interpretirati CSS spremenljivk kot `hsl(var(--app-orange))`. Zaradi tega se barve prikazujejo napačno (črna namesto oranžne).

## Rešitev

Uporabiti dejanske HSL vrednosti namesto CSS spremenljivk v obeh tortnih grafih.

## Spremembe

### 1. `OrganizationPieChart.tsx` - Graf za organizacijo

**Trenutna napačna koda:**
```typescript
const statusDistribution = [
  { name: 'V čakanju', value: stats.orgPendingTests, color: 'hsl(var(--app-orange))' },
  { name: 'Pregledano', value: stats.orgReviewedTests, color: 'hsl(45, 93%, 47%)' },
  { name: 'Zaključeno', value: stats.orgCompletedTests, color: 'hsl(var(--dragon-green))' },
];
```

**Popravljena koda:**
```typescript
const statusDistribution = [
  { name: 'V čakanju', value: stats.orgPendingTests, color: 'hsl(36, 100%, 50%)' },      // Oranžna
  { name: 'Pregledano', value: stats.orgReviewedTests, color: 'hsl(54, 100%, 62%)' },   // Rumena
  { name: 'Zaključeno', value: stats.orgCompletedTests, color: 'hsl(122, 39%, 49%)' },  // Zelena
];
```

### 2. `StatusPieChart.tsx` - Graf za moje delo

**Trenutna napačna koda:**
```typescript
const statusDistribution = [
  { name: 'V obdelavi', value: stats.myInReviewCount, color: 'hsl(var(--app-blue))' },
  { name: 'Pregledano', value: stats.myReviewedCount, color: 'hsl(280, 70%, 50%)' },
  { name: 'Zaključeno', value: stats.myCompletedCount, color: 'hsl(var(--dragon-green))' },
];
```

**Popravljena koda:**
```typescript
const statusDistribution = [
  { name: 'V obdelavi', value: stats.myInReviewCount, color: 'hsl(207, 90%, 54%)' },    // Modra
  { name: 'Pregledano', value: stats.myReviewedCount, color: 'hsl(280, 70%, 50%)' },    // Vijolična
  { name: 'Zaključeno', value: stats.myCompletedCount, color: 'hsl(122, 39%, 49%)' },   // Zelena
];
```

## Barve iz tailwind.config.ts

| Ime | HSL vrednost | Barva |
|-----|--------------|-------|
| app-orange | `hsl(36, 100%, 50%)` | Oranžna |
| app-yellow | `hsl(54, 100%, 62%)` | Rumena |
| dragon-green | `hsl(122, 39%, 49%)` | Zelena |
| app-blue | `hsl(207, 90%, 54%)` | Modra |

## Datoteke za posodobitev

1. **`src/components/admin/OrganizationPieChart.tsx`** - zamenjati CSS spremenljivke z dejanskimi HSL vrednostmi
2. **`src/components/admin/StatusPieChart.tsx`** - zamenjati CSS spremenljivke z dejanskimi HSL vrednostmi

