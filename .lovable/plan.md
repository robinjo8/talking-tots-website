

## Igra Kače in lestve - Načrt implementacije

### Pregled funkcionalnosti

Nova igra "KAČE IN LESTVE" bo dodana na stran /govorne-igre kot nova kartica, identična ostalim (Kolo besed, Bingo itd.). Igra bo za glas C (sredina/konec) z besedami iz podanega seznama. Ko pride figurica na polje, se preverjanje izgovorjave izvede prek obstoječe edge funkcije `transcribe-articulation` z Levenshteinovo razdaljo (enako kot `/artikulacijski-test`).

---

### Arhitektura igre

**Pot:** `/govorne-igre/kace` → `/govorne-igre/kace/c` (za zdaj samo C sredina/konec)

**Admin pot:** `/admin/children/:childId/games/kace` → `/admin/children/:childId/games/kace/c`

**Componente (nova igra v `src/components/games/`):**
- `KaceLestveGame.tsx` - glavni komponenta igre
- `KaceLestveBoard.tsx` - risba 8×8 table z lestve in kačami (SVG/CSS)
- `KaceLestveWordDialog.tsx` - dialog za izgovorjavo besede (prikaže sliko, posname glas, pošlje v OpenAI)
- `KaceLestveSettings.tsx` - nastavitve (1 ali 2 igralca, težavnost)
- `KaceLestveSuccessDialog.tsx` - zaključek igre (BRAVO + vzemi zvezdico)

---

### Podatkovna struktura - Polje igre

Polje je 8×8 = 64 polj. Gibanje po poljih sledi vzorcu "boustrophedon":
- Vrstica 1 (spodaj): polja 1–8, levo → desno
- Vrstica 2: polja 9–16, desno → levo
- Vrstica 3: polja 17–24, levo → desno
- ...
- Vrstica 8 (zgoraj): polja 57–64, desno → levo

Posebnosti:
- Polje 1+2 sta ZDRUŽENA (start)
- Polji 63+64 sta ZDRUŽENI (KONEC)

```text
LESTVE (figurica se premakne naprej):
  3  → 16
  8  → 23
  30 → 41
  48 → KONEC (64)

KAČE (figurica pade nazaj):
  35 → 27
  51 → 24
  59 → 47
```

**Posebno pravilo za konec:** Ko je figurica ≤6 polj od cilja, mora pasti točna številka. Če v 5 zaporednih metih ne pade točna številka, se 5. met samodejno nastavi na točno vrednost.

**Bonus za pravilno izgovorjavo:**
- Lahka: +2 polji
- Srednja: +1 polje
- Težka: brez bonusa

**Izziv na kači (glava kače):** Če figurica pristane na glavi kače, mora otrok izgovoriti eno naključno sliko iz nabora. Če uspe → ostane; če ne → gre dol po kači.

---

### Besede za glas C (sredina/konec)

