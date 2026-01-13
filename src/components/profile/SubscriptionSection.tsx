import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CircleDollarSign, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  pricingPlans, 
  proExclusiveFeatures, 
  plusIncludedFeatures,
  getColorClass,
  type PlanId 
} from "@/config/pricing";

export function SubscriptionSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [showProDialog, setShowProDialog] = useState(false);

  const handleSubscribe = (planName: string) => {
    toast.info(`Izbran paket: ${planName}. Funkcionalnost naročanja še ni implementirana.`);
  };

  const startPlan = pricingPlans.find(p => p.id === 'start')!;
  const plusPlan = pricingPlans.find(p => p.id === 'plus')!;
  const proPlan = pricingPlans.find(p => p.id === 'pro')!;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5" />
          Naročnina
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Plan Toggle */}
          <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanId)} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-12">
              <TabsTrigger value="start" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                {startPlan.shortName}
              </TabsTrigger>
              <TabsTrigger value="plus" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                {plusPlan.shortName}
              </TabsTrigger>
              <TabsTrigger value="pro" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative">
                {proPlan.shortName}
                <span className="absolute -top-2 -right-2 bg-dragon-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Naj izbira
                </span>
              </TabsTrigger>
            </TabsList>

            {/* TomiTalk Start */}
            <TabsContent value="start" className="mt-6">
              <Card className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg h-[580px] shadow-md",
                getColorClass(startPlan.color, 'border')
              )}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={cn(
                      "text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap",
                      getColorClass(startPlan.color, 'bg')
                    )}>
                      {startPlan.badge}
                    </span>
                  </div>
                  
                  <div className="text-center mb-6 mt-2 h-[88px]">
                    <h3 className={cn("text-2xl font-bold mb-2", getColorClass(startPlan.color, 'text'))}>
                      {startPlan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">{startPlan.price} €</span>
                      <span className="text-gray-500">/mesec</span>
                    </div>
                    <p className="text-sm text-gray-600">{startPlan.billingLabel}</p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-lg font-medium text-gray-700 mb-4">
                      {startPlan.tagline}
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="inline-flex flex-col items-start space-y-3">
                      {startPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getColorClass(startPlan.color, 'bg'))} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      "w-full text-white h-12 text-lg font-semibold mt-auto",
                      getColorClass(startPlan.color, 'bg'),
                      "hover:opacity-90"
                    )}
                    onClick={() => handleSubscribe(startPlan.name)}
                  >
                    Izberi {startPlan.name}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TomiTalk Plus */}
            <TabsContent value="plus" className="mt-6">
              <Card className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg h-[580px] shadow-md",
                getColorClass(plusPlan.color, 'border')
              )}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={cn(
                      "text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap",
                      getColorClass(plusPlan.color, 'bg')
                    )}>
                      {plusPlan.badge}
                    </span>
                  </div>
                  
                  <div className="text-center mb-6 mt-2 h-[88px]">
                    <h3 className={cn("text-2xl font-bold mb-2", getColorClass(plusPlan.color, 'text'))}>
                      {plusPlan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">{plusPlan.price} €</span>
                      <span className="text-gray-500">/mesec</span>
                    </div>
                    <p className="text-sm text-gray-600">{plusPlan.billingLabel}</p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-lg font-medium text-gray-700 mb-4">
                      {plusPlan.tagline}
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="inline-flex flex-col items-start space-y-3">
                      {plusPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getColorClass(plusPlan.color, 'bg'))} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      "w-full text-white h-12 text-lg font-semibold mt-auto",
                      getColorClass(plusPlan.color, 'bg'),
                      "hover:opacity-90"
                    )}
                    onClick={() => handleSubscribe(plusPlan.name)}
                  >
                    Izberi {plusPlan.name}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TomiTalk Pro */}
            <TabsContent value="pro" className="mt-6">
              <Card className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg h-[580px] shadow-md",
                getColorClass(proPlan.color, 'border')
              )}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={cn(
                      "text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap",
                      getColorClass(proPlan.color, 'bg')
                    )}>
                      {proPlan.badge}
                    </span>
                  </div>
                  
                  <div className="text-center mb-6 mt-2 h-[88px]">
                    <h3 className={cn("text-2xl font-bold mb-2", getColorClass(proPlan.color, 'text'))}>
                      {proPlan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">{proPlan.price} €</span>
                      <span className="text-gray-500">/mesec</span>
                    </div>
                    <p className="text-sm text-gray-600">{proPlan.billingLabel}</p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-lg font-medium text-gray-700 mb-4">
                      {proPlan.tagline}
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="inline-flex flex-col items-start space-y-3">
                      {proExclusiveFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getColorClass(proPlan.color, 'bg'))} />
                          <span className={feature.isBold ? "font-bold" : ""}>{feature.text}</span>
                          {feature.hasInfo && (
                            <button 
                              className="text-gray-400 hover:text-dragon-green transition-colors"
                              onClick={() => setShowProDialog(true)}
                            >
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      "w-full text-white h-12 text-lg font-semibold mt-auto",
                      getColorClass(proPlan.color, 'bg'),
                      "hover:opacity-90"
                    )}
                    onClick={() => handleSubscribe(proPlan.name)}
                  >
                    Izberi {proPlan.name}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Pro Info Dialog */}
      <Dialog open={showProDialog} onOpenChange={setShowProDialog}>
        <DialogContent className="w-[90%] max-w-sm rounded-xl p-0 overflow-hidden">
          <div className="bg-dragon-green text-white p-4 text-center">
            <DialogTitle className="text-lg font-bold text-white">TomiTalk Pro vključuje</DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Celoten paket za napredek govora
            </DialogDescription>
          </div>
          
          <div className="p-4">
            {/* TomiTalk Plus section */}
            <div className="bg-app-orange/10 border-2 border-app-orange rounded-lg p-3 mb-4">
              <p className="font-bold text-app-orange text-sm mb-2 text-center">
                ✓ Vse iz TomiTalk Plus:
              </p>
              <ul className="space-y-1.5">
                {plusIncludedFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-app-orange flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* TomiTalk Pro exclusive features */}
            <div className="bg-dragon-green/10 border-2 border-dragon-green rounded-lg p-3">
              <p className="font-bold text-dragon-green text-sm mb-2 text-center">
                + Ekskluzivne Pro funkcije:
              </p>
              <ul className="space-y-1.5">
                {proExclusiveFeatures.filter(f => !f.hasInfo).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-dragon-green flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
