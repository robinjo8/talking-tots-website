import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw, Volume2 } from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";

const wordsDataC = [
  { word: "CEDILO", image: "cedilo.png", audio: "cedilo.m4a" },
  { word: "CEKIN", image: "cekin.png", audio: "cekin.m4a" },
  { word: "CERKEV", image: "cerkev.png", audio: "cerkev.m4a" },
  { word: "CESTA", image: "cesta.png", audio: "cesta.m4a" },
  { word: "CEV", image: "cev.png", audio: "cev.m4a" },
  { word: "CIRKUS", image: "cirkus.png", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna.png", audio: "cisterna.m4a" },
  { word: "COKLA", image: "cokla.png", audio: "cokla.m4a" },
  { word: "COPAT", image: "copat.png", audio: "copat.m4a" },
  { word: "CVET", image: "cvet.png", audio: "cvet.m4a" }
];

export default function ArtikulacijaVajeC() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { playAudio } = useAudioPlayback();
  const isMobile = useIsMobile();

  const currentWord = wordsDataC[currentIndex];
  
  // Construct URLs for Supabase storage
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentWord.image}`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${currentWord.audio}`;

  // Auto-play audio when word changes
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio(audioUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex, audioUrl, playAudio]);

  const handleNextWord = () => {
    // Select random word
    const randomIndex = Math.floor(Math.random() * wordsDataC.length);
    setCurrentIndex(randomIndex);
  };

  const handlePlayAudio = () => {
    playAudio(audioUrl);
  };

  const handleBack = () => {
    navigate('/govorno-jezikovne-vaje/artikulacija');
  };

  // Mobile gets fullscreen, desktop gets AppLayout
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
              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-dragon-green">
                  {currentWord.word}
                </h2>
              </div>

              {/* Top buttons */}
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

              {/* Image */}
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

              {/* Bottom buttons */}
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
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-dragon-green">
                {currentWord.word}
              </h2>
            </div>

            {/* Top buttons */}
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

            {/* Image */}
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

            {/* Bottom buttons */}
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
