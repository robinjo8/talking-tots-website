import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericIgraUjemanjaGame } from "@/components/games/GenericIgraUjemanjaGame";
import type { IgraUjemanjaGameConfig } from "@/data/igraUjemanjaConfig";

export default function FreeIgraUjemanjaGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording, getAgeGroup } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Get game type based on age group
  const ageGroup = getAgeGroup();
  const ageGroupSettings: Record<string, { 
    gameType: 'matching' | 'threeColumn' | 'fourColumn';
    numColumns: number;
    numItems: number;
    requiredAgeGroup: string;
  }> = {
    '34': { gameType: 'matching', numColumns: 2, numItems: 4, requiredAgeGroup: '3-4' },
    '56': { gameType: 'threeColumn', numColumns: 3, numItems: 3, requiredAgeGroup: '5-6' },
    '78': { gameType: 'threeColumn', numColumns: 3, numItems: 3, requiredAgeGroup: '7-8' },
    '910': { gameType: 'fourColumn', numColumns: 4, numItems: 4, requiredAgeGroup: '9-10' }
  };
  
  const settings = ageGroupSettings[ageGroup] || ageGroupSettings['34'];

  // K letter configuration for free games
  const config: IgraUjemanjaGameConfig = {
    letter: 'K',
    urlKey: 'k',
    ageGroup: ageGroup,
    requiredAgeGroup: settings.requiredAgeGroup,
    gameType: settings.gameType,
    numColumns: settings.numColumns,
    numItems: settings.numItems,
    trackingId: `free_matching_k_${settings.requiredAgeGroup}`
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
    <GenericIgraUjemanjaGame 
      config={config}
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
