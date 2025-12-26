import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameZ78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameZ78 = ({ onGameComplete, isLandscape = false }: SequenceGameZ78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_z"
      queryKey="memory_cards_z_78"
      config={config78}
    />
  );
};
