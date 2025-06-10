
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TestWord {
  id: string;
  letter: string;
  word: string;
  image_path: string;
  order_index: number;
}

export const useArtikuacijskiTestSupabase = () => {
  const [currentLetter, setCurrentLetter] = useState('P');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsForCurrentLetter, setWordsForCurrentLetter] = useState<TestWord[]>([]);
  const [allLetters, setAllLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load all unique letters on mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        const { data, error } = await supabase
          .from('artikulacijski_test')
          .select('letter')
          .order('letter');

        if (error) throw error;

        const uniqueLetters = [...new Set(data.map(item => item.letter))];
        setAllLetters(uniqueLetters);
      } catch (error) {
        console.error('Error loading letters:', error);
      }
    };

    loadLetters();
  }, []);

  // Load words for current letter
  useEffect(() => {
    const loadWordsForLetter = async () => {
      if (!currentLetter) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artikulacijski_test')
          .select('*')
          .eq('letter', currentLetter)
          .order('order_index');

        if (error) throw error;

        setWordsForCurrentLetter(data || []);
        setCurrentWordIndex(0); // Reset to first word when letter changes
      } catch (error) {
        console.error('Error loading words for letter:', error);
        setWordsForCurrentLetter([]);
      } finally {
        setLoading(false);
      }
    };

    loadWordsForLetter();
  }, [currentLetter]);

  // Update image URL when current word changes
  useEffect(() => {
    const updateImageUrl = async () => {
      if (wordsForCurrentLetter.length === 0) {
        setImageUrl(null);
        return;
      }

      const currentWord = wordsForCurrentLetter[currentWordIndex];
      if (!currentWord) {
        setImageUrl(null);
        return;
      }

      try {
        const { data } = await supabase.storage
          .from('artikulacijski-test')
          .getPublicUrl(currentWord.image_path);

        setImageUrl(data.publicUrl);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl(null);
      }
    };

    updateImageUrl();
  }, [wordsForCurrentLetter, currentWordIndex]);

  const handleNext = () => {
    if (wordsForCurrentLetter.length === 0) return;
    
    setCurrentWordIndex(prev => {
      const nextIndex = prev + 1;
      return nextIndex < wordsForCurrentLetter.length ? nextIndex : 0;
    });
  };

  const handlePrevious = () => {
    if (wordsForCurrentLetter.length === 0) return;
    
    setCurrentWordIndex(prev => {
      const prevIndex = prev - 1;
      return prevIndex >= 0 ? prevIndex : wordsForCurrentLetter.length - 1;
    });
  };

  const getCurrentWord = () => {
    if (wordsForCurrentLetter.length === 0 || !wordsForCurrentLetter[currentWordIndex]) {
      return "";
    }
    return wordsForCurrentLetter[currentWordIndex].word;
  };

  const getCurrentWordInfo = () => {
    return {
      word: getCurrentWord(),
      index: currentWordIndex + 1,
      total: wordsForCurrentLetter.length
    };
  };

  return {
    currentLetter,
    setCurrentLetter,
    allLetters,
    loading,
    imageUrl,
    handleNext,
    handlePrevious,
    getCurrentWord,
    getCurrentWordInfo
  };
};
