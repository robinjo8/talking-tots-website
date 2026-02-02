
# Načrt: Izboljšan postopek dodajanja otroka v admin portalu

## Povzetek problema

Trenutno logopedi v admin portalu dodajajo otroka preko preproste modalne forme, ki vsebuje le osnovne podatke (ime, starost, spol, oznake govornih težav). Ta postopek se bistveno razlikuje od celovitega postopka v uporabniškem portalu za TomiTalk Pro, ki vključuje:

1. **Osnovni podatki** - ime, spol, datum rojstva
2. **Izbira avatarja** - 15 različnih zmajčkov
3. **Govorne težave** - podrobna opredelitev s tekstovnim opisom in možnostjo nalaganja PDF
4. **Osnovni vprašalnik** - 7 vprašanj z izbiro + 2 tekstovni vprašanji
5. **Potrditev** - pregled vnesenih podatkov

## Rešitev

Zamenjati enostavni `AddChildModal` z večkoračnim čarovnikom, ki sledi enakemu postopku kot uporabniški portal.

---

## Koraki implementacije

### 1. Nova komponenta: AdminAddChildWizard

Večkoračni čarovnik z naslednjimi koraki:

| Korak | Vsebina | Komponente za uporabo |
|-------|---------|----------------------|
| 1 | Osnovni podatki (ime, spol, datum rojstva, zapiski, zunanji ID) | Nova forma |
| 2 | Izbira avatarja | `AvatarSelector` |
| 3 | Govorne težave | `SpeechDifficultiesStep` |
| 4 | Osnovni vprašalnik | `SpeechDevelopmentQuestions` |
| 5 | Potrditev | `ChildCompletedView` (prilagojen) |

### 2. Posodobitev CreateChildInput v hooku

Potrebno je razširiti vmesnik `CreateChildInput`:

```typescript
export interface CreateChildInput {
  name: string;
  age: number;
  gender?: 'male' | 'female';
  birth_date?: string;
  avatar_url?: string;                           // NOVO
  speech_difficulties?: string[];
  speech_difficulties_description?: string;
  speech_development?: Record<string, string>;   // NOVO
  notes?: string;
  external_id?: string;
}
```

### 3. Struktura nove komponente

```text
AdminAddChildWizard
├── Korak 1: AdminChildBasicInfoStep
│   ├── Ime otroka
│   ├── Datum rojstva (z izračunom starosti)
│   ├── Spol
│   ├── Zapiski (opcijsko)
│   └── Zunanji ID (opcijsko)
│
├── Korak 2: AvatarSelector (obstoječa komponenta)
│
├── Korak 3: SpeechDifficultiesStep (obstoječa komponenta)
│
├── Korak 4: SpeechDevelopmentQuestions (obstoječa komponenta)
│
└── Korak 5: AdminChildCompletedView
    ├── Pregled vseh vnesenih podatkov
    ├── Gumb "Dodaj drugega otroka"
    └── Gumb "Zaključi"
```

---

## Datoteke za ustvariti

| Datoteka | Opis |
|----------|------|
| `src/components/admin/children/AdminAddChildWizard.tsx` | Glavni čarovnik z vodenjem korakov |
| `src/components/admin/children/steps/AdminChildBasicInfoStep.tsx` | Korak 1: osnovni podatki |
| `src/components/admin/children/steps/AdminChildAvatarStep.tsx` | Korak 2: izbira avatarja |
| `src/components/admin/children/AdminChildCompletedView.tsx` | Korak 5: zaključek |

## Datoteke za posodobiti

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminChildren.tsx` | Zamenjaj `AddChildModal` z `AdminAddChildWizard` |
| `src/hooks/useLogopedistChildren.ts` | Razširi `CreateChildInput` z `avatar_url` in `speech_development` |
| `src/components/admin/children/AddChildModal.tsx` | Odstrani (zamenjano z čarovnikom) |

---

## Podrobnosti novih komponent

### AdminAddChildWizard.tsx

```typescript
enum WizardStep {
  BASIC_INFO = 0,
  AVATAR = 1,
  SPEECH_DIFFICULTIES = 2,
  SPEECH_DEVELOPMENT = 3,
  COMPLETED = 4
}

