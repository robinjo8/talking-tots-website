
## Popravek kač in lestve — cartoon slog po referenčni sliki

### Analiza referenčne slike

Na priloženi sliki so kače in lestve narisane takole:

**Kače:**
- Telo je **zapolnjeno (filled SVG path)** — ni to stroke linija, ampak pravi zapolnjen pas z enakomerno širino
- Enotna barva brez gradienta (zelena ali modra)
- Velika okrogla glava z dvema velikima očema (bela pika z črno zenico)
- Telo valovito, enakomerno debelo skozi celotno dolžino
- Rep se zoži v konico

**Lestve:**
- Klasični rjavo-oranžni izgled
- Debelejše ravne tirnice
- Enakomerno razporejene debele prečke
- Enostavne, jasne, vidne tudi na pisanem ozadju

### Tehnični problem s trenutno implementacijo

Trenutne kače so narisane samo kot **SVG stroke** (linija z debelino) — to izgleda tanko in ne-cartoon-ično. Referenčna slika kaže kače narisane kot **offset path** — pas z enako širino na obeh straneh, ki ustvari pravo debelo zapolnjeno telo kače.

### Rešitev — SVG offset path tehnika

Za vsako kačo bomo izračunali **dve vzporedni krivulji** (leva in desna stran telesa) ter jih zapolnili. To bo dalo isti učinek kot na referenčni sliki.

Konkretno:
1. Izračunamo S-krivuljo (hrbtenica kače)
2. Izračunamo levo in desno offset krivuljo na razdalji ~3-4 SVG enote
3. Zapolnimo območje med njima z enotno barvo
4. Dorisamo glavo (velik polkrog/oval) z očmi
5. Rep se zoži v trikotnik

**Barve kač (po referenčni sliki):**
- Kača 1 (40→36): `#2196F3` modra (kot na sliki)
- Kača 2 (21→5): `#43A047` zelena (kot na sliki)
- Kača 3 (24→8): `#1565C0` temnomodra

**Alternativni pristop (enostavnejši, enako vizualno):**
Namesto offset path bomo uporabili **dva stroke sloja**:
- Debel exterior stroke (bela barva ali temnejša barva) — tloris telesa
- Tanjši interior stroke (osnovna barva) — zapolni telo
- S tem dobimo videz debelega, zapolnjenega telesa brez kompleksnih offset izračunov

To je tehnika ki jo pogosto vidimo v cartoon igrah — in daje enak vizualni rezultat kot na referenčni sliki.

### Parametri SVG kač

```
Exterior stroke (oris): strokeWidth = 7, barva = temnejša varianta
Interior stroke (telo): strokeWidth = 5.5, barva = osnovna
Glava: polkrog r = 4.5, z ušesi (manjša kroga)
Oči: r=1.2 bela + r=0.7 črna
```

### Lestve — popravki

Lestve na referenčni sliki so:
- Debelejše tirnice: `strokeWidth = 2.5`
- Enaka barva rails + rungs: `#C1440E` (opečnato rdeča) ali `#8B4513` (temno rjava)
- Šir spacing med tirnicama: perpendicular offset = 3.5
- Manj prečk (vsaka 8-10 SVG enot)
- Brez fancy 3D efektov — enostavno in jasno

### Datoteka za spremembo

**Samo `src/components/games/KaceLestveBoard.tsx`:**

| Komponenta | Sprememba |
|-----------|-----------|
| `SNAKE_STYLES` | Modra + zelena + temnomodra (kot referenčna slika) |
| `SnakeSVG` | Dvojni stroke pristop za debelo zapolnjeno telo, večja glava (r=4.5), večje oči |
| `LADDER_STYLES` | Opečnato rdeča/rjava barva za rails in rungs |
| `LadderSVG` | Debelejše tirnice (2.5), večji spacing (3.5), enostavne prečke brez efektov |

### Vizualni cilj

Kače bodo izgledale točno kot na referenčni sliki: debele, cartoon zapolnjene, z veliko glavo in jasno vidnimi očmi. Lestve bodo klasične rjave, preproste in jasne — takoj prepoznavne.

### Samo ena datoteka — `KaceLestveBoard.tsx`

Spremembe se nanašajo le na `SnakeSVG` in `LadderSVG` funkciji ter njihove style konstante. Logika igre, grid, avatarji — vse ostane enako.
