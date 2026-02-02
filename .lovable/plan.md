

# Načrt: Dodajanje Govornih vaj, Preverjanja izgovorjave, Video navodil in Osebnega načrta v Admin portal

## Povzetek

Trenutno ko logoped v delovnem prostoru otroka klikne na "Govorne vaje", "Preverjanje izgovorjave", "Video navodila" ali "Moj osebni načrt", se odpre nov zavihek v uporabniškem portalu. To je treba spremeniti tako, da logoped ostane znotraj admin portala - enako kot smo naredili za "Govorne igre".

Poleg tega bomo odstranili "Logopedski nasveti" iz admin portala, ker ta vsebina ni relevantna za logopedov delovni tok z otrokom.

---

## 1. Posodobitev AdminChildWorkspace.tsx

Odstraniti "Logopedski nasveti" in dodati interne poti za vse aktivnosti:

```typescript
// Odstrani 'advice' aktivnost iz seznama
const activities = [
  // ... ostane games, exercises, test, video, challenges
  // BREZ 'advice' (Logopedski nasveti)
];

// Posodobi handleActivityClick za interne poti
const activityPathMap: Record<string, string> = {
  'games': `/admin/children/${childId}/games`,
  'exercises': `/admin/children/${childId}/exercises`,
  'test': `/admin/children/${childId}/test`,
  'video': `/admin/children/${childId}/video-navodila`,
  'challenges': `/admin/children/${childId}/osebni-nacrt`,
};
```

---

## 2. Nove admin strani

### 2.1 Govorne vaje

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminGovorneVaje.tsx` | Glavna stran za govorne vaje (enako kot `GovornojezicovneVaje.tsx`, brez Header/Footer) |
| `src/pages/admin/exercises/AdminVajeMotorikeGovoril.tsx` | Vaje motorike govoril za admin |
| `src/pages/admin/exercises/AdminArtikulacijaVaje.tsx` | Vaje za izgovorjavo glasov za admin |

### 2.2 Video navodila

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminVideoNavodila.tsx` | Seznam črk za video navodila |

### 2.3 Preverjanje izgovorjave

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Celozaslonski test izgovorjave za admin |

### 2.4 Osebni načrt

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminOsebniNacrt.tsx` | Osebni načrt za admin |

---

## 3. Novi admin routerji

| Datoteka | Opis |
|----------|------|
| `src/components/routing/admin/AdminVideoNavodilaRouter.tsx` | Router za video navodila (črka) |

---

## 4. Posodobitve AdminRoutes.tsx

Dodati nove poti:

```typescript
// Lazy load nove strani
const AdminGovorneVaje = lazy(() => import('@/pages/admin/AdminGovorneVaje'));
const AdminVajeMotorikeGovoril = lazy(() => import('@/pages/admin/exercises/AdminVajeMotorikeGovoril'));
const AdminArtikulacijaVaje = lazy(() => import('@/pages/admin/exercises/AdminArtikulacijaVaje'));
const AdminVideoNavodila = lazy(() => import('@/pages/admin/AdminVideoNavodila'));
const AdminVideoNavodilaRouter = lazy(() => import('@/components/routing/admin/AdminVideoNavodilaRouter'));
const AdminArtikulacijskiTest = lazy(() => import('@/pages/admin/AdminArtikulacijskiTest'));
const AdminOsebniNacrt = lazy(() => import('@/pages/admin/AdminOsebniNacrt'));

// Nove poti:
// Govorne vaje
<Route path="children/:childId/exercises" element={<AdminLayoutWrapper><AdminGovorneVaje /></AdminLayoutWrapper>} />
<Route path="children/:childId/exercises/vaje-motorike-govoril" element={<AdminGameFullscreenRoute><AdminVajeMotorikeGovoril /></AdminGameFullscreenRoute>} />
<Route path="children/:childId/exercises/artikulacija" element={<AdminLayoutWrapper><AdminArtikulacijaVaje /></AdminLayoutWrapper>} />

// Video navodila
<Route path="children/:childId/video-navodila" element={<AdminLayoutWrapper><AdminVideoNavodila /></AdminLayoutWrapper>} />
<Route path="children/:childId/video-navodila/:letter" element={<AdminLayoutWrapper><AdminVideoNavodilaRouter /></AdminLayoutWrapper>} />

