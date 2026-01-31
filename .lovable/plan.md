

# Plan: Popravek shranjevanja zvezdic za igro Spomin in Vaje za jezik

## Povzetek analize

Po pregledu vseh iger v aplikaciji sem odkril **dve težavi**:

### Težava 1: Igra Spomin - avtomatsko shranjevanje
Igra Spomin shranjuje napredek **avtomatsko** ob zaključku igre, namesto ob kliku na gumb "VZEMI ZVEZDICO". To ni skladno s standardom projekta in lahko povzroči podvojeno shranjevanje ali prikaz pokala ob napačnem času.

### Težava 2: Vaje za jezik - manjkajoče shranjevanje
Igra "Vaje za jezik" sploh **ne shranjuje** zvezdic v bazo. Napredek ostaja samo v lokalnem stanju komponente.

---

## Pregled vseh iger

| Igra | Shranjevanje | Pokal | Status |
|------|-------------|-------|--------|
| Spomin | ✅ | ✅ | ⚠️ Napačen sprožilec |
| Bingo | ✅ | ✅ | ✅ Pravilno |
| Kolo besed | ✅ | ✅ | ✅ Pravilno |
| Smešne povedi | ✅ | ✅ | ✅ Pravilno |
| Labirint | ✅ | ✅ | ✅ Pravilno |
| Sestavljanka | ✅ | ✅ | ✅ Pravilno |
| Drsna sestavljanka | ✅ | ✅ | ✅ Pravilno |
| Zaporedja | ✅ | ✅ | ✅ Pravilno |
| Povezi pare | ✅ | ✅ | ✅ Pravilno |
| Igra ujemanja | ✅ | ✅ | ✅ Pravilno |
| Ponovi poved | ✅ | ✅ | ✅ Pravilno |
| Vaje za jezik | ❌ | ❌ | ❌ Ne shranjuje |

---

## Tehnične spremembe

### Sprememba 1: Popravek igre Spomin

**Datoteka:** `src/hooks/useGenericMemoryGame.tsx`

Odstrani avtomatsko shranjevanje iz `useEffect` in dodaj callback za gumb "VZEMI ZVEZDICO":

1. Odstrani `recordGameCompletion` in `checkForNewTrophy` iz `useEffect`
2. Dodaj novo funkcijo `handleClaimStar` ki jo vrne hook
3. Posodobi `GenericSpominGame.tsx` da kliče `handleClaimStar` ob kliku na gumb

**Datoteka:** `src/components/games/GenericSpominGame.tsx`

Posodobi gumb "VZEMI ZVEZDICO" da pokliče `handleClaimStar` funkcijo iz hooka.

### Sprememba 2: Dodaj shranjevanje za Vaje za jezik

**Datoteka:** `src/components/games/TongueGymGame.tsx`

1. Dodaj importe za `useEnhancedProgress` in `useTrophyContext`
2. Ob zaključku vseh vaj (ko `allCompleted = true`) prikaži "BRAVO!" dialog
3. Ob kliku na "VZEMI ZVEZDICO" shrani napredek s `recordExerciseCompletion('vaje_za_jezik', 3)` (3 zvezdice za vse vaje)
4. Pokliči `checkForNewTrophy()`

---

## Prizadete datoteke

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useGenericMemoryGame.tsx` | Prestavi shranjevanje iz avtomatskega v callback |
| `src/components/games/GenericSpominGame.tsx` | Posodobi gumb VZEMI ZVEZDICO |
| `src/components/games/TongueGymGame.tsx` | Dodaj shranjevanje napredka |

---

## Testiranje

### Test 1: Spomin
1. Odpri igro `/govorne-igre/spomin/c`
2. Zaključi igro (najdi vseh 10 parov)
3. Preveri, da se zvezdica NE shrani dokler ne klikneš "VZEMI ZVEZDICO"
4. Klikni "VZEMI ZVEZDICO"
5. Preveri na `/moja-stran` da se je zvezdica prištela

### Test 2: Vaje za jezik
1. Odpri `/vaje-za-jezik`
2. Zaključi vse vaje
3. Preveri, da se prikaže zaključni dialog
4. Klikni "VZEMI ZVEZDICO"
5. Preveri na `/moja-stran` da so se prištele 3 zvezdice

### Test 3: Pokal
1. Doseži 100 zvezdic
2. Preveri, da se pokal prikaže ob kliku na "VZEMI ZVEZDICO" (ne prej)

