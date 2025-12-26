import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameK56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameK56 = ({ onGameComplete, isLandscape = false }: SequenceGameK56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_K"
      queryKey="memory_cards_K"
    />
  );
};
