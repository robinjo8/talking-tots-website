import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameŽ78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameŽ78 = ({ onGameComplete, isLandscape = false }: SequenceGameŽ78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Ž"
      queryKey="memory_cards_Ž_78"
      config={config78}
    />
  );
};
