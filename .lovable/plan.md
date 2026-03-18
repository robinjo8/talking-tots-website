
Cilj: odpraviti napako, kjer je beseda pravilna (npr. BRADA), slika pa ostane PAJEK.

1) Natančna analiza (potrjeno s podatki)
- Preveril sem aktivno dodelitev za otroka `c3940422-e5ce-44b4-a2e4-f73c11323776`:
  - assignment: `7934e1da-7f55-4a90-80ba-ec9b1df3c584` (status `in_progress`)
  - session: `7c3aaa10-c762-431a-b42c-2645369ef6c4` (current_word_index `0`, total_words `4`)
- Preveril sem dodeljene besede v `additional_test_words`:
  - `BRADA -> brada1.webp`
  - `BRESKEV -> breskev1.webp`
  - `BREZA -> breza1.webp`
  - `BRIKETI -> briketi1.webp`
- Preveril sem storage objekte v bucketu `slike`: datoteke `brada1.webp`, `breskev1.webp`, `breza1.webp`, `briketi1.webp`, `pajek1.webp` obstajajo in imajo različne `eTag`/velikosti (torej niso ista datoteka).
- Zaključek: baza in dodelitev sta pravilni; problem je v frontend življenjskem ciklu (state/data-source preklop), ne v “napačno shranjenih besedah”.

2) Verjeten dejanski vzrok v kodi
- `DodatnoPreverjanje` hook `useArticulationTestNew` zažene že pred dokončanim nalaganjem custom besed.
- Hook ima fallback na privzeti `articulationData` (prva beseda = PAJEK) in takoj nastavi `imageUrl` na pajek.
- Ko custom besede prispejo, se besedilo preklopi pravilno (BRADA …), medtem ko je `imageUrl` lahko ostanek začetne fallback faze.
- Prejšnji popravek (dependency array) zmanjšuje možnost napake, ne odpravi pa robustno “fallback-first” scenarija.

3) Plan popravka (implementacija)
- Datoteka: `src/pages/DodatnoPreverjanje.tsx`
  1. Uvesti “word-data ready” gate in preprečiti inicializacijo artikulacijskega hooka z default naborom.
  2. Hook za test mountati šele, ko so dodeljene besede dejansko naložene (`assignment` + `assignedWords.length > 0`).
  3. Če ni besed: jasen empty-state (“Ni dodeljenih besed”) namesto fallback na standardni test.

- Datoteka: `src/hooks/useArticulationTestNew.ts`
  4. Odstraniti implicitni fallback pri “custom režimu”:
     - če je caller v custom načinu, hook ne sme nikoli preklopiti na `articulationData`.
  5. Medijski del vezati na dejanski ključ trenutne besede:
     - image effect dependency: `currentData?.word.image` (ne le indeks/večji objekt)
     - audio effect dependency: `currentData?.word.audio` + pogoji predvajanja
  6. Ob preklopu data source resetirati medijski state (`imageUrl`, `loading`, `hasRecorded`, morebiten pending autoplay timer), da se ne prenaša “PAJEK” iz starega source-a.

4) Validacija po popravku
- Korak A: v adminu potrditi dodelitev (BRADA, BRESKEV, BREZA, BRIKETI).
- Korak B: v uporabniškem portalu odpreti “Dodatno preverjanje”:
  - 1. kartica: BRADA + pravilna slika `brada1.webp`
  - naprej: BRESKEV/BREZA/BRIKETI + pravilne slike.
- Korak C: refresh/resume testa (current_word_index > 0) in potrditi, da se prikaže pravilna slika za resume besedo.
- Korak D: hiter regression check, da standardni `artikulacijski-test` še vedno začne na PAJEK (tam je to pravilno).

5) Pričakovani rezultat
- Dodatno preverjanje bo prikazovalo izključno slike, ki so bile dodeljene v `additional_test_words`.
- Ne bo več možno, da bi prvi prikaz “podedoval” sliko iz privzetega testa.
