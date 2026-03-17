

# Poenotenje oranžnega gumba "nazaj" po celotni aplikaciji

## Problem
Obstajata dva različna sloga oranžnega gumba za nazaj:
- **Slog A (referenčni - GenericVideoNavodila, VizualniPrikazUstnic):** `w-16 h-16`, gradient (`from-amber-400 to-orange-500`), `border-2 border-white/50`, `backdrop-blur-sm`, `bottom-4 left-4`, ikona `w-7 h-7`
- **Slog B (ostale strani):** `h-14 w-14`, enobarvni (`bg-app-orange`), brez obrobe, `bottom-6 left-6`, ikona `h-6 w-6`, uporaba `<Button>` komponente

## Kaj se NE spreminja
Gumbi s hišico (Home) v igrah ostanejo nespremenjeni -- te imajo DropdownMenu in Home ikono.

## Spremembe
Vseh 21 datotek z `bg-app-orange` ArrowLeft gumbom se posodobi na referenčni slog:

**Iz:**
```
<Button onClick={...} className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg" size="icon">
  <ArrowLeft className="h-6 w-6 text-white" />
</Button>
```

**V:**
```
<button onClick={...} className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all">
  <ArrowLeft className="w-7 h-7 text-white" />
</button>
```

### Datoteke za posodobitev (21 datotek):
1. `src/pages/VideoNavodila.tsx`
2. `src/pages/GovornojezicovneVaje.tsx`
3. `src/pages/GovorneIgre.tsx`
4. `src/pages/MojeAplikacije.tsx`
5. `src/pages/LogopedskiKoticek.tsx`
6. `src/pages/VajeZaJezik.tsx`
7. `src/pages/ArtikulacijaVaje.tsx`
8. `src/pages/MojiIzziviArhiv.tsx`
9. `src/pages/MetKockeGames.tsx`
10. `src/pages/KoloSreceGames.tsx`
11. `src/pages/BingoGames.tsx`
12. `src/pages/SpominGames.tsx`
13. `src/pages/SestavljankeGames.tsx`
14. `src/pages/DrsnaSestavljanka.tsx`
15. `src/pages/KaceLestveGames.tsx`
16. `src/pages/IgraUjemanja.tsx`
17. `src/pages/Labirint.tsx`
18. `src/pages/Zaporedja.tsx`
19. `src/pages/PonoviPoved.tsx`
20. `src/pages/clanki/GovornoJezikovneTezave.tsx`
21. `src/pages/clanki/PogostaVprasanja.tsx`

### Ključne razlike:
| Lastnost | Prej (Slog B) | Po (Slog A) |
|----------|---------------|-------------|
| Velikost | h-14 w-14 (56px) | w-16 h-16 (64px) |
| Pozicija | bottom-6 left-6 | bottom-4 left-4 |
| Ozadje | bg-app-orange | gradient amber→orange |
| Obroba | brez | border-2 border-white/50 |
| Element | `<Button>` | `<button>` |
| Ikona | h-6 w-6 | w-7 h-7 |

Navigacijska logika (kam vodi gumb) in `isMobile` pogoj ostaneta nespremenjena.

