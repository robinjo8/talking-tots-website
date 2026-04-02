

## Plan: Popravi prikaz PWA na tablici v ležečem položaju

### Problem

V `public/manifest.json` je nastavitev `"orientation": "portrait"`, ki prisili PWA (ko je nameščena na domači zaslon) v pokončni način. Na 10-palčni tablici v ležečem položaju to povzroči, da se aplikacija prikaže v ozkem pokončnem oknu na sredini zaslona z barvnimi pasovi ob straneh.

### Popravek

**1. `public/manifest.json`** — vrstica 9

Spremeni `"orientation": "portrait"` v `"orientation": "any"`.

To omogoči, da se PWA prilagodi orientaciji naprave — pokončno ali ležeče — in vedno zapolni celoten zaslon.

**Opomba**: Igre, ki zahtevajo ležeči položaj (Zaporedja, Igra ujemanja), že same upravljajo orientacijo znotraj komponente z `screen.orientation.lock()`. Domača stran, nastavitve in ostale strani pa pravilno delujejo v obeh orientacijah. Sprememba ne vpliva na nobeno obstoječo funkcionalnost.

### Obseg
- 1 datoteka: `public/manifest.json` — 1 vrstica spremenjena
- Po spremembi mora uporabnik **na novo namestiti PWA** (ali počistiti cache), da se manifest posodobi

