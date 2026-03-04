
Cilj: odpraviti težavo, da se v igri **Smešne povedi (Met kocke)** na Apple napravah ne prikazujejo slike, in preveriti podobne napake še v drugih igrah.

Kaj sem preveril:
- Kodo igre `GenericMetKockeGame` in podatke `metKockeConfig` + `FreeMetKockeGame`.
- Iskanje vseh sumljivih poti (`.png.webp`) po celotnem `src`.
- Obstoj datotek direktno v Supabase Storage.
- Buckete (`slike`, `slike-ostalo`, `zvocni-posnetki`, `ozadja`, `zmajcki`) in njihov `public=true`.
- Poskus UI preverjanja v browser orodju (tam sem pristal na `/login`, zato E2E reprodukcije v seji nisem mogel dokončati brez prijave).

Ugotovitve (root cause):
1) **Jasna podatkovna napaka (vse platforme):**
- V dveh datotekah je napačno ime slike:
  - `Stickman_zeleti.png.webp` (ne obstaja, 404)
  - pravilno: `Stickman_zeleti.webp`
- Datoteki:
  - `src/data/metKockeConfig.ts`
  - `src/components/free-games/FreeMetKockeGame.tsx`

2) **Verjeten Safari/Apple layout problem (zakaj “vse slike” izgledajo prazne):**
- V `GenericMetKockeGame` so celice slik narejene z `aspect-square` + samo `maxHeight/maxWidth` brez stabilne osnovne `width/height`.
- To je tipičen primer, kjer Safari lahko izračuna praktično 0 višino (vizualno prazne celice / tanke črte), medtem ko Chromium to pogosto še prikaže.
- To se ujema s tvojo fotografijo (viden grid brez vsebine, brez “broken image” ikon).

3) **Podobne napake v drugih igrah:**
- Po celotni kodi sem našel `.png.webp` vzorec samo v teh 2 Met kocke datotekah (ni širše sistemske napake z dvojnimi končnicami).
- Dodatno sem opazil še 1 ločeno težavo: v `GamesList` je kartica “Zabavna pot” vezana na `slike-ostalo/kace_lestve_nova_2.webp`, te datoteke v storage ni (to vpliva na thumbnail kartico, ne na Met kocke gameplay).

Zakaj je “prej delalo”:
- Gre za regresijo zaradi kombinacije:
  - napačno preimenovane asset poti (`.png.webp`) v novejši konfiguraciji,
  - in UI refaktorja velikosti celic v Met kocke, ki je bolj občutljiv v Safari renderingu.
- Zato lahko na določenih napravah izgleda, kot da “nič ne dela”, čeprav je del težave podatkovni (ena datoteka), del pa layout-specifičen (Apple/Safari).

Implementacijski plan (ko preklopimo iz read-only):
1) Popravek asset poti:
- `src/data/metKockeConfig.ts`: `Stickman_zeleti.png.webp` -> `Stickman_zeleti.webp`
- `src/components/free-games/FreeMetKockeGame.tsx`: enak popravek.

2) Stabilizacija prikaza slik za Safari:
- `src/components/games/GenericMetKockeGame.tsx`:
  - zamenjam trenutni “aspect-square + maxHeight/maxWidth” pattern z eksplicitno dimenzijo celice (npr. responsive `w/h` ali `clamp()`), da celica nikoli ne kolapsira;
  - dodam varen `onError` fallback na `<img>` (da ob manjkajočem assetu ostane jasen prikaz in ne “prazna” celica).

3) Hiter cross-game hardening:
- popravim manjkajoč thumbnail za “Zabavna pot” (ali path na obstoječ asset, ali dodam pravilno datoteko), da ne ostane skrit broken image drugje.

4) Verifikacija po popravku:
- test Met kocke:
  - Apple Safari (iPhone/iPad),
  - Android Chrome,
  - Windows Chrome/Edge.
- preverim:
  - grid celice (vseh 6 vrstic) so vidne,
  - rezultatni dialog kaže slike,
  - “želi” se naloži pravilno,
  - ni 404 za `Stickman_zeleti`.
