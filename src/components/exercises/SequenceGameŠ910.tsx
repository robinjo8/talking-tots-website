import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameŠ910Props {
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

export const SequenceGameŠ910 = ({ onGameComplete, isLandscape = false }: SequenceGameŠ910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Š_duplicate"
      queryKey="memory_cards_Š_910"
      config={config910}
    />
  );
};
