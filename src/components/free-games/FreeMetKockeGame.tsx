import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericMetKockeGame } from "@/components/games/GenericMetKockeGame";

// K letter met kocke data
const bitjeK = [
  { word: "kača", image: "kaca1.webp", audio: "kaca.m4a" },
  { word: "kuža", image: "kuza1.webp", audio: "kuza.m4a" },
  { word: "koza", image: "koza1.webp", audio: "koza.m4a" },
  { word: "kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "krava", image: "krava1.webp", audio: "krava.m4a" },
  { word: "klop", image: "klop1.webp", audio: "klop.m4a" },
];

const povedekK = [
  { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
  { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
  { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
  { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
  { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
  { word: "želi", image: "Stickman_zeleti.png.webp", audio: "zeli.m4a" },
];

const predmetK = [
  { word: "kocko", image: "kocka1.webp", audio: "kocko.m4a" },
  { word: "koruzo", image: "koruza1.webp", audio: "koruzo.m4a" },
  { word: "kost", image: "kost1.webp", audio: "kost.m4a" },
  { word: "krog", image: "krog1.webp", audio: "krog.m4a" },
  { word: "knjigo", image: "knjiga1.webp", audio: "knjigo.m4a" },
  { word: "kumaro", image: "kumara1.webp", audio: "kumaro.m4a" },
];

export default function FreeMetKockeGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Handle game completion
  const handleGameComplete = () => {
    if (!hasRecordedThisSession) {
      recordGamePlayed();
    }
  };

  if (!canPlay) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericMetKockeGame 
      letter="k"
      displayLetter="K"
      title="SMEŠNE POVEDI - K"
      bitje={bitjeK}
      povedek={povedekK}
      predmet={predmetK}
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
