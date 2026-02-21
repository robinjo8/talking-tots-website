
## Samodejno predvajanje zvoka po ustavitvi koluta v igri Bingo

### Kaj se spremeni
Ko se kolut v igri Bingo ustavi na doloceni besedi, se njen zvocni posnetek samodejno predvaja. To velja za vse Bingo igre na poti `/govorne-igre/bingo/*`.

### Sprememba

**Datoteka: `src/components/games/GenericBingoGame.tsx`**

- Dodati `useEffect`, ki posluša spremembo `isSpinning` in `drawnWord`
- Ko `isSpinning` postane `false` in `drawnWord` ni `null`, predvajati zvok iz URL-ja:
  `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/{drawnWord.audio}`
- Uporabiti `useRef<HTMLAudioElement>` za predvajanje (enostaven pristop, ki deluje tudi na mobilnih napravah)
- Kratek zamik (~300ms) po ustavitvi koluta, da je prehod bolj naraven

Nobena druga datoteka se ne spreminja -- `BingoWordData` ze vsebuje polje `audio` z imenom datoteke (npr. `"cesta.m4a"`).
