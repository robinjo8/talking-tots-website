import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameL78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameL78 = ({ onGameComplete, isLandscape = false }: SequenceGameL78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_l"
      queryKey="memory_cards_l_78"
      config={config78}
    />
  );
};
