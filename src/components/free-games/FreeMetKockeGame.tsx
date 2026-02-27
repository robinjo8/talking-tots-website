import { useEffect } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericMetKockeGame } from "@/components/games/GenericMetKockeGame";

// K letter met kocke data
const bitjeK = [
  { word: "kača", image: "kaca1.webp", audio: "Kaca.mp3" },
  { word: "kuža", image: "kuza1.webp", audio: "Kuza.mp3" },
  { word: "koza", image: "koza1.webp", audio: "Koza_zival.mp3" },
  { word: "kokoš", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
  { word: "krava", image: "krava1.webp", audio: "Krava.mp3" },
  { word: "klop", image: "klop1.webp", audio: "Klop.mp3" },
];

const povedekK = [
  { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
  { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
  { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
  { word: "riše", image: "Stickman_risati.webp", audio: "Rise.mp3" },
  { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
  { word: "želi", image: "Stickman_zeleti.png.webp", audio: "Zeli.mp3" },
];

const predmetK = [
  { word: "kocko", image: "kocka1.webp", audio: "Kocko.mp3" },
  { word: "koruzo", image: "koruza1.webp", audio: "Koruzo.mp3" },
  { word: "kost", image: "kost1.webp", audio: "Kost.mp3" },
  { word: "krog", image: "krog1.webp", audio: "Krog.mp3" },
  { word: "knjigo", image: "knjiga1.webp", audio: "Knjigo.mp3" },
  { word: "kumaro", image: "kumara1.webp", audio: "Kumaro.mp3" },
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
