import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

export function DailyStarsBar() {
  const { selectedChild } = useAuth();
  const todayStr = new Date().toISOString().split("T")[0];

  const { data: dailyStars = 0 } = useQuery({
    queryKey: ["dailyStars", selectedChild?.id, todayStr],
    queryFn: async (): Promise<number> => {
      if (!selectedChild?.id) return 0;

      const { data, error } = await supabase.rpc("get_child_stars_by_date", {
        child_uuid: selectedChild.id,
        start_date: todayStr,
        end_date: todayStr,
      });

      if (error) {
        console.error("Error fetching daily stars:", error);
        return 0;
      }

      return data?.[0]?.stars || 0;
    },
    enabled: !!selectedChild?.id,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  if (!selectedChild) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white font-bold text-lg">{dailyStars}</span>
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    </div>
  );
}
