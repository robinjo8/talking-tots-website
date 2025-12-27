import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameR910Props {
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

export const SequenceGameR910 = ({ onGameComplete, isLandscape = false }: SequenceGameR910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_r"
      queryKey="memory_cards_r_910"
      config={config910}
    />
  );
};
