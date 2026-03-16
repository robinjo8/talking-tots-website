

# Vizualne popravke na strani Vizualni prikaz ustnic

## Spremembe (1 datoteka: `src/pages/VizualniPrikazUstnic.tsx`)

### 1. Odstrani hover povečavo na desktop karticah
Vrstica 269: Odstrani `hover:scale-[1.02]` iz className desktop flip-card.

### 2. Belo ozadje zadnje strani kartice
Na flip-card-back (vrstica 283) dodaj `bg-white`, da ne bo sivega ozadja.

### 3. Zeleni navigacijski gumbi (K, L, R, C-S-Z, Č-Š-Ž)
Zamenjaj `border-foreground` / `bg-foreground` z `border-dragon-green` / `bg-dragon-green` na vseh nav gumbih. Aktivni gumb: `bg-dragon-green text-white`, neaktivni: `bg-white text-dragon-green border-dragon-green`.

### 4. Zeleni puščici za carousel z debelejšimi ikonami
Vrstica 298-299: Zamenjaj `bg-black border-black` z `bg-dragon-green border-dragon-green hover:bg-dragon-green/80`. Ikone puščic v CarouselPrevious/CarouselNext so definirane v carousel.tsx z `ArrowLeft`/`ArrowRight` (h-4 w-4) — uporabimo custom `className` za povečanje ikon znotraj gumba: dodaj `[&>svg]:h-8 [&>svg]:w-8 [&>svg]:stroke-[3]` za večje, krepkejše puščice.

