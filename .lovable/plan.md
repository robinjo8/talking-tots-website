
# Plan: Popravek igre Labirint - nedosegljive zvezdice in gumb za zvok

## Povzetek težav

### Težava 1: Zvezdice na nedosegljivih lokacijah
Na posnetku zaslona je vidno, da se zvezdica nahaja v celici, do katere uporabnik ne more priti. Algoritem za postavljanje zvezdic trenutno samo preveri, ali ima celica vsaj eno odprtino, vendar NE preveri, ali je ta celica dejansko dosegljiva iz začetne pozicije (0,0) preko poti skozi labirint.

### Težava 2: Gumb za predvajanje zvoka ne deluje
Gumb z zvočnikom v pop-up oknu ob pobiranju zvezdic ne predvaja zvoka. Možni vzroki:
- Manjkajoči `type="button"` atribut
- Morebitna napaka pri gradnji URL-ja zvočnega posnetka
- Problem z referenco funkcije v pogovornem oknu

---

## Rešitev 1: Preverjanje dosegljivosti zvezdic z algoritmom BFS

Dodati funkcijo `isReachable` v `useMazeGame.ts`, ki uporabi algoritem BFS (Breadth-First Search) za preverjanje, ali je celica dosegljiva iz začetne pozicije.

### Spremembe v `src/hooks/useMazeGame.ts`:

1. **Dodati funkcijo `isReachable`**:
```typescript
// Check if position is reachable from start using BFS
const isReachable = (grid: Cell[][], target: Position): boolean => {
  const visited = new Set<string>();
  const queue: Position[] = [{ x: 0, y: 0 }];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.x},${current.y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (current.x === target.x && current.y === target.y) {
      return true;
    }
    
    const cell = grid[current.y][current.x];
    
    // Check all 4 directions
    if (!cell.walls.top && current.y > 0) {
      queue.push({ x: current.x, y: current.y - 1 });
    }
    if (!cell.walls.bottom && current.y < ROWS - 1) {
      queue.push({ x: current.x, y: current.y + 1 });
    }
    if (!cell.walls.left && current.x > 0) {
      queue.push({ x: current.x - 1, y: current.y });
    }
    if (!cell.walls.right && current.x < COLS - 1) {
      queue.push({ x: current.x + 1, y: current.y });
    }
  }
  
  return false;
};
```

2. **Posodobiti funkcijo `findStarPositions`**:
V zanki za izbiro kandidatov dodati preverjanje dosegljivosti:
```typescript
// Only consider cells that are actually reachable from start
if (openings > 0 && isReachable(grid, { x, y })) {
  candidates.push({ pos: { x, y }, openings });
}
```

---

## Rešitev 2: Popravek gumba za predvajanje zvoka

### Spremembe v `src/components/games/StarCollectDialog.tsx`:

1. **Dodati `type="button"` atribut** na gumb za zvok, da se prepreči morebitno privzeto vedenje:
```typescript
<button
  type="button"
  onClick={handlePlayAudio}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
```

2. **Dodati preverjanje veljavnosti `image` prop** pred klicem:
```typescript
const handlePlayAudio = () => {
  if (!image?.word) {
    console.error('No image or word available for audio playback');
    return;
  }
  const normalizedWord = image.word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const audioFilename = image.audio || `${normalizedWord}.m4a`;
  const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
  console.log('Playing audio:', audioUrl);
  playAudio(audioUrl);
};
```

3. **Dodati onemogočanje gumba med snemanjem**:
```typescript
<button
  type="button"
  onClick={handlePlayAudio}
  disabled={isRecording}
  className={`p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors ${
    isRecording ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  aria-label="Predvajaj besedo"
>
```

---

## Povzetek sprememb datotek

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useMazeGame.ts` | Dodati funkcijo `isReachable` (BFS algoritem) in jo uporabiti pri izbiri pozicij zvezdic |
| `src/components/games/StarCollectDialog.tsx` | Dodati `type="button"`, preverjanje veljavnosti `image` in onemogočanje med snemanjem |

---

## Tehnične podrobnosti

### Algoritem BFS za preverjanje dosegljivosti
BFS (Breadth-First Search) je idealen za iskanje poti v labirintu, ker:
- Pregleda vse sosednje celice po nivojih
- Uporablja vrsto (queue) za sledenje celicam za pregled
- Uporabi set za označevanje že obiskanih celic
- Upošteva stene med celicami

### Zakaj je to potrebno?
Čeprav recursive backtracker algoritem zagotavlja, da so vse celice povezane, funkcija `addDeadEnds` naknadno dodaja poti. V kombinaciji z zaklepanjem cilja lahko nastanejo situacije, kjer nekatere celice niso več dosegljive iz začetka. BFS preverjanje zagotavlja, da se zvezdice vedno postavijo na dosegljiva mesta.
