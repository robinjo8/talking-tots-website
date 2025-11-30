import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw, Volume2 } from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";

const wordsDataL = [
  { word: "LADJA", image: "ladja.png", audio: "ladja.m4a" },
  { word: "LED", image: "led.png", audio: "led.m4a" },
  { word: "LETALO", image: "letalo.png", audio: "letalo.m4a" },
  { word: "LEV", image: "lev.png", audio: "lev.m4a" },
  { word: "LIST", image: "list.png", audio: "list.m4a" },
  { word: "LIZIKA", image: "lizika.png", audio: "lizika.m4a" },
  { word: "LONEC", image: "lonec.png", audio: "lonec.m4a" },
  { word: "LOPAR", image: "lopar.png", audio: "lopar.m4a" },
  { word: "LUBENICA", image: "lubenica.png", audio: "lubenica.m4a" },
  { word: "LUČ", image: "luc.png", audio: "luc.m4a" }
];

export default function ArtikulacijaVajeL() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { playAudio } = useAudioPlayback();
  const isMobile = useIsMobile();

  const currentWord = wordsDataL[currentIndex];
  
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentWord.image}`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${currentWord.audio}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio(audioUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex, audioUrl, playAudio]);

  const handleNextWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsDataL.length);
    setCurrentIndex(randomIndex);
  };

  const handlePlayAudio = () => {
    playAudio(audioUrl);
  };

  const handleBack = () => {
    navigate('/govorno-jezikovne-vaje/artikulacija');
  };

  const effectiveFullscreen = isMobile;

  if (effectiveFullscreen) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden select-none"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="h-full flex flex-col p-4">
          <Card className="flex-1 flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-dragon-green">
                  {currentWord.word}
                </h2>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                <Button
                  onClick={handleBack}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Nazaj
                </Button>
                
                <Button
                  onClick={() => setShowInstructions(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  Navodila
                </Button>
              </div>

              <div className="flex-1 flex items-center justify-center mb-4">
                <div className="relative w-full max-w-md">
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
              </div>

              <div className="flex justify-center gap-3">
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

  return (
    <AppLayout>
      <div 
        className="w-full min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-dragon-green">
                {currentWord.word}
              </h2>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <Button 
                onClick={handleBack}
                variant="outline" 
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
              <Button 
                onClick={() => setShowInstructions(true)}
                variant="outline" 
                className="gap-2"
              >
                Navodila
              </Button>
            </div>

            <div className="relative w-full max-w-lg mx-auto mb-6">
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

            <div className="flex justify-center gap-4">
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
    </AppLayout>
  );
}
