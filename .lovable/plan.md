
Cilj: razložiti, zakaj se na telefonu ob zagonu PWA še vedno pokaže slika zmajčka, in kaj je realno mogoče popraviti.

1. Kaj je dejanska težava
- To, kar vidite na sliki, je skoraj zagotovo sistemski zagonski splash screen Androida, ne React del aplikacije.
- Ta del se prikaže še preden se naloži `index.html` in še preden lahko steče video.
- Če želite ohraniti zmajčka kot ikono aplikacije na domačem zaslonu, Android na določenih napravah ta isti znak uporabi tudi ob zagonu. Tega v PWA ni mogoče 100 % preprečiti samo s spletno kodo.

2. Kaj sem preveril v kodi
- `public/manifest.json` je že nastavljen na bele `any` ikone in belo `theme_color`.
- `index.html` ima bel loading fallback.
- Vendar so v projektu še stari/neenotni sklici:
  - `index.html` še vedno uporablja `icon-*.png?v=zmajcek7`
  - `browserconfig.xml` še vedno kaže stare ikone in zelen `TileColor`
  - manifest link v `index.html` nima verzijskega parametra, zato OS lažje obdrži star manifest
- To pomeni, da je konfiguracija delno usklajena, delno pa še ne.

3. Kaj bi popravil v kodi
- `index.html`
  - dodam verzijo na `<link rel="manifest" href="/manifest.json?v=...">`
  - uskladim `apple-touch-icon`, `favicon` in ostale icon reference na isto aktualno verzijo
- `public/browserconfig.xml`
  - posodobim vse ikone na aktualne verzije
  - spremenim `TileColor` v `#ffffff`
- `public/manifest.json`
  - po potrebi dvignem verzioniranje poti ikon, da prisilim ponovno branje
- `public/sw.js`
  - povečam cache verzijo, da stare reference ne ostanejo v SW cache

4. Kaj to reši
- Odpravi vse preostale stare reference in cache neskladja.
- Zmanjša možnost, da telefon vleče staro ikono ali staro barvo.
- Naredi prehod bolj bel in bolj čist.

5. Kaj to ne more zagotoviti
- Če obdržimo zmajčka kot nameščeno ikono aplikacije, Android lahko še vedno za kratek trenutek pokaže zmajčka pri sistemskem zagonu.
- To je omejitev platforme, ne napaka videa ali React aplikacije.

6. Kaj morate narediti vi po popravku
- Po objavi sprememb:
  1. odstraniti PWA iz telefona
  2. zapreti Chrome
  3. po možnosti počistiti podatke spletnega mesta za `tomitalk.lovable.app`
  4. znova odpreti objavljeno stran
  5. ponovno “Dodaj na začetni zaslon”
- Test je treba delati na objavljeni domeni, ne v previewju.

7. Edina pot do popolne odstranitve zmajčka ob zagonu
- Spremeniti tudi nameščeno ikono aplikacije v belo/prazno različico.
- Ker ste že izbrali “Ohrani zmajčka”, tega ne bom planiral kot glavno rešitev.

8. Predlagan plan izvedbe
- Korak 1: uskladim vse icon reference in verzije v `index.html`, `manifest.json`, `browserconfig.xml`
- Korak 2: povečam SW cache verzijo
- Korak 3: preverim, da nikjer več ni starih `zmajcek7` referenc ali zelene barve
- Korak 4: po implementaciji testirate na telefonu po popolni ponovni namestitvi PWA
- Korak 5: če se zmajček še vedno pokaže, bo to potrditev, da gre za Android sistemski splash in ne več za napačno projektno konfiguracijo

Tehnična opomba
- Trenutno stanje kaže, da problem ni več v videu ali loading fallbacku, ampak v OS-level launch zaslonu in v nekaj še neusklajenih starih referencah v HTML/browserconfig.
- Zato je naslednji smiseln popravek “poenotenje vseh icon entryjev + cache busting”, ne pa dodatno spreminjanje samega `SplashScreen.tsx`.
