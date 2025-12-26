import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameL56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameL56 = ({ onGameComplete, isLandscape = false }: SequenceGameL56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_l"
      queryKey="memory_cards_l"
    />
  );
};
