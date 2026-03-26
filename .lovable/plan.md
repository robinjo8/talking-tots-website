

## Plan: Popravi popust oznako na /profile

### Problem
Na strani `/cenik` (`PricingSection.tsx`) piše **-55%**, na strani `/profile` (`SubscriptionSection.tsx`) pa piše **-41%**. Glede na cene (Start: 22€/mesec, Pro: 10€/mesec) je pravilen popust **-55%** (10/22 = 45%, torej 55% ceneje).

Vse ostalo (cene, opisi, features, tagline, billingLabel) je enako — obe komponenti bereta iz istega `config/pricing.ts`.

### Sprememba

**Datoteka:** `src/components/profile/SubscriptionSection.tsx`

Vrstica 224: zamenjaj `-41%` z `-55%`.

### Obseg
1 datoteka, 1 vrstica.

