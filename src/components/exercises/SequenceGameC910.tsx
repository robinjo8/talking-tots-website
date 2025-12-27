import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameC910Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config910: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 7,  // Reduced from 10 to 7 for 9-10 age group
  helpAttempts: 1,
  helpDuration: 5
};

export const SequenceGameC910 = ({ onGameComplete, isLandscape = false }: SequenceGameC910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_c"
      queryKey="memory_cards_c_910"
      config={config910}
    />
  );
};
