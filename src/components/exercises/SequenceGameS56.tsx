import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameS56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameS56 = ({ onGameComplete, isLandscape = false }: SequenceGameS56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_S"
      queryKey="memory_cards_S"
    />
  );
};
