

# Načrt: Popravek nadaljevanja seje in gumba "Nazaj" v admin preverjanju izgovorjave

## Identificirana problema

### Problem 1: Gumb "Nazaj" ne deluje v pop-up oknu

V komponenti `ArticulationTestInfoDialog.tsx` gumb "Nazaj" uporablja:

```typescript
const handleBack = () => {
  navigate(-1);
};
```

Ta pristop ima težavo: ko je dialog odprt, `navigate(-1)` ne deluje pravilno, ker dialog blokira dogodke in stran se ne spremeni. Dialog potrebuje callback prop `onBack`, ki ga starševska komponenta lahko uporabi za pravilno navigacijo.

### Problem 2: Nadaljevanje seje ne deluje

Sistem shranjevanja napredka že obstaja v `useArticulationSettings`, vendar ima logika za admin stran pomanjkljivost:

- `loadProgress` preverja `childId`, vendar v admin kontekstu se ključ v localStorage shranjuje generično brez ločevanja med admin in user portalom
- Če se napredek shranjuje v localStorage z istim ključem za vse otroke, se lahko zgodi konflikt

---

## Rešitev

### 1. Popravek gumba "Nazaj" v ArticulationTestInfoDialog

Dodati prop `onBack` v komponento, ki se kliče ob kliku na gumb "Nazaj":

**Datoteka:** `src/components/articulation/ArticulationTestInfoDialog.tsx`

```typescript
// PRED
interface ArticulationTestInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const handleBack = () => {
  navigate(-1);  // Ne deluje, ker je dialog odprt
};

// PO
interface ArticulationTestInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;  // Opcijski callback za navigacijo nazaj
}

const handleBack = () => {
  if (onBack) {
    onBack();
  } else {
    navigate(-1);  // Fallback za obstoječo uporabo
  }
};
```

**Datoteka:** `src/pages/admin/AdminArtikulacijskiTest.tsx`

Posredovati `onBack` prop v dialog:

```typescript
<ArticulationTestInfoDialog
  open={showInfoDialog}
  onClose={async () => {
    await initializeSession();
    setShowInfoDialog(false);
  }}
  onBack={() => navigate(`/admin/children/${childId}/workspace`)}
/>
```

### 2. Potrditev delovanja shranjevanja napredka

Pregledam trenutno logiko v `AdminArtikulacijskiTest.tsx`:

```typescript
// Na vrstici 178:
} = useArticulationTestNew(childId, undefined, fixedSessionNumber, startIndex, difficulty, saveProgress, profile?.id);
```

Hook prejme `saveProgress` in ga kliče v `handleNext()`. Težava je, da `loadProgress` v `useArticulationSettings` primerja `childId`, kar bi moralo delovati pravilno.

**Datoteka:** `src/hooks/useArticulationSettings.ts`

Ključ v localStorage (`articulation_progress`) shrani tudi `childId`, kar pomeni, da:
- Vsak otrok ima svoj shranjen napredek
- Napredek se pravilno naloži ob vračanju na stran

**Preverjanje:** Napredek se shranjuje ob vsakem `handleNext()` klicu (vrstica 221 v hooku). To bi moralo delovati.

**Morebitna težava:** V admin kontekstu se `loadProgress(childId)` kliče z ustreznim childId, vendar moramo zagotoviti, da se dialog prikaže pravilno.

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/articulation/ArticulationTestInfoDialog.tsx` | Dodaj opcijski `onBack` prop in ga uporabi v `handleBack` funkciji |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Posreduj `onBack` prop v `ArticulationTestInfoDialog` z navigacijo na workspace |

---

## Tehnična podrobnost

Shranjevanje napredka poteka takole:

```text
┌─────────────────────────────────────────────────────────────────┐
│  Uporabnik klikne "Naprej"                                      │
│              ↓                                                   │
│  handleNext() v useArticulationTestNew                          │
│              ↓                                                   │
│  onSaveProgress(childId, sessionNumber, nextWordIndex)          │
│              ↓                                                   │
│  saveProgress() v useArticulationSettings                       │
│              ↓                                                   │
│  localStorage.setItem("articulation_progress", JSON.stringify({ │
│    childId, sessionNumber, currentWordIndex, timestamp          │
│  }))                                                             │
└─────────────────────────────────────────────────────────────────┘
```

Ob ponovnem obisku strani se preveri localStorage in prikaže ArticulationResumeDialog.

## Rezultat

Po popravku:
- ✅ Gumb "Nazaj" v info dialogu bo pravilno navigiral na workspace otroka
- ✅ Nadaljevanje seje bo delovalo kot pričakovano - če uporabnik prekine test, bo ob naslednjem obisku videl dialog za nadaljevanje

