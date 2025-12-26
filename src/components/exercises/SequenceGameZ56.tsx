import { SequenceGame56Base } from "./SequenceGame56Base";

interface SequenceGameZ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameZ56 = ({ onGameComplete, isLandscape = false }: SequenceGameZ56Props) => {
  return (
    <SequenceGame56Base
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_z"
      queryKey="memory_cards_z"
    />
  );
};
