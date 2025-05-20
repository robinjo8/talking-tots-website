
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArticulationTestCard = ({ letter, words }: { letter: string, words: string[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-fade-in">
      <h3 className="text-xl font-bold mb-3">ČRKA {letter}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {words.map((word, index) => (
          <div key={index} className="border border-gray-200 rounded p-3 text-center">
            <p className="font-medium">{word}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArtikuacijskiTest = () => {
  const { selectedChildIndex, profile } = useAuth();
  const navigate = useNavigate();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
    
  const articulation_data = [
    { letter: "P", words: ["PIPA", "KAPA", "KLOP"] },
    { letter: "B", words: ["BALON", "RIBA", "ZOB"] },
    { letter: "F", words: ["FANT", "TELEFON", "KROF"] },
    { letter: "V", words: ["VETERNICA", "KRAVA", "LEV"] },
    { letter: "T", words: ["TROBENTA", "AVTO", "LIST"] },
    { letter: "D", words: ["DREVO", "DUDA", "LED"] },
    { letter: "Š", words: ["ŠKARJE", "HRUŠKA", "KOKOŠ"] },
    { letter: "S", words: ["SOVA", "KOST", "PAS"] },
    { letter: "Ž", words: ["ŽABA", "ROŽA", "POLŽ"] },
    { letter: "Z", words: ["ZEBRA", "KOZA", "OBRAZ"] },
    { letter: "Č", words: ["ČEBELA", "OČALA", "KLJUČ"] },
    { letter: "C", words: ["COPATI", "VILICE", "LONEC"] },
    { letter: "K", words: ["KAČA", "ČRKE", "OBLAK"] },
    { letter: "G", words: ["GOBA", "NOGA", "KROG"] },
    { letter: "H", words: ["HIŠA", "MUHA", "KRUH"] },
    { letter: "M", words: ["METLA", "OMARA", "DIM"] },
    { letter: "N", words: ["NOGAVICE", "BANANA", "SLON"] },
    { letter: "L", words: ["LADJA", "KOLO", "ŠAL"] },
    { letter: "R", words: ["ROKA", "URA", "SIR"] },
    { letter: "J", words: ["JABOLKO", "JAJCE", "ZMAJ"] },
  ];

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
        
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">
            {selectedChild ? (
              <>Zbirka besed za testiranje izgovorjave vseh slovenskih soglasnikov.</>
            ) : (
              <>Zbirka besed za testiranje izgovorjave vseh slovenskih soglasnikov.</>
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          {articulation_data.map((item, index) => (
            <ArticulationTestCard 
              key={index} 
              letter={item.letter} 
              words={item.words} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
