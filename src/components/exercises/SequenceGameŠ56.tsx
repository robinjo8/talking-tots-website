import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameŠ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŠ56 = ({ onGameComplete, isLandscape = false }: SequenceGameŠ56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Š_duplicate"
      queryKey="memory_cards_Š"
    />
  );
};
