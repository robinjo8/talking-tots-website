
# Načrt: Implementacija shranjevanja napredka za uporabniški portal

## Trenutno stanje

### Admin portal (`/admin/children/:id/test`)
- Uporablja `useLogopedistSessionManager` hook
- Shranjuje napredek v **bazo podatkov** (tabela `articulation_test_sessions`)
- Uporablja stolpec `logopedist_child_id` za ločevanje
- Deluje na različnih napravah

### Uporabniški portal (`/artikulacijski-test`)
- Uporablja `useArticulationSettings` hook
- Shranjuje napredek v **localStorage**
- Deluje samo na isti napravi
- Napredek se izgubi ob zamenjavi naprave

## Cilj
Uporabniški portal mora uporabljati isto logiko shranjevanja v bazo kot admin portal, ampak s **strogo ločenimi podatki**:
- Admin portal: `logopedist_child_id`
- Uporabniški portal: `child_id`

---

## Rešitev

### 1. Odstrani gumb "Začni znova" iz dialoga

V `ArticulationResumeDialog.tsx`:
- Odstrani gumb "Začni znova" in pripadajočo ikono
- Dialog bo imel samo gumb "Nadaljuj"
- X gumb zapre dialog in vrne uporabnika nazaj

### 2. Ustvari nov hook `useUserSessionManager`

Nov hook za uporabniški portal, ki:
- Uporablja `child_id` namesto `logopedist_child_id`
- Uporablja `source_type: 'parent'` namesto `'logopedist'`
- Uporablja `AuthContext` namesto `AdminAuthContext`
- Ima identično logiko kot `useLogopedistSessionManager`

```typescript
// src/hooks/useUserSessionManager.ts
interface SessionInfo {
  sessionId: string;
  sessionNumber: number;
  startIndex: number;        // Naslednja beseda za izgovorjavo
  lastSpokenIndex: number;   // Zadnja izgovorjena (za dialog)
  isResume: boolean;
  totalWords: number;
}
```

### 3. Posodobi `ArtikuacijskiTest.tsx`

Spremembe:
- Zamenjaj `useArticulationSettings.saveProgress` z `useUserSessionManager.updateProgress`
- Zamenjaj `loadProgress` z `initializeSession` (preveri za nedokončano sejo v bazi)
- Dodaj `effectiveStartIndex` state za pravilno nadaljevanje
- Posodobi dialog logiko za `lastSpokenIndex`

---

## Diagram toka podatkov

```text
UPORABNIŠKI PORTAL                    ADMIN PORTAL
/artikulacijski-test                  /admin/children/:id/test
         │                                     │
         ▼                                     ▼
useUserSessionManager               useLogopedistSessionManager
         │                                     │
         ▼                                     ▼
┌────────────────────────────────────────────────────────────┐
│              articulation_test_sessions                    │
├────────────────────────────────────────────────────────────┤
│ child_id = 'abc-123'      │  logopedist_child_id = 'xyz'  │
│ source_type = 'parent'    │  source_type = 'logopedist'   │
│ current_word_index = 57   │  current_word_index = 23      │
│ is_completed = false      │  is_completed = false         │
└────────────────────────────────────────────────────────────┘
         STROGO LOČENO!
```

---

## Podrobne spremembe

### Datoteka 1: `ArticulationResumeDialog.tsx`
- Odstrani gumb "Začni znova" in RotateCcw ikono
- Posodobi prop interface (odstrani `onStartOver`)
- Gumb "Nadaljuj" ostane enak

### Datoteka 2: `useUserSessionManager.ts` (nova datoteka)
Kopija logike iz `useLogopedistSessionManager.ts` s spremembami:
- Uporabi `useAuth` namesto `useAdminAuth`
- Poizvedi po `child_id` namesto `logopedist_child_id`
- Nastavi `source_type: 'parent'`
- Pri ustvarjanju seje ne nastavi `organization_id`

### Datoteka 3: `ArtikuacijskiTest.tsx`
- Uvozi `useUserSessionManager`
- Dodaj `checkExistingSession` logiko ob nalaganju strani
- Dodaj `effectiveStartIndex` state za dinamično posodobitev
- Posodobi `handleResume` - ne potrebuje navigacije z URL parametri
- Odstrani `onStartOver` prop iz dialoga (X zapre in vrne nazaj)

### Datoteka 4: `useArticulationTestNew.ts`
Brez sprememb - hook že pravilno prejema `onSaveProgress` callback in `startIndex` prop.

---

## Sprememba pomena

| Prej (localStorage) | Potem (baza) |
|---------------------|--------------|
| `saveProgress(childId, sessionNumber, wordIndex)` | `updateProgress(wordIndex)` |
| `loadProgress(childId)` | `initializeSession(childId)` |
| `clearProgress()` | `completeSession()` |

---

## Povzetek datotek

| Datoteka | Akcija |
|----------|--------|
| `ArticulationResumeDialog.tsx` | Odstrani gumb "Začni znova" |
| `useUserSessionManager.ts` | Nova datoteka - hook za uporabniški portal |
| `ArtikuacijskiTest.tsx` | Uporabi nov hook, posodobi logiko nadaljevanja |

---

## Ključne prednosti

1. **Podpora za več naprav** - uporabnik lahko nadaljuje test na drugi napravi
2. **Strogo ločeni podatki** - otroci staršev in logopedov se nikoli ne mešajo
3. **Identična uporabniška izkušnja** - deluje enako kot admin portal
4. **Enostavnejši dialog** - samo en gumb "Nadaljuj"
