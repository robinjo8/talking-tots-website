import { useParams, Navigate } from "react-router-dom";
import { getBingoConfig, type BingoWordData } from "@/data/artikulacijaVajeConfig";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";

export default function AdminBingoRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/bingo`} replace />;
  }

  const config = getBingoConfig(letter);
  
  if (!config) {
    console.warn(`AdminBingoRouter: No config found for letter "${letter}"`);
    return <Navigate to={`/admin/children/${childId}/games/bingo`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/bingo`;

  return (
    <AdminGameWrapper 
      showBackButton={false}
      backPath={backPath}
    >
      <GenericBingoGame
        letter={config.letter}
        displayLetter={config.displayLetter}
        title={config.title}
        wordsData={config.wordsData as BingoWordData[]}
        exerciseId={config.exerciseId || `bingo-${letter}`}
        backPath={backPath}
      />
    </AdminGameWrapper>
  );
}
