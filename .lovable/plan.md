
# Plan: Popravek statusa "Pregledano" vs "Zaključeno"

## Ugotovljen problem

V bazi podatkov za sejo `d3742796-ad32-4880-90b3-f89767dfdb33` je:
- `status: completed`
- `reviewed_at: NULL` (manjka!)
- `completed_at: NULL`

Ko je bil izveden prejšnji plan, spremembe **niso bile pravilno aplicirane**. Funkcija `completeReview` še vedno nastavlja samo `status: 'completed'` brez `reviewed_at`.

## Potrebne spremembe

### 1. Funkcija `completeReview` v `useSessionReview.ts`

**Problem:** Funkcija ne nastavlja `reviewed_at` ob zaključku pregleda.

**Rešitev:** Posodobiti update stavek na vrsticah 294-298:
```typescript
// TRENUTNO:
.update({ status: 'completed' })

// NOVO:
.update({ 
  status: 'completed',
  reviewed_at: new Date().toISOString() 
})
```

### 2. Hook `useMyReviews.ts` - manjkajoča polja

**Problem:** Query ne pridobiva `reviewed_at` in `completed_at` polj, zato UI ne more ločiti statusov.

**Rešitev:**
- Razširiti interface `MyReviewSession` z novima poljema
- Posodobiti select query (vrstica 32) da vključi ti polji
- Dodati mapiranje v rezultat (vrstice 83-95)

### 3. Hook `useAdminTests.ts` - manjkajoča polja

**Problem:** Enako - query ne pridobiva potrebnih polj za prikaz statusa.

**Rešitev:**
- Razširiti interface `TestSessionData`
- Posodobiti select query (vrstica 32)
- Posodobiti `calculateTestStats` funkcijo za pravilno štetje

### 4. `StatusBadge` v `AdminMyReviews.tsx`

**Problem:** Komponenta gleda samo `status` polje, ne razlikuje med "Pregledano" in "Zaključeno".

**Rešitev:** Spremeniti logiko da upošteva `reviewed_at` in `completed_at`:
- Če je `completed_at` nastavljen → "Zaključeno" (zelena)
- Če je `reviewed_at` nastavljen ALI status = 'completed' → "Pregledano" (vijolična)
- Sicer → "V pregledu" (modra)

### 5. `StatusBadge` v `AdminTests.tsx`

**Problem:** Enaka logika manjka.

**Rešitev:** Dodati novo statusno logiko z dodatnim stanjem "Pregledano" (vijolična).

### 6. Štetje odprtih primerov v `useAdminCounts.ts`

**Problem:** Query šteje samo `assigned` in `in_review`, ne pa tudi `completed` brez `completed_at`.

**Rešitev:** Spremeniti query (vrstice 33-37) da šteje vse seje brez končnega poročila:
```typescript
// Štej vse seje ki so dodeljene meni IN nimajo completed_at
.eq('assigned_to', profile.id)
.is('completed_at', null)
```

### 7. Filter za status na strani `/admin/all-tests`

**Problem:** Filter ima samo "Zaključeno", manjka "Pregledano".

**Rešitev:** Dodati novo opcijo v Select in posodobiti logiko filtriranja.

### 8. Popravek obstoječega zapisa v bazi

Za sejo, ki je že bila zaključena brez `reviewed_at`, bom dodal SQL migracijo:
```sql
UPDATE articulation_test_sessions 
SET reviewed_at = updated_at 
WHERE status = 'completed' AND reviewed_at IS NULL;
```

---

## Vizualna predstavitev statusa

| Pogoj | Status | Barva |
|-------|--------|-------|
| `status = 'pending'` | V čakanju | Oranžna |
| `status IN ('assigned', 'in_review')` | V obdelavi | Modra |
| `status = 'completed' AND completed_at IS NULL` | Pregledano | Vijolična |
| `completed_at IS NOT NULL` | Zaključeno | Zelena |

---

## Datoteke za posodobitev

1. **`src/hooks/useSessionReview.ts`** - popraviti `completeReview` funkcijo
2. **`src/hooks/useMyReviews.ts`** - dodati `reviewed_at`, `completed_at` polja
3. **`src/hooks/useAdminTests.ts`** - dodati `reviewed_at`, `completed_at` polja
4. **`src/hooks/useAdminCounts.ts`** - popraviti query za štetje odprtih primerov
5. **`src/pages/admin/AdminMyReviews.tsx`** - posodobiti `StatusBadge` logiko
6. **`src/pages/admin/AdminTests.tsx`** - posodobiti `StatusBadge` logiko in filter
7. **Nova SQL migracija** - popraviti obstoječe seje brez `reviewed_at`
