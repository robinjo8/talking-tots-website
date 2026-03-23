import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlbumSticker, ChildSticker, ChildAlbumStats, DisplaySticker, StickerWorld, WORLDS_ORDER } from "./albumTypes";

export function useAlbumData() {
  const { selectedChild } = useAuth();

  const { data: allStickers, isLoading: stickersLoading } = useQuery({
    queryKey: ["albumStickers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("album_stickers")
        .select("*")
        .order("world")
        .order("sort_order");
      if (error) throw error;
      return data as AlbumSticker[];
    },
    staleTime: 60000 * 10,
  });

  const { data: ownedStickers, isLoading: ownedLoading } = useQuery({
    queryKey: ["childStickers", selectedChild?.id],
    queryFn: async () => {
      if (!selectedChild?.id) return [];
      const { data, error } = await supabase
        .from("child_stickers")
        .select("*")
        .eq("child_id", selectedChild.id);
      if (error) throw error;
      return data as ChildSticker[];
    },
    enabled: !!selectedChild?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ["childAlbumStats", selectedChild?.id],
    queryFn: async () => {
      if (!selectedChild?.id) return null;
      const { data, error } = await supabase
        .from("child_album_stats")
        .select("*")
        .eq("child_id", selectedChild.id)
        .maybeSingle();
      if (error) throw error;
      return data as ChildAlbumStats | null;
    },
    enabled: !!selectedChild?.id,
  });

  // Build display stickers by world
  const stickersByWorld: Record<StickerWorld, DisplaySticker[]> = {} as any;
  const ownedMap = new Map((ownedStickers || []).map(s => [s.sticker_id, s]));

  for (const world of WORLDS_ORDER) {
    const worldStickers = (allStickers || []).filter(s => s.world === world);
    stickersByWorld[world] = worldStickers.map(sticker => {
      const owned = ownedMap.get(sticker.id);
      if (owned) {
        return {
          ...sticker,
          owned: true as const,
          earned_at: owned.earned_at,
          earned_reason: owned.earned_reason,
          is_golden_version: owned.is_golden_version,
        };
      }
      return { ...sticker, owned: false as const };
    });
  }

  return {
    stickersByWorld,
    stats,
    totalStickers: allStickers?.length || 0,
    ownedCount: ownedStickers?.length || 0,
    isLoading: stickersLoading || ownedLoading,
  };
}
