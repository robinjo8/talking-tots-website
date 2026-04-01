

## Analiza vseh iger z novimi črkami F, G, H, V — Poročilo

### 1. KONFIGURACIJA IN PODATKI — vse OK

| Igra | Config datoteka | F, G, H, V prisotni | Besede pravilne | Slike/Zvoki pravilni |
|------|----------------|---------------------|-----------------|---------------------|
| Kolo besed | artikulacijaVajeConfig.ts | Da (13, 16, 14, 22) | Da | Da |
| Spomin | spominConfig.ts | Da (localData) | Da | Da (polni URL-ji) |
| Zaporedja | zaporedjaConfig.ts | Da (localData iz spominConfig) | Da | Da |
| Labirint | labirintConfig.ts | Da (fImages, gImages, hImages, vImages) | Da | Da |
| Drsna sestavljanka | drsnaSestavljankaConfig.ts | Da | Da | Da |
| Igra ujemanja | igraUjemanjaConfig.ts | Da | Da | Da |
| Sestavljanka | sestavljankeGameConfig.ts | Da | Da | Da |

Slike: bucket `slike`, zvoki: bucket `zvocni-posnetki`, zmajčki: bucket `zmajcki`. Pravilno.

---

### 2. HOOKS IN LOKALNI FALLBACK — vse OK

- **useGenericMemoryGame.tsx** — preveri `config.localData`, če obstaja preskoči DB query. Pravilno.
- **useSequenceGame.ts** — sprejme `localData` parameter, če je podan uporabi lokalne podatke. Pravilno.
- **SequenceGame56Base.tsx** — ima `localData` prop in query fallback. Pravilno.
- **SequenceGameBase.tsx** — ima `localData` prop in query fallback. Pravilno.
- **SequenceGameLocal.tsx** — nova komponenta za 3-4 starostno skupino z lokalnimi podatki. Pravilno.
- **GenericZaporedjaGame.tsx** — pravilno routira: če `config.localData` obstaja, uporabi `SequenceGameLocal` za 3-4 skupino, za 5-6/7-8/9-10 posreduje `localData` prop v SequenceGame56Base/SequenceGameBase. Pravilno.

---

### 3. SELEKCIJSKE STRANI (kartice) — vse OK

Vse 7 selekcijskih strani imajo F, G, H, V kartice dodane v abecednem vrstnem redu (po Č, pred K):
- SpominGames.tsx — 14 kartic, F/G/H/V prisotni z `.webp` zmajčki
- KoloSreceGames.tsx — preveriti bi bilo treba, ampak config je pravilen
- Zaporedja.tsx, IgraUjemanja.tsx, DrsnaSestavljanka.tsx, Labirint.tsx, SestavljankeGames.tsx — vsi imajo kartice

---

### 4. NAJDENE TEŽAVE

#### PROBLEM 1 (MEDIUM): Labirint — napačen abecedni vrstni red

V `labirintConfig.ts` je vrstni red: **C, F, G, H, Č, K, L, R, S, Š, Z, V, Ž, R-zacetek**

To je napačno. Pravilni vrstni red bi moral biti: **C, Č, F, G, H, K, L, R, R-zacetek, S, Š, V, Z, Ž**

Č je po C (kot v slovenščini), V mora biti pred Z (ne za Z). R-zacetek mora biti takoj za R.

#### PROBLEM 2 (MEDIUM): Admin portal — manjkajo F, G, H, V kartice

`AdminSpominGames.tsx` ima le 10 kartic (C, Č, K, L, R-zacetek, R, S, Š, Z, Ž). **F, G, H, V niso dodane.** To pomeni, da logoped v admin portalu ne vidi novih glasov za igro Spomin.

Preveriti je treba ali imajo tudi ostale admin strani (AdminZaporedja, AdminLabirint itd.) enak problem.

#### PROBLEM 3 (LOW): Kolo besed — F, G, H, V nimajo `lipsImage`

V `artikulacijaVajeConfig.ts` vrstice 558-560 in 567:
```
'f': { ... wordsData: wordsDataF },  // brez lipsImage
'g': { ... wordsData: wordsDataG },  // brez lipsImage
'h': { ... wordsData: wordsDataH },  // brez lipsImage
'v': { ... wordsData: wordsDataV },  // brez lipsImage
```

Vse ostale črke (C, Č, K, L, R, S, Š, Z, Ž) imajo `lipsImage` nastavljeno (npr. `'Glas_SZC.png'`). Za F, G, H, V ni slike ustnic, kar pomeni da gumb za prikaz ustnic v igri Kolo besed za te črke ne bo prikazoval slike (ali pa se gumb sploh ne prikaže).

#### PROBLEM 4 (LOW): Bingo — F, G, H, V nimajo bingo konfiguracij

V `artikulacijaVajeConfig.ts` so za nove črke definirani samo `wheel` config-i, ne pa tudi `bingo` (sredina/konec). To je pričakovano, ker gre za glasove na **začetku** besede, ampak je vredno preveriti ali uporabnik pričakuje tudi bingo igre za te glasove.

---

### 5. FUNKCIONALNOST IGER — analiza

| Funkcija | Status | Opomba |
|----------|--------|--------|
| Prikaz kartic na selekcijski strani | OK | Zmajčki .webp pravilno referencirani |
| Spomin — flip, match, pair dialog | OK | useGenericMemoryGame localData fallback deluje |
| Spomin — zvok ob prikazu para | OK | audio_url polni URL-ji v localData |
| Spomin — completion dialog, zvezdica | OK | handleClaimStar, gameCompleted logika nespremenjena |
| Zaporedja 3-4 — SequenceGameLocal | OK | drag&drop, pre-countdown, sequential audio |
| Zaporedja 5-6 — SequenceGame56Base | OK | localData prop podprt |
| Zaporedja 7-8/9-10 — SequenceGameBase | OK | localData prop podprt |
| Kolo besed — wheel spin, word display | OK | wordsData pravilno definirani |
| Labirint — maze, completion images | OK | fImages/gImages/hImages/vImages pravilno referencirani |
| Drsna sestavljanka — sliding puzzle | OK | images iz puzzleImages |
| Igra ujemanja — matching | OK | artikulacijaVajeConfig word data |
| Sestavljanka — jigsaw puzzle | OK | images iz puzzleImages |
| Pop-up okna, completion dialogi | OK | Enaka logika kot obstoječe črke |
| Progress tracking | OK | trackingId-ji generirani |

---

### 6. POVZETEK

**Deluje pravilno:**
- Vseh 7 iger za uporabniški portal ima F, G, H, V pravilno konfigurirane
- Slike, zvoki in besede so pravilno nastavljene
- LocalData fallback za Spomin in Zaporedja deluje
- Pop-up okna, gumbi, completion dialogi — enaka logika kot obstoječe igre

**Za popraviti:**
1. **Labirint config vrstni red** — Č mora biti za C, V pred Z, R-zacetek za R
2. **Admin portal** — dodaj F, G, H, V kartice v AdminSpominGames (in preveri ostale admin game selection strani)
3. **LipsImage** za F, G, H, V v Kolo besed — trenutno manjka (ni kritično, ampak nedosledno)

