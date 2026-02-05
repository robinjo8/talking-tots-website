
# Plan: Popravek PWA in Touch Event Težave

## Analiza problema

### Kaj se je zgodilo
Pri zadnji spremembi (preprečitev pull-to-refresh) sem dodal preveč agresivne CSS in JavaScript omejitve, ki so zlomile PWA:

1. **CSS `touch-action: pan-x pinch-zoom`** - preprečuje vertikalno scrollanje in lahko blokira osnovne touch evente
2. **Tailwind `touch-none` razred** - popolnoma onemogoči vse touch interakcije na elementu
3. **JavaScript touchmove listener na `document`** - preveč agresivno blokira touch evente na celotnem dokumentu

### Zakaj PWA ne deluje
Ko uporabnik odpre PWA:
- Brskalnik poskuša procesirati touch evente za navigacijo
- CSS `touch-action: pan-x pinch-zoom` in `touch-none` blokirata te evente
- JavaScript listener še dodatno blokira touchmove
- Rezultat: PWA se ne zažene pravilno ali se zatakne

## Rešitev

### 1. Popravek CSS v `src/index.css`

Namesto agresivnega `touch-action: pan-x pinch-zoom` uporabim bolj ciljano rešitev:

```css
/* PREJ (problematično) */
.game-container {
  overscroll-behavior-y: contain;
  touch-action: pan-x pinch-zoom;
  -webkit-overflow-scrolling: auto;
}

/* POTEM (pravilno) */
.game-container {
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: auto;
}

/* Ločen razred samo za elemente ki potrebujejo blokiranje */
.prevent-pull-refresh {
  overscroll-behavior-y: contain;
}
```

`overscroll-behavior-y: contain` je dovolj za preprečitev pull-to-refresh brez blokiranja drugih touch eventov.

### 2. Popravek `GenericMetKockeGame.tsx`

Odstrani `touch-none` razred in popravi JavaScript listener:

```text
PREJ:
<div className="... game-container touch-none" ...>

POTEM:
<div className="... game-container" ...>
```

Za JavaScript listener - namesto da dodaja na `document`, naj dodaja samo na svoj element:

```tsx
// PREJ (agresivno - na document)
document.addEventListener('touchmove', handleTouchMove, { passive: false });

// POTEM (ciljano - na element igre)
const gameElement = useRef<HTMLDivElement>(null);
// Listener samo na element igre, ne na cel dokument
```

### 3. Enake popravke za ostale igre

Odstrani `touch-none` iz vseh iger kjer sem ga dodal:
- GenericSpominGame.tsx
- GenericLabirintGame.tsx
- GenericBingoGame.tsx
- GenericZaporedjaGame.tsx
- GenericDrsnaSestavljankaGame.tsx
- GenericIgraUjemanjaGame.tsx
- GenericWheelGame.tsx
- PonoviPovedGame.tsx

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/index.css` | Odstrani `touch-action: pan-x pinch-zoom`, ohrani samo `overscroll-behavior-y: contain` |
| `src/components/games/GenericMetKockeGame.tsx` | Odstrani `touch-none`, popravi JS listener |
| `src/components/games/GenericSpominGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericLabirintGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericBingoGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericZaporedjaGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | Odstrani `touch-none` |
| `src/components/games/GenericWheelGame.tsx` | Odstrani `touch-none` |
| `src/components/games/PonoviPovedGame.tsx` | Odstrani `touch-none`, popravi JS listener |

## Tehnična razlaga

### Zakaj `overscroll-behavior-y: contain` zadostuje

Ta CSS lastnost pove brskalniku:
- "Ko uporabnik doseže rob elementa s scrollanjem, NE aktiviraj privzetega obnašanja brskalnika (pull-to-refresh)"
- NE blokira normalnih touch eventov
- NE vpliva na PWA zagon
- Podprt v vseh modernih brskalnikih

### Zakaj `touch-action` in `touch-none` sta problematična

- `touch-none` = "brskalnik, ignoriraj VSE touch evente na tem elementu"
- `touch-action: pan-x pinch-zoom` = "dovoli samo horizontalno premikanje in zoom"
- Oba blokirata osnovno interakcijo ki jo PWA potrebuje

## Rezultat

Po popravku:
- PWA se bo normalno zagnala na telefonu
- Pull-to-refresh bo še vedno preprečen v igrah (preko `overscroll-behavior-y: contain`)
- Vse touch interakcije bodo delovale normalno
- Dialog gumbi bodo dostopni (popravek iz prejšnjega koraka ostane)
