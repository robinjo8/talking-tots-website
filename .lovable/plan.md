

# Implementacijski načrt: Vgraditev iger v admin portal za logopede

## Povzetek problema

Ko logoped iz delovnega prostora otroka klikne na "Govorne igre", se odpre uporabniški portal, ki pričakuje otroka iz tabele `children` (preko `AuthContext.selectedChild`). Logopedovi otroci so v tabeli `logopedist_children` in niso dostopni preko tega konteksta.

## Rešitev

Ustvariti **GameModeContext** ki bo zagotovil informacije o načinu delovanja (user/logopedist) in ID otroka. Komponente iger bodo preverjale ta kontekst in shranjevale napredek v ustrezno polje (`child_id` ali `logopedist_child_id`).

---

## Tehnična implementacija

### 1. Nov kontekst: `GameModeContext.tsx`

```typescript
// src/contexts/GameModeContext.tsx
interface GameModeContextType {
  mode: 'user' | 'logopedist';
  childId: string | null;           // Za uporabniški način (parent's child)
  logopedistChildId: string | null; // Za logopedistov način
  childName: string | null;
  basePath: string;                  // '/govorne-igre' ali '/admin/children/:id/games'
}
```

Ta kontekst bo omogočil:
- Igram, da vedo ali shranjujejo v `child_id` ali `logopedist_child_id`
- Navigacijskim gumbom, da vedo kam se vrnejo (uporabniški ali admin portal)

### 2. Posodobitev `useEnhancedProgress.ts`

Razširitev hooka za podporo logopedistovim otrokom:

```typescript
// Dodaj parameter za logopedist način
const recordGameCompletion = (
  gameType: string, 
  subtype: string = 'general',
  logopedistChildId?: string  // Nov opcijski parameter
) => {
  // Če je podan logopedistChildId, uporabi to namesto child_id
  const progressEntry = {
    child_id: logopedistChildId ? null : selectedChild?.id,
    logopedist_child_id: logopedistChildId || null,
    // ... ostalo
  };
};
```

### 3. Nove admin strani za igre

| Datoteka | Namen |
|----------|-------|
| `src/pages/admin/AdminGovorneIgre.tsx` | Seznam iger (brez Header/Footer) |
| `src/pages/admin/games/AdminSpominGames.tsx` | Izbira črk za Spomin |
| `src/pages/admin/games/AdminKoloSreceGames.tsx` | Izbira črk za Kolo besed |
| `src/pages/admin/games/AdminBingoGames.tsx` | Izbira črk za Bingo |
| `src/pages/admin/games/AdminLabirintGames.tsx` | Izbira črk za Labirint |
| ... (ostale igre) |

### 4. Admin routerji za igre

| Datoteka | Namen |
|----------|-------|
| `src/components/routing/AdminSpominRouter.tsx` | Router za Spomin igro |
| `src/components/routing/AdminKoloSreceRouter.tsx` | Router za Kolo besed |
| ... (ostali routerji) |

### 5. Wrapper komponenta: `AdminGameWrapper.tsx`

```typescript
// src/components/admin/games/AdminGameWrapper.tsx
// Wrapper ki nastavi GameModeContext in prikaže info o otroku

interface Props {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function AdminGameWrapper({ children, showBackButton = true }: Props) {
  const { childId } = useParams();
  const { data: child } = useLogopedistChild(childId);
  
  return (
    <GameModeProvider mode="logopedist" logopedistChildId={childId}>
      <div className="space-y-4">
        {showBackButton && (
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft /> Nazaj
            </Button>
            <ChildSwitcherCompact child={child} />
          </div>
        )}
        {children}
      </div>
    </GameModeProvider>
  );
}
```

### 6. Posodobitev `AdminRoutes.tsx`

```typescript
// Dodaj nove poti za igre
<Route path="children/:childId/games" element={<AdminLayoutWrapper><AdminGovorneIgre /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/spomin" element={<AdminLayoutWrapper><AdminSpominGames /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/spomin/:gameId" element={<AdminLayoutWrapper><AdminSpominRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/kolo-srece" element={<AdminLayoutWrapper><AdminKoloSreceGames /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/kolo-srece/:letter" element={<AdminLayoutWrapper><AdminKoloSreceRouter /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/bingo" element={<AdminLayoutWrapper><AdminBingoGames /></AdminLayoutWrapper>} />
<Route path="children/:childId/games/bingo/:letter" element={<AdminLayoutWrapper><AdminBingoRouter /></AdminLayoutWrapper>} />
// ... vse ostale igre
```

### 7. Posodobitev `AdminChildWorkspace.tsx`

Sprememba navigacije iz `window.open()` v interno navigacijo:

```typescript
const handleActivityClick = (activity: typeof activities[0]) => {
  // Mapiranje aktivnosti na admin poti
  const activityPathMap: Record<string, string> = {
    'games': `/admin/children/${childId}/games`,
    'exercises': `/admin/children/${childId}/exercises`,
    'test': `/admin/children/${childId}/test`,
    // ... ostale aktivnosti
  };
  
  const targetPath = activityPathMap[activity.id];
  if (targetPath) {
    navigate(targetPath);
  }
};
```

### 8. Posodobitev hook-ov za igre

Vsak hook za igro (npr. `useGenericMemoryGame.tsx`) mora biti posodobljen:

