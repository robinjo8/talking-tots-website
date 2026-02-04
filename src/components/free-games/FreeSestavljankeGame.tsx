import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericSestavljankaGame } from "@/components/games/GenericSestavljankaGame";
import { kImages } from "@/data/puzzleImages";
import type { SestavljankeGameConfig } from "@/data/sestavljankeGameConfig";

export default function FreeSestavljankeGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording, getAgeGroup } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Get grid size based on age group
  const ageGroup = getAgeGroup();
  const gridByAge: Record<string, { cols: number; rows: number; pieces: number }> = {
    '34': { cols: 3, rows: 3, pieces: 9 },
    '56': { cols: 4, rows: 3, pieces: 12 },
    '78': { cols: 5, rows: 4, pieces: 20 },
    '910': { cols: 6, rows: 5, pieces: 30 }
  };
  
  const grid = gridByAge[ageGroup] || gridByAge['34'];
  const ageGroupMap: Record<string, string> = {
    '34': '3-4',
    '56': '5-6',
    '78': '7-8',
    '910': '9-10'
  };

  // K letter configuration for free games
  const config: SestavljankeGameConfig = {
    letter: 'K',
    urlKey: 'k',
    ageGroup: ageGroup,
    requiredAgeGroup: ageGroupMap[ageGroup] || '3-4',
    gridCols: grid.cols,
    gridRows: grid.rows,
    trackingId: `free_puzzle_k_${grid.pieces}`,
    images: kImages
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
    <GenericSestavljankaGame 
      config={config}
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
