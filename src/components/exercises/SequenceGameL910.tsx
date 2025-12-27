import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameL910Props {
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

export const SequenceGameL910 = ({ onGameComplete, isLandscape = false }: SequenceGameL910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_l"
      queryKey="memory_cards_l_910"
      config={config910}
    />
  );
};
