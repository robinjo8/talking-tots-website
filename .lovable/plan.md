
## Popravek vizualnega izgleda kač in lestve

### Problem

Trenutne kače in lestve izgledajo grdo ker:
- SVG kače imajo preprosto kubično Bezier krivuljo (samo ena krivina) — to ni dovolj za naraven izgled kače
- Linije so predebele glede na velikost celic
- Lestve imajo preveč prečk in so predebele

### Rešitev

Popravimo SVG direktno v kodi za bistveno boljši izgled. S slikami bi bilo lepše, ampak kače se morajo dinamično prilagajati med dvema točkama na tabli — to je s slikami nemogoče doseči brez predračunane orientacije. SVG ostaja najboljša tehnična rešitev, ki jo zgolj drastično izboljšamo.

---

### Kače — izboljšave

Vse 3 kače bodo **modre** (različni odtenki):
- Kača 1 (40→36): `#1565C0` / `#42A5F5` (temnomodra/svetlomodra)
- Kača 2 (21→5): `#0D47A1` / `#64B5F6` (kraljevskomodra/nebesnomodra)
- Kača 3 (24→8): `#1976D2` / `#90CAF9` (srednja modra/ledeno modra)

**Konkretne spremembe SVG kode:**

1. **Vitkejše telo**: `strokeWidth` zmanjšamo iz `4.5` na `2.8` (% viewBox enote)
2. **Boljša krivulja** — namesto enostavne kubične Bezier, bomo izrisali pravo S-krivuljo z dvema kontrolnima točkama, ki ustvari bolj naraven, valovit izgled kače:
   ```
   M head C cp1 cp2 mid S cp3 tail
   ```
   kjer se kontrolne točke izračunajo glede na smer potovanja kače
3. **Manjša senca** (opacity 0.1, offset 0.3)
4. **Vzorec lusk** — bolj subtilen, `strokeWidth="0.8"` (bil je 1.5)
5. **Glava** — ohranimo, ampak `headR` zmanjšamo iz `3.5` na `2.8`
6. **Brez rep kroga** — nadomestimo s konico (trikotnik)

---

### Lestve — izboljšave

Vse 4 lestve bodo **klasično rjave** Disney cartoon slog:
- Rail barva: `#8B5E3C` (temno rjava)
- Rung barva: `#C8972B` (zlato rjava)
- Highlight na tirnicah: `rgba(255,255,255,0.3)` (za 3D efekt)

**Konkretne spremembe SVG kode:**

1. **Tanjše tirnice**: `strokeWidth` iz `3` na `2` 
2. **Manj prečk**: `len / 10` namesto `len / 7` (manj gneče)
3. **Tanjše prečke**: `strokeWidth` iz `2.2` na `1.8`
4. **Wider spacing**: `perpX/Y` povečamo iz `2` na `2.5` (lestev je malo širša)
5. **3D efekt**: dodamo tanko belo linijo vzdolž tirnic za svetlobni odsev:
   ```svg
   <line ... stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
   ```
6. **Zaobljene konce**: dodamo majhne kroge na vrhu in dnu vsake tirnice

---

### Datoteka za spremembo

Samo **`src/components/games/KaceLestveBoard.tsx`**:

| Del | Sprememba |
|-----|-----------|
| `SNAKE_STYLES` | Vse modre barve (3 odtenki modre) |
| `SnakeSVG` | Boljša S-krivulja, vitkejše telo (2.8), manjša glava (2.8), koničasti rep |
| `LADDER_STYLES` | Vse rjave barve (rail + zlato rung) |
| `LadderSVG` | Tanjše linije, manj prečk, 3D highlight, zaobljeni konci |

---

### Vizualni rezultat

**Kače** bodo vitkejše, bolj elegantne modre kače z S-krivuljo, jasno vidno glavo z očmi in nasmeškom, ter koničastim repom.

**Lestve** bodo klasične rjave Disney-slog lestve s sodobnim 3D svetlobnim odsevom na tirnicah in enakomerno razporejenimi prečkami.

Samo ena datoteka, minimalne spremembe, maksimalen vizualni učinek.
