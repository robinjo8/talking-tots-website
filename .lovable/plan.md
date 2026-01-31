
# Plan: Popravek igre Ponovi Poved

## Opis problemov

### Problem 1: Gumb za skok mora biti onemogočen med predvajanjem zvoka
Trenutno se ob skoku na barvni kamen (beseda) zvok začne predvajati, vendar je gumb za skok takoj spet aktiven. Uporabnik lahko klikne na gumb preden se zvok konča, kar povzroči prekrivanje zvokov.

**Rešitev:** Dodati stanje `isPlayingAudio` ki onemogočid gumb za skok dokler se zvok ne konča predvajati.

### Problem 2: V pop-up oknu se morajo vse tri besede avtomatsko predvajati zaporedno
Trenutno se ob odprtju dialoga predvaja polna poved (celotna audio datoteka). Zahteva je, da se ob odprtju dialoga avtomatsko predvajajo vse tri besede zaporedno brez zamika (0ms).

**Rešitev:** Uporabiti `onended` event na audio elementu za zaporedno predvajanje vseh treh besed.

## Tehnične spremembe

### Sprememba 1: Dodaj novo stanje za sledenje predvajanja zvoka

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`

**Lokacija:** Vrstica ~370-385 (med obstoječimi stanji)

```tsx
// Obstoječa stanja
const [phase, setPhase] = useState<GamePhase>("start");
const [dragonPosition, setDragonPosition] = useState(0);
const [isJumping, setIsJumping] = useState(false);
// NOVO: Dodaj stanje za sledenje predvajanja zvoka
const [isPlayingAudio, setIsPlayingAudio] = useState(false);
```

### Sprememba 2: Posodobi playAudio funkcijo da nastavi stanje

**Lokacija:** Vrstica ~441-451

Trenutna koda:
```tsx
const playAudio = useCallback(async (audioFile: string) => {
  if (audioRef.current) {
    try {
      audioRef.current.src = getAudioUrl(audioFile);
      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }
}, []);
```

Nova koda:
```tsx
const playAudio = useCallback((audioFile: string): Promise<void> => {
  return new Promise((resolve) => {
    if (audioRef.current) {
      try {
        setIsPlayingAudio(true);
        audioRef.current.src = getAudioUrl(audioFile);
        
        // Počakaj da se zvok konča
        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          resolve();
        };
        
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          resolve();
        };
        
        audioRef.current.play().catch(() => {
          setIsPlayingAudio(false);
          resolve();
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlayingAudio(false);
        resolve();
      }
    } else {
      resolve();
    }
  });
}, []);
```

### Sprememba 3: Posodobi playSentenceAudio da predvaja vse tri besede zaporedno z 0ms zamikom

**Lokacija:** Vrstica ~454-474

Trenutna koda:
```tsx
const playSentenceAudio = useCallback(async () => {
  const sentence = config.sentences[currentSentenceForDialog];
  if (!sentence) return;
  
  try {
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(sentence.audio);
      await audioRef.current.play();
      return;
    }
  } catch (error) {
    console.log("Full sentence audio not found, playing individual words");
  }
  
  for (let i = 0; i < sentence.words.length; i++) {
    await playAudio(sentence.words[i].audio);
    if (i < sentence.words.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}, [currentSentenceForDialog, config.sentences, playAudio]);
```

Nova koda:
```tsx
const playSentenceAudio = useCallback(async () => {
  const sentence = config.sentences[currentSentenceForDialog];
  if (!sentence) return;
  
  // Predvajaj vse tri besede zaporedno brez zamika (0ms)
  for (let i = 0; i < sentence.words.length; i++) {
    await playAudio(sentence.words[i].audio);
    // Brez zamika med besedami (0ms)
  }
}, [currentSentenceForDialog, config.sentences, playAudio]);
```

### Sprememba 4: Dodaj useEffect za avtomatsko predvajanje ob odprtju dialoga

**Lokacija:** Za `playSentenceAudio` funkcijo (nova koda)

```tsx
// Avtomatsko predvajaj vse tri besede ko se dialog odpre
useEffect(() => {
  if (showSentenceDialog && dialogSentence) {
    // Počakaj kratek čas da se dialog odpre
    const timer = setTimeout(async () => {
      for (let i = 0; i < dialogSentence.words.length; i++) {
        await playAudio(dialogSentence.words[i].audio);
        // Brez zamika med besedami (0ms)
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }
}, [showSentenceDialog, dialogSentence, playAudio]);
```

### Sprememba 5: Posodobi onemogočitev gumba za skok

**Lokacija desktop gumba:** Vrstica ~818-822
**Lokacija mobile gumba:** Vrstica ~863-866

Desktop:
```tsx
<JumpButton 
  onClick={handleNext} 
  disabled={isJumping || phase === "complete" || showSentenceDialog || isPlayingAudio}
  size={144}
/>
```

Mobile:
```tsx
<JumpButton 
  onClick={handleNext} 
  disabled={isJumping || phase === "complete" || showSentenceDialog || isPlayingAudio}
/>
```

### Sprememba 6: Odstrani stari code za predvajanje v handleNext

**Lokacija:** Vrstica ~571-601

V `handleNext` funkciji odstrani staro logiko predvajanja zvoka, saj se bo zdaj izvajala preko `playAudio` z await:

```tsx
setTimeout(async () => {
  setIsJumping(false);
  
  if (nextStone.isRest) {
    // Landed on rest stone - show sentence dialog
    setCurrentSentenceForDialog(nextStone.sentenceIndex ?? 0);
    setPhase("sentence");
    setShowSentenceDialog(true);
    // Odstrani staro predvajanje - useEffect bo to naredil
  } else if (nextStone.wordIndex !== undefined) {
    // Landed on word stone
    setPhase("word");
    const word = config.sentences[nextStone.sentenceIndex!].words[nextStone.wordIndex];
    
    // Add to collected words
    setCollectedWords(prev => [...prev, word]);
    
    // Play word audio - await zagotovi da se gumb omogoči šele ko se zvok konča
    await playAudio(word.audio);
  }
}, 600);
```

## Diagram spremembe

```text
PRED POPRAVKOM:
┌────────────────────────────────────────────────┐
│ Klik na gumb → Skok → Zvok začne → Gumb aktiven│
│                        ↓                       │
│              Uporabnik lahko klikne spet       │
│              (zvoki se prekrivajo)             │
└────────────────────────────────────────────────┘

PO POPRAVKU:
┌────────────────────────────────────────────────┐
│ Klik na gumb → Skok → Zvok začne → Gumb onemog.│
│                        ↓                       │
│              Zvok se konča predvajati          │
│                        ↓                       │
│              Gumb spet aktiven                 │
└────────────────────────────────────────────────┘

POP-UP OKNO:
┌────────────────────────────────────────────────┐
│ Dialog se odpre → Beseda 1 → Beseda 2 → Beseda 3│
│                   (0ms)      (0ms)             │
│              Avtomatsko zaporedno predvajanje  │
└────────────────────────────────────────────────┘
```

## Testiranje

1. Odpri igro `/govorne-igre/ponovi-poved/c`
2. Klikni na gumb za skok
3. Preveri, da je gumb onemogočen dokler se zvok ne konča predvajati
4. Ko zmajček pristane na sivem kamnu, preveri da se pop-up odpre
5. V pop-up oknu preveri, da se vse tri besede samodejno predvajajo zaporedno brez zamika
