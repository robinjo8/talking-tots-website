

## Popravek: sessionNumber se ne sinhronizira pri nadaljevanju testa

### Problem

Ko uporabnik nadaljuje nedokončan test (klikne "Nadaljuj" v resume dialogu), se `sessionNumber` znotraj `useArticulationTestNew` hooka nikoli ne nastavi. To pomeni, da se napredek NE shranjuje v bazo, ker pogoj `if (childId && sessionNumber && onSaveProgress)` v `handleNext` vedno vrne `false`.

Vzrok: `useState(fixedSessionNumber ?? null)` uporabi samo začetno vrednost. Na prvem renderju je `sessionInfo` še `null`, zato je `fixedSessionNumber` = `undefined` in `sessionNumber` ostane `null` za vedno.

Pri novem testu to deluje, ker uporabnik zapre info dialog, kar pokliče `initializeSession()`, ki nastavi `sessionNumber`. Pri nadaljevanju pa se resume dialog zapre brez klica `initializeSession()`.

### Resitev

Dodati `useEffect` v `useArticulationTestNew.ts` ki sinhronizira `sessionNumber` kadar se `fixedSessionNumber` prop spremeni:

```text
useEffect(() => {
  if (fixedSessionNumber !== undefined && fixedSessionNumber !== null) {
    setSessionNumber(fixedSessionNumber);
    setSessionInitialized(true);
  }
}, [fixedSessionNumber]);
```

To se doda takoj za obstojecim `useEffect` za `startIndex` (vrstica 41-43).

### Sprememba

**`src/hooks/useArticulationTestNew.ts`** - dodaj useEffect za sinhronizacijo sessionNumber:

Za obstojecim blokom:
```text
useEffect(() => {
  setCurrentWordIndex(startIndex);
}, [startIndex]);
```

Dodaj:
```text
useEffect(() => {
  if (fixedSessionNumber !== undefined && fixedSessionNumber !== null) {
    setSessionNumber(fixedSessionNumber);
    setSessionInitialized(true);
  }
}, [fixedSessionNumber]);
```

### Vpliv

- Popravlja shranjevanje napredka pri nadaljevanju testa (resume)
- Velja za 20-besedni test (skupina 3-4) in 60-besedni test
- Ne vpliva na nove teste (tam ze deluje pravilno)
- Ne vpliva na admin portal (uporablja drugacen flow)

