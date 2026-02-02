

# Načrt: Dodajanje plavajočega gumba "Hiška" v admin igre

## Problem

V admin portalu igre manjka plavajoči gumb "Hiška" (Home) z dropdown menijem, ki vsebuje:
- **Nazaj** - vrni se na izbiro črk
- **Nova igra** - ponastavi igro
- **Navodila** - prikaži navodila za igro

### Vzrok problema

Igre v admin portalu so ovite v `AdminLayoutWrapper` → `AdminLayout`, ki vsebuje:
- `AdminSidebar` (levo)
- `AdminHeader` (zgoraj)
- `<main className="p-6">` (vsebina s paddingom)

Igre pa uporabljajo `fixed inset-0` za celozaslonski prikaz, kar je v konfliktu z admin layoutom. V uporabniškem portalu igre nimajo layouta (samo `ProtectedLazyRoute`), zato delujejo pravilno.

### Trenutno stanje

Komponente iger (`GenericWheelGame`, `GenericBingoGame`, itd.) že vsebujejo plavajoči gumb "Hiška":

```tsx
<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
  <DropdownMenuTrigger asChild>
    <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 ...">
      <Home className="w-8 h-8 text-white" />
    </button>
  </DropdownMenuTrigger>
  ...
</DropdownMenu>
```

Gumb obstaja, ampak je prekrit z admin layoutom (sidebar, header, padding).

---

## Rešitev

Ustvariti **ločene poti za admin igre BREZ AdminLayout wrappa**. Igre v admin portalu morajo biti celozaslonske, tako kot v uporabniškem portalu.

### Pristop

1. **Ustvari nov wrapper brez layouta**: `AdminGameFullscreenWrapper`
   - Samo avtentikacija (preveri ali je logopedist)
   - `GameModeProvider` za kontekst
   - BREZ sidebar, header, padding - celozaslonski prikaz

2. **Posodobi AdminRoutes.tsx**:
   - Poti za igre (npr. `.../games/kolo-srece/:letter`) uporabijo nov fullscreen wrapper namesto `AdminLayoutWrapper`

3. **AdminGameWrapper ostane enak**:
   - Uporablja se za izbirne strani (npr. `.../games/kolo-srece`) kjer želimo admin layout
   - Za dejanske igre uporabimo `AdminGameFullscreenWrapper`

---

## Tehnična implementacija

### Nova komponenta: `AdminGameFullscreenWrapper.tsx`

```tsx
// src/components/admin/games/AdminGameFullscreenWrapper.tsx
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { GameModeProvider } from '@/contexts/GameModeContext';
import { useLogopedistChild } from '@/hooks/useLogopedistChildren';
import { Loader } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export function AdminGameFullscreenWrapper({ children }: Props) {
  const { childId } = useParams<{ childId: string }>();
  const { user, isLogopedist, isLoading: authLoading } = useAdminAuth();
  const { data: child, isLoading: childLoading } = useLogopedistChild(childId);

  // Auth check
  if (authLoading || childLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 animate-spin text-dragon-green" />
      </div>
    );
  }

  if (!user || !isLogopedist) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!child || !childId) {
    return <Navigate to="/admin/children" replace />;
  }

  // Fullscreen game - no layout, just auth + context
  return (
    <GameModeProvider 
      mode="logopedist" 
      logopedistChildId={childId}
      childName={child.name}
    >
      {children}
    </GameModeProvider>
  );
}
```

### Posodobitev: `AdminRoutes.tsx`

Sprememba poti za dejanske igre (ne izbirne strani):

```tsx
// Nova funkcija - fullscreen wrapper za igre
function AdminGameFullscreenRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminGameFullscreenWrapper>
        {children}
      </AdminGameFullscreenWrapper>
    </Suspense>
  );
}

// Sprememba poti za igre:
// PREJ:
<Route path="children/:childId/games/kolo-srece/:letter" 
       element={<AdminLayoutWrapper><AdminKoloSreceRouter /></AdminLayoutWrapper>} />

// POTEM:
<Route path="children/:childId/games/kolo-srece/:letter" 
       element={<AdminGameFullscreenRoute><AdminKoloSreceRouter /></AdminGameFullscreenRoute>} />
```

### Posodobitev: Admin routerji

Admin routerji (`AdminKoloSreceRouter`, `AdminBingoRouter`, itd.) morajo biti posodobljeni:
- Odstrani `AdminGameWrapper` - ni več potreben, ker fullscreen wrapper nastavi kontekst
- Ali pa poenostavi `AdminGameWrapper` da ne dodaja UI elementov

---

## Datoteke za ustvariti

| Datoteka | Namen |
|----------|-------|
| `src/components/admin/games/AdminGameFullscreenWrapper.tsx` | Celozaslonski wrapper za igre |

## Datoteke za posodobiti

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/routing/AdminRoutes.tsx` | Poti za igre uporabijo fullscreen wrapper |
| `src/components/routing/admin/AdminKoloSreceRouter.tsx` | Poenostavi - odstrani redundantni wrapper |
| `src/components/routing/admin/AdminBingoRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminLabirintRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminSpominRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminZaporedjaRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminSestavljankeRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminDrsnaSestavljankaRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminIgraUjemanjaRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminMetKockeRouter.tsx` | Poenostavi |
| `src/components/routing/admin/AdminPonoviPovedRouter.tsx` | Poenostavi |

---

## Koraki implementacije

1. **Ustvari `AdminGameFullscreenWrapper.tsx`** - celozaslonski wrapper
2. **Posodobi `AdminRoutes.tsx`** - dodaj `AdminGameFullscreenRoute` funkcijo in posodobi poti za igre
3. **Poenostavi admin routerje** - odstrani redundantni `AdminGameWrapper` iz routerjev za igre
4. **Testiraj** - preveri da se plavajoči gumb prikaže in deluje pravilno

---

## Vizualni rezultat

Po implementaciji:

```
/admin/children/:id/games/kolo-srece/:letter
└─ AdminGameFullscreenWrapper (avtentikacija + kontekst)
   └─ GenericWheelGame (celozaslonsko)
      └─ Plavajoči gumb "Hiška" v levem spodnjem kotu ✓
         ├─ Nazaj → vrne na izbiro črk
         ├─ Nova igra → ponastavi igro
         └─ Navodila → prikaže navodila
```

## Pomembno

- **Uporabniški portal ostane nedotaknjen** - nobena sprememba ne vpliva na obstoječe igre
- **Izbirne strani ohranijo admin layout** - npr. `/admin/children/:id/games/kolo-srece` prikazuje seznam črk z admin UI
- **Dejanske igre so celozaslonske** - npr. `/admin/children/:id/games/kolo-srece/c` prikazuje igro brez admin UI

