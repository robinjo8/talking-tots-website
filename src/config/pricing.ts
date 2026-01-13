// Centralna konfiguracija cenovnih paketov TomiTalk
// Uporablja se v /cenik (PricingSection) in /profile (SubscriptionSection)

export type PlanId = 'start' | 'plus' | 'pro';

export interface PricingPlan {
  id: PlanId;
  name: string;
  shortName: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  billingLabel: string;
  tagline: string;
  badge: string | null;
  color: 'app-blue' | 'app-orange' | 'dragon-green';
  features: string[];
  isPopular?: boolean;
  stripePriceId: string;
  stripeProductId: string;
}

export interface ProFeature {
  text: string;
  isBold: boolean;
  hasInfo: boolean;
}

// Funkcije vključene v TomiTalk Plus (prikazane v Pro info dialogu)
export const plusIncludedFeatures = [
  "Interaktivne govornih igre",
  "Vaje za izgovorjavo glasov",
  "Vaje motorike govoril",
  "Video navodila logopeda",
  "Logopedski nasveti za starše",
  "Spodbujevalni model nagrajevanja",
  "Dostop do vseh novih vsebin",
  "Razširjene igre"
];

// Ekskluzivne Pro funkcije
export const proExclusiveFeatures: ProFeature[] = [
  { text: "Vse iz TomiTalk Plus", isBold: true, hasInfo: true },
  { text: "Prilagojen osebni načrt", isBold: false, hasInfo: false },
  { text: "Preverjanje izgovorjave", isBold: false, hasInfo: false },
  { text: "Strokovna obravnava govora", isBold: false, hasInfo: false },
  { text: "Logopedska poročila", isBold: false, hasInfo: false },
  { text: "Spremljanje napredka z razlago", isBold: false, hasInfo: false },
  { text: "Dostop do vseh novih AI vsebin", isBold: false, hasInfo: false },
  { text: "Klepet", isBold: false, hasInfo: false }
];

// Stripe tier mapping - maps product IDs to plan IDs
export const stripeTiers: Record<string, PlanId> = {
  'prod_TmbXrf2SNJLlHM': 'start',
  'prod_TmbXaM32ndD11d': 'plus',
  'prod_TmbZ19RhCaSzrp': 'pro'
};

// Glavni paketi
export const pricingPlans: PricingPlan[] = [
  {
    id: 'start',
    name: 'TomiTalk Start',
    shortName: 'Start',
    price: 17,
    billingPeriod: 'monthly',
    billingLabel: 'zaračunano mesečno',
    tagline: '"Vse, kar potrebuje otrok, da izboljša govor!"',
    badge: 'Fleksibilno',
    color: 'app-blue',
    features: [
      "Interaktivne govornih igre",
      "Vaje za izgovorjavo glasov",
      "Vaje motorike govoril",
      "Video navodila logopeda",
      "Logopedski nasveti za starše",
      "Spodbujevalni model nagrajevanja"
    ],
    isPopular: false,
    stripePriceId: 'price_1Sp2K9GncjlOci0kLq14l1pk',
    stripeProductId: 'prod_TmbXrf2SNJLlHM'
  },
  {
    id: 'plus',
    name: 'TomiTalk Plus',
    shortName: 'Plus',
    price: 8,
    billingPeriod: 'yearly',
    billingLabel: 'zaračunano letno',
    tagline: '"Vse, kar potrebuje otrok, da izboljša govor!"',
    badge: 'Prihranek',
    color: 'app-orange',
    features: plusIncludedFeatures,
    isPopular: false,
    stripePriceId: 'price_1Sp2KqGncjlOci0krAzeJdIn',
    stripeProductId: 'prod_TmbXaM32ndD11d'
  },
  {
    id: 'pro',
    name: 'TomiTalk Pro',
    shortName: 'Pro',
    price: 13,
    billingPeriod: 'yearly',
    billingLabel: 'zaračunano letno',
    tagline: '"Razširjena strokovna podpora in osebni pristop."',
    badge: 'Naj izbira',
    color: 'dragon-green',
    features: [], // Pro uporablja proExclusiveFeatures
    isPopular: true,
    stripePriceId: 'price_1Sp2M6GncjlOci0k6WHpDzMv',
    stripeProductId: 'prod_TmbZ19RhCaSzrp'
  }
];

// Helper funkcije
export const getPlanById = (id: PlanId): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.id === id);
};

export const getPlanByProductId = (productId: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.stripeProductId === productId);
};

export const getColorClass = (color: PricingPlan['color'], type: 'text' | 'bg' | 'border'): string => {
  const colorMap = {
    'app-blue': { text: 'text-app-blue', bg: 'bg-app-blue', border: 'border-app-blue' },
    'app-orange': { text: 'text-app-orange', bg: 'bg-app-orange', border: 'border-app-orange' },
    'dragon-green': { text: 'text-dragon-green', bg: 'bg-dragon-green', border: 'border-dragon-green' }
  };
  return colorMap[color][type];
};
