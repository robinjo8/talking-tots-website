import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameK910Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config910: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 7,
  helpAttempts: 1,
  helpDuration: 5
};

export const SequenceGameK910 = ({ onGameComplete, isLandscape = false }: SequenceGameK910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_K"
      queryKey="memory_cards_K_910"
      config={config910}
    />
  );
};
