
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { articulationData, Word, LetterGroup } from "@/data/articulationTestData";

interface WordWithIndices {
  word: Word;
  letterIndex: number;
  wordIndex: number;
}

export const useArticulationTest = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [overallIndex, setOverallIndex] = useState(0);
  
  // Calculate total number of words across all letter groups
  const totalWords = articulationData.reduce((count, group) => count + group.words.length, 0);
  
  // Create a flat list of all words with their indices for easier navigation
  const flatWordsList: WordWithIndices[] = articulationData.flatMap((group, letterIndex) => 
    group.words.map((word, wordIndex) => ({
      word,
      letterIndex,
      wordIndex
    }))
  );

  // Update the image URL when the overall index changes
  useEffect(() => {
    if (articulationData.length > 0) {
      updateImage();
    }
  }, [overallIndex]);
  
  // Fetch the image from Supabase storage
  const updateImage = async () => {
    setLoading(true);
    const currentItem = flatWordsList[overallIndex];
    if (currentItem) {
      const { letterIndex, wordIndex } = currentItem;
      setCurrentLetterIndex(letterIndex);
      setCurrentWordIndex(wordIndex);
      
      // Load image from Supabase
      const word = articulationData[letterIndex].words[wordIndex];
      try {
        const { data } = await supabase.storage
          .from('slike')
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
  
  // Navigate to the next word
  const handleNext = () => {
    setOverallIndex((current) => {
      const next = current + 1;
      return next < totalWords ? next : 0;
    });
  };
  
  // Navigate to the previous word
  const handlePrevious = () => {
    setOverallIndex((current) => {
      const prev = current - 1;
      return prev >= 0 ? prev : totalWords - 1;
    });
  };
  
  // Set current letter and navigate to first word of that letter
  const setCurrentLetter = (letter: string) => {
    const letterIndex = articulationData.findIndex(group => group.letter === letter);
    if (letterIndex !== -1) {
      // Calculate the overall index for the first word of this letter
      let newOverallIndex = 0;
      for (let i = 0; i < letterIndex; i++) {
        newOverallIndex += articulationData[i].words.length;
      }
      setOverallIndex(newOverallIndex);
    }
  };
  
  // Get the current word text
  const getCurrentWord = () => {
    if (currentLetterIndex < articulationData.length && 
        currentWordIndex < articulationData[currentLetterIndex].words.length) {
      return articulationData[currentLetterIndex].words[currentWordIndex].text;
    }
    return "";
  };
  
  // Get all unique letters for the letter grid
  const allLetters = articulationData.map(group => group.letter);
  const currentLetter = articulationData[currentLetterIndex]?.letter || "";

  return {
    imageUrl,
    loading,
    currentLetter,
    allLetters,
    overallIndex,
    totalWords,
    handleNext,
    handlePrevious,
    getCurrentWord,
    setCurrentLetter
  };
};
