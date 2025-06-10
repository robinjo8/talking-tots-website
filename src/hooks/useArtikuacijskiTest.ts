
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArtikuacijskiTestWord {
  id: string;
  letter: string;
  word: string;
  image_path: string;
  order_index: number;
}

export const useArtikuacijskiTest = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [allLetters, setAllLetters] = useState<string[]>([]);
  const [wordsForCurrentLetter, setWordsForCurrentLetter] = useState<ArtikuacijskiTestWord[]>([]);
  
  // Fetch all unique letters on component mount
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const { data, error } = await supabase
          .from('artikulacijski_test')
          .select('letter')
          .order('letter');
        
        if (error) {
          console.error("Error fetching letters:", error);
          return;
        }
        
        const uniqueLetters = [...new Set(data.map(item => item.letter))];
        setAllLetters(uniqueLetters);
      } catch (error) {
        console.error("Error in fetchLetters:", error);
      }
    };
    
    fetchLetters();
  }, []);
  
  // Fetch words for current letter when letter changes
  useEffect(() => {
    const fetchWordsForLetter = async () => {
      if (allLetters.length === 0) return;
      
      const currentLetter = allLetters[currentLetterIndex];
      if (!currentLetter) return;
      
      try {
        const { data, error } = await supabase
          .from('artikulacijski_test')
          .select('*')
          .eq('letter', currentLetter)
          .order('order_index');
        
        if (error) {
          console.error("Error fetching words:", error);
          return;
        }
        
        setWordsForCurrentLetter(data || []);
        setCurrentWordIndex(0); // Reset to first word when letter changes
      } catch (error) {
        console.error("Error in fetchWordsForLetter:", error);
      }
    };
    
    fetchWordsForLetter();
  }, [currentLetterIndex, allLetters]);
  
  // Update image URL when word changes
  useEffect(() => {
    const updateImage = async () => {
      setLoading(true);
      
      if (wordsForCurrentLetter.length === 0) {
        setLoading(false);
        return;
      }
      
      const currentWord = wordsForCurrentLetter[currentWordIndex];
      if (!currentWord) {
        setLoading(false);
        return;
      }
      
      try {
        const { data } = supabase.storage
          .from('artikulacijski-test')
          .getPublicUrl(currentWord.image_path);
          
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
      
      setLoading(false);
    };
    
    updateImage();
  }, [currentWordIndex, wordsForCurrentLetter]);
  
  // Navigate to the next word
  const handleNext = () => {
    if (currentWordIndex < wordsForCurrentLetter.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Move to next letter
      if (currentLetterIndex < allLetters.length - 1) {
        setCurrentLetterIndex(prev => prev + 1);
      } else {
        // Loop back to first letter
        setCurrentLetterIndex(0);
      }
    }
  };
  
  // Navigate to the previous word
  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    } else {
      // Move to previous letter
      if (currentLetterIndex > 0) {
        setCurrentLetterIndex(prev => prev - 1);
        // Will be set to last word of previous letter in useEffect
      } else {
        // Loop to last letter
        setCurrentLetterIndex(allLetters.length - 1);
      }
    }
  };
  
  // Set current letter and navigate to first word of that letter
  const setCurrentLetter = (letter: string) => {
    const letterIndex = allLetters.findIndex(l => l === letter);
    if (letterIndex !== -1) {
      setCurrentLetterIndex(letterIndex);
    }
  };
  
  // Get the current word text
  const getCurrentWord = () => {
    if (wordsForCurrentLetter.length > 0 && currentWordIndex < wordsForCurrentLetter.length) {
      return wordsForCurrentLetter[currentWordIndex].word;
    }
    return "";
  };
  
  const currentLetter = allLetters[currentLetterIndex] || "";
  const totalWords = wordsForCurrentLetter.length;
  const overallProgress = currentWordIndex + 1;

  return {
    imageUrl,
    loading,
    currentLetter,
    allLetters,
    overallIndex: overallProgress - 1,
    totalWords,
    handleNext,
    handlePrevious,
    getCurrentWord,
    setCurrentLetter
  };
};
