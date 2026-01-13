import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getPlanByProductId } from "@/config/pricing";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [planName, setPlanName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || !session) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!error && data?.productId) {
          const plan = getPlanByProductId(data.productId);
          if (plan) {
            setPlanName(plan.name);
          }
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to allow Stripe to process
    const timer = setTimeout(checkSubscription, 1500);
    return () => clearTimeout(timer);
  }, [user, session]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dragon-green/10 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-dragon-green shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-dragon-green" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hvala za naročnino!
          </h1>

          {isLoading ? (
            <p className="text-gray-600 mb-6">
              Preverjam vašo naročnino...
            </p>
          ) : planName ? (
            <p className="text-gray-600 mb-6">
              Uspešno ste se naročili na <span className="font-semibold text-dragon-green">{planName}</span>. 
              Zdaj imate dostop do vseh funkcij!
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Vaša naročnina je bila uspešno aktivirana. 
              Zdaj imate dostop do vseh funkcij!
            </p>
          )}

          <div className="space-y-3">
            <Button
              className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white"
              onClick={() => navigate("/moja-stran")}
            >
              Pojdi na mojo stran
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-dragon-green text-dragon-green hover:bg-dragon-green/10"
              onClick={() => navigate("/profile?section=subscription")}
            >
              Upravljaj naročnino
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
