

# Popravek centriranja obvestil na mobilni verziji

## Problem

Na mobilni verziji se okno z obvestili odpira na vrhu zaslona namesto na sredini. Iz slike je razvidno, da se odpira Popover komponenta namesto mobilnega modala.

## Vzrok

1. **Napačna detekcija mobilne naprave** - `isMobile` se izračuna samo ob prvem renderju in ni reaktiven
2. **Gumb X ima napačno pozicioniranje** - `absolute` brez `relative` na parent elementu, zato se pozicionira glede na napačen kontejner

## Rešitev

### 1. Uporabi `useIsMobile` hook
Zamenjaj ročno preverjanje `window.innerWidth` z obstoječim `useIsMobile()` hookom, ki pravilno posluša spremembe velikosti okna.

### 2. Popravi pozicioniranje gumba X
Dodaj `relative` na parent element gumba X, da se bo pravilno pozicioniral znotraj modala.

### 3. Zagotovi pravilno delovanje
- Desktop (sm in več): Popover se odpre pod zvončkom
- Mobile (pod sm): Modal se odpre točno na sredini zaslona (horizontalno in vertikalno)

## Tehnične spremembe

**Datoteka:** `src/components/header/UserNotificationBell.tsx`

```tsx
// Zamenjaj:
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

// Z:
import { useIsMobile } from '@/hooks/use-mobile';
const isMobile = useIsMobile();
```

```tsx
// Popravi mobile modal container - dodaj relative za gumb X:
<div 
  className="relative bg-background rounded-xl shadow-xl w-[90vw] max-w-[350px] max-h-[80vh] overflow-hidden"
  onClick={(e) => e.stopPropagation()}
>
```

## Rezultat

Ob kliku na zvonček na telefonu se bo modal odprl točno na sredini zaslona - tako horizontalno kot vertikalno. Gumb X za zapiranje bo pravilno pozicioniran v zgornjem desnem kotu modala.

