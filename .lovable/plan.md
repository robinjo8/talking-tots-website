
# Načrt: Prikaz pokala (100 zvezdic) takoj po igri

## Trenutno stanje

### Kako trenutno deluje:
1. Otrok dokonča igro → prejme zvezdico
2. Sistem zabeleži napredek v bazo podatkov
3. `TrophyDialog` se prikaže **samo na strani /moja-stran**
4. Otrok mora **zapustiti igro** in **iti na Moja stran** da vidi čestitke za pokal

### Vsebina TrophyDialog:
- Naslov: "ČESTITKE!"  
- Besedilo: "Čestitamo **[Ime]** za osvojeni pokal!"
- Slika: Zmajček s pokalom (Zmajcek_pokal.webp)
- Prikaz: "⭐ [število] ZVEZD ⭐"
- Zaporedna številka: "Bravo, to je tvoj **[n]**. pokal!"
- Gumb: "Vzemi pokal"

---

## Predlagana rešitev

### Pristop: Globalni TrophyDialog provider

Namesto da imamo TrophyDialog samo v UnifiedProgressDisplay, bomo ustvarili **globalni kontekst**, ki bo spremljal napredek in prikazal pop-up **kjerkoli v aplikaciji** - vključno znotraj iger.

---

## Koraki implementacije

### 1. Ustvari nov hook `useTrophyCheck`

Nov hook, ki ga kličejo igre PO beleženju zvezdice:

```typescript
// src/hooks/useTrophyCheck.ts
export function useTrophyCheck() {
  const { selectedChild } = useAuth();
  const queryClient = useQueryClient();
  const [showTrophy, setShowTrophy] = useState(false);
  const [trophyData, setTrophyData] = useState<TrophyData | null>(null);

  const checkForNewTrophy = async () => {
    // 1. Osveži podatke o napredku
    await queryClient.invalidateQueries(['enhancedProgress']);
    
    // 2. Preberi sveže podatke
    const progress = await fetchProgress(selectedChild.id);
    
    // 3. Preveri če je nov pokal
    const storageKey = `trophy_claimed_${selectedChild.id}_${progress.totalTrophies}`;
    if (progress.totalTrophies > 0 && !localStorage.getItem(storageKey)) {
      setTrophyData({
        childName: selectedChild.name,
        totalStars: progress.totalStars,
        trophyNumber: progress.totalTrophies
      });
      setShowTrophy(true);
    }
  };

  const claimTrophy = () => {
    localStorage.setItem(`trophy_claimed_${selectedChild.id}_${trophyData.trophyNumber}`, 'true');
    setShowTrophy(false);
  };

  return { showTrophy, trophyData, checkForNewTrophy, claimTrophy };
}
```

### 2. Ustvari TrophyProvider kontekst

Globalni provider, ki ovija celotno aplikacijo:

```typescript
// src/contexts/TrophyContext.tsx
export function TrophyProvider({ children }) {
  const { showTrophy, trophyData, claimTrophy } = useTrophyCheck();

  return (
    <TrophyContext.Provider value={{ checkForNewTrophy }}>
      {children}
      <TrophyDialog 
        isOpen={showTrophy}
        childName={trophyData?.childName}
        totalStars={trophyData?.totalStars}
        trophyNumber={trophyData?.trophyNumber}
        onClaimTrophy={claimTrophy}
      />
    </TrophyContext.Provider>
  );
}
```

### 3. Posodobi vse igre da kličejo `checkForNewTrophy`

V vsaki igri/vaji, PO beleženju zvezdice:

```typescript
// Primer: GenericSestavljankaGame.tsx
const { checkForNewTrophy } = useTrophyContext();

const handleStarClaimed = async () => {
  recordGameCompletion('puzzle', config.letter);
  
  // Počakaj da se napredek shrani
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Preveri za nov pokal
  await checkForNewTrophy();
};
```

### 4. Ovij App.tsx s TrophyProvider

```typescript
// src/App.tsx
<TrophyProvider>
  <RouterProvider router={router} />
</TrophyProvider>
```

### 5. Odstrani duplicirano logiko iz UnifiedProgressDisplay

Po implementaciji globalnega providerja ni več potrebe za TrophyDialog v UnifiedProgressDisplay - odstrani dvojno preverjanje.

---

## Tok uporabnika (po spremembi)

```text
1. Otrok igra igro Spomin
   ↓
2. Najde zadnji par → BRAVO dialog → Vzemi zvezdico
   ↓
3. recordGameCompletion() beleži 100. zvezdico
   ↓
4. checkForNewTrophy() preveri: totalTrophies = 1, ni claimed
   ↓
5. TrophyDialog se prikaže TAKOJ v igri:
   ┌────────────────────────────────────┐
   │      🎉 ČESTITKE! 🎉              │
   │                                    │
   │  Čestitamo ŽAK za osvojeni pokal! │
   │                                    │
   │      [Zmajček s pokalom]          │
   │                                    │
   │       ⭐ 100 ZVEZD ⭐              │
   │  Bravo, to je tvoj 1. pokal!      │
   │                                    │
   │       [ Vzemi pokal ]             │
   └────────────────────────────────────┘
   ↓
6. Otrok klikne "Vzemi pokal"
   ↓
7. localStorage označi pokal kot prevzet
   ↓
8. Otrok nadaljuje z igro ali zapusti
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/hooks/useTrophyCheck.ts` | Nova | Hook za preverjanje in prikaz pokala |
| `src/contexts/TrophyContext.tsx` | Nova | Globalni provider za TrophyDialog |
| `src/App.tsx` | Posodobi | Ovij z TrophyProvider |
| `src/components/games/GenericSestavljankaGame.tsx` | Posodobi | Dodaj checkForNewTrophy po beleženju |
| `src/components/games/GenericSpominGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericLabirintGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericBingoGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericMetKockeGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericWheelGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/GenericZaporedjaGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/games/TongueGymGame.tsx` | Posodobi | Dodaj checkForNewTrophy |
| `src/components/progress/UnifiedProgressDisplay.tsx` | Posodobi | Odstrani duplicirano TrophyDialog logiko |

---

## Tehnični povzetek

- **Problem**: TrophyDialog se prikaže samo na /moja-stran
- **Rešitev**: Globalni TrophyProvider, ki prikaže dialog kjerkoli
- **Prednost**: Otrok vidi čestitke TAKOJ ko doseže mejnik
- **Ključni mehanizem**: `checkForNewTrophy()` se kliče po vsaki osvojeni zvezdici
