import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameŽ910Props {
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

export const SequenceGameŽ910 = ({ onGameComplete, isLandscape = false }: SequenceGameŽ910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Ž"
      queryKey="memory_cards_Ž_910"
      config={config910}
    />
  );
};
