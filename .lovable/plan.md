

## Popravek: Spomin in Zaporedja -- desktop prikaz brez scrollanja

### Diagnoza

**Spomin (desktop) -- "katastrofa":**
Moja prejsnja sprememba je pokvarila desktop prikaz. Problem je v `MemoryGrid.tsx` -- dinamicno racunanje velikosti kartic (vrstice 53-68) se izvaja SAMO ko je `isLandscape=true`. V desktop nacinu (`isLandscape=false`) se kartice velikostno dolocajo s CSS `1fr` stolpci in `maxHeight: calc((100vh - 120px) / rows)`, kar v kombinaciji z `overflow-hidden` na zunanjem kontejnerju povzroca premajhne ali nepravilno prikazane kartice.

**Zaporedja (desktop):**
Desktop verzija (vrstice 346-443 v `GenericZaporedjaGame.tsx`) se nikoli ni spremenila -- se vedno uporablja `overflow-auto` + `min-h-full` + `pb-24`, kar povzroca scrollanje.

### Kako deluje Labirint (referenca)

Labirint racuna `CELL_SIZE` iz dejanskih dimenzij okna:
```text
CELL_SIZE = min(
  (availableWidth - padding) / columns,
  (availableHeight - padding) / rows
) * 0.99
```
Canvas se nastavi na tocne piksle -- nikoli ne preseze okna, ne glede na velikost brskalnika.

### Popravki

## 1) MemoryGrid -- dinamicno racunanje kartic tudi za desktop
**Datoteka:** `src/components/games/MemoryGrid.tsx`

Trenutno: `cardSize` se racuna samo ko `isLandscape=true` (vrstica 54). V desktop nacinu (`isLandscape=false`) se uporablja CSS `1fr` z `maxHeight`, kar ne deluje zanesljivo.

Popravek:
- Odstranim pogoj `if (!isLandscape ...)` iz `cardSize` izracuna
- Za desktop racunam enako kot za landscape, le z drugimi rezerviranimi prostori:
  - Desktop: `reservedVertical = 120` (naslov + progress + padding), `reservedHorizontal = 100`
  - Landscape: `reservedVertical = 8`, `reservedHorizontal = 8` (kot zdaj)
- Grid vedno uporablja eksplicitne pikselske dimenzije (kot canvas v Labirintu)
- Odstranim CSS fallback z `1fr` in `maxHeight: calc(...)` -- vse preko pikslov

## 2) GenericSpominGame -- desktop kontejner popravek
**Datoteka:** `src/components/games/GenericSpominGame.tsx`

Trenutna desktop verzija (vrstica 300-436) ima `fixed inset-0 overflow-hidden` kar je OK, ampak grid wrapper `max-w-4xl mx-auto` (vrstica 323) ne daje pravilnega konteksta za centriranje.

Popravek:
- Grid wrapper dobi `flex-1 flex items-center justify-center` za vertikalno centriranje (kot Labirint, ki ima `justify-start pt-8`)
- Ohranim `fixed inset-0 overflow-hidden` (pravilno)
- Naslov in progress ostanejo na vrhu, grid se centrira v preostalem prostoru

## 3) GenericZaporedjaGame -- desktop verzija brez scrollanja
**Datoteka:** `src/components/games/GenericZaporedjaGame.tsx`

Trenutna desktop verzija (vrstica 346-443):
```text
<div className="fixed inset-0 overflow-auto ...">
  <div className="min-h-full flex flex-col ... p-4 pb-24">
```

Popravek:
- Zamenjam `overflow-auto` z `overflow-hidden`
- Zamenjam `min-h-full` z `h-full`
- Odstranim `pb-24` (floating gumbi so `fixed`, ne rabijo paddinga)
- Dodam `justify-center` na flex kontejner, da se igra centrira vertikalno

## 4) SequenceGame komponente -- desktop velikost
**Datoteke:** Vse `SequenceGame*.tsx` komponente (S, Z, C, SH, ZH, CH, K, L, R) in `SequenceGame56Base.tsx`

Trenutno: `itemSize` se racuna samo ko `isLandscape=true`. V desktop nacinu (`isLandscape=false`) se uporablja CSS `max-w-4xl` z `grid-cols-4`, kar lahko preseze okno.

Popravek:
- Dodam izracun `itemSize` tudi za desktop nastavitve (vecji `reservedVertical` za naslov)
- Ko je `itemSize` definiran, grid uporablja eksplicitne pikselske dimenzije (kot v landscape)
- Desktop bo imel vecje `maxTileSize` omejitve (npr. 180px) za primeren prikaz na vecjih zaslonih

---

### Kaj ostane nespremenjeno
- Mobilni (touch) layout za obe igri -- ze deluje s fullscreen pristopom
- Labirint -- ze deluje odlicno
- Bingo, Kolo besed, Sestavljanka -- ze popravljene v prejsnjem koraku
- Igra ujemanja -- locen popravek ze narejen
- Admin portal -- uporablja iste `Generic*Game` komponente, zato bodo popravki avtomatsko delovali tudi tam (npr. za OŠ Test)

### Vrstni red implementacije
1. `MemoryGrid.tsx` -- dinamicno racunanje za desktop
2. `GenericSpominGame.tsx` -- desktop wrapper popravek
3. `GenericZaporedjaGame.tsx` -- overflow-hidden + centriranje
4. `SequenceGameS.tsx` (in ostale variante) -- desktop itemSize
5. `SequenceGame56Base.tsx` -- desktop itemSize

### Kriteriji uspeha
- Na desktopu ob spremembi velikosti okna se igra sorazmerno povecuje/pomanjsuje (kot Labirint)
- Ni scrollanja pri nobeni velikosti okna
- Kartice/slike so jasno vidne in primerne velikosti
- Na admin portalu deluje enako
- Mobilni layout se ne spremeni
