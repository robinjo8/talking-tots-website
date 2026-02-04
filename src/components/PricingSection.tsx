import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { 
  pricingPlans, 
  proExclusiveFeatures, 
  startIncludedFeatures,
  getColorClass,
  type PlanId 
} from "@/config/pricing";

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<PlanId | null>(null);
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { isSubscribed, planId: currentPlanId } = useSubscriptionContext();

  const startPlan = pricingPlans.find(p => p.id === 'start')!;
  const proPlan = pricingPlans.find(p => p.id === 'pro')!;

  const handleSelectPlan = async (plan: typeof startPlan) => {
    // If not logged in, redirect to login
    if (!user || !session) {
      toast.info("Za naročnino se morate najprej prijaviti.");
      navigate("/login", { state: { returnTo: "/cenik" } });
      return;
    }

    // If already subscribed to this plan
    if (isSubscribed && currentPlanId === plan.id) {
      toast.info("Že imate aktivno naročnino na ta paket.");
      return;
    }

    setIsCheckoutLoading(plan.id);

    try {
      // Refresh session to ensure token is valid
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        console.error('Session refresh error:', refreshError);
        toast.error("Seja je potekla. Prosimo, prijavite se znova.");
        navigate("/login", { state: { returnTo: "/cenik" } });
        return;
      }

      const freshToken = refreshData.session.access_token;

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: plan.stripePriceId,
          planId: plan.id,
        },
        headers: {
          Authorization: `Bearer ${freshToken}`,
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error("Napaka pri ustvarjanju naročnine. Poskusite znova.");
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout (same window for Safari compatibility)
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Napaka pri ustvarjanju naročnine. Poskusite znova.");
    } finally {
      setIsCheckoutLoading(null);
    }
  };

  const renderPlanButton = (plan: typeof startPlan) => {
    const isCurrentPlan = isSubscribed && currentPlanId === plan.id;
    const isLoading = isCheckoutLoading === plan.id;

    return (
      <Button 
        className={cn(
          "w-full text-white h-9 md:h-12 text-sm md:text-lg font-semibold mt-auto hover:opacity-90",
          getColorClass(plan.color, 'bg'),
          isCurrentPlan && "opacity-75"
        )}
        onClick={() => handleSelectPlan(plan)}
        disabled={isLoading || isCurrentPlan}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isCurrentPlan ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            Vaš trenutni paket
          </>
        ) : (
          `Izberi ${plan.name}`
        )}
      </Button>
    );
  };

  return (
    <section id="cenik" className="w-full bg-white py-4 md:py-16 px-4 h-full md:h-auto">
      <div className="max-w-3xl md:max-w-5xl mx-auto text-center mb-4 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">TomiTalk paketi</h2>
        <p className="text-sm md:text-lg text-muted-foreground whitespace-nowrap">
          Izberite svoj TomiTalk paket in začnite danes.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Plan Toggle */}
        <Tabs value={selectedPlan} onValueChange={value => setSelectedPlan(value as PlanId)} className="w-full mb-4 md:mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 h-10 md:h-12">
            <TabsTrigger value="start" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm md:text-base relative">
              <span className="md:hidden">{startPlan.shortName}</span>
              <span className="hidden md:inline">{startPlan.name}</span>
              {isSubscribed && currentPlanId === 'start' && (
                <Check className="h-4 w-4 text-app-blue absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
            <TabsTrigger value="pro" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative text-sm md:text-base flex items-center gap-1.5">
              <span className="md:hidden">{proPlan.shortName}</span>
              <span className="hidden md:inline">{proPlan.name}</span>
              {isSubscribed && currentPlanId === 'pro' && (
                <Check className="h-4 w-4 text-dragon-green" />
              )}
              <span className="bg-app-orange text-black text-xs px-1.5 py-0.5 rounded font-medium">
                -41%
              </span>
            </TabsTrigger>
          </TabsList>

          {/* TomiTalk Start */}
          <TabsContent value="start" className="mt-4 md:mt-6">
            <Card className={cn(
              "relative border-2 transition-all duration-300 hover:shadow-lg h-[360px] md:h-[580px] shadow-md",
              getColorClass(startPlan.color, 'border'),
              isSubscribed && currentPlanId === 'start' && "ring-2 ring-app-blue ring-offset-2"
            )}>
              <CardContent className="p-3 md:p-8 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={cn(
                    "text-white text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-medium whitespace-nowrap",
                    getColorClass(startPlan.color, 'bg')
                  )}>
                    {isSubscribed && currentPlanId === 'start' ? 'Vaš paket' : startPlan.badge}
                  </span>
                </div>
                
                <div className="text-center mb-2 md:mb-6 mt-2 md:h-[88px]">
                  <h3 className={cn("text-xl md:text-2xl font-bold mb-1 md:mb-2", getColorClass(startPlan.color, 'text'))}>
                    {startPlan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1 md:mb-2">
                    <span className="text-3xl md:text-4xl font-bold">{startPlan.price} €</span>
                    <span className="text-gray-500 text-sm md:text-base">/mesec</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{startPlan.billingLabel}</p>
                </div>

                <div className="text-center mb-2 md:mb-6">
                  <p className="text-sm md:text-lg font-medium text-gray-700 mb-1 md:mb-4">
                    {startPlan.tagline}
                  </p>
                </div>

                <div className="flex justify-center mb-3 md:mb-6">
                  <div className="inline-flex flex-col items-start space-y-0.5 md:space-y-3">
                    {startPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full flex-shrink-0", getColorClass(startPlan.color, 'bg'))} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {renderPlanButton(startPlan)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TomiTalk Pro */}
          <TabsContent value="pro" className="mt-4 md:mt-6">
            <Card className={cn(
              "relative border-2 transition-all duration-300 hover:shadow-lg h-[360px] md:h-[580px] shadow-md",
              getColorClass(proPlan.color, 'border'),
              isSubscribed && currentPlanId === 'pro' && "ring-2 ring-dragon-green ring-offset-2"
            )}>
              <CardContent className="p-3 md:p-8 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={cn(
                    "text-white text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-medium whitespace-nowrap",
                    getColorClass(proPlan.color, 'bg')
                  )}>
                    {isSubscribed && currentPlanId === 'pro' ? 'Vaš paket' : proPlan.badge}
                  </span>
                </div>
                
                <div className="text-center mb-2 md:mb-6 mt-2 md:h-[88px]">
                  <h3 className={cn("text-xl md:text-2xl font-bold mb-1 md:mb-2", getColorClass(proPlan.color, 'text'))}>
                    {proPlan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1 md:mb-2">
                    <span className="text-gray-400 line-through text-lg md:text-xl">{startPlan.price} €</span>
                    <span className="text-3xl md:text-4xl font-bold">{proPlan.price} €</span>
                    <span className="text-gray-500 text-sm md:text-base">/mesec</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{proPlan.billingLabel}</p>
                </div>

                <div className="text-center mb-2 md:mb-6">
                  <p className="text-sm md:text-lg font-medium text-gray-700 mb-1 md:mb-4">
                    {proPlan.tagline}
                  </p>
                </div>

                <div className="flex justify-center mb-3 md:mb-6">
                  <div className="inline-flex flex-col items-start space-y-0.5 md:space-y-3">
                    {proExclusiveFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full flex-shrink-0", getColorClass(proPlan.color, 'bg'))} />
                        <span className={feature.isBold ? "font-bold" : ""}>{feature.text}</span>
                        {feature.hasInfo && (
                          <button 
                            className="text-gray-400 hover:text-dragon-green transition-colors"
                            onClick={() => setShowMobileDialog(true)}
                          >
                            <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {renderPlanButton(proPlan)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Dialog for TomiTalk Pro info */}
      <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
        <DialogContent className="w-[90%] max-w-sm rounded-xl p-0 overflow-hidden">
          <div className="bg-dragon-green text-white p-4 text-center">
            <DialogTitle className="text-lg font-bold text-white">TomiTalk Pro vključuje</DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Celoten paket za napredek govora
            </DialogDescription>
          </div>
          
          <div className="p-4">
            {/* TomiTalk Start section */}
            <div className="bg-app-blue/10 border-2 border-app-blue rounded-lg p-3 mb-4">
              <p className="font-bold text-app-blue text-sm mb-2 text-center">
                ✓ Vse iz TomiTalk Start:
              </p>
              <ul className="space-y-1.5">
                {startIncludedFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-app-blue flex-shrink-0" />
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
    </section>
  );
}

export default PricingSection;
