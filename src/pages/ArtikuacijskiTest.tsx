import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { supabase } from "@/integrations/supabase/client";
import LetterGrid from "@/components/articulation/LetterGrid";
import WordDisplay from "@/components/articulation/WordDisplay";
import TestNavigation from "@/components/articulation/TestNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
      return next < totalWords ? next : 0;
    });
  };
  
  const handlePrevious = () => {
    setOverallIndex((current) => {
      const prev = current - 1;
      return prev >= 0 ? prev : totalWords - 1;
    });
  };
  
  const handlePlayAudio = () => {
    const currentWord = flatWordsList[overallIndex]?.word;
    if (currentWord?.audio) {
      playAudio(currentWord.audio);
    } else {
      console.log("No audio available for this word");
    }
  };

  const getCurrentWord = () => {
    if (currentLetterIndex < articulation_data.length && 
        currentWordIndex < articulation_data[currentLetterIndex].words.length) {
      return articulation_data[currentLetterIndex].words[currentWordIndex].text;
    }
    return "";
  };
  
  // Extract all unique letters for the letter grid
  const allLetters = articulation_data.map(group => group.letter);
  const currentLetter = articulation_data[currentLetterIndex]?.letter || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto pt-24 pb-20 px-4">
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
        
        {/* Letter grid component */}
        <LetterGrid 
          letters={allLetters}
          currentLetter={currentLetter}
        />
        
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left column (empty on mobile, visible on md+) */}
          <div className="hidden md:block md:col-span-1">
            {/* Placeholder for additional content if needed */}
          </div>
          
          {/* Center column - Word and Image */}
          <div className="md:col-span-1">
            <WordDisplay 
              word={getCurrentWord()}
              imageUrl={imageUrl}
              loading={loading}
              currentIndex={overallIndex}
              totalWords={totalWords}
              onPlayAudio={handlePlayAudio}
            />
          </div>
          
          {/* Right column - Navigation */}
          <div className="md:col-span-1 flex justify-center mt-8 md:mt-0">
            <TestNavigation 
              onNext={handleNext} 
              onPrevious={handlePrevious} 
            />
          </div>
        </div>
        
        {/* Mobile navigation - only visible on small screens */}
        {isMobile && (
          <div className="flex justify-between mt-8 px-8">
            <Button 
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 border-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={handleNext}
              variant="outline"
              size="icon" 
              className="rounded-full h-14 w-14 border-2"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
