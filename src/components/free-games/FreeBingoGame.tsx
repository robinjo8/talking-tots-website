import { useEffect, useMemo } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";

// K letter bingo words
const bingoWordsK = [
  { word: "KAČA", image: "kaca1.webp", audio: "Kaca.mp3" },
  { word: "KAPA", image: "kapa1.webp", audio: "Kapa.mp3" },
  { word: "KAVA", image: "kava1.webp", audio: "Kava.mp3" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3" },
  { word: "KLOP", image: "klop1.webp", audio: "Klop.mp3" },
  { word: "KNJIGA", image: "knjiga1.webp", audio: "Knjiga.mp3" },
  { word: "KOCKA", image: "kocka1.webp", audio: "Kocka.mp3" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3" },
  { word: "KOLO", image: "kolo1.webp", audio: "Kolo.mp3" },
  { word: "KOŠ", image: "kos1.webp", audio: "Kos_predmet.mp3" },
  { word: "KOST", image: "kost1.webp", audio: "Kost.mp3" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "Kosara.mp3" },
  { word: "KOZA", image: "koza1.webp", audio: "Koza_zival.mp3" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3" },
  { word: "KRAVA", image: "krava1.webp", audio: "Krava.mp3" },
  { word: "KROF", image: "krof1.webp", audio: "Krof.mp3" },
  { word: "KROG", image: "krog1.webp", audio: "Krog.mp3" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "Kroznik.mp3" },
  { word: "KRUH", image: "kruh1.webp", audio: "Kruh.mp3" },
  { word: "KUMARA", image: "kumara1.webp", audio: "Kumara.mp3" },
  { word: "KUŽA", image: "kuza1.webp", audio: "Kuza.mp3" },
  { word: "KORUZA", image: "koruza1.webp", audio: "Koruza.mp3" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
];

export default function FreeBingoGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();

  // Reset session recording when component mounts
  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Shuffle and select 25 words for bingo
  const wordsData = useMemo(() => {
    const shuffled = [...bingoWordsK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25);
  }, []);

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
    <GenericBingoGame 
      letter="k"
      displayLetter="K"
      title="BINGO - K"
      wordsData={wordsData}
      exerciseId="free-bingo-k"
      backPath="/brezplacne-igre"
      onGameComplete={handleGameComplete}
    />
  );
}
