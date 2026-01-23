
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fonetični vrstni red glasov za artikulacijski test
const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'];

interface TestWord {
  id: string;
  word: string;
  image_path: string;
  order_index: number;
}

export const useArtikuacijskiTest = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [overallIndex, setOverallIndex] = useState(0);
  const [allLettersData, setAllLettersData] = useState<{ letter: string; words: TestWord[] }[]>([]);
  
  // Fetch all test data organized by letter
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const { data, error } = await supabase
          .from('artikulacijski_test')
          .select('*')
          .order('letter')
          .order('order_index');

        if (error) {
          console.error("Error fetching test data:", error);
          return;
        }

        console.log("Fetched artikulacijski_test data:", data);

        // Group data by letter
        const groupedData: { letter: string; words: TestWord[] }[] = [];
        const letterMap = new Map<string, TestWord[]>();

        data?.forEach((item) => {
          if (!letterMap.has(item.letter)) {
            letterMap.set(item.letter, []);
          }
          letterMap.get(item.letter)?.push({
            id: item.id,
            word: item.word,
            image_path: item.image_path,
            order_index: item.order_index || 0
          });
        });

        // Convert map to array and sort
        letterMap.forEach((words, letter) => {
          groupedData.push({
            letter,
            words: words.sort((a, b) => a.order_index - b.order_index)
          });
        });

        // Sort by phonetic order instead of alphabetically
        const sortedData = groupedData.sort((a, b) => {
          const indexA = PHONETIC_ORDER.indexOf(a.letter.toUpperCase());
          const indexB = PHONETIC_ORDER.indexOf(b.letter.toUpperCase());
          // If letter not found in order, put it at the end
          const orderA = indexA === -1 ? 999 : indexA;
          const orderB = indexB === -1 ? 999 : indexB;
          return orderA - orderB;
        });

        setAllLettersData(sortedData);
      } catch (error) {
        console.error("Error in fetchTestData:", error);
      }
    };

    fetchTestData();
  }, []);

  // Calculate total number of words across all letters
  const totalWords = allLettersData.reduce((count, group) => count + group.words.length, 0);
  
  // Create a flat list of all words with their indices for easier navigation
  const flatWordsList = allLettersData.flatMap((group, letterIndex) => 
    group.words.map((word, wordIndex) => ({
      word,
      letterIndex,
      wordIndex
    }))
  );

  // Update the image URL when the overall index changes
  useEffect(() => {
    if (allLettersData.length > 0 && flatWordsList.length > 0) {
      updateImage();
    }
  }, [overallIndex, allLettersData]);
  
  // Fetch the image from Supabase storage
  const updateImage = async () => {
    setLoading(true);
    setImageError(null);
    const currentItem = flatWordsList[overallIndex];
    if (currentItem) {
      const { letterIndex, wordIndex } = currentItem;
      setCurrentLetterIndex(letterIndex);
      setCurrentWordIndex(wordIndex);
      
      // Load image from Supabase storage
      const word = allLettersData[letterIndex].words[wordIndex];
      console.log("Loading image for word:", word.word);
      
      try {
        // Create filename based on word name - try different extensions
        const wordName = word.word.toLowerCase();
        const possibleExtensions = ['png', 'jpg', 'jpeg', 'webp'];
        
        let imageFound = false;
        
        for (const ext of possibleExtensions) {
          const filename = `${wordName}.${ext}`;
          console.log("Trying filename:", filename);
          
          // Get the public URL for the image
          const { data } = supabase.storage
            .from('artikulacijski-test')
            .getPublicUrl(filename);
            
          if (data?.publicUrl) {
            // Test if the image actually exists by trying to load it
            const img = new Image();
            img.onload = () => {
              console.log("Successfully loaded image:", data.publicUrl);
              setImageUrl(data.publicUrl);
              setImageError(null);
              setLoading(false);
              imageFound = true;
            };
            img.onerror = () => {
              console.log("Image not found with extension:", ext);
              // Continue to next extension
            };
            
            // Try to load the image
            img.src = data.publicUrl;
            
            // Wait a bit to see if the image loads
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (imageFound) break;
          }
        }
        
        // If no image was found with any extension
        if (!imageFound) {
          console.error("No image found for word:", word.word);
          setImageError(`Image not found for word: ${word.word}`);
          setImageUrl(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageError("Error loading image");
        setImageUrl(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
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
    const letterIndex = allLettersData.findIndex(group => group.letter === letter);
    if (letterIndex !== -1) {
      // Calculate the overall index for the first word of this letter
      let newOverallIndex = 0;
      for (let i = 0; i < letterIndex; i++) {
        newOverallIndex += allLettersData[i].words.length;
      }
      setOverallIndex(newOverallIndex);
    }
  };
  
  // Get the current word text
  const getCurrentWord = () => {
    if (currentLetterIndex < allLettersData.length && 
        currentWordIndex < allLettersData[currentLetterIndex].words.length) {
      return allLettersData[currentLetterIndex].words[currentWordIndex].word;
    }
    return "";
  };
  
  // Get all unique letters for the letter grid
  const allLetters = allLettersData.map(group => group.letter);
  const currentLetter = allLettersData[currentLetterIndex]?.letter || "";

  return {
    imageUrl,
    loading,
    imageError,
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
