

## Popravek shranjevanja napredka pri preverjanju izgovorjave

### Problem

V bazi je `current_word_index = 1` (po PAJEK), čeprav ste uspešno izgovorili tudi BIK in šli naprej na MIZO. To pomeni, da se shranjevanje napredka za BIK ni izvedlo, kljub temu da je bila transkripcija sprejeta.

Vzrok: shranjevanje napredka se izvede v `handleRecordingComplete` takoj po transkripciji, vendar to ne zagotavlja, da se je dejansko uspešno shranilo PREDEN uporabnik klikne "Naprej". Poleg tega se pri ponovnem snemanju iste besede (prvi poskus neuspešen, drugi uspešen) lahko pojavi težava s časovnim zaporedjem (race condition).

### Rešitev

Napredek se mora shraniti ob kliku na **"Naprej"** (v `handleNext`), ne pa ob koncu snemanja. To zagotavlja:
1. Napredek se shrani šele ko uporabnik dejansko napreduje na naslednjo besedo
2. Ni možnosti za izgubo napredka zaradi časovnih težav
3. Deluje enako za 20-besedni (skupina 3-4) in 60-besedni test

### Spremembe

**`src/hooks/useArticulationTestNew.ts`**:

1. Odstrani shranjevanje iz `handleRecordingComplete` (vrstice 225-229)
2. Dodaj shranjevanje v `handleNext` -- ko uporabnik klikne naprej, shrani trenutni indeks:

```text
// handleNext
const handleNext = () => {
  // Shrani napredek PRED premikom na naslednjo besedo
  if (childId && sessionNumber && onSaveProgress) {
    onSaveProgress(childId, sessionNumber, currentWordIndex);
  }
  
  if (currentWordIndex < totalWords - 1) {
    setCurrentWordIndex(currentWordIndex + 1);
    // ...reset state
  } else {
    setIsTestComplete(true);
  }
};
```

To pomeni: napredek se shrani vedno ko uporabnik klikne "Naprej", ne glede na to ali je bila transkripcija sprejeta ali ne (gumb "Naprej" je viden samo po snemanju). Velja za oba portala (uporabniški in admin), saj oba uporabljata isti hook.

### Vpliv

- Uporabniški portal: pravilno shranjevanje in nadaljevanje
- Admin portal: ista logika, ista popravka
- Dialog za nadaljevanje bo pravilno pokazal zadnjo izgovorjeno besedo
- Nobena druga funkcionalnost se ne spremeni
