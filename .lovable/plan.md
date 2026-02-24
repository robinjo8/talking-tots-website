

## Popravek: Igra ujemanja - prilagoditev na telefonu (brez scrollanja)

### Problem

Ko je igra ujemanja na telefonu v landscape nacinu, hook `useDynamicTileSize` vrne **fiksno velikost 80px** za vse kartice, ne glede na velikost zaslona telefona. Na manjsih telefonih to pomeni, da se kartice ne prilegajo zaslonu in je potrebno scrollati.

Labirint tega problema nima, ker dinamicno izracuna velikost celic iz dejanskih dimenzij zaslona.

### Koren problema

V `src/hooks/useDynamicTileSize.ts`, vrstica 23:
```text
if (isLandscape) return 80; // Fiksna vrednost - NE prilagaja se zaslonu!
```

In vrstica 28:
```text
if (isLandscape) return; // Ne posodablja velikosti ob spremembi zaslona
```

### Resitev

Namesto fiksne velikosti 80px za mobilni landscape nacin, uporabimo **enako dinamicno logiko** kot za desktop, le z manjsim paddingom in manjsim gap-om, ker je na telefonu manj prostora.

### Tehnicna sprememba

**`src/hooks/useDynamicTileSize.ts`** - edina datoteka, ki jo je treba spremeniti:

Odstranimo fiksno vrednost `80` za landscape in namesto tega izracunamo velikost kartic glede na dejanski zaslon:

```text
// PREJ:
if (isLandscape) return 80;
...
if (isLandscape) return; // ne resize-a

// POTEM:
if (isLandscape) {
  return calculateTileSize(
    window.innerWidth, window.innerHeight,
    numColumns, numRows,
    40,   // manj vertikalnega paddinga (namesto 120)
    40,   // manj horizontalnega paddinga (namesto 80)
    4,    // manjsi gap (namesto 16)
    120   // manjsi max (namesto 180)
  );
}
```

In v useEffect dodamo resize listener tudi za landscape, z istimi parametri.

### Kaj ostane nespremenjeno

- **Desktop** - brez sprememb (racunalnik ze deluje pravilno)
- `GenericIgraUjemanjaGame.tsx` - brez sprememb
- `MatchingGame.tsx`, `ThreeColumnGame.tsx`, `FourColumnGame.tsx` - brez sprememb (ze uporabljajo `useDynamicTileSize`)
- `ImageTile.tsx` - brez sprememb

### Kaj to pomeni za uporabnike

- Na **majhnem telefonu**: kartice bodo manjse, a vse vidne brez scrollanja
- Na **vecjem telefonu/tablici**: kartice bodo vecje, ker je vec prostora
- Na **racunalniku**: brez sprememb

