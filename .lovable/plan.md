

# Načrt: Dodajanje manjkajočih Admin routerjev za igre

## Problem

Ko logoped na strani `/admin/children/:id/games/kolo-srece` klikne na kartico za črko (npr. "C"), se preusmeri na pot `/admin/children/:id/games/kolo-srece/c`, ki **ne obstaja v routerju**. Trenutno so v `AdminRoutes.tsx` definirane samo izbirne strani za igre, manjkajo pa **dejanski routerji** ki renderirajo igre.

### Manjkajoči routerji v `AdminRoutes.tsx`:

| Igra | Izbira (obstaja) | Router za igro (manjka) |
|------|------------------|------------------------|
| Spomin | `.../spomin` ✅ | `.../spomin/:gameId` ✅ |
| Kolo besed | `.../kolo-srece` ✅ | `.../kolo-srece/:letter` ❌ |
| Bingo | `.../bingo` ✅ | `.../bingo/:letter` ❌ |
| Labirint | `.../labirint` ✅ | `.../labirint/:letter` ❌ |
| Zaporedja | `.../zaporedja` ✅ | `.../zaporedja/:letterAndAge` ❌ |
| Sestavljanke | `.../sestavljanke` ✅ | `.../sestavljanke/:letterAndAge` ❌ |
| Drsna sestavljanka | `.../drsna-sestavljanka` ✅ | `.../drsna-sestavljanka/:letterAndAge` ❌ |
| Igra ujemanja | `.../igra-ujemanja` ✅ | `.../igra-ujemanja/:letterAndAge` ❌ |
| Met kocke | `.../met-kocke` ✅ | `.../met-kocke/:letter` ❌ |
| Ponovi poved | `.../ponovi-poved` ✅ | `.../ponovi-poved/:letter` ❌ |

## Rešitev

Ustvariti **admin routerje** za vsako igro, ki bodo:
1. Brali URL parametre
2. Naložili ustrezno konfiguracijo igre
3. Ovilili igro v `AdminGameWrapper` (ki nastavi `GameModeContext`)
4. Renderirali obstoječo Generic*Game komponento

### Pomembno pravilo (poudaril si ga)
**Admin igre ne smejo vplivati na uporabniški portal!** Zato bomo:
- Ustvarili **ločene admin routerje** v mapi `src/components/routing/admin/`
- Originalni routerji v `src/components/routing/` ostanejo **nedotaknjeni**
- Igre (Generic*Game komponente) bodo uporabile `GameModeContext` za pravilno navigacijo nazaj

---

## Nove datoteke

### 1. Admin routerji (v `src/components/routing/admin/`)

| Datoteka | Namen |
|----------|-------|
| `AdminKoloSreceRouter.tsx` | Router za Kolo besed |
| `AdminBingoRouter.tsx` | Router za Bingo |
| `AdminLabirintRouter.tsx` | Router za Labirint |
| `AdminZaporedjaRouter.tsx` | Router za Zaporedja |
| `AdminSestavljankeRouter.tsx` | Router za Sestavljanke |
| `AdminDrsnaSestavljankaRouter.tsx` | Router za Drsno sestavljanko |
| `AdminIgraUjemanjaRouter.tsx` | Router za Igro ujemanja |
| `AdminMetKockeRouter.tsx` | Router za Met kocke (Smešne povedi) |
| `AdminPonoviPovedRouter.tsx` | Router za Ponovi poved |

### Primer: `AdminKoloSreceRouter.tsx`

```typescript
import { useParams, Navigate } from "react-router-dom";
import { getWheelConfig, type WordData } from "@/data/artikulacijaVajeConfig";
import { GenericWheelGame } from "@/components/games/GenericWheelGame";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

export default function AdminKoloSreceRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/kolo-srece`} replace />;
  }

  const config = getWheelConfig(letter);
  
  if (!config) {
    return <Navigate to={`/admin/children/${childId}/games/kolo-srece`} replace />;
  }

  return (
    <AdminGameWrapper 
      showBackButton={false}
      backPath={`/admin/children/${childId}/games/kolo-srece`}
    >
      <GenericWheelGame
        letter={config.letter}
        displayLetter={config.displayLetter}
        title={config.title}
        wordsData={config.wordsData as WordData[]}
        backPath={`/admin/children/${childId}/games/kolo-srece`}
      />
    </AdminGameWrapper>
  );
}
```

---

## Posodobitve obstoječih datotek

### 1. `AdminRoutes.tsx` - Dodaj manjkajoče poti

Dodati je treba:

```typescript
// Lazy load admin game routers
const AdminKoloSreceRouter = lazy(() => import('@/components/routing/admin/AdminKoloSreceRouter'));
const AdminBingoRouter = lazy(() => import('@/components/routing/admin/AdminBingoRouter'));
const AdminLabirintRouter = lazy(() => import('@/components/routing/admin/AdminLabirintRouter'));
const AdminZaporedjaRouter = lazy(() => import('@/components/routing/admin/AdminZaporedjaRouter'));
const AdminSestavljankeRouter = lazy(() => import('@/components/routing/admin/AdminSestavljankeRouter'));
const AdminDrsnaSestavljankaRouter = lazy(() => import('@/components/routing/admin/AdminDrsnaSestavljankaRouter'));
const AdminIgraUjemanjaRouter = lazy(() => import('@/components/routing/admin/AdminIgraUjemanjaRouter'));
const AdminMetKockeRouter = lazy(() => import('@/components/routing/admin/AdminMetKockeRouter'));
const AdminPonoviPovedRouter = lazy(() => import('@/components/routing/admin/AdminPonoviPovedRouter'));

