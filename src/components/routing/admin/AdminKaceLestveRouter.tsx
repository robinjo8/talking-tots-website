import { useParams, Navigate } from "react-router-dom";
import { KaceLestveGame } from "@/components/games/KaceLestveGame";
import { getKaceWordList } from "@/data/kaceLestveConfig";
import { getLipsImageForLetter } from "@/utils/lipsImageMap";

const VALID_LETTERS = ["c", "s", "z", "r-zacetek", "sh", "zh", "ch", "k", "l", "r"];

export default function AdminKaceLestveRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();

  if (!letter || !childId || !VALID_LETTERS.includes(letter)) {
    return <Navigate to={`/admin/children/${childId}/games/kace`} replace />;
  }

  return (
    <KaceLestveGame
      backPath={`/admin/children/${childId}/games/kace`}
      logopedistChildId={childId}
      wordList={getKaceWordList(letter)}
      lipsImage={getLipsImageForLetter(letter)}
    />
  );
}
