
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, ArrowLeft, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type ArticulationWord = {
  word: string;
  imageAvailable: boolean;
};

type ConsonantGroup = {
  letter: string;
  words: ArticulationWord[];
};

const ArtikuacijskiTest = () => {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  if (!user) {
    navigate("/login");
    return null;
  }

  const consonantGroups: ConsonantGroup[] = [
    {
      letter: "P",
      words: [
        { word: "PIPA", imageAvailable: true },
        { word: "KAPA", imageAvailable: true },
        { word: "KLOP", imageAvailable: true }
      ]
    },
    {
      letter: "B",
      words: [
        { word: "BALON", imageAvailable: true },
        { word: "RIBA", imageAvailable: true },
        { word: "ZOB", imageAvailable: true }
      ]
    },
    {
      letter: "F",
      words: [
        { word: "FANT", imageAvailable: true },
        { word: "TELEFON", imageAvailable: true },
        { word: "KROF", imageAvailable: true }
      ]
    },
    {
      letter: "V",
      words: [
        { word: "VETERNICA", imageAvailable: true },
        { word: "KRAVA", imageAvailable: true },
        { word: "LEV", imageAvailable: true }
      ]
    },
    {
      letter: "T",
      words: [
        { word: "TROBENTA", imageAvailable: false },
        { word: "AVTO", imageAvailable: false },
        { word: "LIST", imageAvailable: false }
      ]
    },
    {
      letter: "D",
      words: [
        { word: "DREVO", imageAvailable: false },
        { word: "DUDA", imageAvailable: false },
        { word: "LED", imageAvailable: false }
      ]
    },
    {
      letter: "Š",
      words: [
        { word: "ŠKARJE", imageAvailable: false },
        { word: "HRUŠKA", imageAvailable: false },
        { word: "KOKOŠ", imageAvailable: false }
      ]
    },
    {
      letter: "S",
      words: [
        { word: "SOVA", imageAvailable: false },
        { word: "KOST", imageAvailable: false },
        { word: "PAS", imageAvailable: false }
      ]
    },
    {
      letter: "Ž",
      words: [
        { word: "ŽABA", imageAvailable: false },
        { word: "ROŽA", imageAvailable: false },
        { word: "POLŽ", imageAvailable: false }
      ]
    },
    {
      letter: "Z",
      words: [
        { word: "ZEBRA", imageAvailable: false },
        { word: "KOZA", imageAvailable: false },
        { word: "OBRAZ", imageAvailable: false }
      ]
    },
    {
      letter: "Č",
      words: [
        { word: "ČEBELA", imageAvailable: false },
        { word: "OČALA", imageAvailable: false },
        { word: "KLJUČ", imageAvailable: false }
      ]
    },
    {
      letter: "C",
      words: [
        { word: "COPATI", imageAvailable: false },
        { word: "VILICE", imageAvailable: false },
        { word: "LONEC", imageAvailable: false }
      ]
    },
    {
      letter: "K",
      words: [
        { word: "KAČA", imageAvailable: false },
        { word: "ČRKE", imageAvailable: false },
        { word: "OBLAK", imageAvailable: false }
      ]
    },
    {
      letter: "G",
      words: [
        { word: "GOBA", imageAvailable: false },
        { word: "NOGA", imageAvailable: false },
        { word: "KROG", imageAvailable: false }
      ]
    },
    {
      letter: "H",
      words: [
        { word: "HIŠA", imageAvailable: false },
        { word: "MUHA", imageAvailable: false },
        { word: "KRUH", imageAvailable: false }
      ]
    },
    {
      letter: "M",
      words: [
        { word: "METLA", imageAvailable: false },
        { word: "OMARA", imageAvailable: false },
        { word: "DIM", imageAvailable: false }
      ]
    },
    {
      letter: "N",
      words: [
        { word: "NOGAVICE", imageAvailable: false },
        { word: "BANANA", imageAvailable: false },
        { word: "SLON", imageAvailable: false }
      ]
    },
    {
      letter: "L",
      words: [
        { word: "LADJA", imageAvailable: false },
        { word: "KOLO", imageAvailable: false },
        { word: "ŠAL", imageAvailable: false }
      ]
    },
    {
      letter: "R",
      words: [
        { word: "ROKA", imageAvailable: false },
        { word: "URA", imageAvailable: false },
        { word: "SIR", imageAvailable: false }
      ]
    },
    {
      letter: "J",
      words: [
        { word: "JABOLKO", imageAvailable: false },
        { word: "JAJCE", imageAvailable: false },
        { word: "ZMAJ", imageAvailable: false }
      ]
    }
  ];

  const toggleSection = (letter: string) => {
    setExpandedSection(expandedSection === letter ? null : letter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/moja-stran")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold">
            Artikulacijski test
            {selectedChild && (
              <span className="text-app-purple ml-2">za {selectedChild.name}</span>
            )}
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Pregled artikulacije slovenskih soglasnikov za prepoznavanje težav z izgovorjavo.
        </p>
        
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10">
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-app-purple" />
              Artikulacijski test
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 divide-y">
            <p className="text-lg mb-6">
              Pregled artikulacije slovenskih soglasnikov za prepoznavanje težav z izgovorjavo.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {consonantGroups.map((group) => (
                <div key={group.letter} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection(group.letter)}
                  >
                    <h3 className="font-bold text-lg">ČRKA {group.letter}</h3>
                    <div className="w-8 h-8 rounded-full bg-app-purple/10 flex items-center justify-center">
                      <span className="font-bold text-app-purple">{group.letter}</span>
                    </div>
                  </div>
                  
                  {expandedSection === group.letter && (
                    <div className="px-4 pb-4 space-y-3">
                      {group.words.map((wordItem) => (
                        <div key={wordItem.word} className="flex flex-col items-center">
                          <span className="font-medium mb-1">{wordItem.word}</span>
                          {wordItem.imageAvailable ? (
                            <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={`${supabase.storage.from('artikulacijski-test').getPublicUrl(`${wordItem.word.toLowerCase()}.png`).data.publicUrl}`}
                                alt={wordItem.word}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                              <MicOff className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
