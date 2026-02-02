
# Načrt: Prikaz avatarja, prevod govornih težav in izboljšano urejanje otroka

## Povzetek problema

Na strani `/admin/children` so trije problemi:

1. **Avatar se ne prikazuje** - Namesto shranjene slike avatarja (`child.avatar_url`) se prikaže privzeti emoji
2. **Govorne težave so v angleščini** - Prikazuje se `articulation` namesto slovenskega prevoda "Motnja izreke / artikulacije"
3. **Urejanje ni enako kot na uporabniški strani** - Admin modal je preprost, uporabniška stran pa ima polno formo z avatarjem, datumom rojstva in spol selektorjem

---

## 1. Prikaz avatarja na kartici otroka

### Trenutno stanje (vrstice 151-158):
```typescript
<div className={cn(
  "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
  child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
)}>
  <span className="text-xl">
    {child.gender === 'male' ? '🧒' : '👧'}
  </span>
</div>
```

### Rešitev:
Preveriti, če ima otrok `avatar_url` - če ga ima, prikazati sliko avatarja, sicer prikazati privzeti emoji.

```typescript
<div className={cn(
  "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
  child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
)}>
  {child.avatar_url ? (
    <img 
      src={child.avatar_url} 
      alt={child.name} 
      className="h-full w-full object-contain"
    />
  ) : (
    <span className="text-xl">
      {child.gender === 'male' ? '🧒' : '👧'}
    </span>
  )}
</div>
```

---

## 2. Prevod govornih težav v slovenščino

### Trenutno stanje (vrstica 167):
```typescript
<span>Težave: {child.speech_difficulties.join(', ')}</span>
```
Prikazuje: `Težave: articulation, stuttering`

### Rešitev:
Uporabiti model `SPEECH_DIFFICULTIES` za prevod ID-jev v slovenske naslove.

```typescript
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";

// Helper funkcija za prevod
const getSpeechDifficultyLabel = (difficultyId: string): string => {
  const difficulty = SPEECH_DIFFICULTIES.find(d => d.id === difficultyId);
  if (difficulty) {
    // Vzemi samo prvo besedo naslova za krajši prikaz
    return difficulty.title.split('–')[0].trim();
  }
  return difficultyId; // Fallback na ID če ni najden
};

// Uporaba
<span>Govorne težave: {child.speech_difficulties.map(getSpeechDifficultyLabel).join(', ')}</span>
```

Prikazuje: `Govorne težave: Motnja izreke / artikulacije, Motnja ritma in tempa govora`

---

## 3. Izboljšano urejanje otroka (enako kot uporabniška stran)

### Trenutno stanje:
Admin `EditChildModal` ima le:
- Ime
- Starost (število)
- Spol (radio gumbi)
- Govorne težave (checkboxi za črke: Š, Ž, Č...)
- Zapiski
- Zunanji ID

### Uporabniška stran ima:
- Ime
- Datum rojstva (s koledarjem)
- Spol (z `GenderSelector`)
- Izbira avatarja (z `AvatarSelector`)

### Rešitev:
Posodobiti `EditChildModal` da uporablja enake komponente kot uporabniška stran:

| Polje | Trenutno | Po spremembi |
|-------|----------|--------------|
| Ime | Input | Input (brez spremembe) |
| Datum rojstva | ❌ | Koledar s `Calendar` komponento |
| Starost | Input (število) | Samodejno izračunano iz datuma rojstva |
| Spol | RadioGroup | `GenderSelector` komponenta |
| Avatar | ❌ | `AvatarSelector` z variant="dropdown" |
| Govorne težave | Checkboxi za črke | Brez spremembe |
| Zapiski | Textarea | Brez spremembe |
| Zunanji ID | Input | Brez spremembe |

---

## Datoteke za posodobiti

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminChildren.tsx` | 1) Prikaz avatarja namesto emojija, 2) Prevod govornih težav v SLO |
| `src/components/admin/children/EditChildModal.tsx` | Dodaj AvatarSelector, GenderSelector, datum rojstva |
| `src/hooks/useLogopedistChildren.ts` | Posodobi `UpdateChildInput` da podpira `avatar_url` in `birth_date` |

---

## Tehnične podrobnosti

### AdminChildren.tsx
- Dodaj import za `SPEECH_DIFFICULTIES`
- Dodaj helper funkcijo `getSpeechDifficultyLabel`
- Spremeni prikaz avatarja na kartici (pogojni prikaz slike ali emojija)
- Spremeni prikaz govornih težav (uporabi prevod)

### EditChildModal.tsx
- Dodaj importe: `AvatarSelector`, `GenderSelector`, `Calendar`, `Popover`
- Dodaj state za `birthDate` in `avatarId`
- Zamenjaj RadioGroup za spol z `GenderSelector`
- Dodaj `AvatarSelector` z variant="dropdown"
- Dodaj koledar za datum rojstva
- Odstrani input za starost (se izračuna iz datuma rojstva)
- Posodobi `handleSubmit` za shranjevanje novih polj

### useLogopedistChildren.ts (UpdateChildInput)
Preveri, da vmesnik že podpira:
- `avatar_url`
- `birth_date`

---

## Vizualni rezultat

### Kartica otroka (po spremembi):
```text
┌─────────────────────────────────────────────────────────────────────┐
│  [🐲 Avatar]  Žan Novak                              [Napredek] [▶] │
│               Starost: 5 let • Govorne težave: Motnja izreke       │
│               ID: PAC-2024-042                        [✏️] [🗑️]    │
└─────────────────────────────────────────────────────────────────────┘
```

### Modal za urejanje (po spremembi):
```text
┌─────────────────────────────────────────────────────────────────────┐
│  Uredi otroka                                                       │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Ime otroka *                                                       │
│  [Žan Novak                                      ]                  │
│                                                                     │
│  Datum rojstva *                                                    │
│  [📅 15.03.2019                                  ]                  │
│                                                                     │
│  Spol                                                               │
│  [🧑 Deček] [👧 Deklica]                                            │
│                                                                     │
│  Izberi avatarja                                                    │
│  [🐲 Izbrani avatar                              ▼]                 │
│                                                                     │
│  Govorni izzivi (opcijsko)                                          │
│  [Š] [Ž] [Č] [C] [S] [Z] [R] [L] ...                               │
│                                                                     │
│  Zapiski (opcijsko)                                                 │
│  [                                               ]                  │
│                                                                     │
│  Zunanji ID (opcijsko)                                              │
│  [PAC-2024-042                                   ]                  │
│                                                                     │
│                            [Prekliči]  [Shrani spremembe]           │
└─────────────────────────────────────────────────────────────────────┘
```
