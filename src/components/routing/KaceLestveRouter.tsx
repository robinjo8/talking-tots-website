import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";
import { getKaceWordList } from "@/data/kaceLestveConfig";
import { getLipsImageForLetter } from "@/utils/lipsImageMap";

const VALID_LETTERS = ["c", "s", "z", "r-zacetek", "sh", "zh", "ch", "k", "l", "r"];

export default function KaceLestveRouter() {
  const { letter } = useParams<{ letter: string }>();
  const { selectedChild } = useAuth();

  if (!letter || !VALID_LETTERS.includes(letter)) {
    return <Navigate to="/govorne-igre/kace" replace />;
  }

  return (
    <KaceLestveGame
      backPath="/govorne-igre/kace"
      childId={selectedChild?.id}
      wordList={getKaceWordList(letter)}
      lipsImage={getLipsImageForLetter(letter)}
    />
  );
}
