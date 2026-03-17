

# Mobilna prilagoditev: odstranitev breadcrumbov, oranžen gumb za nazaj, prilagoditev kartic

## Pregled

Tri sklope sprememb:
1. **Odstranitev breadcrumb navigacije na mobilni verziji** — povsod
2. **Oranžen floating gumb za nazaj** na mobilni verziji na vseh straneh, ki vodi eno stran nazaj v hierarhiji
3. **Prilagoditev kartic za izbiro glasov** na mobilni verziji po vzoru `/video-navodila` (3-stolpčna mreža, manjše kartice brez opisa)

Desktop ostane nespremenjen.

---

## 1. Odstranitev breadcrumbov na mobilni verziji

Namesto spreminjanja vsakega fajla posebej, spremenim `BreadcrumbNavigation.tsx` — na začetku komponente dodam `useIsMobile()` preverjanje. Če je mobilna naprava, komponenta vrne `null`.

**Datoteka:** `src/components/BreadcrumbNavigation.tsx`
- Uvozi `useIsMobile`
- Na vrhu `BreadcrumbNavigation()` dodaj: `if (isMobile) return null;`

To pokrije vse strani naenkrat (cca 15+ strani), brez posameznega urejanja.

---

## 2. Oranžen floating gumb za nazaj

Strani, ki že imajo ta gumb na mobilni verziji in ga ne potrebujejo spremeniti:
- `GovorneIgre.tsx` → nazaj na `/moje-aplikacije` ✓
- `SpominGames.tsx`, `KoloSreceGames.tsx`, `MetKockeGames.tsx`, `BingoGames.tsx`, `KaceLestveGames.tsx`, `PonoviPoved.tsx`, `Labirint.tsx`, `Zaporedja.tsx`, `IgraUjemanja.tsx`, `DrsnaSestavljanka.tsx`, `SestavljankeGames.tsx` → nazaj na `/govorne-igre` ✓

Strani, ki **potrebujejo dodan** oranžen gumb na mobilni verziji:

| Stran | Datoteka | Nazaj na |
|-------|----------|----------|
| Govorne vaje | `GovornojezicovneVaje.tsx` | `/moje-aplikacije` |
| Video navodila (seznam) | `VideoNavodila.tsx` | `/govorno-jezikovne-vaje` |
| Vizualni prikaz ustnic | `VizualniPrikazUstnic.tsx` | `/govorno-jezikovne-vaje` |
| Artikulacija vaje | `ArtikulacijaVaje.tsx` | `/govorno-jezikovne-vaje` |
| Moje aplikacije (Govor) | `MojeAplikacije.tsx` | `/` (domov) |
| Logopedski nasveti | `LogopedskiKoticek.tsx` | `/` |
| Moji izzivi arhiv | `MojiIzziviArhiv.tsx` | `/moji-izzivi` |
| Pogosta vprašanja | `PogostaVprasanja.tsx` | `/logopedski-koticek` |
| Govorno-jezikovne težave | `GovornoJezikovneTezave.tsx` | `/logopedski-koticek` |
| Vaje za jezik | `VajeZaJezik.tsx` | `/govorno-jezikovne-vaje` |

Vzorec gumba (enak kot v `GovorneIgre.tsx`):
```tsx
{isMobile && (
  <Button
    onClick={() => navigate("[parent-path]")}
    className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
    size="icon"
  >
    <ArrowLeft className="h-6 w-6 text-white" />
  </Button>
)}
```

Za strani pod `/govorno-jezikovne-vaje` (VizualniPrikazUstnic, GenericVideoNavodila) ki že imajo oranžen floating gumb — preverim da kaže na pravilno predhodno stran.

---

## 3. Prilagoditev kartic za izbiro glasov na mobilni verziji

Trenutno večina letter-selection strani na mobilni verziji uporablja `grid-cols-2 gap-4` z `aspect-square` slikami in besedilom pod sliko.

Po vzoru `/video-navodila` spremenimo na mobilni verziji:
- Mreža: `grid-cols-3 gap-2` namesto `grid-cols-2 gap-4`
- Slika: `aspect-[4/3]` namesto `aspect-square`
- Besedilo: manjši padding (`p-1.5`), manjša pisava (`text-xs`), brez opisa
- Ime: samo naslov (npr. "Glas S") v `text-center`

**Datoteke za spremembo** (letter-selection strani):
- `SpominGames.tsx`
- `KoloSreceGames.tsx`
- `MetKockeGames.tsx`
- `BingoGames.tsx`
- `KaceLestveGames.tsx`
- `PonoviPoved.tsx`
- `Labirint.tsx`
- `Zaporedja.tsx`
- `IgraUjemanja.tsx`
- `DrsnaSestavljanka.tsx`
- `SestavljankeGames.tsx`
- `ArtikulacijaVaje.tsx`

Desktop ostane nespremenjen (3-stolpčna mreža z velikimi karticami).

---

## Povzetek datotek

| # | Datoteka | Sprememba |
|---|----------|-----------|
| 1 | `BreadcrumbNavigation.tsx` | Skrij na mobilni (1 vrstica) |
| 2 | `GovornojezicovneVaje.tsx` | Dodaj back gumb |
| 3 | `VideoNavodila.tsx` | Dodaj back gumb |
| 4 | `MojeAplikacije.tsx` | Dodaj back gumb |
| 5 | `LogopedskiKoticek.tsx` | Dodaj back gumb |
| 6 | `MojiIzziviArhiv.tsx` | Dodaj back gumb |
| 7 | `PogostaVprasanja.tsx` | Dodaj back gumb |
| 8 | `GovornoJezikovneTezave.tsx` | Dodaj back gumb |
| 9 | `VajeZaJezik.tsx` | Dodaj back gumb |
| 10 | `ArtikulacijaVaje.tsx` | Dodaj back gumb |
| 11 | `VizualniPrikazUstnic.tsx` | Popravi back gumb pot |
| 12-22 | 11 letter-selection strani | Mobilne kartice: 3 stolpci, manjše |

