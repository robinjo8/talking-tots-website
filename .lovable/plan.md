
## Popravki: Snemanje 3s, sporočila o tišini/šumu, odstranitev kače iz dialoga, fix animacije 16→17

### 1. Snemanje — 3 sekunde, sporočili, gumb PONOVI

**Problem:** `RECORDING_DURATION = 4` v `KaceLestveWordDialog.tsx`. Poleg tega ni ločenih sporočil za "tišina" vs "šum zaznan" — samo generično "Zvok ni bil zaznan".

**Rešitev v `KaceLestveWordDialog.tsx`:**

- Spremenimo `RECORDING_DURATION` iz `4` na `3`
- Dodamo logiko za razlikovanje med tišino in šumom: `useAudioRecording` že vrne `isSilent` in `audioBase64`. Tišina = ni bil zaznan noben zvok (`isSilent === true`). Šum = zvok zaznan a ne prepoznan (ni pravilna beseda, `isSilent === false`, `wrongWord === null` in `phase === 'fail'`). Torej:
  - `isSilent && phase === 'fail'` → "Zvok ni bil zaznan"
  - `!isSilent && phase === 'fail' && !wrongWord` → "Zaznan je bil šum, ne govor"
  - `!isSilent && phase === 'fail' && wrongWord` → "Slišano: "{wrongWord}""
- Gumb PONOVI se pojavi pri vseh `fail` stanjih (tudi `isSilent`)

**Sprememba v `renderActionArea()`:**

```tsx
// RECORDING_DURATION: 4 → 3

// Staro:
if (isSilent && phase === "fail") {
  return (
    ...
    <p>Zvok ni bil zaznan</p>
    <button>Poskusi znova</button>
  );
}

// Novo — en blok za vse fail primere:
if (phase === "fail") {
  let message = "";
  if (isSilent) {
    message = "Zvok ni bil zaznan";
  } else if (!wrongWord) {
    message = "Zaznan je bil šum, ne govor";
  } else {
    message = `Slišano: "${wrongWord}"`;
  }
  return (
    <div ...>
      <p className="text-red-600 font-medium text-sm">{message}</p>
      <button onClick={handleRetry}>PONOVI</button>
    </div>
  );
}
```

---

### 2. Odstranitev ikone kače iz pop-up okna med snake challengem

**Problem:** Ko se odpre dialog med izzivom kače (`isSnakeChallenge={true}`), se v glavi dialoga prikaže `🐍` ikona in besedilo "IZZIV NA KAČI!".

**Zahtevano:** Ikono kače odstraniti — ohraniti samo besedilo "IZZIV NA KAČI!" (ali sploh brez glave, samo dialog z besedo).

**Rešitev v `KaceLestveWordDialog.tsx`**, v `{isSnakeChallenge ? ... : ...}` bloku glave dialoga:

```tsx
// STARO:
{isSnakeChallenge ? (
  <div className="text-center">
    <p className="text-2xl mb-1">🐍</p>   ← TO ODSTRANIMO
    <h2 className="text-lg font-bold text-red-500">IZZIV NA KAČI!</h2>
    <p className="text-sm text-muted-foreground">Pravilno izgovori in ostani na mestu!</p>
  </div>
) : (

// NOVO:
{isSnakeChallenge ? (
  <div className="text-center">
    <h2 className="text-lg font-bold text-red-500">IZZIV NA KAČI!</h2>
    <p className="text-sm text-muted-foreground">Izgovori besedo</p>
  </div>
) : (
```

---

### 3. Popravek animacije — čuden skok med poljem 16 in 17

**Vzrok težave:**

Ko hop animacija konča (zadnji korak), se v `KaceLestveBoard.tsx` po `HOP_INTERVAL_MS + 80` ms resetira `hopDisplayPositions[activePlayerIdx]` na `null`. V tistem trenutku:
- `isHopping` postane `false`
- `displayPos` preide iz hop pozicije nazaj na `player.position` (ki je bila posodobljena v `gameState` na začetku)
- Ker je `player.position` == zadnja hop pozicija, bi moralo biti enako — ampak **problem je sekvenca**: `hopDisplayPositions` se resetira na `null` **preden** se `onAvatarLanded` pokliče

