import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ArtikuacijskiTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const letters = ['r', 's', 'š', 'k'];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleResult = (letter: string, isCorrect: boolean) => {
    setResults(prev => ({ ...prev, [letter]: isCorrect }));
  };

  const startTest = () => {
    setResults({});
    setShowResults(false);
    setIsTestStarted(true);
    setCurrentLetterIndex(0);
  };

  const nextLetter = () => {
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else {
      setIsTestStarted(false);
      setShowResults(true);
    }
  };

  const currentLetter = letters[currentLetterIndex];

  const getResultText = (letter: string) => {
    if (results[letter] === undefined) return "Ni odgovora";
    return results[letter] ? "Pravilno" : "Nepravilno";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Artikulacijski test" backPath="/govorno-jezikovne-vaje" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        {!isTestStarted && !showResults && (
          <div className="text-center">
            <p className="text-muted-foreground mb-8">
              Ta test bo preveril vašo izgovorjavo glasov R, S, Š in K.
            </p>
            <Button onClick={startTest} className="bg-dragon-green hover:bg-dragon-green/90 text-white">
              Začni test
            </Button>
          </div>
        )}

        {isTestStarted && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Izgovorite črko: {currentLetter}</h2>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleResult(currentLetter, true)} className="bg-dragon-green hover:bg-dragon-green/90 text-white">
                Pravilno
              </Button>
              <Button onClick={() => handleResult(currentLetter, false)} className="bg-app-orange hover:bg-app-orange/90 text-white">
                Nepravilno
              </Button>
            </div>
            <Button onClick={nextLetter} className="mt-4 bg-app-blue hover:bg-app-blue/90 text-white">
              Naslednja črka
            </Button>
          </div>
        )}

        {showResults && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rezultati testa:</h2>
            <ul>
              {letters.map(letter => (
                <li key={letter} className="mb-2">
                  Črka {letter}: {getResultText(letter)}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/artikulacija")} className="bg-dragon-green hover:bg-dragon-green/90 text-white">
              Poglej vaje za artikulacijo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
