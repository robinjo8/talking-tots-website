

# Preoblikovanje strani Vaje motorike govoril po vzoru Vizualni prikaz ustnic

## Spremembe v `src/pages/VajeMotorikeGovoril.tsx`

### 1. Ozadje
- Zamenjaj oranžno slikovno ozadje z `bg-dragon-green` (enotna zelena barva kot na referenčni strani)
- Odstrani `<div>` z `backgroundImage`

### 2. Layout in naslov
- Dodaj `<Header />` komponento na vrh
- Dodaj naslovni blok z naslovom "Vaje motorike govoril" in opisom (na desktop) — enak vzorec kot referenčna stran
- Mobilni container: `fixed inset-0 overflow-auto flex flex-col` z `pt-20 pb-24`
- Desktop container: `min-h-screen` z `pt-28 md:pt-32 pb-20`

### 3. Odstranitve
- Gumbi K L R C S Z Č Š Ž ne obstajajo na tej strani, tako da ni treba ničesar odstraniti
- Odstrani fullscreen logiko (referenčna stran je ne uporablja)

### 4. Brez sprememb
- Hiška gumb z DropdownMenu ostane popolnoma enak
- SequentialExerciseGrid, InfoModal, MemoryExitConfirmationDialog — logika ostane enaka
- useExerciseProgress ostane enak

### 5. Datoteke
- `src/pages/VajeMotorikeGovoril.tsx` — edina sprememba

