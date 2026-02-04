import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericSpominGame } from "@/components/games/GenericSpominGame";
import { SpominConfig } from "@/data/spominConfig";

export default function FreeSpominGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // K letter configuration for free games
  const config: SpominConfig = {
    urlKey: 'k',
    displayLetter: 'K',
    tableName: 'memory_cards_K',
    queryKey: 'memoryCardsK',
  };

  // Handle game completion (when all pairs found)
  const handleGameComplete = () => {
    if (!hasRecordedThisSession) {
      recordGamePlayed();
    }
  };

  if (!canPlay) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericSpominGame 
      config={config}
      backPath="/brezplacne-igre"
    />
  );
}
