import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { PonoviPovedGame } from "@/components/games/PonoviPovedGame";
import { ponoviPovedK } from "@/data/ponoviPovedConfig";

export default function FreePonoviPovedGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

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
    <PonoviPovedGame 
      config={ponoviPovedK}
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
