
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Word {
  text: string;
  image: string;
  audio?: string;
}

interface LetterGroup {
  letter: string;
  words: Word[];
}

const ArtikuacijskiTest = () => {
  const { selectedChildIndex, profile } = useAuth();
  const navigate = useNavigate();
  const { playAudio } = useAudioPlayback();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  // State for tracking which word is currently selected
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Comprehensive test data with all necessary information
  const articulation_data: LetterGroup[] = [
    { 
      letter: "P", 
      words: [
        { text: "PIPA", image: "pipa.png" },
        { text: "KAPA", image: "kapa.png" },
        { text: "KLOP", image: "klop.png" },
      ] 
    },
    { 
      letter: "B", 
      words: [
        { text: "BALON", image: "balon.png" },
        { text: "RIBA", image: "riba.png" },
        { text: "ZOB", image: "zob.png" },
      ] 
    },
    { 
      letter: "F", 
      words: [
        { text: "FANT", image: "fant.png" },
        { text: "TELEFON", image: "telefon.png" },
        { text: "KROF", image: "krof.png" },
      ] 
    },
    { 
      letter: "V", 
      words: [
        { text: "VETERNICA", image: "veternica.png" },
        { text: "KRAVA", image: "krava.png" },
        { text: "LEV", image: "lev.png" },
      ] 
    },
    { 
      letter: "T", 
      words: [
        { text: "TROBENTA", image: "trobenta.png" },
        { text: "AVTO", image: "avto.png" },
        { text: "LIST", image: "list.png" },
      ] 
    },
    { 
      letter: "D", 
      words: [
        { text: "DREVO", image: "drevo.png" },
        { text: "DUDA", image: "duda.png" },
        { text: "LED", image: "led.png" },
      ] 
    },
    { letter: "Š", words: [
        { text: "ŠKARJE", image: "skarje.png" }, 
        { text: "HRUŠKA", image: "hruska.png" }, 
        { text: "KOKOŠ", image: "kokos.png" }
      ] 
    },
    { letter: "S", words: [
        { text: "SOVA", image: "sova.png" }, 
        { text: "KOST", image: "kost.png" }, 
        { text: "PAS", image: "pas.png" }
      ] 
    },
    { letter: "Ž", words: [
        { text: "ŽABA", image: "zaba.png" }, 
        { text: "ROŽA", image: "roza.png" }, 
        { text: "POLŽ", image: "polz.png" }
      ] 
    },
    { letter: "Z", words: [
        { text: "ZEBRA", image: "zebra.png" }, 
        { text: "KOZA", image: "koza.png" }, 
        { text: "OBRAZ", image: "obraz.png" }
      ] 
    },
    { letter: "Č", words: [
        { text: "ČEBELA", image: "cebela.png" }, 
        { text: "OČALA", image: "ocala.png" }, 
        { text: "KLJUČ", image: "kljuc.png" }
      ] 
    },
    { letter: "C", words: [
        { text: "COPATI", image: "copati.png" }, 
        { text: "VILICE", image: "vilice.png" }, 
        { text: "LONEC", image: "lonec.png" }
      ] 
    },
    { letter: "K", words: [
        { text: "KAČA", image: "kaca.png" }, 
        { text: "ČRKE", image: "crke.png" }, 
        { text: "OBLAK", image: "oblak.png" }
      ] 
    },
    { letter: "G", words: [
        { text: "GOBA", image: "goba.png" }, 
        { text: "NOGA", image: "noga.png" }, 
        { text: "KROG", image: "krog.png" }
      ] 
    },
    { letter: "H", words: [
        { text: "HIŠA", image: "hisa.png" }, 
        { text: "MUHA", image: "muha.png" }, 
        { text: "KRUH", image: "kruh.png" }
      ] 
    },
    { letter: "M", words: [
        { text: "METLA", image: "metla.png" }, 
        { text: "OMARA", image: "omara.png" }, 
        { text: "DIM", image: "dim.png" }
      ] 
    },
    { letter: "N", words: [
        { text: "NOGAVICE", image: "nogavice.png" }, 
        { text: "BANANA", image: "banana.png" }, 
        { text: "SLON", image: "slon.png" }
      ] 
    },
    { letter: "L", words: [
        { text: "LADJA", image: "ladja.png" }, 
        { text: "KOLO", image: "kolo.png" }, 
        { text: "ŠAL", image: "sal.png" }
      ] 
    },
    { letter: "R", words: [
        { text: "ROKA", image: "roka.png" }, 
        { text: "URA", image: "ura.png" }, 
        { text: "SIR", image: "sir.png" }
      ] 
    },
    { letter: "J", words: [
        { text: "JABOLKO", image: "jabolko.png" }, 
        { text: "JAJCE", image: "jajce.png" }, 
        { text: "ZMAJ", image: "zmaj.png" }
      ] 
    },
  ];
  
  const totalWords = articulation_data.reduce((count, group) => count + group.words.length, 0);
  const flatWordsList = articulation_data.flatMap((group, letterIndex) => 
    group.words.map((word, wordIndex) => ({
      word,
      letterIndex,
      wordIndex
    }))
  );
  
  // Calculate overall progress index
  const [overallIndex, setOverallIndex] = useState(0);
  
  useEffect(() => {
    if (articulation_data.length > 0) {
      updateImage();
    }
  }, [overallIndex]);
  
  const updateImage = async () => {
    setLoading(true);
    const currentItem = flatWordsList[overallIndex];
    if (currentItem) {
      const { letterIndex, wordIndex } = currentItem;
      setCurrentLetterIndex(letterIndex);
      setCurrentWordIndex(wordIndex);
      
      // Load image from Supabase
      const word = articulation_data[letterIndex].words[wordIndex];
      try {
        // Fix: The getPublicUrl method returns an object with a data property that contains the publicUrl
        // It doesn't return an error property
        const { data } = await supabase.storage
          .from('artikulacijski-test')
          .getPublicUrl(word.image);
          
        if (data) {
          setImageUrl(data.publicUrl);
        } else {
          console.error("No data returned when fetching image URL");
          setImageUrl(null);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageUrl(null);
      }
    }
    setLoading(false);
  };
  
  const handleNext = () => {
    setOverallIndex((current) => {
      const next = current + 1;
      return next < totalWords ? next : 0; // Loop back to start when reaching the end
    });
  };
  
  const handlePrevious = () => {
    setOverallIndex((current) => {
      const prev = current - 1;
      return prev >= 0 ? prev : totalWords - 1; // Loop to end when at start
    });
  };
  
  const handlePlayAudio = () => {
    const currentWord = flatWordsList[overallIndex]?.word;
    if (currentWord?.audio) {
      playAudio(currentWord.audio);
    } else {
      console.log("No audio available for this word");
      // In a real implementation, you might want to synthesize speech here
    }
  };

  const getCurrentWord = () => {
    if (currentLetterIndex < articulation_data.length && 
        currentWordIndex < articulation_data[currentLetterIndex].words.length) {
      return articulation_data[currentLetterIndex].words[currentWordIndex].text;
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/moja-stran')}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Nazaj
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">
            Artikulacijski test
          </h1>
        </div>
        
        {/* Letter selection bar */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            {articulation_data.map((item, index) => (
              <button
                key={index}
                className={cn(
                  "py-2 px-4 rounded-lg text-lg font-semibold transition-colors",
                  index === currentLetterIndex 
                    ? "bg-app-purple text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                ČRKA {item.letter}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left column (empty on mobile, visible on md+) */}
          <div className="hidden md:block">
            {/* Placeholder for additional content if needed */}
          </div>
          
          {/* Center column - Word and Image */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-app-purple mb-2">
                {getCurrentWord()}
              </h2>
              <p className="text-muted-foreground">
                Beseda {overallIndex + 1} od {totalWords}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 w-full aspect-square flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={getCurrentWord()} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-muted-foreground">Ni slike</div>
              )}
            </div>
            
            <Button 
              onClick={handlePlayAudio}
              className="bg-app-teal hover:bg-app-teal/90 mt-2"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Izgovori besedo
            </Button>
          </div>
          
          {/* Right column - Navigation */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
              <Button 
                onClick={handleNext}
                size="lg"
                className="bg-app-blue hover:bg-app-blue/90 rounded-full h-16 w-16 p-0"
              >
                <ArrowRight className="h-8 w-8" />
              </Button>
              <p className="text-sm text-muted-foreground">Naslednja beseda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
