

# Plan: Posodobitev dizajna ocenjevalnega dela

## Povzetek sprememb

Posodobiti postavitev ocenjevalnega dela na strani za pregled preverjanja izgovorjave tako, da bodo:
- Checkboxi za specifične napake na **levi strani**
- 5-stopenjska lestvica na **desni strani**
- Komentar **pod obema** sekcijama
- Naslov preimenovan iz "Ocena artikulacije" v "Ocena preverjanja izgovorjave"

---

## Vizualni prikaz nove postavitve

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Ocena preverjanja izgovorjave                                               │
├─────────────────────────────────┬───────────────────────────────────────────┤
│ LEVA STRAN (checkboxi)          │ DESNA STRAN (5-stopenjska lestvica)       │
│                                 │                                           │
│ ☐ Ž izgovarja kot Z             │ ☐ 1️⃣ Neizvedljivo / odsotno         ▼    │
│ ☐ Odlično izgovarja             │ ☐ 2️⃣ Močno odstopanje              ▼    │
│ ☐ Ne izgovarja                  │ ☐ 3️⃣ Delno pravilno                ▼    │
│ ☐ Zamenjuje za Š                │ ☐ 4️⃣ Skoraj pravilno               ▼    │
│                                 │ ☐ 5️⃣ Pravilno                      ▼    │
├─────────────────────────────────┴───────────────────────────────────────────┤
│ Komentar                                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Dodatne opombe...                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Datoteke za posodobitev

### 1. `src/components/admin/EvaluationCheckboxes.tsx`

Spremeniti layout iz vertikalnega v horizontalni (grid z dvema stolpcema):

**Spremembe:**
- Dodati skupen naslov "Ocena preverjanja izgovorjave" na vrhu
- Uporabiti `grid grid-cols-1 md:grid-cols-2 gap-6` za razdelitev na levo in desno stran
- Levi stolpec: checkboxi (vertikalna lista namesto 2x2 mreže)
- Desni stolpec: 5-stopenjska lestvica
- Pod gridom: polje za komentar

### 2. `src/components/admin/ArticulationRatingScale.tsx`

**Spremembe:**
- Odstraniti naslov "Ocena artikulacije" (bo na višjem nivoju v `EvaluationCheckboxes`)
- Ohraniti collapsible funkcionalnost

---

## Podrobnosti implementacije

### EvaluationCheckboxes.tsx - nova struktura

```tsx
return (
  <div className="space-y-4 pt-4 border-t border-border">
    {/* Skupen naslov */}
    <span className="text-sm font-medium text-foreground">
      Ocena preverjanja izgovorjave
    </span>
    
    {/* Grid z dvema stolpcema */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Levi stolpec - checkboxi */}
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox ... />
            <Label ...>{option.label}</Label>
          </div>
        ))}
      </div>
      
      {/* Desni stolpec - 5-stopenjska lestvica */}
      <ArticulationRatingScale
        selectedRating={rating}
        onRatingChange={onRatingChange}
        disabled={disabled}
      />
    </div>
    
    {/* Komentar pod obema */}
    <div className="space-y-2">
      <Label>Komentar</Label>
      <Textarea ... />
    </div>
  </div>
);
```

### ArticulationRatingScale.tsx - odstranitev naslova

Odstraniti vrstico 40:
```tsx
<span className="text-sm font-medium text-foreground">Ocena artikulacije</span>
```

Ker bo naslov "Ocena preverjanja izgovorjave" zdaj na višjem nivoju v `EvaluationCheckboxes.tsx`.

---

## Odzivni dizajn

- Na manjših zaslonih (mobilni) bo grid imel en stolpec (`grid-cols-1`)
- Na večjih zaslonih (md: 768px+) bosta dva stolpca drug ob drugem (`md:grid-cols-2`)

---

## Vrstni red checkboxov

Na sliki vidim vrstni red:
1. Ž izgovarja kot Z
2. Odlično izgovarja
3. Ne izgovarja
4. Zamenjuje za Š

Trenutni vrstni red v `evaluationOptions.ts`:
1. Ž izgovarja kot Z
2. Ne izgovarja
3. Odlično izgovarja
4. Zamenjuje za Š

Posodobiti vrstni red v datoteki `src/data/evaluationOptions.ts` da se ujema s sliko.

