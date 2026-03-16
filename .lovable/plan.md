

# Popravki na strani Vizualni prikaz ustnic

## Spremembe (1 datoteka: `src/pages/VizualniPrikazUstnic.tsx`)

### 1. Crn okvir na karticah
Zamenjaj `border-gray-200` z `border-black border-2` na flip-card elementih (front in back) za obe varianti (mobile + desktop), da se kartice jasno ločijo od belega ozadja.

### 2. Navigacijski gumbi za glasove nad karticami
Nad carousel dodaj dve vrstici gumbov:
- **Vrstica 1**: `R` | `L` | `K` (indeksi 2, 1, 0)
- **Vrstica 2**: `C, S, Z` | `Č, Š, Ž` (indeksi 3, 4)

Gumbi ob kliku pokličejo `carouselApi.scrollTo(index)` (mobile) oz. `desktopCarouselApi.scrollTo(index)` (desktop). Aktivni gumb (ki ustreza currentSlide) dobi poudarjen stil (npr. filled/solid), ostali so outline.

### 3. Avtomatsko zapiranje kartice ob premiku
V obstoječih `onSelect` in `onDesktopSelect` callback-ih dodaj `setFlippedCardId(null)`, da se ob premiku na drug slide prejšnja kartica zapre.