```typescript
const KACE_WORDS_C = [
  { text: "BOROVNICE", image: "borovnice1.webp", audio: "borovnice.m4a",
    acceptedVariants: ["BOROVNICE", "BOROVNICA", "BORONICA", "BOROVNICE!", "BOROVNIC", "BOROVNCE"] },
  { text: "KOCKA", image: "kocka1.webp", audio: "kocka.m4a",
    acceptedVariants: ["KOCKA", "COCKA", "KOTKA", "KOCKE", "KOCKI", "KOCKO", "KOSCA"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a",
    acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOSAREC", "KODAREC", "KOZARC"] },
  { text: "LONEC", image: "lonec1.webp", audio: "lonec.m4a",
    acceptedVariants: ["LONEC", "LONAC", "LONC", "LONEC!", "LOVEC", "TONEC", "LONECI"] },
  { text: "LUBENICA", image: "lubenica1.webp", audio: "lubenica.m4a",
    acceptedVariants: ["LUBENICA", "LUBENICE", "LUBENICI", "LUBENICO", "LUBENICA!", "LUBNICA", "LUBENICA?"] },
  { text: "NOGAVICE", image: "nogavice1.webp", audio: "nogavice.m4a",
    acceptedVariants: ["NOGAVICE", "NOGAVICA", "NOGAVICI", "NOGAVICO", "NOGAVICE!", "NOGAVCE", "GAVICE"] },
  { text: "PICA", image: "pica1.webp", audio: "pica.m4a",
    acceptedVariants: ["PICA", "PITA", "PIZA", "PIZZA", "PICE", "PICI", "PICO", "PICA!"] },
  { text: "RACA", image: "raca1.webp", audio: "raca.m4a",
    acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RAZA", "RAŠA", "LACA", "RACA!"] },
  { text: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "ropotuljica.m4a",
    acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTLJICA", "ROPOTULJICE", "ROPOTULJICA!"] },
  { text: "SONCE", image: "sonce1.webp", audio: "sonce.m4a",
    acceptedVariants: ["SONCE", "SONCA", "SONCU", "SONCE!", "SONCE?", "SUNCE", "ŠONCE", "SONC"] },
  { text: "VETRNICA", image: "vetrnica1.webp", audio: "vetrnica.m4a",
    acceptedVariants: ["VETRNICA", "VETRNICE", "VETRNICI", "VETRNICO", "VETRNICA!", "VETRCA", "VETRNICA?"] },
  { text: "VILICE", image: "vilice1.webp", audio: "vilice.m4a",
    acceptedVariants: ["VILICE", "VILICA", "VILICI", "VILICO", "VILCE", "VILICE!", "BILICE"] },
  { text: "ZAJEC", image: "zajec1.webp", audio: "zajec.m4a",
    acceptedVariants: ["ZAJEC", "ZAJCA", "ZAJCU", "ZAJCI", "SAJEC", "ZAICC", "ZAJEC!", "JAZEC"] },
  { text: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "zobotrebec.m4a",
    acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBC", "ZOTREBEC", "GOBOTREBEC"] },
  { text: "ZARNICA", image: "zarnica1.webp", audio: "zarnica.m4a",
    acceptedVariants: ["ZARNICA", "ŽARNICA", "ZARNICE", "ZARNICI", "ZARNICO", "SARNICA", "ZARNICA!"] },
  { text: "ZLICA", image: "zlica1.webp", audio: "zlica.m4a",
    acceptedVariants: ["ZLICA", "ŽLICA", "SLICA", "ZLICE", "ZLICI", "ZLICO", "ZLICA!", "ŠLICA"] },
];
```

*Opomba: Slike bodo iz Supabase bucketa `artikulacijski-test` (kjer so že shranjene za glas C).*

---

### Stran za izbiro igre (/govorne-igre/kace)

Ker je za zdaj samo en glas (C - sredina/konec), stran za izbiro direktno preusmeri na `/govorne-igre/kace/c` brez vmesnih kartic.

Alternativno (bolj prihodnostno): enaka stran kot `KoloSreceGames.tsx` z eno kartico za "Glas C (sredina/konec)". Ta pristop je boljši.

---

### Kartica v GamesList.tsx

Nova kartica bo dodana v `GamesList.tsx` in `AdminGovorneIgre.tsx` z enako strukturo kot obstoječe kartice:

```typescript
{
  id: "kace",
  title: "KAČE IN LESTVE",
  description: "Igraj kače in lestve ter vadi izgovorjavo glasov na sredini in koncu besed",
  image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/kace_lestve_nova.webp",
  gradient: "from-dragon-green/20 to-app-teal/20",
  customBackground: "...",
  path: "/govorne-igre/kace",
  available: true,
  imageScale: "90%"
}
```

*Opomba: Slika kartice bo zmajček z zmajcki bucketa ker je igra nova, npr. `Zmajcek_11.webp` začasno dokler ne bo nova slika.*

---

### Vizualni design igre

Igra bo v fullscreen načinu z zelenim ozadjem (enako kot kolo besed: `zeleno_ozadje.webp`).

