import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SequenceStorageImage {
  id: string;
  word: string;
  image_url: string;
  audio_url: string | null;
}

// Slike po črkah iz bucket-a "slike"
const LETTER_IMAGES: Record<string, { word: string; filename: string }[]> = {
  C: [
    { word: "Cedilo", filename: "cedilo.png" },
    { word: "Cekin", filename: "cekin.png" },
    { word: "Cerkev", filename: "cerkev.png" },
    { word: "Cesta", filename: "cesta.png" },
    { word: "Cev", filename: "cev.png" },
    { word: "Cirkus", filename: "cirkus.png" },
    { word: "Cisterna", filename: "cisterna.png" },
    { word: "Cokla", filename: "cokla.png" },
    { word: "Copat", filename: "copat.png" },
    { word: "Cvet", filename: "cvet.png" },
  ],
  Č: [
    { word: "Čaj", filename: "caj.png" },
    { word: "Časopis", filename: "casopis.png" },
    { word: "Čebela", filename: "cebela.png" },
    { word: "Čebula", filename: "cebula.png" },
    { word: "Česen", filename: "cesen.png" },
    { word: "Čevlji", filename: "cevlji.png" },
    { word: "Čokolada", filename: "cokolada.png" },
    { word: "Čoln", filename: "coln.png" },
    { word: "Čopič", filename: "copic.png" },
    { word: "Črke", filename: "crke.png" },
  ],
  K: [
    { word: "Kača", filename: "kaca.png" },
    { word: "Kapa", filename: "kapa.png" },
    { word: "Kava", filename: "kava.png" },
    { word: "Klavir", filename: "klavir.png" },
    { word: "Ključ", filename: "kljuc.png" },
    { word: "Klop", filename: "klop.png" },
    { word: "Knjiga", filename: "knjiga.png" },
    { word: "Kocka", filename: "kocka.png" },
    { word: "Kokos", filename: "kokos_sadez.png" },
    { word: "Kokoš", filename: "kokos.png" },
    { word: "Kolač", filename: "kolac.png" },
    { word: "Kolo", filename: "kolo.png" },
    { word: "Koruza", filename: "koruza.png" },
    { word: "Kost", filename: "kost.png" },
    { word: "Koš", filename: "kos.png" },
    { word: "Košara", filename: "kosara.png" },
    { word: "Koza", filename: "koza.png" },
    { word: "Kozarec", filename: "kozarec.png" },
    { word: "Koža", filename: "koza_skin.png" },
    { word: "Krava", filename: "krava.png" },
    { word: "Krof", filename: "krof.png" },
    { word: "Krog", filename: "krog.png" },
    { word: "Krožnik", filename: "kroznik.png" },
    { word: "Kruh", filename: "kruh.png" },
    { word: "Kumara", filename: "kumara.png" },
    { word: "Kuža", filename: "kuza.png" },
  ],
  L: [
    { word: "Ladja", filename: "ladja.png" },
    { word: "Lasje", filename: "lasje.png" },
    { word: "Led", filename: "led.png" },
    { word: "Lešnik", filename: "lesnik.png" },
    { word: "Letalo", filename: "letalo.png" },
    { word: "Lev", filename: "lev.png" },
    { word: "Les", filename: "les.png" },
    { word: "List", filename: "list.png" },
    { word: "Lizika", filename: "lizika.png" },
    { word: "Lonec", filename: "lonec.png" },
    { word: "Lopar", filename: "lopar.png" },
    { word: "Lubenica", filename: "lubenica.png" },
    { word: "Luč", filename: "luc.png" },
    { word: "Luža", filename: "luza.png" },
  ],
  R: [
    { word: "Raca", filename: "raca.png" },
    { word: "Rak", filename: "rak.png" },
    { word: "Raketa", filename: "raketa.png" },
    { word: "Ravnilo", filename: "ravnilo.png" },
    { word: "Rep", filename: "rep.png" },
    { word: "Repa", filename: "repa.png" },
    { word: "Riba", filename: "riba.png" },
    { word: "Ribez", filename: "ribez.png" },
    { word: "Ribič", filename: "ribic.png" },
    { word: "Ris", filename: "ris.png" },
    { word: "Riž", filename: "riz.png" },
    { word: "Robot", filename: "robot.png" },
    { word: "Roka", filename: "roka.png" },
    { word: "Rokometaš", filename: "rokometas.png" },
    { word: "Rolka", filename: "rolka.png" },
    { word: "Ropotuljica", filename: "ropotuljica.png" },
    { word: "Roža", filename: "roza.png" },
  ],
  S: [
    { word: "Sedem", filename: "sedem.png" },
    { word: "Sir", filename: "sir.png" },
    { word: "Sladoled", filename: "sladoled.png" },
    { word: "Slika", filename: "slika.png" },
    { word: "Slon", filename: "slon.png" },
    { word: "Sluz", filename: "sluz.png" },
    { word: "Smreka", filename: "smreka.png" },
    { word: "Sneg", filename: "sneg.png" },
    { word: "Snežak", filename: "snezak.png" },
    { word: "Snežinka", filename: "snezinka.png" },
    { word: "Sok", filename: "sok.png" },
    { word: "Sonce", filename: "sonce.png" },
    { word: "Sova", filename: "sova.png" },
    { word: "Stol", filename: "stol.png" },
    { word: "Svetilka", filename: "svetilka.png" },
    { word: "Svinčnik", filename: "svincnik.png" },
  ],
  Š: [
    { word: "Šah", filename: "sah.png" },
    { word: "Šal", filename: "sal.png" },
    { word: "Ščetka", filename: "scetka.png" },
    { word: "Škarje", filename: "skarje.png" },
    { word: "Škatla", filename: "skatla.png" },
    { word: "Školjka", filename: "skoljka.png" },
    { word: "Šopek", filename: "sopek.png" },
    { word: "Šotor", filename: "sotor.png" },
    { word: "Štampiljka", filename: "stampiljka.png" },
    { word: "Štorklja", filename: "storklja.png" },
  ],
  Z: [
    { word: "Zajec", filename: "zajec.png" },
    { word: "Zaslon", filename: "zaslon.png" },
    { word: "Zavesa", filename: "zavesa.png" },
    { word: "Zebra", filename: "zebra.png" },
    { word: "Zlato", filename: "zlato.png" },
    { word: "Zmaj", filename: "zmaj.png" },
    { word: "Zob", filename: "zob.png" },
    { word: "Zobotrebec", filename: "zobotrebec.png" },
    { word: "Zvezda", filename: "zvezda.png" },
    { word: "Zvezek", filename: "zvezek.png" },
    { word: "Zvočnik", filename: "zvocnik.png" },
  ],
  Ž: [
    { word: "Žaba", filename: "zaba.png" },
    { word: "Žaga", filename: "zaga.png" },
    { word: "Žarnica", filename: "zarnica.png" },
    { word: "Žebelj", filename: "zebelj.png" },
    { word: "Želva", filename: "zelva.png" },
    { word: "Žerjav", filename: "zerjav.png" },
    { word: "Žirafa", filename: "zirafa.png" },
    { word: "Žlica", filename: "zlica.png" },
    { word: "Žoga", filename: "zoga.png" },
    { word: "Žolna", filename: "zolna.png" },
  ],
};