// Preverjanje izgovorjave
<Route path="children/:childId/test" element={<AdminGameFullscreenRoute><AdminArtikulacijskiTest /></AdminGameFullscreenRoute>} />

// Osebni načrt
<Route path="children/:childId/osebni-nacrt" element={<AdminLayoutWrapper><AdminOsebniNacrt /></AdminLayoutWrapper>} />
```

---

## 5. Podrobnosti novih komponent

### 5.1 AdminGovorneVaje.tsx (Govorne vaje - izbira)

Podobno kot `GovornojezicovneVaje.tsx`, ampak:
- Brez `Header` in `FooterSection`
- Ovito v `AdminGameWrapper`
- Navigacija na interne admin poti

```typescript
// Primer strukture
export default function AdminGovorneVaje() {
  const navigate = useNavigate();
  const { childId } = useParams();

  const exerciseTypes = [
    {
      id: "vaje-motorike-govoril",
      title: "VAJE MOTORIKE GOVORIL",
      path: `/admin/children/${childId}/exercises/vaje-motorike-govoril`,
      available: true
    },
    {
      id: "motnja-izreke",
      title: "VAJE ZA IZGOVORJAVO GLASOV",
      path: `/admin/children/${childId}/exercises/artikulacija`,
      available: true
    },
    // ... ostale neaktivne vaje
  ];

  return (
    <AdminGameWrapper 
      title="Govorne vaje"
      backPath={`/admin/children/${childId}/workspace`}
    >
      {/* Grid kartic kot v originalu */}
    </AdminGameWrapper>
  );
}
```

### 5.2 AdminVajeMotorikeGovoril.tsx (Vaje motorike govoril)

Podobno kot `VajeMotorikeGovoril.tsx`, ampak:
- Uporablja `GameModeContext` za pravilno shranjevanje napredka
- Gumb "Nazaj" vodi na admin pot

```typescript
export default function AdminVajeMotorikeGovoril() {
  const { childId } = useParams();
  const navigate = useNavigate();
  
  const handleConfirmExit = () => {
    navigate(`/admin/children/${childId}/exercises`);
  };
  
  return (
    <GameModeProvider mode="logopedist" logopedistChildId={childId}>
      {/* Enaka vsebina kot original, samo z admin navigacijo */}
    </GameModeProvider>
  );
}
```

### 5.3 AdminVideoNavodila.tsx (Video navodila - izbira črk)

Podobno kot `VideoNavodila.tsx`, ampak:
- Brez `Header`
- Ovito v `AdminGameWrapper`
- Navigacija na admin poti

### 5.4 AdminVideoNavodilaRouter.tsx (Router za posamezni video)

```typescript
export default function AdminVideoNavodilaRouter() {
  const { childId, letter } = useParams();
  const config = getVideoNavodilaConfig(letter);
  
  if (!config) {
    return <Navigate to={`/admin/children/${childId}/video-navodila`} replace />;
  }

  return (
    <AdminGameWrapper 
      title={`Video navodila - ${config.displayLetter}`}
      backPath={`/admin/children/${childId}/video-navodila`}
    >
      {/* Video player vsebina */}
    </AdminGameWrapper>
  );
}
```

### 5.5 AdminArtikulacijskiTest.tsx (Preverjanje izgovorjave)

Podobno kot `ArtikuacijskiTest.tsx`, ampak:
- Celozaslonski prikaz (brez admin layouta)
- Uporablja `logopedist_child_id` za shranjevanje rezultatov
- Gumb "Nazaj" vodi na admin workspace

### 5.6 AdminOsebniNacrt.tsx (Osebni načrt)

Enostavna stran z informacijo, da je osebni načrt na voljo:
- Ovita v `AdminGameWrapper`
- Prikaz izzivov za otroka (če so na voljo)

---

## 6. Posodobitve obstoječih hookov

### 6.1 useExerciseProgress.ts

Dodati podporo za `logopedist_child_id`:

```typescript
export const useExerciseProgress = (logopedistChildId?: string) => {
  const { recordExerciseCompletion } = useEnhancedProgress();
  const { logopedistChildId: contextChildId } = useGameMode();
  
  const effectiveLogopedistChildId = logopedistChildId || contextChildId;
  
  // V completeCard() uporabi effectiveLogopedistChildId
  recordExerciseCompletion('vaje_motorike_govoril', 3, effectiveLogopedistChildId);
};
```

### 6.2 useArticulationTestNew.ts

Dodati podporo za `logopedist_child_id`:

```typescript
export const useArticulationTestNew = (
  childId?: string, 
  userId?: string, 
  fixedSessionNumber?: number, 
  startIndex: number = 0,
  difficulty: string = "srednja",
  onSaveProgress?: Function,
  logopedistChildId?: string  // NOV parameter
) => {
  // Pri shranjevanju posnetkov uporabi logopedistChildId
};
```

---

## 7. Koraki implementacije

1. **Posodobi `AdminChildWorkspace.tsx`** - odstrani "Logopedski nasveti", dodaj interne poti
2. **Ustvari `AdminGovorneVaje.tsx`** - glavna stran za govorne vaje
3. **Ustvari `AdminVajeMotorikeGovoril.tsx`** - celozaslonske vaje motorike govoril
4. **Ustvari `AdminArtikulacijaVaje.tsx`** - vaje za izgovorjavo
5. **Ustvari `AdminVideoNavodila.tsx`** - izbira črk za video
6. **Ustvari `AdminVideoNavodilaRouter.tsx`** - router za posamezni video
7. **Ustvari `AdminArtikulacijskiTest.tsx`** - celozaslonski test izgovorjave
8. **Ustvari `AdminOsebniNacrt.tsx`** - osebni načrt
9. **Posodobi `AdminRoutes.tsx`** - dodaj vse nove poti
10. **Posodobi `useExerciseProgress.ts`** - podpora za logopedist_child_id
11. **Posodobi `useArticulationTestNew.ts`** - podpora za logopedist_child_id

---

## 8. Vizualni rezultat

Po implementaciji bo logoped ostal v admin portalu:

```text
/admin/children/:id/workspace
  → klik na "Govorne vaje"
