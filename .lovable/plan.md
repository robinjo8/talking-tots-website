

# Načrt: Popravki na strani napredka otroka

## Povzetek sprememb

### 1. Preimenovanja in reorganizacija kategorij v `activityAggregation.ts`

| Trenutno ime | Novo ime | Akcija |
|--------------|----------|--------|
| Vrti kolo | Kolo besed | Preimenuj |
| Met kocke | Smešne povedi | Preimenuj |
| Ponovi poved | Ponovi poved | Premakni iz VAJE v IGRE |
| Povezi pare | - | Odstrani |
| Video navodila | - | Odstrani |

### 2. Končni seznam iger (11) in vaj (1)

**IGRE (11)**
1. Sestavljanka
2. Drsna sestavljanka
3. Labirint
4. Spomin
5. Zaporedja
6. Igra ujemanja
7. Kolo besed (prej Vrti kolo)
8. Bingo
9. Smešne povedi (prej Met kocke)
10. Ponovi poved (premaknjeno iz VAJ)

**VAJE (1)**
1. Vaje za jezik

### 3. Popravek strani za izbor črk pri igri Ponovi poved

Trenutno `AdminPonoviPovedGames.tsx` prikazuje placeholder besedilo. Potrebno ga je zamenjati z mrežo kartic za izbor črk (enako kot AdminLabirintGames.tsx).

### 4. Popravek avatarja otroka na strani napredka

Trenutno se prikazuje emoji (🧒 ali 👧) namesto dejanskega avatarja (`avatar_url`). Potrebno je popraviti prikaz, da se uporabi slika iz `child.avatar_url`.

---

## Tehnične spremembe

### Datoteka 1: `src/utils/activityAggregation.ts`

Spremembe v `categoryPatterns`:
- Preimenuj `'Vrti kolo'` v `'Kolo besed'`
- Preimenuj `'Met kocke'` v `'Smešne povedi'`
- Spremeni `type` pri `ponovi_poved` iz `'exercise'` v `'game'`
- Odstrani vnos za `povezi_pare`
- Odstrani vnos za `video`

```typescript
const categoryPatterns = [
  // Games (11)
  { pattern: /^puzzle_/, key: 'puzzle', name: 'Sestavljanka', type: 'game', color: 'purple' },
  { pattern: /^sliding_puzzle_/, key: 'sliding_puzzle', name: 'Drsna sestavljanka', type: 'game', color: 'blue' },
  { pattern: /^labirint-/, key: 'labirint', name: 'Labirint', type: 'game', color: 'green' },
  { pattern: /^(C|Č|K|L|R|S|Š|Z|Ž)$/, key: 'memory', name: 'Spomin', type: 'game', color: 'orange' },
  { pattern: /^sequence_/, key: 'sequence', name: 'Zaporedja', type: 'game', color: 'teal' },
  { pattern: /^matching_/, key: 'igra_ujemanja', name: 'Igra ujemanja', type: 'game', color: 'rose' },
  { pattern: /^wheel-/, key: 'wheel', name: 'Kolo besed', type: 'game', color: 'amber' },
  { pattern: /^artikulacija_bingo_/, key: 'bingo', name: 'Bingo', type: 'game', color: 'yellow' },
  { pattern: /^smesne-povedi-/, key: 'smesne_povedi', name: 'Smešne povedi', type: 'game', color: 'indigo' },
  { pattern: /^ponovi-poved-/, key: 'ponovi_poved', name: 'Ponovi poved', type: 'game', color: 'cyan' },
  // Exercises (1)
  { pattern: /^vaje_motorike_govoril$/, key: 'tongue_gym', name: 'Vaje za jezik', type: 'exercise', color: 'red' },
];
```

### Datoteka 2: `src/pages/admin/games/AdminPonoviPovedGames.tsx`

Zamenjaj placeholder z mrežo kartic za izbor črk (po vzoru AdminLabirintGames.tsx):
- Uporabi `hasPonoviPovedConfig()` za preverjanje dostopnosti črke
- Prikaži kartice z zmajčki za vsako črko
- Navigiraj na `/admin/children/${childId}/games/ponovi-poved/${letter}`

### Datoteka 3: `src/pages/admin/AdminChildProgress.tsx`

Popravek prikaza avatarja:
- Namesto emoji-ja (🧒/👧) uporabi `child.avatar_url`
- Če `avatar_url` ni nastavljen, prikaži privzeti emoji

```tsx
// Trenutno:
<span className="text-2xl">
  {child.gender === 'male' ? '🧒' : '👧'}
</span>

// Novo:
{child.avatar_url ? (
  <img 
    src={child.avatar_url} 
    alt={child.name}
    className="w-full h-full object-cover rounded-full"
  />
) : (
  <span className="text-2xl">
    {child.gender === 'male' ? '🧒' : '👧'}
  </span>
)}
```

---

## Seznam datotek za spremembo

| Datoteka | Akcija |
|----------|--------|
| `src/utils/activityAggregation.ts` | Posodobi - preimenovanja, premik kategorij, odstranitve |
| `src/pages/admin/games/AdminPonoviPovedGames.tsx` | Posodobi - zamenjaj placeholder z mrežo črk |
| `src/pages/admin/AdminChildProgress.tsx` | Posodobi - prikaži avatar namesto emoji-ja |

---

## Rezultat

Po popravkih:
1. Stran napredka bo prikazovala pravilne nazive iger (Kolo besed, Smešne povedi)
2. Ponovi poved bo v razdelku IGRE
3. Povezi pare in Video navodila ne bosta več prikazana
4. Igra Ponovi poved bo imela delujoč izbor črk
5. Avatar otroka bo pravilno prikazan namesto generičnega emoji-ja

