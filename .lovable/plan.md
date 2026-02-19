
## Popravek kač, lestve in pozicij

### Spremembe pozicij kač (kaceLestveConfig.ts)

Kača 24→8 se spremeni v **24→10**
Kača 40→36 se spremeni v **40→31**

```
SNAKES = { 40: 31, 21: 5, 24: 10 }
```

---

### Vzroki za vizualne probleme

**Problem 1 — predebele kače**: `strokeWidth="8"` na SVG viewBox 100×100 je enormno. Celica je wide 100/6 = ~16.7 SVG enot. Kača s strokeWidth 8 zasede skoraj polovico celice.

**Problem 2 — čudne krivine**: `perpX = -dy * 0.38` je prevelik faktor. Kača se preveč ukrivi in izgleda čudno zavita. Referenčna slika kaže bolj subtilne, naravne krivine (faktor ~0.20–0.25).

**Problem 3 — glava ni podobna kači**: Samo krog brez prave cartoon oblike. Na referenčni sliki imata kači veliko, okroglo glavo z markantnimi očmi in nasmehom.

**Problem 4 — prekrivanje številk**: SVG overlay z debelimi potezami pokriva celična polja s številkami.

---

### Rešitve

#### Kače — nova implementacija

Spremembe v `SnakeSVG`:

1. **Debelina**: `strokeWidth` iz `8`/`6` na `4.5`/`3.2` — vitke, elegantne kače
2. **Krivina**: perp faktor iz `0.38` na `0.22` — bolj naravna, manj dramatična S-krivulja
3. **Glava**: povečamo na `headR = 3.5`, dodamo obrobo z barvo telesa + belo svetlobo, oči bodo večje in bolj cartoon (r=1.5 bela, r=0.8 črna)
4. **Senca**: zmanjšamo opacity iz `0.18` na `0.10`, offset iz `0.4` na `0.25`
5. **Rep**: ohranimo trikotnik, ampak ga zmanjšamo
6. **Barve**: obdržimo modra + zelena + modra (kot referenčna slika)

#### Lestve — nova implementacija

Spremembe v `LadderSVG`:

1. **Debelina tirnic**: `strokeWidth` iz `3.5`/`2.5` na `2.2`/`1.6`
2. **Prečke**: iz `2.8`/`2.0` na `2.0`/`1.4`
3. **Spacing**: perp offset iz `3.5` na `2.8`
4. **Senca**: opacity iz `0.20` na `0.12`, strokeWidth iz `4` na `2.5`
5. **Število prečk**: `len / 9` (obstoječe) — ostane, samo tanjše

#### Številke vedno vidne

Ker so SVG elementi tanjši, bodo številke bolj vidne. Poleg tega bomo v HTML celicah dodali `z-index` na `<span>` z številko, da bo vedno nad SVG overlayem.

Trenutno je SVG overlay `absolute inset-0 z-index ni nastavljen` in celični `<span>` za številko nima z-indeksa. SVG overlay je v DOM-u **za** grid divom, torej je že vizualno nad njim. Rešitev: SVG overlay nastavimo na `opacity: 0.85` ali dodamo `mix-blend-mode: multiply` da številke prosevajo skozi.

Boljša rešitev: **številko v celici premaknemo nad SVG overlay** z dodatnim absolutnim elementom, ki je v DOM-u za SVG overlajem. To pa je kompleksno. Enostavnejša rešitev: **tanjše kače in lestve** ki ne pokrivajo središča celic.

Najboljša rešitev: **premaknemo številke v absolutno pozicioniran div** ki je v DOM-u po SVG overlayu — ali pa SVG overlay damo v `z-index: 5` in številke v `z-index: 10`. Ker pa so številke v grid celicah (normalen DOM flow) in SVG je absolute, bo SVG vedno nad njimi.

**Implementacija**: Dodamo drugi overlay div za številke, ki je absolutno pozicioniran ZA SVG overlayem (višji z-index):

```
<div class="absolute inset-0 grid pointer-events-none z-10">
  {/* samo številke, brez ozadja */}
  {cells.map(cell => <div key={...} style={{position in grid}}>{cell.pos}</div>)}
</div>
```

To zagotovi da so številke vedno vidne, ne glede na debelino kač.

---

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | Sprememba SNAKES: `40→31`, `24→10` |
| `src/components/games/KaceLestveBoard.tsx` | Tanjše kače (strokeWidth 4.5/3.2), manjša krivina (0.22), tanjše lestve (2.2/1.6), dodamo absolutni overlay za številke z `z-index: 10` nad SVG |

---

### Povzetek vizualnih popravkov

- Kače bodo vitke in elegantne kot na referenčni sliki
- Lestve bodo tanjše in jasnejše
- Številke bodo VEDNO vidne, ker jih prikažemo v ločenem absolutnem sloju nad SVG overlayem
- Kačine krivine bodo bolj naravne (manj dramatične)
- Poziciji kač sta posodobljeni: 24→10 in 40→31
