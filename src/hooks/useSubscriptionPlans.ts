
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[] | null;
  order_index?: number;
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchPlans() {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscription_plans" as any)
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && Array.isArray(data) && isMounted) {
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
      if (isMounted) setLoading(false);
    }
    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  return { plans, loading };
}
