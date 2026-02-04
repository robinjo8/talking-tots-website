import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericZaporedjaGame } from "@/components/games/GenericZaporedjaGame";
import type { ZaporedjaGameConfig } from "@/data/zaporedjaConfig";

export default function FreeZaporedjaGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording, getAgeGroup } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Get game type based on age group
  const ageGroup = getAgeGroup();
  const ageGroupMap: Record<string, string> = {
    '34': '3-4',
    '56': '5-6',
    '78': '7-8',
    '910': '9-10'
  };

  // K letter configuration for free games
  const config: ZaporedjaGameConfig = {
    letter: 'K',
    urlKey: 'k',
    ageGroup: ageGroup,
    requiredAgeGroup: ageGroupMap[ageGroup] || '3-4',
    tableName: 'memory_cards_K',
    queryKey: `memory_cards_K_${ageGroup}`,
    trackingId: `free_sequence_k_${ageGroupMap[ageGroup] || '3-4'}`,
    gameType: ageGroup as '34' | '56' | '78' | '910'
  };

  // Handle game completion
  const handleGameComplete = () => {
    if (!hasRecordedThisSession) {
      recordGamePlayed();
    }
  };

  if (!canPlay) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericZaporedjaGame 
      config={config}
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
