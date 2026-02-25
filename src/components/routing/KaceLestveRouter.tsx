import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";
import { KACE_WORDS_C, KACE_WORDS_R_ZACETEK } from "@/data/kaceLestveConfig";

const VALID_LETTERS = ["c", "s", "z", "r-zacetek"];

export default function KaceLestveRouter() {
  const { letter } = useParams<{ letter: string }>();
  const { selectedChild } = useAuth();

  if (!letter || !VALID_LETTERS.includes(letter)) {
    return <Navigate to="/govorne-igre/kace" replace />;
  }

  const wordList = letter === 'r-zacetek' ? KACE_WORDS_R_ZACETEK : KACE_WORDS_C;

  return (
    <KaceLestveGame
      backPath="/govorne-igre/kace"
      childId={selectedChild?.id}
      wordList={wordList}
    />
  );
}
