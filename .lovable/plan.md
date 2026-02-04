
# Plan: Popravek omejitve brezplačnih iger

## Pregled problema

Sistem za omejitev 3 brezplačnih iger na dan ne deluje pravilno. Identificirane so štiri ključne težave:

1. **Napačen prikaz števca** - "Preostale igre danes: 3/3" uporabnik razume kot "3 od 3 že odigranih", čeprav pomeni nasprotno
2. **Vrednosti se ne posodabljajo** - `canPlay` in `remainingGames` se izračunata samo enkrat ob zagonu
3. **Igre se ne beležijo** - funkcija `recordGamePlayed()` se nikoli ne pokliče, ker ni povezana z zaključkom igre
4. **Kartice niso zaklenjene** - uporabnik lahko klikne na igro tudi ko je omejitev dosežena

## Rešitev

### 1. Popravi prikaz števca

V `BrezplacneIgre.tsx` spremeni prikaz iz:
```text
Preostale igre danes: 3/3
```
v:
```text
Preostale igre danes: 3
```

To jasno pokaže koliko iger je še na voljo.

### 2. Popravi reaktivnost v FreeGameContext

Problem: `canPlay` in `remainingGames` se izračunata samo enkrat:
```typescript
const value = {
  canPlay: canPlayFreeGame(),     // ← pokliče se enkrat
  remainingGames: getRemainingGames(), // ← pokliče se enkrat
};
```

Rešitev: Uporabi `gamesPlayed` state za izračun:
```typescript
const value = {
  canPlay: gamesPlayed < 3,
  remainingGames: Math.max(0, 3 - gamesPlayed),
};
```

### 3. Dodaj beleženje zaključka igre

Za vsako igro moram dodati logiko, ki ob zaključku pokliče `recordGamePlayed()`.

| Igra | Pogoj za zaključek | Sprememba |
|------|-------------------|-----------|
| **Spomin** | `gameCompleted === true` | Dodaj `useEffect` ki spremlja `gameCompleted` |
| **Bingo** | `gameComplete === true` | Dodaj `useEffect` ki spremlja `gameComplete` |
| **Sestavljanke** | Ko se pojavi `PuzzleSuccessDialog` | Dodaj prop `onPuzzleComplete` |
| **Labirint** | Ko se pojavi `PuzzleSuccessDialog` | Dodaj prop `onPuzzleComplete` |
| **Zaporedja** | Ko se pojavi zaključni dialog | Dodaj prop `onGameComplete` |
| **Drsna sestavljanka** | Ko se pojavi zaključni dialog | Dodaj prop `onGameComplete` |
| **Igra ujemanja** | Ko se pojavi zaključni dialog | Dodaj prop `onGameComplete` |
| **Smešne povedi** | Ko `progress === 5` | Dodaj `useEffect` ki spremlja progress |
| **Ponovi poved** | Ko uporabnik enkrat ponovi | Dodaj prop `onComplete` |

Za enostavnejšo implementacijo bom:
1. V generične komponente dodal opcijski prop `onGameComplete?: () => void`
2. V brezplačnih wrapper komponentah preveril stanje igre in poklical `recordGamePlayed()`

### 4. Zakleni kartice ko je omejitev dosežena

V `FreeGamesList.tsx` dodaj preverjanje `canPlay`:
- Če `canPlay === false`, ob kliku na kartico prikaži `FreeLimitReachedDialog` namesto navigacije
- Vizualno označi kartice kot zaklenjene (siva barva, ikona ključavnice)

## Datoteke za spremembo

### Obstoječe datoteke

| Datoteka | Sprememba |
|----------|-----------|
| `src/contexts/FreeGameContext.tsx` | Popravi izračun `canPlay` in `remainingGames` z uporabo `gamesPlayed` state |
| `src/pages/BrezplacneIgre.tsx` | Popravi prikaz števca iz "X/3" v "Preostale: X" |
| `src/components/free-games/FreeGamesList.tsx` | Dodaj preverjanje omejitve in prikaz dialoga/zaklenjenih kartic |
| `src/components/free-games/FreeSpominGame.tsx` | Dodaj `useEffect` za beleženje ob `gameCompleted` |
| `src/components/free-games/FreeBingoGame.tsx` | Dodaj `useEffect` za beleženje ob `gameComplete` |
| `src/components/free-games/FreeSestavljankeGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreeLabirintGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreeZaporedjaGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreeDrsnaSestavljankaGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreeIgraUjemanjaGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreeMetKockeGame.tsx` | Dodaj logiko za beleženje ob zaključku |
| `src/components/free-games/FreePonoviPovedGame.tsx` | Dodaj logiko za beleženje ob zaključku |

### Generične igre - dodaj onGameComplete prop

Za igre, kjer je potrebno, dodaj opcijski prop v generične komponente:
- `GenericSpominGame.tsx` - vrni `gameCompleted` status
- `GenericBingoGame.tsx` - vrni `gameComplete` status
- `GenericSestavljankaGame.tsx` - dodaj `onPuzzleComplete`
- `GenericLabirintGame.tsx` - dodaj `onPuzzleComplete`
- Ostale po potrebi

## Vizualni rezultat

### Pred popravkom
```text
Preostale igre danes: 3/3  ← zmede, pomeni "še 3 na voljo"
[BINGO] [SPOMIN] [SESTAV...]  ← vse klikljivo
```

### Po popravku
```text
Preostale igre danes: 3  ← jasno
[BINGO] [SPOMIN] [SESTAV...]  ← vse klikljivo

--- po 3 igrah ---

Preostale igre danes: 0  ← jasno
[🔒BINGO] [🔒SPOMIN] [🔒SESTAV...]  ← zaklenjeno, sivo
```

## Tehnična implementacija

### FreeGameContext.tsx popravek

```typescript
const value: FreeGameContextType = {
  // ... ostalo
  canPlay: gamesPlayed < FREE_GAMES_LIMIT,  // reaktivno
  remainingGames: Math.max(0, FREE_GAMES_LIMIT - gamesPlayed),  // reaktivno
  // ... ostalo
};
```

### FreeSpominGame.tsx primer popravka

```typescript
export default function FreeSpominGame() {
  const { canPlay, recordGamePlayed, hasRecordedThisSession, resetSessionRecording } = useFreeGameContext();
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    resetSessionRecording();
  }, [resetSessionRecording]);

  // Beleženje ob zaključku igre
  useEffect(() => {
    if (gameCompleted && !hasRecordedThisSession) {
      recordGamePlayed();
    }
  }, [gameCompleted, hasRecordedThisSession, recordGamePlayed]);

  // ... config

  if (!canPlay) {
    return <FreeLimitReachedDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <GenericSpominGame 
      config={config}
      backPath="/brezplacne-igre"
      onGameComplete={() => setGameCompleted(true)}  // nov prop
    />
  );
}
```

### FreeGamesList.tsx popravek

```typescript
export function FreeGamesList() {
  const navigate = useNavigate();
  const { canPlay } = useFreeGameContext();
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const handleGameClick = (path: string) => {
    if (!canPlay) {
      setShowLimitDialog(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="grid ...">
        {FREE_GAMES.map((game) => (
          <div 
            key={game.id}
            onClick={() => handleGameClick(game.path)}
            className={!canPlay ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            {/* kartica */}
            {!canPlay && <LockIcon />}
          </div>
        ))}
      </div>
      <FreeLimitReachedDialog 
        open={showLimitDialog} 
        onOpenChange={setShowLimitDialog} 
      />
    </>
  );
}
```
