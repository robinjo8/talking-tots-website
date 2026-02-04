import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericLabirintGame } from "@/components/games/GenericLabirintGame";
import { getLabirintConfig } from "@/data/labirintConfig";

export default function FreeLabirintGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // K letter configuration for free games
  const config = getLabirintConfig('k');

  if (!canPlay || !config) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericLabirintGame 
      config={config}
      backPath="/brezplacne-igre"
    />
  );
}
