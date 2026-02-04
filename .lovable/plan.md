
# Popravek: -41% oznaka mora biti vedno vidna

## Problem

Trenutna koda prikazuje bodisi kljukico (če si naročen na Pro) bodisi -41% oznako (če nisi naročen). Ker si ti naročen na Pro, se prikazuje samo kljukica.

## Rešitev

Spremeniti logiko tako, da se -41% oznaka prikazuje **vedno**, kljukica pa se doda poleg, če si naročen.

## Spremembe

### 1. `src/components/PricingSection.tsx` (vrstice 137-147)

**Iz:**
```tsx
<TabsTrigger value="pro" className="... flex items-center gap-1.5">
  <span className="md:hidden">{proPlan.shortName}</span>
  <span className="hidden md:inline">{proPlan.name}</span>
  {isSubscribed && currentPlanId === 'pro' ? (
    <Check className="h-4 w-4 text-dragon-green" />
  ) : (
    <span className="bg-white text-app-orange ...">-41%</span>
  )}
</TabsTrigger>
```

**V:**
```tsx
<TabsTrigger value="pro" className="... flex items-center gap-1.5">
  <span className="md:hidden">{proPlan.shortName}</span>
  <span className="hidden md:inline">{proPlan.name}</span>
  {isSubscribed && currentPlanId === 'pro' && (
    <Check className="h-4 w-4 text-dragon-green" />
  )}
  <span className="bg-white text-app-orange ...">-41%</span>
</TabsTrigger>
```

Zdaj bo kljukica prikazana **poleg** -41% oznake, ne **namesto** nje.

### 2. `src/components/profile/SubscriptionSection.tsx` (enaka sprememba)

Ista popravka za profil stran.

---

## Vizualni rezultat

| Stanje | Pred | Po |
|--------|------|-----|
| Ni naročen | "TomiTalk Pro -41%" | "TomiTalk Pro -41%" |
| Naročen na Pro | "TomiTalk Pro ✓" | "TomiTalk Pro ✓ -41%" |

