
# Načrt: Popravek "Moji pregledi" in dodajanje notification značk

## Problem 1: Prevzeta seja se ne prikaže v "Moji pregledi"

Hook `useClaimTestSession` zdaj pravilno shranjuje `profile.id` v `assigned_to`, vendar hook `useMyReviews` še vedno išče po `user.id`. To je neujemanje!

**Stanje v bazi:**
- Session ima `assigned_to: 6837d765-...` (profile.id)
- Hook išče po `user.id: 1ba88ef8-...` (auth user id)
- Zato ni zadetkov!

## Problem 2: Manjkajo notification značke

Zavihka "V čakanju" in "Moji pregledi" potrebujeta oranžne kroge s številkami, ki prikazujejo število primerov.

---

## Rešitev

### 1. Popravek useMyReviews.ts

Spremeniti iskanje iz `user.id` v `profile.id`:

```typescript
// Prej:
const { user } = useAdminAuth();
.eq('assigned_to', user.id)
enabled: !!user?.id

// Potem:
const { profile } = useAdminAuth();
.eq('assigned_to', profile.id)
enabled: !!profile?.id
```

### 2. Nov hook za štetje primerov

Ustvariti `useAdminCounts.ts` hook, ki vrne:
- `pendingCount` - število čakajočih primerov
- `myReviewsCount` - število mojih pregledov

```typescript
export function useAdminCounts() {
  const { profile } = useAdminAuth();
  
  // Poizvedba za pending count
  const pendingQuery = useQuery({
    queryKey: ['admin-pending-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .is('assigned_to', null);
      return count || 0;
    }
  });
  
  // Poizvedba za my reviews count
  const myReviewsQuery = useQuery({
    queryKey: ['admin-my-reviews-count', profile?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('articulation_test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', profile.id)
        .in('status', ['assigned', 'in_review']);
      return count || 0;
    },
    enabled: !!profile?.id
  });
  
  return {
    pendingCount: pendingQuery.data || 0,
    myReviewsCount: myReviewsQuery.data || 0
  };
}
```

### 3. Posodobitev AdminSidebar.tsx

Dodati notification badge komponento in jo uporabiti na ustreznih zavihkih:

```tsx
// Nova badge komponenta
function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-app-orange text-[10px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// V navigaciji
const { pendingCount, myReviewsCount } = useAdminCounts();

const navigation = [
  { name: 'Moj portal', href: '/admin', icon: LayoutDashboard, count: 0 },
  { name: 'Vsa preverjanja', href: '/admin/all-tests', icon: ClipboardList, count: 0 },
  { name: 'V čakanju', href: '/admin/pending', icon: Clock, count: pendingCount },
  { name: 'Moji pregledi', href: '/admin/my-reviews', icon: User, count: myReviewsCount },
];

// V renderju
{item.name}
{item.count > 0 && <NotificationBadge count={item.count} />}
```

### 4. Posodobitev AdminMobileNav.tsx

Enako kot pri sidebar - dodati notification badge na mobilni navigaciji.

---

## Vizualni rezultat

### Desktop sidebar:
```
┌─────────────────────────────┐
│ V čakanju         🟠 2      │
│ Moji pregledi     🟠 1      │
└─────────────────────────────┘
```

### Mobile nav:
```
┌─────────────────────────────┐
│ 🕐 V čakanju       🟠 2     │
│ 👤 Moji pregledi   🟠 1     │
└─────────────────────────────┘
```

---

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useMyReviews.ts` | Zamenjaj `user.id` s `profile.id` |
| `src/hooks/useAdminCounts.ts` | Nova datoteka - hook za štetje |
| `src/components/admin/AdminSidebar.tsx` | Dodaj notification badges |
| `src/components/admin/AdminMobileNav.tsx` | Dodaj notification badges |

---

## Rezultat

Po implementaciji:
- Prevzeti primeri se bodo pravilno prikazali v "Moji pregledi"
- Zavihek "V čakanju" bo imel oranžno številko (npr. 2)
- Zavihek "Moji pregledi" bo imel oranžno številko (npr. 1)
- Značke se bodo avtomatsko posodabljale ob spremembah
