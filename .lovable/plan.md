

# Plan: Poenotenje gumba za zvočnik v vseh igrah

## Opis problema

Gumb za predvajanje zvoka (ikona zvočnika) ni enak v vseh igrah:
- **Labirint (StarCollectDialog):** Okrogel zelen gumb z barvo `dragon-green`
- **Ostale igre:** Kvadraten gumb z barvo `green-500`, različne velikosti

## Ciljna oblika

Vse igre morajo uporabljati enako obliko kot Labirint:

```tsx
<button
  onClick={handlePlayAudio}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

**Lastnosti:**
- Okrogel gumb (`rounded-full`)
- Barva `dragon-green` (namesto `green-500`)
- Padding `p-2` (namesto fiksne višine/širine)
- Ikona velikosti `w-6 h-6` z belo barvo
- Hover efekt: `hover:bg-dragon-green/90`
- Prehod: `transition-colors`

## Tehnične spremembe

### 1. BingoSuccessDialog.tsx
**Lokacija:** Vrstica ~170-178

Spremeni:
```tsx
<Button
  onClick={handlePlayAudio}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
>
  <Volume2 className="w-6 h-6" />
</Button>
```

V:
```tsx
<button
  onClick={handlePlayAudio}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 2. WheelSuccessDialog.tsx (Kolo sreče)
**Lokacija:** Vrstica ~284-291

Spremeni:
```tsx
<Button
  onClick={handlePlayAudio}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 sm:h-12 sm:w-12"
>
  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
</Button>
```

V:
```tsx
<button
  onClick={handlePlayAudio}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 3. MatchingCompletionDialog.tsx (Igra ujemanja / Zaporedja)
**Lokacija:** Vrstica ~221-230

Spremeni:
```tsx
<Button
  onClick={(e) => {
    e.stopPropagation();
    handlePlayAudio(image);
  }}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
>
  <Volume2 className="w-4 h-4" />
</Button>
```

V:
```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    handlePlayAudio(image);
  }}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 4. PuzzleSuccessDialog.tsx (Sestavljanke zaključek)
**Lokacija:** Vrstica ~224-233

Spremeni:
```tsx
<Button
  onClick={(e) => {
    e.stopPropagation();
    handlePlayAudio(image);
  }}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
>
  <Volume2 className="w-4 h-4" />
</Button>
```

V:
```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    handlePlayAudio(image);
  }}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 5. MemoryPairDialog.tsx (Spomin)
**Lokacija:** Vrstica ~180-187

Spremeni:
```tsx
<Button
  onClick={() => audioUrl && playAudio(audioUrl)}
  disabled={!audioUrl}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
>
  <Volume2 className="w-6 h-6" />
</Button>
```

V:
```tsx
<button
  onClick={() => audioUrl && playAudio(audioUrl)}
  disabled={!audioUrl}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 6. PuzzleCompletionDialog.tsx (Stari dialog)
**Lokacija:** Vrstica ~104-111

Spremeni:
```tsx
<Button
  onClick={handlePlayAudio}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
>
  <Volume2 className="w-6 h-6" />
</Button>
```

V:
```tsx
<button
  onClick={handlePlayAudio}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
  <Volume2 className="w-6 h-6 text-white" />
</button>
```

### 7. AudioPracticeDialog.tsx
**Lokacija:** Vrstica ~37-48

Spremeni:
```tsx
<Button 
  onClick={onPlayAudio}
  disabled={isAudioLoading}
  size="icon"
  className="bg-green-500 hover:bg-green-600 text-white h-12 w-12"
>
  {isAudioLoading ? (
    <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <Volume2 className="w-6 h-6" />
  )}
</Button>
```

V:
```tsx
<button
  onClick={onPlayAudio}
  disabled={isAudioLoading}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  aria-label="Predvajaj besedo"
>
  {isAudioLoading ? (
    <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <Volume2 className="w-6 h-6 text-white" />
  )}
</button>
```

## Vizualna primerjava

```text
PRED POPRAVKOM:
┌────────────┐
│  ┌──────┐  │  ← Kvadrat, bg-green-500
│  │ 🔊  │  │    Različne velikosti (h-8, h-10, h-12)
│  └──────┘  │
└────────────┘

PO POPRAVKU:
┌────────────┐
│    ⭕      │  ← Krog, bg-dragon-green
│   🔊       │    Enotna velikost (p-2, w-6 h-6)
│            │
└────────────┘
```

## Prizadete igre

- **Bingo** (vse črke)
- **Kolo besed** (vse črke)
- **Igra ujemanja / Zaporedja** (vse starostne skupine)
- **Sestavljanke** (zaključni dialog)
- **Spomin** (dialog za pare)
- **Govorna vaja** (AudioPracticeDialog)

## Testiranje

1. Odpri igro Bingo (`/govorne-igre/bingo/c`) in preveri gumb za zvočnik
2. Odpri igro Kolo besed in preveri gumb
3. Odpri igro Spomin in najdi par, da se prikaže dialog
4. Odpri igro Sestavljanka in jo zaključi
5. Preveri, da je v vseh primerih gumb okrogel in zelene barve (dragon-green)