```typescript
export const useGenericMemoryGame = (config: SpominConfig) => {
  const gameMode = useGameModeContext();
  const { recordGameCompletion } = useEnhancedProgress();
  
  const handleClaimStar = async () => {
    if (gameMode.mode === 'logopedist' && gameMode.logopedistChildId) {
      // Shrani za logopedistovega otroka
      recordGameCompletion('memory', config.displayLetter, gameMode.logopedistChildId);
    } else {
      // Standardno shranjevanje za uporabnika
      recordGameCompletion('memory', config.displayLetter);
    }
  };
};
```

### 9. Posodobitev igre komponente (primer `GenericSpominGame.tsx`)

Sprememba navigacije nazaj:

```typescript
const handleConfirmExit = () => {
  const gameMode = useGameModeContext();
  setShowExitConfirmation(false);
  
  if (gameMode.mode === 'logopedist') {
    navigate(`/admin/children/${gameMode.logopedistChildId}/games/spomin`);
  } else {
    navigate("/govorne-igre/spomin");
  }
};
```

---

## Seznam vseh novih datotek

| Datoteka | Opis |
|----------|------|
| `src/contexts/GameModeContext.tsx` | Kontekst za način delovanja iger |
| `src/components/admin/games/AdminGameWrapper.tsx` | Wrapper za admin igre |
| `src/pages/admin/AdminGovorneIgre.tsx` | Seznam iger za admin |
| `src/pages/admin/games/AdminSpominGames.tsx` | Izbira črk za Spomin |
| `src/pages/admin/games/AdminKoloSreceGames.tsx` | Izbira črk za Kolo besed |
| `src/pages/admin/games/AdminBingoGames.tsx` | Izbira črk za Bingo |
| `src/pages/admin/games/AdminLabirintGames.tsx` | Izbira za Labirint |
| `src/pages/admin/games/AdminZaporedjaGames.tsx` | Izbira za Zaporedja |
| `src/pages/admin/games/AdminSestavljankeGames.tsx` | Izbira za Sestavljanke |
| `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx` | Izbira za Drsno sestavljanko |
| `src/pages/admin/games/AdminMetKockeGames.tsx` | Izbira za Met kocke |
| `src/pages/admin/games/AdminPonoviPovedGames.tsx` | Izbira za Ponovi poved |
| `src/pages/admin/games/AdminIgraUjemanjaGames.tsx` | Izbira za Igro ujemanja |
| `src/components/routing/admin/AdminSpominRouter.tsx` | Router za Spomin |
| `src/components/routing/admin/AdminKoloSreceRouter.tsx` | Router za Kolo besed |
| `src/components/routing/admin/AdminBingoRouter.tsx` | Router za Bingo |
| `src/components/routing/admin/AdminLabirintRouter.tsx` | Router za Labirint |
| ... (ostali routerji) |

## Seznam datotek za posodobitev

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useEnhancedProgress.ts` | Dodaj podporo za `logopedist_child_id` |
| `src/hooks/useGenericMemoryGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericSpominGame.tsx` | Uporabi `GameModeContext` za navigacijo |
| `src/components/games/GenericBingoGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericWheelGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericLabirintGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericMetKockeGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericZaporedjaGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericSestavljankaGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/PonoviPovedGame.tsx` | Uporabi `GameModeContext` |
| `src/components/games/TongueGymGame.tsx` | Uporabi `GameModeContext` |
| `src/pages/admin/AdminChildWorkspace.tsx` | Spremeni navigacijo |
| `src/components/routing/AdminRoutes.tsx` | Dodaj nove poti |

---

## Koraki implementacije

1. **Ustvari `GameModeContext.tsx`** - kontekst za način delovanja
2. **Posodobi `useEnhancedProgress.ts`** - dodaj podporo za `logopedist_child_id`
3. **Ustvari `AdminGameWrapper.tsx`** - wrapper za admin igre
4. **Ustvari `AdminGovorneIgre.tsx`** - seznam iger za admin
5. **Ustvari admin izbirne strani** - za vsako igro posebej
6. **Ustvari admin routerje** - za vsako igro posebej
7. **Posodobi `AdminRoutes.tsx`** - dodaj vse nove poti
8. **Posodobi `AdminChildWorkspace.tsx`** - spremeni navigacijo
9. **Posodobi vse Generic*Game komponente** - uporabi GameModeContext
10. **Posodobi vse hook-e za igre** - uporabi GameModeContext za shranjevanje

---

## Vizualni rezultat

Po implementaciji bo logoped ostal v admin portalu:

```text
/admin/children/abc123/workspace
  → klik na "Govorne igre"
/admin/children/abc123/games
  → klik na "Spomin"
/admin/children/abc123/games/spomin
  → klik na "Črka Š"
/admin/children/abc123/games/spomin/spomin-sh
  → igra se izvaja
  → ob zaključku se napredek shrani v progress.logopedist_child_id
  → klik nazaj vodi na /admin/children/abc123/games/spomin
```

## Prednosti

1. **Popolna ločitev** - Logoped ostane v admin portalu
2. **Ponovna uporaba** - Dejanske igre (Generic*Game) ostanejo iste
3. **Pravilno sledenje** - Napredek se shranjuje pod `logopedist_child_id`
4. **Konsistentna navigacija** - Vsi gumbi "nazaj" vodijo na prave strani
5. **Enostavno preklapljanje** - Logoped lahko hitro zamenja otroka

