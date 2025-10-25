import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentWord = wordsDataC[currentIndex];

  // Load image and audio URLs from Supabase
  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      
      // Get image URL
      const { data: imageData } = supabase.storage
        .from('slike-artikulacija-vaje')
        .getPublicUrl(`C/${currentWord.image}`);
      
      setImageUrl(imageData.publicUrl);

      // Get audio URL
      const { data: audioData } = supabase.storage
        .from('audio-artikulacija-vaje')
        .getPublicUrl(`C/${currentWord.audio}`);
      
      setAudioUrl(audioData.publicUrl);
      setLoading(false);
    };

    loadMedia();
  }, [currentIndex, currentWord.image, currentWord.audio]);

  // Auto-play audio when it's loaded
  useEffect(() => {
    if (audioUrl && audioRef.current && !loading) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        audioRef.current?.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [audioUrl, loading]);

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % wordsDataC.length);
  };

  const handlePlayAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/govorno-jezikovne-vaje/artikulacija')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Nazaj
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-app-blue">
            Črka C - Vaje
          </h1>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Word display card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-dragon-green mb-2">
                {currentWord.word}
              </h2>
              <p className="text-muted-foreground">
                Beseda {currentIndex + 1} / {wordsDataC.length}
              </p>
            </div>

            {/* Image display */}
            <div className="relative w-full max-w-lg mx-auto mb-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {loading ? (
                  <div className="text-muted-foreground">Nalaganje...</div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={currentWord.word}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">Slika ni na voljo</div>
                )}
              </div>
            </div>

            {/* Audio controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={handlePlayAudio}
                disabled={!audioUrl || loading}
                className="gap-2"
              >
                🔊 Poslušaj besedo
              </Button>
              
              <Button
                size="lg"
                onClick={handleNextWord}
                className="gap-2 bg-dragon-green hover:bg-dragon-green/90"
              >
                <RotateCw className="h-5 w-5" />
                Nova beseda
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioUrl || undefined} />
      </div>
    </div>
  );
}
