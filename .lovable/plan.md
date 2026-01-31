
# Plan: Popravki za igro Ponovi Poved

## Opis zahtev

### Zahteva 1: Gumb "ponovi" mora biti onemogočen med predvajanjem zvoka
Trenutno je gumb "ponovi" onemogočen samo med snemanjem (`isRecording`). Mora biti onemogočen tudi med avtomatskim predvajanjem vseh treh besed (`isPlayingAudio`).

### Zahteva 2: Odstrani gumb "Naprej" in samodejno zapri pop-up po končanem snemanju
Ko uporabnik klikne gumb "ponovi" in se odštevanje konča (5 sekund), se trenutno prikaže gumb "Naprej". Ta gumb je potrebno odstraniti - namesto tega naj se pop-up samodejno zapre, da lahko uporabnik nadaljuje z igro.

### Zahteva 3: Popravi zvočni posnetek za besedo "liziko" (črka L)
V konfiguraciji za črko L je beseda "liziko", vendar je uporabljen napačen zvočni posnetek `lizika.m4a`. Pravilni posnetek je `liziko.m4a`.

## Tehnične spremembe

### Sprememba 1: Onemogočitev gumba "ponovi" med predvajanjem zvoka

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`

**Lokacija:** Vrstice 1024-1037 (gumb "ponovi")

Trenutna koda:
```tsx
<Button
  onClick={handleRepeat}
  disabled={isRecording}
  className="relative bg-app-orange hover:bg-app-orange/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
>
```

Nova koda:
```tsx
<Button
  onClick={handleRepeat}
  disabled={isRecording || isPlayingAudio}
  className="relative bg-app-orange hover:bg-app-orange/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
>
```

### Sprememba 2: Onemogočitev gumba "Predvajaj" med predvajanjem in snemanjem

**Lokacija:** Vrstice 1015-1022 (gumb "Predvajaj")

Trenutna koda:
```tsx
<Button
  onClick={playSentenceAudio}
  disabled={isRecording}
  className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
>
```

Nova koda:
```tsx
<Button
  onClick={playSentenceAudio}
  disabled={isRecording || isPlayingAudio}
  className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
>
```

### Sprememba 3: Samodejno zaprtje pop-upa po končanem snemanju

**Lokacija:** Vrstice 504-520 (funkcija `handleRepeat`)

Trenutna koda:
```tsx
const handleRepeat = useCallback(() => {
  setIsRecording(true);
  setCountdown(5);
  
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setIsRecording(false);
        setRepeatCompleted(true);
        return 5;
      }
      return prev - 1;
    });
  }, 1000);
}, []);
```

Nova koda - samodejno zapri dialog in nadaljuj z igro:
```tsx
const handleRepeat = useCallback(() => {
  setIsRecording(true);
  setCountdown(5);
  
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setIsRecording(false);
        
        // Samodejno zapri dialog in nadaljuj z igro
        setShowSentenceDialog(false);
        setCollectedWords([]);
        setRepeatCompleted(false);
        
        // Preveri če je bila to zadnja poved
        if (currentSentenceForDialog === 3) {
          setPhase("complete");
          setIsGameCompleted(true);
          
          if (!completionCalledRef.current) {
            completionCalledRef.current = true;
            recordProgress().then(() => {
              setShowSuccessDialog(true);
            });
          }
        }
        
        return 5;
      }
      return prev - 1;
    });
  }, 1000);
}, [currentSentenceForDialog]);
```

### Sprememba 4: Odstrani gumb "Naprej"

**Lokacija:** Vrstice 1038-1045

Odstrani celoten pogojni blok za gumb "Naprej":
```tsx
) : (
  <Button 
    onClick={handleContinueFromDialog} 
    className="bg-dragon-green hover:bg-dragon-green/90 text-white uppercase font-medium h-10 w-28 md:w-32"
  >
    NAPREJ
  </Button>
)}
```

### Sprememba 5: Popravi zvočni posnetek za "liziko"

**Datoteka:** `src/data/ponoviPovedConfig.ts`

**Lokacija:** Vrstica 112

Trenutna koda:
```tsx
{ word: "liziko", image: "lizika1.webp", audio: "lizika.m4a" }
```

Nova koda:
```tsx
{ word: "liziko", image: "lizika1.webp", audio: "liziko.m4a" }
```

## Diagram spremembe

```text
PRED POPRAVKOM:
┌────────────────────────────────────────────────┐
│ Dialog se odpre → Zvok predvaja                │
│                   ↓                            │
│ Gumb "ponovi" aktiven (napaka!)                │
│                   ↓                            │
│ Uporabnik klikne → Odštevanje 5s               │
│                   ↓                            │
│ Prikaže se gumb "Naprej" → Klik → Dialog zaprt │
└────────────────────────────────────────────────┘

PO POPRAVKU:
┌────────────────────────────────────────────────┐
│ Dialog se odpre → Zvok predvaja                │
│                   ↓                            │
│ Gumb "ponovi" ONEMOGOČEN                       │
│                   ↓                            │
│ Zvok se konča → Gumb "ponovi" aktiven          │
│                   ↓                            │
│ Uporabnik klikne → Odštevanje 5s               │
│                   ↓                            │
│ Odštevanje končano → Dialog se SAMODEJNO ZAPRE│
└────────────────────────────────────────────────┘
```

## Prizadete datoteke

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Onemogočitev gumbov, samodejno zaprtje dialoga |
| `src/data/ponoviPovedConfig.ts` | Popravek audio datoteke za "liziko" |

## Testiranje

1. Odpri igro `/govorne-igre/ponovi-poved/l`
2. Skoči do sivega kamna da se odpre pop-up okno
3. Preveri, da je gumb "ponovi" onemogočen med predvajanjem vseh treh besed
4. Ko se predvajanje konča, klikni gumb "ponovi"
5. Počakaj da se odštevanje konča (5 sekund)
6. Preveri, da se pop-up samodejno zapre brez prikaza gumba "Naprej"
7. Preveri, da se za besedo "liziko" predvaja pravilen zvočni posnetek