Poglejmo kodo:
```tsx
if (i === hoppingPositions.length - 1) {
  setTimeout(() => {
    setHopDisplayPositions(prev => {    // ← 1. resetira displayPos na null
      const next = [...prev];
      next[activePlayerIdx] = null;    //   → isHopping = false → non-hop transition (1.8s)
      return next;                     //   → displayPos = player.position
    });
    onAvatarLanded?.(activePlayerIdx); // ← 2. pokliče onAvatarLanded
  }, HOP_INTERVAL_MS + 80);
}
```

Ko se `hopDisplayPositions[idx]` postavi na `null`, `isHopping` postane `false`. `displayPos` se takrat preklopi na `player.position`. Ker sta vrednosti enaki (oboje = zadnja pozicija), ni vidnega skoka... a **ni nujno vedno tako** — odvisno od tega, kdaj React batch-a state updataje.

**Dejanski vzrok:** Ko se zmajček giba s polja 16 (fizična 18) na polje 17 (fizična 19), se obe polji nahajata na istem stolpcu (stolpec 5, skrajno desno), v sosednjih vrsticah. Med hop animacijo, ko `hopDisplayPositions` prikaže pozicijo 18 (display 16), nato pa takoj 19 (display 17), framer-motion interpolira med tema dvema pozicijama z `tween 0.26s`. Ker sta obe poziciji na skrajno desni strani, je premik kratka navpična animacija. To je normalno.

**Pravi razlog** za "čuden skok" je verjetno ta: Ko je zmajček na polju 16 (display) in naredi hop na polje 17 (display), ter je polje 17 **glava kače** (ker `SNAKES[19] = 9`, torej fizična 19 = glava kače), se takoj po pristanku aktivira `animStep = 'moving_to_final'` in zmajček skoči na rep (fizična 9 = display 7). Ta skok je hiter in nenadejoven.

Dejansko je `SNAKES[21] = 9` — display 19 → 7. Polje 17 (display) = fizična 19, kar pa **ni** glava kače. Fizična 21 = display 19 je glava kače.

Torej problem ni pri kači. Fizična 18 (display 16) je v vrstici 4, stolpec 5, in fizična 19 (display 17) je v vrstici 3, stolpec 5. Pri `hopDisplayPositions` animaciji se prikaže vsak korak posebej. Ko pa `hopDisplayPositions` preide iz ene vrednosti na drugo, se `isHopping` vsakič postavi na `true`, torej se za to uporabi `tween 0.26s`. Ni posebnega skoka.

**Možen dejanski problem:** Ko se aktivna pozicija med hopping-om posodobi in nato resetira nazaj, obstaja en frame kjer je `isHopping = false` in `displayPos = player.position`. Ker je `player.position` že bil posodobljen na končno pozicijo takoj ob metu kocke (v `handleDiceRollComplete`), se zmajček med hopping-om ko je `hopDisplayPositions = null` vidi na končni poziciji, ne na začetni. Ko se hop začne, hopDisplayPositions[idx] dobi vrednost 1. koraka, in ker se `isHopping` postavi na `true`, se za premik iz končne pozicije do 1. koraka uporabi kratka `tween 0.26s` animacija. **Ampak** se zmajček vizualno začne premikati od *zadnje* pozicije (ki je bila posodobljena v `gameState.positions`) do prvega hopa — to pomeni, da se zmajček na začetku hopa premakne **od končne pozicije nazaj k začetku** in potem naprej!

**To je dejanski bug:** `gameState.positions[currentPlayer]` je takoj posodobljen na `newPos` (končna pozicija), `hopDisplayPositions` pa postopoma prihaja od `currentPos+1` do `newPos`. Torej preden se `hopDisplayPositions[activePlayerIdx]` postavi na prvo vrednost, `displayPos` prikaže `newPos`. Ko `hopDisplayPositions` postane 1. korak, se zmajček premakne od `newPos` do `1. koraka` — to je skok *nazaj*.

**Rešitev:** Dodamo začetno pozicijo v `hopDisplayPositions` še preden se hopi začnejo, ali pa shranjujemo prejšnjo pozicijo v `hoppingPositions` array vključno z začetno:

