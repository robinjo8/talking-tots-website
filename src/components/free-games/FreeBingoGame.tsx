import { useEffect, useMemo } from "react";
import { useFreeGameContext } from "@/contexts/FreeGameContext";
import { FreeLimitReachedDialog } from "@/components/free-games/FreeLimitReachedDialog";
import { GenericBingoGame } from "@/components/games/GenericBingoGame";

// K letter bingo words
const bingoWordsK = [
  { word: "KAČA", image: "kaca1.webp", audio: "kaca.m4a" },
  { word: "KAPA", image: "kapa1.webp", audio: "kapa.m4a" },
  { word: "KAVA", image: "kava1.webp", audio: "kava.m4a" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop1.webp", audio: "klop.m4a" },
  { word: "KNJIGA", image: "knjiga1.webp", audio: "knjiga.m4a" },
  { word: "KOCKA", image: "kocka1.webp", audio: "kocka.m4a" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo1.webp", audio: "kolo.m4a" },
  { word: "KOŠ", image: "kos1.webp", audio: "kos.m4a" },
  { word: "KOST", image: "kost1.webp", audio: "kost.m4a" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a" },
  { word: "KOZA", image: "koza1.webp", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a" },
  { word: "KRAVA", image: "krava1.webp", audio: "krava.m4a" },
  { word: "KROF", image: "krof1.webp", audio: "krof.m4a" },
  { word: "KROG", image: "krog1.webp", audio: "krog.m4a" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "kroznik.m4a" },
  { word: "KRUH", image: "kruh1.webp", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara1.webp", audio: "kumara.m4a" },
  { word: "KUŽA", image: "kuza1.webp", audio: "kuza.m4a" },
  { word: "KORUZA", image: "koruza1.webp", audio: "koruza.m4a" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a" },
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
