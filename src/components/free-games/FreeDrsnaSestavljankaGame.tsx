import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericDrsnaSestavljankaGame } from "@/components/games/GenericDrsnaSestavljankaGame";
import { kImages } from "@/data/puzzleImages";
import type { DrsnaSestavljankaGameConfig } from "@/data/drsnaSestavljankaConfig";

export default function FreeDrsnaSestavljankaGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording, getAgeGroup } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Get puzzle type based on age group
  const ageGroup = getAgeGroup();
  const ageGroupSettings: Record<string, { 
    puzzleType: '34' | '78' | '910'; 
    completionImageCount: number;
    requiredAgeGroup: string;
  }> = {
    '34': { puzzleType: '34', completionImageCount: 4, requiredAgeGroup: '3-4' },
    '56': { puzzleType: '34', completionImageCount: 4, requiredAgeGroup: '5-6' },
    '78': { puzzleType: '78', completionImageCount: 5, requiredAgeGroup: '7-8' },
    '910': { puzzleType: '910', completionImageCount: 5, requiredAgeGroup: '9-10' }
  };
  
  const settings = ageGroupSettings[ageGroup] || ageGroupSettings['34'];

  // K letter configuration for free games
  const config: DrsnaSestavljankaGameConfig = {
    letter: 'K',
    urlKey: 'k',
    ageGroup: ageGroup,
    requiredAgeGroup: settings.requiredAgeGroup,
    puzzleType: settings.puzzleType,
    completionImageCount: settings.completionImageCount,
    trackingId: `free_sliding_puzzle_k_${settings.requiredAgeGroup}`,
    images: kImages
  };

  if (!canPlay) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericDrsnaSestavljankaGame 
      config={config}
      backPath="/brezplacne-igre"
    />
  );
}
