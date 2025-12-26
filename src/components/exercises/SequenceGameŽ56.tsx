import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameŽ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŽ56 = ({ onGameComplete, isLandscape = false }: SequenceGameŽ56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Ž"
      queryKey="memory_cards_Ž"
    />
  );
};
