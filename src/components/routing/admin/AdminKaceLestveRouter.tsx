import { useParams, Navigate } from "react-router-dom";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";
import { KACE_WORDS_C, KACE_WORDS_R_ZACETEK } from "@/data/kaceLestveConfig";

const VALID_LETTERS = ["c", "s", "z", "r-zacetek"];

export default function AdminKaceLestveRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();

  if (!letter || !childId || !VALID_LETTERS.includes(letter)) {
    return <Navigate to={`/admin/children/${childId}/games/kace`} replace />;
  }

  const wordList = letter === 'r-zacetek' ? KACE_WORDS_R_ZACETEK : KACE_WORDS_C;

  return (
    <KaceLestveGame
      backPath={`/admin/children/${childId}/games/kace`}
      logopedistChildId={childId}
      wordList={wordList}
    />
  );
}
