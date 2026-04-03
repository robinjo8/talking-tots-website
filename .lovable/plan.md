

## Plan: Popravi zvočne posnetke za KOŽA in ostale dvoumne besede

### Problem

Beseda KOŽA (`koza_skin1.webp`) nima nastavljenega `audio` polja v `puzzleImages.ts`. Poleg tega funkcija `enrichImageWithAudio` v Sestavljanki in Labirintu **ignorira** obstoječe `audio` polje in vedno izpelje ime iz datoteke slike.

Rezultat: `koza_skin1.webp` → `Koza_skin.mp3` (ne obstaja). Pravilno bi moralo biti `Koza_cutilo.mp3`.

### Prizadete igre

| Igra | Kako resolve-a audio | Problem |
|------|----------------------|---------|
| **Sestavljanka** | `enrichImageWithAudio` ignorira `audio` polje | Da — narobe |
| **Labirint** | `enrichImageWithAudio` ignorira `audio` polje | Da — narobe |
| **Drsna sestavljanka** | Uporablja `img.audio` direktno | Da — ker KOŽA nima `audio` polja, je `undefined` |
| **Kolo besed** | `artikulacijaVajeConfig.ts` z eksplicitnim `audio` | OK ✅ |
| **Igra ujemanja** | `matchingGameData.ts` z eksplicitnim `audio_url` | OK ✅ |
| **Spomin** | `threeColumnMatchingData.ts` z eksplicitnim `audioFile` | OK ✅ |
| **Bingo** | `bingoWordsZHSredinaKonec.ts` z eksplicitnim `audio` | OK ✅ |
| **Kače in lestve** | `kaceLestveConfig.ts` z eksplicitnim `audio` | OK ✅ |

### Prizadete besede (4 brez `audio` polja v puzzleImages.ts)

| Slika | Beseda | enrichImage naredi | Pravilno |
|-------|--------|-------------------|----------|
| `koza_skin1.webp` | KOŽA | `Koza_skin.mp3` ❌ | `Koza_cutilo.mp3` |
| `kokos1.webp` | KOKOŠ | `Kokos.mp3` ❌ | `Kokos_zival.mp3` |
| `kos1.webp` | KOŠ | `Kos.mp3` ❌ | `Kos_predmet.mp3` |
| `koza1.webp` | KOZA | `Koza.mp3` ❌ | `Koza_zival.mp3` |

### Popravki

**1. `src/data/puzzleImages.ts`** — dodaj manjkajoča `audio` polja

```
{ filename: 'kokos1.webp', word: 'KOKOŠ', audio: 'Kokos_zival.mp3' }
{ filename: 'kos1.webp', word: 'KOŠ', audio: 'Kos_predmet.mp3' }
{ filename: 'koza1.webp', word: 'KOZA', audio: 'Koza_zival.mp3' }
{ filename: 'koza_skin1.webp', word: 'KOŽA', audio: 'Koza_cutilo.mp3' }
```

**2. `src/components/games/GenericSestavljankaGame.tsx`** — popravi `enrichImageWithAudio`

Če ima slika že nastavljen `audio`, ga uporabi namesto izpeljevanja iz datoteke:
```
if (image.audio) return { ...image };
// ... sicer izpelji kot doslej
```

**3. `src/components/games/GenericLabirintGame.tsx`** — enaka popravka `enrichImageWithAudio`

### Obseg
- 3 datoteke, ~10 vrstic spremenjenih
- Brez sprememb za igre ki že delujejo pravilno (Kolo besed, Igra ujemanja, Spomin, Bingo, Kače)