/admin/children/:id/exercises
  → klik na "Vaje motorike govoril"
/admin/children/:id/exercises/vaje-motorike-govoril
  → Celozaslonske vaje (kot v uporabniškem portalu)
  → Gumb "Nazaj" vodi na /admin/children/:id/exercises

/admin/children/:id/workspace
  → klik na "Preverjanje izgovorjave"
/admin/children/:id/test
  → Celozaslonski test (kot v uporabniškem portalu)
  → Napredek se shranjuje pod logopedist_child_id
  → Gumb "Nazaj" vodi na /admin/children/:id/workspace

/admin/children/:id/workspace
  → klik na "Video navodila"
/admin/children/:id/video-navodila
  → Seznam črk za video
  → klik na "Črka C"
/admin/children/:id/video-navodila/c
  → Video predvajalnik

/admin/children/:id/workspace
  → klik na "Moj osebni načrt"
/admin/children/:id/osebni-nacrt
  → Osebni načrt otroka
```

---

## 9. Seznam novih datotek

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminGovorneVaje.tsx` | Izbira govornih vaj |
| `src/pages/admin/exercises/AdminVajeMotorikeGovoril.tsx` | Celozaslonske vaje motorike |
| `src/pages/admin/exercises/AdminArtikulacijaVaje.tsx` | Vaje za izgovorjavo |
| `src/pages/admin/AdminVideoNavodila.tsx` | Izbira črk za video |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Celozaslonski test izgovorjave |
| `src/pages/admin/AdminOsebniNacrt.tsx` | Osebni načrt |
| `src/components/routing/admin/AdminVideoNavodilaRouter.tsx` | Router za video |

## 10. Seznam datotek za posodobitev

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminChildWorkspace.tsx` | Odstrani "Logopedski nasveti", dodaj interne poti |
| `src/components/routing/AdminRoutes.tsx` | Dodaj nove poti |
| `src/hooks/useExerciseProgress.ts` | Podpora za logopedist_child_id |
| `src/hooks/useArticulationTestNew.ts` | Podpora za logopedist_child_id |

---

## 11. Ključna načela

1. **Uporabniški portal ostane nedotaknjen** - nobena sprememba ne vpliva na obstoječe strani
2. **Admin portal uporablja ločene komponente** - jasna ločitev
3. **Ponovna uporaba logike** - isti hooki in komponente, le z admin kontekstom
4. **GameModeContext za navigacijo in shranjevanje** - pravilno sledenje napredku