// ... in dodati poti:
<Route path="children/:childId/games/kolo-srece/:letter" element={<AdminLayoutWrapper><AdminKoloSreceRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/bingo/:letter" element={<AdminLayoutWrapper><AdminBingoRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/labirint/:letter" element={<AdminLayoutWrapper><AdminLabirintRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/zaporedja/:letterAndAge" element={<AdminLayoutWrapper><AdminZaporedjaRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/sestavljanke/:letterAndAge" element={<AdminLayoutWrapper><AdminSestavljankeRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/drsna-sestavljanka/:letterAndAge" element={<AdminLayoutWrapper><AdminDrsnaSestavljankaRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/igra-ujemanja/:letterAndAge" element={<AdminLayoutWrapper><AdminIgraUjemanjaRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/met-kocke/:letter" element={<AdminLayoutWrapper><AdminMetKockeRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/ponovi-poved/:letter" element={<AdminLayoutWrapper><AdminPonoviPovedRouter /></AdminLayoutWrapper>} />
```

### 2. Posodobitev Generic*Game komponent

Igre kot `GenericWheelGame`, `GenericBingoGame` itd. morajo uporabljati `useGameMode()` za pravilno navigacijo nazaj. Trenutno nekatere igre imajo hardkodirano pot (npr. `backPath="/govorne-igre/kolo-srece"`).

Posodobitev bo vključevala:
- Uporabo `useGameNavigation()` za dinamično generiranje poti
- Ali pa prevzem `backPath` prop iz admin routerja (hitrejša opcija)

**Hitrejša opcija**: Admin routerji že pošiljajo `backPath` prop igram. Preveriti je potrebno, da igre ta prop upoštevajo in ne uporabljajo hardkodirane vrednosti.

---

## Koraki implementacije

1. **Ustvari `AdminKoloSreceRouter.tsx`** - Router za Kolo besed
2. **Ustvari `AdminBingoRouter.tsx`** - Router za Bingo
3. **Ustvari `AdminLabirintRouter.tsx`** - Router za Labirint
4. **Ustvari `AdminZaporedjaRouter.tsx`** - Router za Zaporedja
5. **Ustvari `AdminSestavljankeRouter.tsx`** - Router za Sestavljanke
6. **Ustvari `AdminDrsnaSestavljankaRouter.tsx`** - Router za Drsno sestavljanko
7. **Ustvari `AdminIgraUjemanjaRouter.tsx`** - Router za Igro ujemanja
8. **Ustvari `AdminMetKockeRouter.tsx`** - Router za Met kocke
9. **Ustvari `AdminPonoviPovedRouter.tsx`** - Router za Ponovi poved
10. **Posodobi `AdminRoutes.tsx`** - Dodaj lazy loade in Route elemente
11. **Preveri delovanje** - Test navigacije in shranjevanja napredka

---

## Vizualni rezultat po implementaciji

```text
/admin/children/abc123/games/kolo-srece
  → klik na kartico "Črka C"
/admin/children/abc123/games/kolo-srece/c
  → GenericWheelGame se renderira znotraj AdminGameWrapper
  → Gumb "Nazaj" vodi na /admin/children/abc123/games/kolo-srece
  → Napredek se shranjuje v progress.logopedist_child_id
```

## Ključna načela

1. **Uporabniški portal ostane nedotaknjen** - Vsi originalni routerji in igre delujejo kot prej
2. **Admin portal uporablja ločene routerje** - V mapi `admin/` za jasno ločitev
3. **Ponovna uporaba komponent** - Generic*Game komponente se ponovno uporabijo, le ovite so v AdminGameWrapper
4. **GameModeContext za navigacijo** - Igre vedo kam navigirati glede na kontekst

