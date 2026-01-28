

# Analiza gumbov "Hiška" in "Nova igra" po vseh igrah

## Povzetek

Analiza primerja implementacijo gumbov "Hiška" (Home) in "Nova igra" (RefreshCw po zaključku) v vseh igrah glede na referenco na strani `/govorne-igre/igra-ujemanja/ch56`.

---

## Referenčni stil (GenericIgraUjemanjaGame.tsx)

### Gumb "Hiška":
- Pozicija: `fixed bottom-4 left-4 z-50`
- Velikost: `w-16 h-16`
- Oblika: `rounded-full`
- Barva: `bg-gradient-to-r from-amber-400 to-orange-500`
- Obroba: `border-2 border-white/50`
- Senca: `shadow-lg backdrop-blur-sm`
- Animacija: `hover:scale-105 transition-transform`
- Ikona: `Home` (lucide-react), `w-8 h-8 text-white`

### Gumb "Nova igra" (po zaključku):
- Pozicija: `fixed bottom-4 left-24 z-50`
- Velikost: `w-16 h-16`
- Oblika: `rounded-full`
- Barva: `bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700`
- Obroba: `border-2 border-white/50`
- Senca: `shadow-lg backdrop-blur-sm`
- Ikona: `RefreshCw` (lucide-react), `h-7 w-7 text-white`
- Pogoj prikaza: `isGameCompleted` state

---

## Status po igrah

### ✅ Popolnoma pravilno (2 igri)

| Igra | Datoteka |
|------|----------|
| Igra ujemanja | `GenericIgraUjemanjaGame.tsx` |
| Ponovi poved | `PonoviPovedGame.tsx` |

### ⚠️ Hiška pravilna, Nova igra napačen stil (5 iger)

| Igra | Datoteka | Problem |
|------|----------|---------|
| Sestavljanke | `GenericSestavljankaGame.tsx` | Gumb: `bg-blue-500`, `w-14 h-14` namesto gradientne modre in `w-16 h-16` |
| Drsna sestavljanka | `GenericDrsnaSestavljankaGame.tsx` | Gumb: `bg-sky-400` namesto gradientne modre |
| Zaporedja | `GenericZaporedjaGame.tsx` | Gumb: `bg-sky-400` namesto gradientne modre |
| Labirint | `GenericLabirintGame.tsx` | Gumb: `bg-blue-500`, `w-14 h-14` namesto gradientne modre in `w-16 h-16` |
| Bingo | `GenericBingoGame.tsx` | Gumb: `from-blue-400 to-blue-500`, manjka `border-white/50` |

### ❌ Manjka gumb "Nova igra" po zaključku (3 igre)

| Igra | Datoteka | Opis |
|------|----------|------|
| Spomin | `GenericSpominGame.tsx` | Ni `isGameCompleted` stanja, ni plovočega gumba |
| Met kocke | `GenericMetKockeGame.tsx` | Ni `isGameCompleted` stanja, ni plovočega gumba |
| Kolo sreče | `GenericWheelGame.tsx` | Ni plovočega gumba po zaključku |

### ❌ Popolnoma drugačna implementacija (1 igra)

| Igra | Datoteka | Opis |
|------|----------|------|
| Poveži pare | `GenericPoveziPareGame.tsx` | Uporablja navadne gumbe v headerju namesto plovočega menija |

---

## Potrebne spremembe

### 1. GenericSpominGame.tsx
- Dodaj stanje `isGameCompleted`
- Dodaj plavajoči modri gumb po zaključku igre

### 2. GenericSestavljankaGame.tsx
- Spremeni stil gumba iz `bg-blue-500 w-14 h-14` v:
  ```
  bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 w-16 h-16 border-2 border-white/50 backdrop-blur-sm
  ```

### 3. GenericDrsnaSestavljankaGame.tsx
- Spremeni stil gumba iz `bg-sky-400` v:
  ```
  bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700
  ```

### 4. GenericZaporedjaGame.tsx
- Spremeni stil gumba (na dveh mestih - mobile in desktop) iz `bg-sky-400` v:
  ```
  bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700
  ```

### 5. GenericLabirintGame.tsx
- Spremeni stil gumba iz `bg-blue-500 w-14 h-14` v:
  ```
  bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 w-16 h-16 border-2 border-white/50 backdrop-blur-sm
  ```

### 6. GenericMetKockeGame.tsx
- Dodaj stanje `isGameCompleted`
- Dodaj logiko za prikaz po zaključku runde
- Dodaj plavajoči modri gumb

### 7. GenericWheelGame.tsx
- Dodaj stanje `isGameCompleted` ali `showNewGameButton`
- Dodaj plavajoči modri gumb po zaključku

### 8. GenericBingoGame.tsx
- Dodaj `border-2 border-white/50 backdrop-blur-sm` in popravi hover stanje

### 9. GenericPoveziPareGame.tsx (največja sprememba)
- Zamenjaj headerske gumbe s plovočim Home menijem
- Dodaj plavajoči modri gumb po zaključku
- Uskladi z referenčnim stilom

---

## Tehnični povzetek

| Komponenta | Št. vrstic za spremembo | Prioriteta |
|------------|--------------------------|------------|
| GenericSestavljankaGame.tsx | ~5 | Nizka |
| GenericDrsnaSestavljankaGame.tsx | ~5 | Nizka |
| GenericZaporedjaGame.tsx | ~10 | Nizka |
| GenericLabirintGame.tsx | ~10 | Nizka |
| GenericBingoGame.tsx | ~5 | Nizka |
| GenericSpominGame.tsx | ~20 | Srednja |
| GenericMetKockeGame.tsx | ~20 | Srednja |
| GenericWheelGame.tsx | ~15 | Srednja |
| GenericPoveziPareGame.tsx | ~50 | Visoka |

**Skupno: 9 datotek za posodobitev**

