import { useParams, Navigate } from 'react-router-dom';
import { GenericMetKockeGame } from '@/components/games/GenericMetKockeGame';
import { getMetKockeConfig } from '@/data/metKockeConfig';

export default function MetKockeRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/met-kocke" replace />;
  }

  const config = getMetKockeConfig(letter);
  
  if (!config) {
    return <Navigate to="/govorne-igre/met-kocke" replace />;
  }

  return (
    <GenericMetKockeGame
      letter={config.letter}
      displayLetter={config.displayLetter}
      title={config.title}
      bitje={config.bitje}
      povedek={config.povedek}
      predmet={config.predmet}
      backPath="/govorne-igre/met-kocke"
    />
  );
}