const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";

export const useSequenceGameStorage = (letter: string, count: number = 4) => {
  const allImages = useMemo<SequenceStorageImage[]>(() => {
    const letterImages = LETTER_IMAGES[letter] || [];
    return letterImages.map((img, index) => ({
      id: `${letter}-${img.filename}-${index}`,
      word: img.word,
      image_url: `${SUPABASE_STORAGE_URL}/${img.filename}`,
      audio_url: null,
    }));
  }, [letter]);

  const [targetSequence, setTargetSequence] = useState<SequenceStorageImage[]>([]);
  const [currentSequence, setCurrentSequence] = useState<SequenceStorageImage[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffleUntilDifferent = (target: SequenceStorageImage[], maxAttempts: number = 100): SequenceStorageImage[] => {
    let shuffled = shuffleArray([...target]);
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const hasMatch = shuffled.some((item, index) => item.id === target[index]?.id);
      if (!hasMatch) {
        return shuffled;
      }
      shuffled = shuffleArray([...target]);
      attempts++;
    }
    
    if (shuffled[0]?.id === target[0]?.id && shuffled.length > 1) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    
    return shuffled;
  };

  const initializeGame = useCallback(() => {
    if (allImages.length < count) {
      setIsLoading(false);
      return;
    }

    const shuffled = shuffleArray(allImages);
    const selected = shuffled.slice(0, count);

    setTargetSequence(selected);
    setCurrentSequence(shuffleUntilDifferent(selected));
    setIsComplete(false);
    setIsLoading(false);
  }, [allImages, count]);

  useEffect(() => {
    if (allImages.length >= count) {
      initializeGame();
    } else {
      setIsLoading(false);
    }
  }, [allImages, initializeGame, count]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setCurrentSequence(prev => {
      const newSequence = [...prev];
      const [movedItem] = newSequence.splice(fromIndex, 1);
      newSequence.splice(toIndex, 0, movedItem);
      return newSequence;
    });
  }, []);

  const checkCompletion = useCallback(() => {
    if (targetSequence.length === 0 || currentSequence.length === 0) return false;
    
    const isMatch = targetSequence.every((item, index) => 
      item.id === currentSequence[index]?.id
    );
    
    if (isMatch && !isComplete) {
      setIsComplete(true);
    }
    
    return isMatch;
  }, [targetSequence, currentSequence, isComplete]);

  useEffect(() => {
    checkCompletion();
  }, [currentSequence, checkCompletion]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    allImages,
    targetSequence,
    currentSequence,
    isComplete,
    isLoading,
    moveItem,
    resetGame
  };
};
