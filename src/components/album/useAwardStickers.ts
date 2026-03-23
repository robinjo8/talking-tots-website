import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { AlbumSticker } from "./albumTypes";

interface AwardResult {
  awarded: AlbumSticker[];
  message?: string;
}

export function useAwardStickers() {
  const { selectedChild } = useAuth();
  const queryClient = useQueryClient();

  const awardStickers = useCallback(async (
    count: number,
    reason: string,
    includeGolden: boolean = false
  ): Promise<AwardResult | null> => {
    if (!selectedChild?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('award-stickers', {
        body: {
          child_id: selectedChild.id,
          count,
          reason,
          include_golden: includeGolden,
        },
      });

      if (error) throw error;

      // Invalidate album queries
      queryClient.invalidateQueries({ queryKey: ["childStickers", selectedChild.id] });
      queryClient.invalidateQueries({ queryKey: ["childAlbumStats", selectedChild.id] });

      return data as AwardResult;
    } catch (err) {
      console.error('Error awarding stickers:', err);
      return null;
    }
  }, [selectedChild?.id, queryClient]);

  return { awardStickers };
}
