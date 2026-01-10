import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// All features for the comparison table
const allFeatures = [
  "Interaktivne govorne igre",
  "Vaje za izgovorjavo glasov",
  "Vaje motorike govoril",
  "Video navodila logopeda",
  "Logopedski nasveti za starše",
  "Spodbujevalni model nagrajevanja",
  "Dostop do vseh novih vsebin",
  "Razširjene igre",
  "Prilagojen osebni načrt",
  "Preverjanje izgovorjave",
  "Strokovna obravnava govora",
  "Logopedska poročila",
  "Spremljanje napredka z razlago",
  "Dostop do vseh novih AI vsebin",
  "Klepet",
];

// Feature availability per plan
const startFeatures = new Set([
  "Interaktivne govorne igre",
  "Vaje za izgovorjavo glasov",
  "Vaje motorike govoril",
  "Video navodila logopeda",
  "Logopedski nasveti za starše",
  "Spodbujevalni model nagrajevanja",
]);

const plusFeatures = new Set([
  ...startFeatures,
  "Dostop do vseh novih vsebin",
  "Razširjene igre",
]);

const proFeatures = new Set(allFeatures);

interface PlanConfig {
  name: string;
  price: number;
  billing: string;
  tagline: string;
  badge?: string;
  features: Set<string>;
  colorClass: string;
  bgColorClass: string;
  textColorClass: string;
  buttonClass: string;
  checkClass: string;
  isPro?: boolean;
}

const plans: PlanConfig[] = [
  {
    name: "TomiTalk Start",
    price: 17,
    billing: "zaračunano mesečno",
    tagline: "Vse, kar potrebuje otrok, da izboljša govor!",
    badge: "Fleksibilno",
    features: startFeatures,
    colorClass: "border-app-blue",
    bgColorClass: "bg-white",
    textColorClass: "text-app-blue",
    buttonClass: "bg-app-blue hover:bg-app-blue/90 text-white",
    checkClass: "text-app-blue",
  },
  {
    name: "TomiTalk Plus",
    price: 8,
    billing: "zaračunano letno",
    tagline: "Vse, kar potrebuje otrok, da izboljša govor!",
    features: plusFeatures,
    colorClass: "border-app-orange",
    bgColorClass: "bg-white",
    textColorClass: "text-app-orange",
    buttonClass: "bg-app-orange hover:bg-app-orange/90 text-white",
    checkClass: "text-app-orange",
  },
  {
    name: "TomiTalk Pro",
    price: 13,
    billing: "zaračunano letno",
    tagline: "Razširjena strokovna podpora in osebni pristop.",
    badge: "Najbolj priljubljeno",
    features: proFeatures,
    colorClass: "border-dragon-green",
    bgColorClass: "bg-dragon-green",
    textColorClass: "text-white",
    buttonClass: "bg-white hover:bg-gray-100 text-dragon-green",
    checkClass: "text-white",
    isPro: true,
  },
];

export function PricingSection() {
  return (
    <section id="cenik" className="w-full bg-white py-10 md:py-16 px-4">
      <div className="max-w-3xl md:max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground">
          Naši paketi so zasnovani posebej za starše in njihove otroke. Izberite paket, ki vam najbolj ustreza.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header with plan names and prices */}
          <thead>
            <tr>
              <th className="p-4 text-left w-[280px] min-w-[200px]">
                <span className="text-lg font-semibold text-gray-700">Funkcionalnosti</span>
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className={cn(
                    "p-4 text-center border-2 rounded-t-xl min-w-[180px]",
                    plan.colorClass,
                    plan.bgColorClass,
                    plan.isPro ? "text-white" : ""
                  )}
                >
                  <div className="relative">
                    {plan.badge && (
                      <span
                        className={cn(
                          "absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap",
                          plan.isPro
                            ? "bg-app-orange text-white"
                            : "bg-app-blue text-white"
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <h3 className={cn("text-xl font-bold mb-2", plan.textColorClass)}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className={cn("text-3xl font-bold", plan.isPro ? "text-white" : "text-gray-900")}>
                        {plan.price} €
                      </span>
                      <span className={cn("text-sm", plan.isPro ? "text-white/80" : "text-gray-500")}>
                        /mesec
                      </span>
                    </div>
                    <p className={cn("text-xs mb-3", plan.isPro ? "text-white/80" : "text-gray-500")}>
                      {plan.billing}
                    </p>
                    <p className={cn("text-sm font-medium italic", plan.isPro ? "text-white/90" : "text-gray-600")}>
                      "{plan.tagline}"
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Feature rows */}
          <tbody>
            {allFeatures.map((feature, index) => (
              <tr
                key={feature}
                className={cn(
                  "border-b border-gray-100",
                  index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                )}
              >
                <td className="p-4 text-sm text-gray-700 font-medium">
                  {feature}
                </td>
                {plans.map((plan) => {
                  const hasFeature = plan.features.has(feature);
                  return (
                    <td
                      key={`${plan.name}-${feature}`}
                      className={cn(
                        "p-4 text-center border-x-2",
                        plan.colorClass,
                        plan.isPro ? "bg-dragon-green" : ""
                      )}
                    >
                      {hasFeature ? (
                        <Check className={cn("h-5 w-5 mx-auto", plan.checkClass)} />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Footer with CTA buttons */}
          <tfoot>
            <tr>
              <td className="p-4"></td>
              {plans.map((plan) => (
                <td
                  key={`${plan.name}-cta`}
                  className={cn(
                    "p-6 text-center border-2 border-t-0 rounded-b-xl",
                    plan.colorClass,
                    plan.isPro ? "bg-dragon-green" : "bg-white"
                  )}
                >
                  <Button
                    className={cn("w-full h-12 text-base font-semibold", plan.buttonClass)}
                  >
                    Izberi paket
                  </Button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default PricingSection;