**Tabla:**
- 8×8 grid prikazan kot SVG ali CSS Grid
- Celice so pobarvane v nežnih pastelnih barvah (roza, svetlomodra, mint, lavanda, rumena, breskev)
- Vsaka celica ima številko
- Polje 1+2 = START (zeleno, z zmajčkom)
- Polje 63+64 = KONEC (zlato, z zvezdico)
- Lestve: animirane SVG lestve v zeleni/rjavi barvi, cartoon slog
- Kače: animirane cartoon kače, prijazne, nasmejane

**Figurice:**
- 1 ali 2 figurici (za 1 ali 2 igralca)
- Disney/cartoon slog, žive barve

**Postavitev UI:**
- Tabla: centrirana, zavzame večino zaslona
- Desno/spodaj: gumb za met kocke (big, animated)
- Spodaj levo: gumb Home (oranžen, rounded-full, kot pri kolo besed)
- Informacije o trenutnem igralcu in poziciji

---

### Nastavitve igre (modal pred začetkom)

Enaka struktura kot nastavitve pri `/govorne-igre/met-kocke/s`:
- **Število igralcev:** 1 ali 2
- **Težavnost:** Lahka / Srednja / Težka (z opisom bonusa)

---

### Potek igre - korak za korakom

1. Odpre se nastavitve modal
2. Otrok/logoped izbere število igralcev in težavnost
3. Prikaže se tabla z figurico(ami) na polju START
4. Gumb "VRŽI KOCKO" (ali klik na animirano kocko)
5. Kocka se animira (3D, enako kot `DiceRoller.tsx`)
6. Po animaciji se figurica premakne
7. Preverjanje posebnih polj:
   - Lestev → figurica skoči naprej (animacija)
   - Glava kače → odpre se izziv dialog
8. Odpre se `KaceLestveWordDialog` z naključno besedo:
   - Prikaže se slika
   - Zvok se predvaja samodejno
   - Otrok posname izgovorjavo (3s, enako kot WheelSuccessDialog)
   - Pošlje se v `transcribe-articulation` edge function
   - Rezultat: pravilno = bonus premik, napačno = ostane
9. Če 2 igralca: preklopi na naslednjega
10. Ko kdo doseže polje 64: prikaže se `KaceLestveSuccessDialog` (BRAVO + vzemi zvezdico)

---

### Preverjanje izgovorjave

Enako kot v `/artikulacijski-test`, prek obstoječe `useTranscription` hook + `useAudioRecording` hook:

```typescript
// V KaceLestveWordDialog.tsx
const { startRecording, audioBase64, isRecording, countdown } = useAudioRecording(3);
const { transcribe, isTranscribing } = useTranscription();

// Ko se posnetek zaključi:
const result = await transcribe(
  audioBase64,
  word.text,
  word.acceptedVariants,
  childId,
  undefined, // sessionNumber ni potreben
  undefined, // wordIndex
  'C',       // letter
  difficulty  // lahka/srednja/tezka
);

if (result?.accepted) {
  // Premakni figurico za bonus
  movePlayer(bonusSquares[difficulty]);
}
```

---

### Datoteke za ustvarjanje/spremembo

**Nove datoteke:**
1. `src/data/kaceLestveConfig.ts` - konfiguracija (besede, lestve, kače)
2. `src/pages/KaceLestveGames.tsx` - stran za izbiro (glas C)
3. `src/components/games/KaceLestveGame.tsx` - glavni komponenta igre
4. `src/components/games/KaceLestveBoard.tsx` - SVG tabla
5. `src/components/games/KaceLestveWordDialog.tsx` - dialog za besedo + snemanje
6. `src/components/games/KaceLestveSettingsModal.tsx` - nastavitve
7. `src/components/games/KaceLestveSuccessDialog.tsx` - zaključek
8. `src/components/routing/KaceLestveRouter.tsx` - router za user portal
9. `src/components/routing/admin/AdminKaceLestveRouter.tsx` - router za admin
10. `src/pages/admin/games/AdminKaceLestveGames.tsx` - admin stran za izbiro