V `KaceLestveGame.tsx`, `handleDiceRollComplete`:
```tsx
// Takoj nastavi displayPos na currentPos (ne newPos) preden začnemo hop
// To naredimo tako, da hoppingPositions vsebuje currentPos+1 ... newPos
// in player.position = currentPos (ne newPos) med hopping-om

// Rešitev: ne posodabljamo gameState.positions takoj, ampak šele po koncu hopov
```

Ampak to bi zahtevalo večjo refaktoriacijo.

**Enostavnejša rešitev:** Shranjujemo začetno pozicijo pred hopingom in jo vrnemo v `hopDisplayPositions` kot `null` (kar pomeni "uporabi `player.position`"). Ker `player.position` je posodobljen na `newPos`, ne bo delovalo.

**Najlažja rešitev:** V `KaceLestveBoard.tsx`, dodamo `initialHopPosition` prop, ki pove kje se zmajček nahaja preden začne hop. Takrat se `hopDisplayPositions[activePlayerIdx]` takoj postavi na to vrednost (brez animacije), preden se pričnejo hop koraki.

Alternativno: v `hoppingPositions` array dodamo `currentPos` kot prvi element (začetna pozicija), in s tem zagotovimo, da se zmajček najprej premakne na `currentPos` (brez hop animacije, ker je to tja kjer je) in potem naprej. To bi pomenilo, da `gameState.positions` ostane na `currentPos` dokler hopinga ne bo konec.

**Najboljša rešitev:** Posodobiti `gameState.positions` šele ko `onAvatarLanded` je klican, ne takoj ob metu kocke. Dodamo `pendingPosition` state.

Toda ker je `gameState.positions` že posodobljen v `handleDiceRollComplete`, bo enostavneje v `KaceLestveBoard.tsx` inicializirati `hopDisplayPositions[activePlayerIdx]` na `hoppingPositions[0]` takoj, ko `hoppingPositions` se nastavi — brez animacijske zakasnitve. To zagotovi, da framer-motion ne vidi "jump" med `newPos` in `hoppingPositions[0]`.

**Konkretna rešitev:** Ko `hoppingPositions` se nastavi, takoj brez timeoutov postavi `hopDisplayPositions[activePlayerIdx] = hoppingPositions[0]`. Potem z timeoutom od `i=1` naprej počakamo `HOP_INTERVAL_MS` med koraki.

```tsx
useEffect(() => {
  hopTimersRef.current.forEach(t => clearTimeout(t));
  hopTimersRef.current = [];

  if (!hoppingPositions || hoppingPositions.length === 0) {
    setHopDisplayPositions([null, null]);
    return;
  }

  // Takoj (brez timeoutov) postavi 1. korak — prepreči "skok nazaj" od newPos
  setHopDisplayPositions(prev => {
    const next = [...prev];
    next[activePlayerIdx] = hoppingPositions[0];
    return next;
  });

  // Nato ostale korake z zakasnitvijo
  hoppingPositions.slice(1).forEach((pos, i) => {
    const timer = setTimeout(() => {
      setHopDisplayPositions(prev => {
        const next = [...prev];
        next[activePlayerIdx] = pos;
        return next;
      });
      if (i === hoppingPositions.length - 2) {
        setTimeout(() => {
          setHopDisplayPositions(prev => {
            const next = [...prev];
            next[activePlayerIdx] = null;
            return next;
          });
          onAvatarLanded?.(activePlayerIdx);
        }, HOP_INTERVAL_MS + 80);
      }
    }, (i + 1) * HOP_INTERVAL_MS);
    hopTimersRef.current.push(timer);
  });

  // Edge case: samo en korak
  if (hoppingPositions.length === 1) {
    setTimeout(() => {
      setHopDisplayPositions(prev => {
        const next = [...prev];
        next[activePlayerIdx] = null;
        return next;
      });
      onAvatarLanded?.(activePlayerIdx);
    }, HOP_INTERVAL_MS + 80);
  }

  return () => { hopTimersRef.current.forEach(t => clearTimeout(t)); };
}, [hoppingPositions, activePlayerIdx, onAvatarLanded]);
```

---

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveWordDialog.tsx` | `RECORDING_DURATION: 4 → 3`, ločena sporočila za tišino/šum/napačna beseda, gumb "PONOVI", odstranitev 🐍 ikone |
| `src/components/games/KaceLestveBoard.tsx` | Fix hop animacije — takoj nastavi 1. korak brez timeoutov da prepreči "skok nazaj" |

