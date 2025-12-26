import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameR78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 10,
  helpAttempts: 1,
  helpDuration: 5
};

export const SequenceGameR78 = ({ onGameComplete, isLandscape = false }: SequenceGameR78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_r"
      queryKey="memory_cards_r_78"
      config={config78}
    />
  );
};
