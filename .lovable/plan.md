
# Načrt: Popravek posredovanja podatkov vprašalnika

## Problem

Ko uporabnik zaključi vprašalnik in klikne "Shrani", se zgodi naslednje:

```typescript
onSubmit={(answers) => {
  setChildData(prev => ({
    ...prev,
    speechDevelopment: answers,  // 1. Posodobi state (asinhrono!)
  }));
  handleSaveChild();  // 2. Takoj kliči shrani (state še NI posodobljen!)
}}
```

React `setState` je **asinhrona operacija**. Ko se `handleSaveChild()` pokliče, `childData.speechDevelopment` še vedno vsebuje staro vrednost `{}`, zato se vprašalnik ne naloži.

Konzola potrjuje:
```
Questionnaire data received: undefined
Questionnaire keys: undefined
```

## Rešitev

Spremeniti `handleSaveChild`, da sprejme `answers` kot parameter, namesto da bere iz state:

```typescript
// Sprememba 1: handleSaveChild sprejme speechDevelopment kot parameter
const handleSaveChild = async (speechDevelopmentAnswers?: Record<string, string>) => {
  // ...
  
  // Uporabi parameter namesto childData.speechDevelopment
  const speechDevelopmentData = speechDevelopmentAnswers || childData.speechDevelopment;
  
  // Upload documents
  if (newChild?.id) {
    const { errors } = await uploadLogopedistChildDocuments(
      logopedistId,
      newChild.id,
      childData.name.trim(),
      childData.speechDifficultiesDescription,
      Object.keys(speechDevelopmentData).length > 0 ? speechDevelopmentData : undefined
    );
    // ...
  }
};

// Sprememba 2: Klic handleSaveChild z answers
onSubmit={(answers) => {
  setChildData(prev => ({
    ...prev,
    speechDevelopment: answers,
  }));
  handleSaveChild(answers);  // Posreduj answers direktno!
}}
```

## Datoteka za posodobiti

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/admin/children/AdminAddChildWizard.tsx` | Posodobi `handleSaveChild` da sprejme parameter in ga uporabi za upload |

## Rezultat

Pred:
- Opis govornih težav: naložen
- Osnovni vprašalnik: NI naložen

Po:
- Opis govornih težav: naložen
- Osnovni vprašalnik: naložen