// State za shranjevanje podatkov med koraki
interface ChildData {
  name: string;
  birthDate: Date | null;
  gender: 'male' | 'female' | null;
  notes: string;
  externalId: string;
  avatarId: number;
  speechDifficulties: string[];
  speechDifficultiesDescription: string;
  speechDevelopment: Record<string, string>;
}
```

### AdminChildBasicInfoStep.tsx

Vsebuje:
- Input za ime otroka (obvezno)
- Koledar za datum rojstva (obvezno)
- Radio gumbi za spol
- Textarea za zapiske (opcijsko)
- Input za zunanji ID (opcijsko)

Preveri validnost pred nadaljevanjem (ime + datum rojstva).

### AdminChildAvatarStep.tsx

Uporabi obstoječo komponento `AvatarSelector` z variant="grid".

### Uporaba obstoječih komponent

- **SpeechDifficultiesStep** - uporabi neposredno s prilagojenimi propsi
- **SpeechDevelopmentQuestions** - uporabi neposredno s prilagojenimi propsi

### AdminChildCompletedView.tsx

Podobno kot `ChildCompletedView`, ampak prilagojeno za admin portal:
- Prikaz vseh vnesenih podatkov
- Gumb "Dodaj drugega otroka" za ponastavitev čarovnika
- Gumb "Zaključi" za zaprtje čarovnika

---

## Shranjevanje v bazo

Pri zadnjem koraku (po vprašalniku) se kliče mutacija `createChild` z vsemi zbranimi podatki:

```typescript
await createChild.mutateAsync({
  name: childData.name,
  age: calculateAge(childData.birthDate),
  gender: childData.gender,
  birth_date: childData.birthDate?.toISOString().split('T')[0],
  avatar_url: avatarOptions[childData.avatarId]?.src || null,
  speech_difficulties: childData.speechDifficulties,
  speech_difficulties_description: childData.speechDifficultiesDescription,
  speech_development: childData.speechDevelopment,
  notes: childData.notes,
  external_id: childData.externalId
});
```

---

## Vizualni tok

```text
[Dodaj otroka] → Modal se odpre
       ↓
┌─────────────────────────────────────┐
│  Korak 1/5: Osnovni podatki         │
│  ─────────────────────────────────  │
│  Ime otroka: [_______________]      │
│  Datum rojstva: [📅 Izberi]         │
│  Spol: ○ Deček  ○ Deklica           │
│  Zapiski: [_______________]         │
│  Zunanji ID: [_______________]      │
│                                     │
│         [Naprej]                    │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│  Korak 2/5: Izberi avatarja         │
│  ─────────────────────────────────  │
│  [🐲1] [🐲2] [🐲3]                  │
│  [🐲4] [🐲5] [🐲6]                  │
│  ...                                │
│                                     │
│  [Nazaj]              [Naprej]      │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│  Korak 3/5: Govorne težave          │
│  ─────────────────────────────────  │
│  (SpeechDifficultiesStep)           │
│                                     │
│  [Nazaj]              [Naprej]      │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│  Korak 4/5: Osnovni vprašalnik      │
│  ─────────────────────────────────  │
│  (SpeechDevelopmentQuestions)       │
│                                     │
│  [Nazaj]              [Naprej]      │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│  ✓ Profil uspešno ustvarjen!        │
│  ─────────────────────────────────  │
│  Ime: Žan Novak                     │
│  Starost: 5 let                     │
│  Govorne težave: R, L, S            │
│  ...                                │
│                                     │
│  [Dodaj drugega]      [Zaključi]    │
└─────────────────────────────────────┘
```

---

## Ključne točke

1. **Ponovna uporaba komponent** - `AvatarSelector`, `SpeechDifficultiesStep`, `SpeechDevelopmentQuestions` so obstoječe komponente
2. **Enoten tok** - logoped in starš imata enako izkušnjo pri dodajanju otroka
3. **Celoviti podatki** - zbrani so vsi potrebni podatki za strokovno delo
4. **Ohranjena združljivost** - obstoječa baza `logopedist_children` že podpira vsa potrebna polja
5. **Brez izgube funkcionalnosti** - zapiski in zunanji ID ostanejo na voljo