**Spremembe obstoječih datotek:**
11. `src/components/games/GamesList.tsx` - dodati kartico KAČE IN LESTVE
12. `src/pages/admin/AdminGovorneIgre.tsx` - dodati kartico za admin
13. `src/config/routes.tsx` - dodati poti za /govorne-igre/kace in /govorne-igre/kace/:letter
14. `src/components/routing/AdminRoutes.tsx` - dodati admin poti

---

### Tehnični detajli - Tabla (KaceLestveBoard.tsx)

Tabla je implementirana kot CSS Grid 8×8. Vsaka celica ima:
- `position: relative` za prikaz figuric
- Pastelno barvo ozadja (izmenično, vizualno privlačno)
- Številko v kotu
- SVG elementi za kače in lestve postavljeni absolutno čez grid

**Barvna shema celic (8 barv v vzorcu):**
```
Rdeča-roza → #FFD6D6
Svetlomodra → #D6EAFF  
Mint → #D6FFE8
Lavanda → #E8D6FF
Rumena → #FFF6D6
Breskev → #FFE8D6
Turkizna → #D6FFF6
Zelena → #E8FFD6
```

**SVG lestve:** Preproste cartoon lestve z dvema navpičnima stranicama in prečkami. Barva: rjava (#8B6914) z zelenim robom.

**SVG kače:** Zavita kača z nasmeškom. Barva: zelena/rdeča, cartoon slog. Glava kače je na višjem polju (začetek), rep na nižjem (konec).

---

### Admin verzija

Admin verzija bo enaka kot user verzija, samo z admin potmi. Klic `useEnhancedProgress` bo imel parameter `logopedistChildId` (iz URL params), enako kot pri ostalih igrah.

---

### Zvezdice in napredek

Ob zaključku igre (kdo pride do cilja):
- Prikaže se `WheelSuccessDialog` / nov `KaceLestveSuccessDialog` z zmajčkom `Zmajcek_11.webp`
- Gumb "⭐ VZEMI ZVEZDICO"
- Klic `recordExerciseCompletion('kace-lestve-c')` (user portal) ali z `logopedistChildId` (admin)
- Preverjanje trofej prek `useTrophyContext`

---

### Posebna pravila - implementacija

**Pravilo za konec (≤6 polj od cilja):**
```typescript
const squaresToEnd = 64 - currentPosition;
if (squaresToEnd <= 6) {
  consecutiveFailedAttempts++;
  if (diceResult !== squaresToEnd) {
    // Ne premakni figurice (ni točna vrednost)
    if (consecutiveFailedAttempts >= 5) {
      // Prisili premik na cilj pri petem metu
      forceMove(64);
    }
    return;
  }
}
```

**Izziv na kači:**
```typescript
if (snakeHeads.includes(newPosition)) {
  const randomWord = getRandomWord();
  showChallengeDialog(randomWord, {
    onSuccess: () => stayAtPosition(newPosition),
    onFail: () => moveToSnakeTail(newPosition)
  });
}
```

---

### Povzetek - seznam vseh datotek

| Datoteka | Tip |
|----------|-----|
| src/data/kaceLestveConfig.ts | NOVA |
| src/pages/KaceLestveGames.tsx | NOVA |
| src/components/games/KaceLestveGame.tsx | NOVA |
| src/components/games/KaceLestveBoard.tsx | NOVA |
| src/components/games/KaceLestveWordDialog.tsx | NOVA |
| src/components/games/KaceLestveSettingsModal.tsx | NOVA |
| src/components/games/KaceLestveSuccessDialog.tsx | NOVA |
| src/components/routing/KaceLestveRouter.tsx | NOVA |
| src/components/routing/admin/AdminKaceLestveRouter.tsx | NOVA |
| src/pages/admin/games/AdminKaceLestveGames.tsx | NOVA |
| src/components/games/GamesList.tsx | SPREMEMBA (dodati kartico) |
| src/pages/admin/AdminGovorneIgre.tsx | SPREMEMBA (dodati kartico) |
| src/config/routes.tsx | SPREMEMBA (dodati poti) |
| src/components/routing/AdminRoutes.tsx | SPREMEMBA (dodati poti) |

Skupaj: **10 novih datotek** + **4 spremembe**

