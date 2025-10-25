import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw, Volume2 } from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";

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
    setCurrentIndex((prev) => (prev + 1) % wordsDataC.length);
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
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Artikulacija - Črka C</h2>
            <div className="flex justify-center gap-3">
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
                onClick={handleNextWord}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Nova beseda
              </Button>
              
              <Button
                onClick={handlePlayAudio}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Zvok
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-auto p-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-bold text-dragon-green mb-2">
                    {currentWord.word}
                  </h2>
                  <p className="text-muted-foreground">
                    Beseda {currentIndex + 1} / {wordsDataC.length}
                  </p>
                </div>

                <div className="relative w-full max-w-lg mx-auto">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <Button 
            onClick={handleBack}
            variant="outline" 
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <Button 
            onClick={handleNextWord}
            className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Nova beseda
          </Button>
          
          <Button 
            onClick={handlePlayAudio}
            variant="outline" 
            className="gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Poslušaj besedo
          </Button>
        </div>
        
        <div className="w-full flex justify-center items-center p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-dragon-green mb-2">
                  {currentWord.word}
                </h2>
                <p className="text-muted-foreground">
                  Beseda {currentIndex + 1} / {wordsDataC.length}
                </p>
              </div>

              <div className="relative w-full max-w-lg mx-auto">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
