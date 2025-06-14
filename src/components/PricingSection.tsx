
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the interface for a subscription plan
interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[] | null;
  order_index?: number;
}

export function PricingSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      // Query using any type fallback, since "subscription_plans" doesn't exist in supabase types
      const { data, error } = await supabase
        .from("subscription_plans" as any)
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && Array.isArray(data)) {
        // Robustly decode features as array
        setPlans(
          data.map((item: any) => ({
            id: String(item.id),
            name: String(item.name),
            price: String(item.price),
            description: String(item.description),
            features: Array.isArray(item.features) ? item.features : null,
            order_index: item.order_index,
          }))
        );
      }
      setLoading(false);
    }
    fetchPlans();
  }, []);

  return (
    <section
      id="cenik"
      className="w-full bg-white py-10 md:py-16 px-4 border-t border-gray-100"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground">
          Enostavna, pregledna in prilagodljiva naročnina za vašo družino.
        </p>
      </div>
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Nalaganje cenikov...</div>
      ) : (
        <div
          className="flex flex-row gap-4 justify-center items-stretch max-w-md mx-auto
            [&>*]:flex-1
            md:max-w-2xl"
        >
          {plans.map((pkg) => (
            <Card
              key={pkg.id}
              className="flex flex-col items-center justify-between rounded-[24px] shadow-md px-2 py-4 bg-white
                md:px-6 md:py-8
              "
            >
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg md:text-2xl font-bold mb-1">{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center p-0 mb-2 w-full">
                <div className="text-2xl md:text-3xl font-extrabold text-dragon-green mb-2">{pkg.price}</div>
                <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">{pkg.description}</div>
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="mb-3 w-full px-3 md:px-0">
                    {pkg.features.map((f, i) => (
                      <li key={f + i} className="text-[12px] md:text-base text-gray-800 mb-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-dragon-green rounded-full mr-2" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <Button className="w-full mt-auto bg-dragon-green hover:bg-dragon-green/80 rounded-full text-white font-bold">
                Izberi
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default PricingSection;
