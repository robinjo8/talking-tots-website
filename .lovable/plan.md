

# Načrt: Popravki nadzorne plošče in filtri na straneh

## 1. Spremembe na strani /admin/dashboard

### 1.1 Preimenovanje kartice
- "Vsa preverjanja" → "Preverjanja"

### 1.2 Skrivanje ikon na mobilnih napravah
V `StatCard.tsx` bom dodal responsivno klaso za skrivanje ikone na manjših zaslonih:
- Ikona se bo prikazovala samo na `md:` (768px+) napravah
- Na mobilnih napravah bo kartica vsebovala samo besedilo

### 1.3 Popravek navigacije ob kliku na kartice

**Organizacija (leva stran):**
| Kartica | Trenutna pot | Nova pot |
|---------|--------------|----------|
| Preverjanja | /admin/tests | /admin/all-tests |
| V čakanju | /admin/tests?status=pending | /admin/pending |
| Pregledano | /admin/tests?status=reviewed | /admin/all-tests?status=reviewed |
| Zaključeno | /admin/tests?status=completed | /admin/all-tests?status=completed |

**Moje delo (desna stran):**
| Kartica | Trenutna pot | Nova pot |
|---------|--------------|----------|
| Moji pregledi | /admin/my-reviews | /admin/my-reviews |
| V pregledu | /admin/my-reviews | /admin/my-reviews?status=in_review |
| Pregledano | /admin/my-reviews | /admin/my-reviews?status=reviewed |
| Zaključeno | /admin/my-reviews | /admin/my-reviews?status=completed |

## 2. Dodajanje filtrov na strani

Bom ustvaril skupno komponento `TestFilters` ki jo bom lahko ponovno uporabil na vseh straneh.

### 2.1 Nova komponenta `TestFilters.tsx`
Komponenta bo vsebovala:
- **Starost**: Vse starosti, 3 leta, 4 leta, 5 let, 6 let, 7+ let
- **Spol**: Vsi, Moški, Ženski
- **Status**: Vsi statusi, V čakanju, V obdelavi, Pregledano, Zaključeno
- **Datum oddaje**: Vsi datumi, Danes, Zadnji teden, Zadnji mesec, Zadnje leto

### 2.2 Integracija na straneh

| Stran | Filtri |
|-------|--------|
| /admin/pending | Starost, Spol, Datum (Status ni potreben - vedno "pending") |
| /admin/my-reviews | Starost, Spol, Status (brez "V čakanju"), Datum |
| /admin/users | Starost, Spol |
| /admin/reports | Status (Osnutek, Revidirano, Oddano), Datum |

## 3. Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/components/admin/StatCard.tsx` | Posodobitev | Skrij ikono na mobilnih napravah z `hidden md:flex` |
| `src/pages/admin/AdminDashboard.tsx` | Posodobitev | Spremeni "Vsa preverjanja" v "Preverjanja", popravi URL-je |
| `src/components/admin/TestFilters.tsx` | Nova | Skupna komponenta za filtre |
| `src/pages/admin/AdminPending.tsx` | Posodobitev | Dodaj filtre za starost, spol, datum |
| `src/pages/admin/AdminMyReviews.tsx` | Posodobitev | Dodaj filtre za starost, spol, status, datum |
| `src/pages/admin/AdminUsers.tsx` | Posodobitev | Dodaj filtre za starost, spol |
| `src/pages/admin/AdminReports.tsx` | Posodobitev | Dodaj filtre za status, datum |

## 4. Tehnična implementacija

### StatCard - responsivna ikona
```tsx
{/* Ikona - skrita na mobilnih, vidna na md+ */}
<div className={cn(
  'hidden md:flex h-12 w-12 rounded-full items-center justify-center', 
  classes.bg
)}>
  <Icon className={cn('h-6 w-6', classes.text)} />
</div>
```

### TestFilters komponenta
```tsx
interface TestFiltersProps {
  ageFilter?: string;
  setAgeFilter?: (value: string) => void;
  genderFilter?: string;
  setGenderFilter?: (value: string) => void;
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  dateFilter?: string;
  setDateFilter?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
}
```

Komponenta bo omogočala prilagoditev, kateri filtri so prikazani in kakšne so možnosti za status (različne strani potrebujejo različne statusne opcije).

