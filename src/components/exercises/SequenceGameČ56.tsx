import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameČ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameČ56 = ({ onGameComplete, isLandscape = false }: SequenceGameČ56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Č"
      queryKey="memory_cards_Č"
    />
  );
};
