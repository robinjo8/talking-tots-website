import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameZ910Props {
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

export const SequenceGameZ910 = ({ onGameComplete, isLandscape = false }: SequenceGameZ910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_z"
      queryKey="memory_cards_z_910"
      config={config910}
    />
  );
};
