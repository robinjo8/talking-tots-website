import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw, Volume2 } from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";

const wordsDataZ = [
  { word: "ZAJEC", image: "zajec.png", audio: "zajec.m4a" },
  { word: "ZASLON", image: "zaslon.png", audio: "zaslon.m4a" },
  { word: "ZAVESE", image: "zavesa.png", audio: "zavesa.m4a" },
  { word: "ZEBRA", image: "zebra.png", audio: "zebra.m4a" },
  { word: "ZLATO", image: "zlato.png", audio: "zlato.m4a" },
  { word: "ZMAJ", image: "zmaj.png", audio: "zmaj.m4a" },
  { word: "ZOB", image: "zob.png", audio: "zob.m4a" },
  { word: "ZOBOTREBEC", image: "zobotrebec.png", audio: "zobotrebec.m4a" },
  { word: "ZVEZDA", image: "zvezda.png", audio: "zvezda.m4a" },
  { word: "ZVOČNIK", image: "zvocnik.png", audio: "zvocnik.m4a" }
];

export default function ArtikulacijaVajeZ() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { playAudio } = useAudioPlayback();
  const isMobile = useIsMobile();

  const currentWord = wordsDataZ[currentIndex];
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentWord.image}`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${currentWord.audio}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio(audioUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex, audioUrl, playAudio]);

  const handleNextWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsDataZ.length);
    setCurrentIndex(randomIndex);
  };

  const handlePlayAudio = () => {
    playAudio(audioUrl);
  };

  const handleBack = () => {
    navigate('/govorno-jezikovne-vaje/artikulacija');
  };

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-3xl md:text-5xl font-bold text-dragon-green">
                {currentWord.word}
              </h2>
            </div>

            <div className="flex justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Button 
                onClick={handleBack}
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
              <Button 
                onClick={() => setShowInstructions(true)}
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="gap-2"
              >
                Navodila
              </Button>
            </div>

            <div className="relative w-full max-w-md mx-auto mb-4 md:mb-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {loading ? (
                  <div className="text-muted-foreground">Nalaganje...</div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={currentWord.word}
                    className="w-full h-full object-contain p-4"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3 md:gap-4">
              <Button 
                onClick={handlePlayAudio}
                className="bg-black hover:bg-black/90 text-white gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Poslušaj besedo
              </Button>
              
              <Button 
                onClick={handleNextWord}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Nova beseda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="articulation"
      />
    </div>
  );
}
