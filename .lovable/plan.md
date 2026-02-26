
# Popravek klepeta: CORS napaka + dodaj Klepet v desktop navigacijo

## Problem 1: "Napaka pri komunikaciji z asistentom"
Edge funkcija `chat-assistant` ima CORS preverjanje, ki dovoljuje samo domene, ki se končajo z `.lovable.app`. Preview URL pa uporablja domeno `.lovableproject.com`, ki ni dovoljena. Zato brskalnik zavrne zahtevo ("Failed to fetch").

**Popravek:** V `supabase/functions/chat-assistant/index.ts` dodaj `.lovableproject.com` v CORS preverjanje:
```typescript
const isAllowed = allowedOrigins.includes(origin) 
  || (origin.startsWith("https://") && origin.endsWith(".lovable.app"))
  || (origin.startsWith("https://") && origin.endsWith(".lovableproject.com"));
```

## Problem 2: Klepet manjka v desktop navigaciji
Klepet je dodan samo v hamburger meni (mobilna verzija), manjka pa v desktop headerju.

**Popravek:** V `src/components/header/DesktopNavigation.tsx` dodaj gumb "Klepet" v desni del navigacije (poleg ikone za informacije), viden samo za prijavljene uporabnike. Uporabi ikono `MessageCircle`.

## Datoteke za urejanje
1. `supabase/functions/chat-assistant/index.ts` -- dodaj `.lovableproject.com` v CORS
2. `src/components/header/DesktopNavigation.tsx` -- dodaj Klepet gumb za desktop
