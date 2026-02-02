import { useParams, Navigate } from 'react-router-dom';
import { GenericMetKockeGame } from '@/components/games/GenericMetKockeGame';
import { getMetKockeConfig } from '@/data/metKockeConfig';

export default function AdminMetKockeRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  
  if (!letter || !childId) {
    return <Navigate to={`/admin/children/${childId}/games/met-kocke`} replace />;
  }

  const config = getMetKockeConfig(letter);
  
  if (!config) {
    console.warn(`AdminMetKockeRouter: No config found for letter "${letter}"`);
    return <Navigate to={`/admin/children/${childId}/games/met-kocke`} replace />;
  }

  const backPath = `/admin/children/${childId}/games/met-kocke`;

  return (
    <GenericMetKockeGame
      letter={config.letter}
      displayLetter={config.displayLetter}
      title={config.title}
      bitje={config.bitje}
      povedek={config.povedek}
      predmet={config.predmet}
      backPath={backPath}
    />
  );
}
