import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CircleDollarSign, HelpCircle, Loader2, Check, Settings, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  pricingPlans, 
  proExclusiveFeatures, 
  startIncludedFeatures,
  getColorClass,
  getPlanById,
  type PlanId 
} from "@/config/pricing";

export function SubscriptionSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [showProDialog, setShowProDialog] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<PlanId | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
  const { session } = useAuth();
  const { isSubscribed, planId: currentPlanId, subscriptionEnd, isLoading: isSubscriptionLoading, refreshSubscription } = useSubscription();

  const handleSubscribe = async (plan: typeof startPlan) => {
    if (!session) {
      toast.error("Za naročnino se morate najprej prijaviti.");
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

  const handleManageSubscription = async () => {
    if (!session) {
      toast.error("Za upravljanje naročnine se morate najprej prijaviti.");
      return;
    }

    setIsPortalLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Portal error:', error);
        toast.error("Napaka pri odpiranju portala. Poskusite znova.");
        return;
      }

      if (data?.url) {
        // Redirect to Stripe portal (same window for Safari compatibility)
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error("Napaka pri odpiranju portala. Poskusite znova.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const startPlan = pricingPlans.find(p => p.id === 'start')!;
  const proPlan = pricingPlans.find(p => p.id === 'pro')!;

  const currentPlan = currentPlanId ? getPlanById(currentPlanId) : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sl-SI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderPlanButton = (plan: typeof startPlan) => {
    const isCurrentPlan = isSubscribed && currentPlanId === plan.id;
    const isLoading = isCheckoutLoading === plan.id;

    return (
      <Button 
        className={cn(
          "w-full text-white h-12 text-lg font-semibold mt-auto",
          getColorClass(plan.color, 'bg'),
          "hover:opacity-90",
          isCurrentPlan && "opacity-75"
        )}
        onClick={() => handleSubscribe(plan)}
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
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5" />
          Naročnina
        </h2>
      </div>
      
      {/* Current Subscription Status */}
      {isSubscribed && currentPlan && (
        <div className="p-4 bg-gradient-to-r from-dragon-green/10 to-transparent border-b border-dragon-green/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", getColorClass(currentPlan.color, 'bg'))}>
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Aktivna naročnina: <span className={getColorClass(currentPlan.color, 'text')}>{currentPlan.name}</span>
                </p>
                {subscriptionEnd && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Veljavno do: {formatDate(subscriptionEnd)}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="border-dragon-green text-dragon-green hover:bg-dragon-green/10"
              onClick={handleManageSubscription}
              disabled={isPortalLoading}
            >
              {isPortalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Upravljaj naročnino
            </Button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Plan Toggle */}
          <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanId)} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-12">
              <TabsTrigger value="start" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative">
                {startPlan.shortName}
                {isSubscribed && currentPlanId === 'start' && (
                  <Check className="h-4 w-4 text-app-blue absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
              <TabsTrigger value="pro" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 relative flex items-center gap-1.5">
                {proPlan.shortName}
                {isSubscribed && currentPlanId === 'pro' && (
                  <Check className="h-4 w-4 text-dragon-green" />
                )}
                <span className="bg-white text-app-orange text-xs px-1.5 py-0.5 rounded font-medium border border-app-orange">
                  -41%
                </span>
              </TabsTrigger>
            </TabsList>

            {/* TomiTalk Start */}
            <TabsContent value="start" className="mt-6">
              <Card className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg h-[580px] shadow-md",
                getColorClass(startPlan.color, 'border'),
                isSubscribed && currentPlanId === 'start' && "ring-2 ring-app-blue ring-offset-2"
              )}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={cn(
                      "text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap",
                      getColorClass(startPlan.color, 'bg')
                    )}>
                      {isSubscribed && currentPlanId === 'start' ? 'Vaš paket' : startPlan.badge}
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

                  {renderPlanButton(startPlan)}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TomiTalk Pro */}
            <TabsContent value="pro" className="mt-6">
              <Card className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-lg h-[580px] shadow-md",
                getColorClass(proPlan.color, 'border'),
                isSubscribed && currentPlanId === 'pro' && "ring-2 ring-dragon-green ring-offset-2"
              )}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={cn(
                      "text-white text-sm px-4 py-1 rounded-full font-medium whitespace-nowrap",
                      getColorClass(proPlan.color, 'bg')
                    )}>
                      {isSubscribed && currentPlanId === 'pro' ? 'Vaš paket' : proPlan.badge}
                    </span>
                  </div>
                  
                  <div className="text-center mb-6 mt-2 h-[88px]">
                    <h3 className={cn("text-2xl font-bold mb-2", getColorClass(proPlan.color, 'text'))}>
                      {proPlan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold">{proPlan.price} €</span>
                      <span className="text-gray-500">/mesec</span>
                      <span className="bg-dragon-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        -41%
                      </span>
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

                  {renderPlanButton(proPlan)}
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
    </div>
  );
}
