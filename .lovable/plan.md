
Cilj popravka je, da bo **Igra ujemanja** na telefonu (landscape) vedno 100% vidna brez odrezanih kartic in brez scrollanja, ne glede na model telefona, pri tem pa **desktop ostane nespremenjen**.

### Kaj je trenutno narobe (na podlagi kode in screenshota)

1. `useDynamicTileSize` računa velikost kartic iz `window.innerHeight`, kar na mobilnih brskalnikih ni vedno dejanska vidna višina (dinamični browser UI, notch/safe-area, različne vrstice).
2. Izračun ne upošteva dovolj natančno celotnega vertikalnega “footprinta”:
   - razmikov med vrsticami,
   - progress bara + `mt-4`,
   - notranjih paddingov kontejnerja,
   - floating gumbov in safe-area.
3. Kartice imajo scale efekte (`hover:scale-105`, `isSelected -> scale-105`), ki lahko na tesnih zaslonih povzročijo, da vsebina “uide” iz vidnega območja.
4. Popravek z večjim `paddingVertical` (40 -> 70) je preveč “grob” in ne deluje konsistentno na vseh telefonih.

---

### Načrt izvedbe (samo mobilni del, desktop brez sprememb)

## 1) Natančen izračun tile size glede na realni vidni viewport
**Datoteka:** `src/hooks/useDynamicTileSize.ts`

- Dodam mobilno-landscape pot, ki uporablja `window.visualViewport?.height/width` (fallback na `window.innerHeight/innerWidth`).
- Izračun preoblikujem tako, da direktno računa največji možni `tileSize` iz celotnega footprinta:

```text
tileByHeight = floor((usableHeight - reservedVertical - (numRows - 1) * gap) / numRows)
tileByWidth  = floor((usableWidth  - reservedHorizontal - (numColumns - 1) * gap) / numColumns)
tileSize = min(tileByHeight, tileByWidth, maxTileSize)
tileSize = max(tileSize, minTileSize)
```

- `reservedVertical` bo vključeval:
  - progress območje (tudi ko ni dokončano),
  - padding kontejnerja,
  - varnostni rob za safe-area / browser chrome variacije.
- Dodam listenerje za:
  - `resize`,
  - `orientationchange`,
  - `visualViewport.resize` in `visualViewport.scroll` (kjer podprto),
  da se velikost osveži takoj ob spremembah UI brskalnika.

## 2) Odstranitev “overflow” transform efektov na telefonu
**Datoteke:**
- `src/components/matching/ImageTile.tsx`
- `src/components/matching/MatchingGame.tsx`
- `src/components/matching/ThreeColumnGame.tsx`
- `src/components/matching/FourColumnGame.tsx`

- Dodam flag (npr. `disableScaleEffects`) za mobilni landscape.
- Na touch-landscape:
  - izklopim `hover:scale-105`,
  - izklopim `scale-105` pri selected tile.
- Vizualni feedback ostane preko border/barve/overlay, brez povečanja elementa, da nič ne “potisne” mreže iz zaslona.

## 3) Rezerviran “safe” igralni prostor v `GenericIgraUjemanjaGame` (samo mobile)
**Datoteka:** `src/components/games/GenericIgraUjemanjaGame.tsx`

- Za `isTouchDevice` pustim fullscreen strukturo, ampak game območju dodam eksplicitne notranje odmike (top/bottom), ki upoštevajo:
  - safe-area (`env(safe-area-inset-*)`),
  - prostor za spodnje floating gumbe.
- To prepreči, da bi se mreža centrirala čez prostor, kjer je UI prekrit z gumbi ali sistemsko vrstico.
- **Desktop branch se ne spreminja.**

## 4) Umeritev parametrov po tipih iger (2/3/4 stolpci)
**Datoteke:**
- `MatchingGame.tsx`
- `ThreeColumnGame.tsx`
- `FourColumnGame.tsx`

- Hooku podam konsistentne mobilne parametre (gap, reserved space), prilagojene številu stolpcev/vrstic.
- Ohranimo obstoječe vedenje za desktop (`isLandscape = false`) brez sprememb.

---

### Zakaj bo ta pristop stabilen na “vsakem telefonu”

- Ne temelji na eni fiksni številki (`70`) ampak na dejanski vidni površini.
- Upošteva celoten layout footprint (ne samo mreže).
- Odstrani transform povečave, ki na majhnih zaslonih pogosto povzročijo odrezane robove.
- Reagira na dinamične spremembe browser UI (kar je pogost vzrok “enkrat je OK, drugič ni”).

---

### Tehnična sekcija (implementacijska zaporedja)

1. Posodobitev `useDynamicTileSize`:
   - helper `getViewportSize()`,
   - helper `calculateLandscapeTileSize()` z reserved vrednostmi,
   - robustni listenerji (`resize`, `orientationchange`, `visualViewport`).
2. Posodobitev tile komponent:
   - nov prop za on/off scale efektov,
   - conditional className za mobile landscape.
3. Posodobitev `GenericIgraUjemanjaGame` mobile wrapperja:
   - varni paddings + rezerviran spodnji prostor.
4. Parametri hooka v vseh treh matching variacijah.
5. Verifikacija scenarijev:
   - majhen Android (npr. 360x800 landscape),
   - večji Android,
   - iPhone Safari/Chrome landscape,
   - preverba, da desktop ostane enak.

---

### Kriteriji uspeha

- Na telefonu v landscape:
  - ni scrollanja,
  - nobena kartica ni odrezana (zgoraj/spodaj/levo/desno),
  - progress bar je viden,
  - floating gumbi ne prekrivajo igralnega območja.
- Ob tapu na kartico se layout ne “razbije” in nič ne uide iz zaslona.
- Desktop izgled/vedenje igre ujemanja ostane nespremenjen.
