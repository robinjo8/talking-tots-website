

## Plan: Zmanjšaj vidnost ikone pred videom

### Analiza problema

Na Androidu se nativni splash screen (s sliko ikone) **ne da popolnoma odstraniti** — to je sistemska funkcija Chroma. Manifest je pravilno nastavljen (bele `any` ikone + zmajček `maskable` ikone). Vendar obstajata dva dodatna problema, ki podaljšujeta prikaz ikone/nebelega ozadja:

1. **`index.html` loading fallback** prikazuje zeleni spinner na sivi podlagi (`background:#f5f5f5`) — to se vidi med nativnim splash screenom in videom
2. **`theme-color` je #4CAF50 (zelena)** — statusna vrstica je zelena med nalaganjem, kar ustvarja vizualni "blisk"
3. **Service worker** predpomni stare ikone (`icon-*.png`) v `ESSENTIAL_CACHE`, kar lahko na nekaterih napravah povzroči starejši cache

### Popravki

**1. `index.html`**
- Spremeni `loading-fallback` ozadje iz `#f5f5f5` v `#ffffff` (čisto belo)
- Skrij spinner in "Nalaganje..." tekst — prikaže se le bel zaslon, ki se zlije z videom
- Spremeni `theme-color` iz `#4CAF50` v `#ffffff` — statusna vrstica bo bela med nalaganjem

**2. `public/manifest.json`**
- Spremeni `theme_color` iz `#4CAF50` v `#ffffff`

**3. `public/sw.js`**
- Dodaj `splash-*.png` ikone v `ESSENTIAL_CACHE`, da se bele ikone predpomnijo
- Povečaj verzijo cache-a za prisilno osvežitev

### Rezultat
Prehod bo: bel nativni splash (z majhno ikono na Androidu, ki jo ne moremo odstraniti) -> bel loading zaslon -> video. Vse skupaj bo delovalo kot gladek bel prehod v video, namesto zeleni spinner + ikona.

### Obseg
- 3 datoteke, minimalne spremembe
- Brez sprememb logike ali vizualnega izgleda aplikacije po nalaganju

