

## Plan: Popravi naslov Album sekcije + odstrani ArticulationTestSection iz /moja-stran

### 1. Naslov "Album zmajčka Tomija" — poenoti stil

Trenutno ima `AlbumSection.tsx` naslov s stilom:
```
text-xs font-bold tracking-widest text-muted-foreground uppercase
```

Naslov "IGRE IN VAJE" v `UnifiedProgressDisplay.tsx` pa ima stil:
```
text-2xl font-bold text-center text-app-blue
```

To sta dva različna pristopa — "IGRE IN VAJE" je znotraj kartice kot naslov kartice, medtem ko "Album zmajčka Tomija" je zunaj kartice kot sekcijski podnaslov.

**Popravek**: V `AlbumSection.tsx` zamenjam naslov `<h2>` z enakim stilom kot imajo naslovi kartic v ProgressSection — `text-2xl font-bold text-center text-amber-500` (ali `text-app-blue`), da bo konsistenten z ostalimi sekcijami na tej strani.

### 2. PREVERJANJE IZGOVORJAVE — odstrani iz /moja-stran

**Datumi**: Prikaz je pravilen — zadnji test 26. september 2026, naslednji test 3 mesece pozneje (26. december 2026). To je normalno delovanje "Smart Cooldown" logike (90 dni).

**Podvajanje**: Ista informacija je že prikazana na strani `/profile` v zavihku "Preverjanje izgovorjave" (`ArticulationTestProfileSection`), kjer je bolj podrobna in vključuje tudi gumb za začetek testa, reset itd.

**Popravek**: Odstranim `<ArticulationTestSection />` iz `MojaStran.tsx`. Stran `/moja-stran` naj prikazuje samo napredek (pokali, zmajčki, zvezdice) in album — preverjanje izgovorjave pa ostane na `/profile`.

### Spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/progress/AlbumSection.tsx` | Naslov `<h2>` dobi stil `text-2xl font-bold text-center text-amber-500 mb-4` |
| `src/pages/MojaStran.tsx` | Odstrani import in uporabo `ArticulationTestSection` |

### Obseg
- 2 datoteki, ~5 vrstic spremenjenih
- Brez novih komponent ali routov

