

## Odgovor na vprašanje: Admin portal — en ali dva?

Admin portal je **en sam** — koda za TomiTalk logoped in OŠ Test je **identična**. Razlika je le v podatkih (ime organizacije iz `profile.organization_name`), vidnost nekaterih menijev (npr. "Upravljanje" je skrit za eksterne organizacije kot OŠ Test) se upravlja z enim samim pogojem. Ni ločene kode.

---

## Natančna primerjava: Uporabniški portal (referenca) vs Admin portal

### 1. SEZNAM IGER (GamesList.tsx vs AdminGovorneIgre.tsx)

| Lastnost | Uporabniški portal | Admin portal | Razlika? |
|---|---|---|---|
| Ime "Zabavna pot" | `ZABAVNA POT` | `KAČE IN LESTVE` | **DA — NAPAKA** |
| Opis "Zabavna pot" | "Igraj zabavno pot ter vadi..." | "Igraj kače in lestve ter vadi..." | **DA — NAPAKA** |
| Slika "Zabavna pot" | `kace_lestve_nova.webp` | `kace_lestve_nova_2.webp` | **DA — drugačen asset** |
| Opis "Kolo besed" | "...vadi izgovorjavo glasov na začetku besed" | "...vadi izgovorjavo črk" | **DA — manjka "na začetku besed"** |
| Opis "Bingo" | "...na sredini in koncu besed" | "...vadi izgovorjavo črk" | **DA — manjka pozicija glasov** |
| Opis "Spomin" | "...glasov na začetku besed" | "...vadi izgovorjavo" | **DA — manjka pozicija** |
| Opis "Sestavljanke" | "...glasov na začetku besed" | "...vadi logično razmišljanje" | **DA — napačen opis** |
| Opis "Zaporedja" | "...glasov na začetku besed" | "...vadi izgovorjavo" | **DA — manjka** |
| Opis "Drsna igra" | "...glasov na začetku besed" | "...za vajo izgovorjave" | **DA — manjka** |
| Opis "Labirint" | "...glasov na začetku besed" | "...vadi izgovorjavo" | **DA — manjka** |
| Opis "Igra ujemanja" | "Poveži slike in vadi izgovorjavo glasov na začetku besed" | "Poveži enake slike med stolpci" | **DA — napačen** |
| Opis "Ponovi poved" | "...na začetku, na sredini in na koncu." | "...tri-besedne povedi in vadi izgovorjavo" | **DA — manjka pozicija** |
| Opis "Smešne povedi" | "Sestavi smešne povedi in vadi izgovorjavo z glasovi na začetku, sredini in koncu besed" | "Vrzi kocko in sestavi smešne povedi" | **DA — manjka pozicija** |
| Vrstni red iger | Kolo, Ujemanje, Zaporedja, Spomin, Drsna, Labirint, Sestavljanke, Zabavna pot, Bingo, Ponovi, Smešne | Kolo, Bingo, Spomin, Sestavljanke, Zaporedja, Drsna, Ujemanje, Labirint, Smešne, Ponovi, Kače | **DA — popolnoma drugačen vrstni red** |
| Desktop gap | `gap-8` | `gap-6` | **DA — manjši razmik** |
| Mobile padding | `p-3` | `p-3` (ok), desktop `p-4` vs `p-6` | **DA — desktop padding manjši** |
| Naslov desktop velikost | `text-xl` | `text-lg` | **DA — manjša pisava** |
| Desktop min-height naslov | `min-h-[3.5rem] flex items-center` | ni | **DA — manjka** |
| Mobile opis | Prikazan (`text-xs text-center`) | Prikazan (`text-sm`) | **DA — razlika v velikosti** |
| Shadow | `shadow-xl` | `shadow-lg` | **DA — manjši shadow** |
| Nedostopne igre | Prikazane (Pobarvanke, Poveži pike, Razvrščanje) | Niso prikazane | OK — smiselno za admin |

### 2. STRANI ZA IZBIRO GLASOV (npr. BingoGames.tsx vs AdminBingoGames.tsx)

| Lastnost | Uporabniški portal | Admin portal | Razlika? |
|---|---|---|---|
| Vrstni red glasov | C, Č, K, L, R-začetne, R, S, Š, Z, Ž (abecedni) | S, Z, C, Š, Ž, Č, K, L, R-začetne, R (nekonsistenten) | **DA — vse admin strani imajo napačen vrstni red** |
| Mobile mreža | `grid-cols-3 gap-2` | `grid-cols-2 gap-4` | **DA — 2 stolpca namesto 3** |
| Mobile aspect ratio | `aspect-[4/3]` | `aspect-square` | **DA — drugačno razmerje** |
| Mobile padding | `p-1.5` | `p-3` | **DA — večji padding** |
| Mobile font | `text-xs` | `text-lg` | **DA — prevelika pisava** |
| Desktop padding | `p-6` | `p-4` | **DA — manjši padding** |
| Desktop font naslov | `text-xl` | `text-lg` | **DA — manjša pisava** |
| Hover barva | `text-app-blue` | `text-primary` | **DA — različna barva** |
| Ozadje kartic | Vsak glas ima unikatne barvne gradiente | Vse kartice imajo enak oranžen gradient | **DA — manjkajo barvni gradienti** |
| Naslov "Zabavna pot" | "Zabavna pot" | "Kače in lestve - izberi glas" | **DA — NAPAKA** |
| Opisi besed (Bingo) | "...na sredini in koncu besed" | Manjka pozicija glasov | **DA** |
| Spomin — ozadje | Unikatni gradienti z bg-gradient-to-br | Enak oranžen gradient za vse | **DA** |

### 3. ADMIN SPOMIN — posebnost

AdminSpominGames ima popolnoma drugačno strukturo kartic kot ostale admin strani (uporablja polne URL-je za slike, drugačen class za kartice). Ni usklajen niti z ostalimi admin stranmi, niti z uporabniškim portalom.

---

## Plan popravkov

Referenca za vse popravke: **uporabniški portal**.

### Korak 1: AdminGovorneIgre.tsx — seznam iger
- Preimenovati "KAČE IN LESTVE" → "ZABAVNA POT"
- Popraviti opis na "Igraj zabavno pot ter vadi izgovorjavo glasov na sredini in koncu besed"
- Popraviti sliko na `kace_lestve_nova.webp`
- Popraviti vse opise iger na točne opise iz uporabniškega portala
- Popraviti vrstni red iger na enak kot v GamesList.tsx
- Popraviti desktop: `gap-8`, `p-6`, `text-xl`, `min-h-[3.5rem]`, `shadow-xl`

### Korak 2: Vseh 10 admin letter-selection strani — poenotiti z uporabniškim portalom
Datoteke: `AdminKaceLestveGames`, `AdminBingoGames`, `AdminKoloSreceGames`, `AdminSpominGames`, `AdminSestavljankeGames`, `AdminZaporedjaGames`, `AdminDrsnaSestavljankaGames`, `AdminIgraUjemanjaGames`, `AdminLabirintGames`, `AdminPonoviPovedGames`, `AdminMetKockeGames`

Za vsako:
- Vrstni red glasov: C, Č, K, L, R-začetne, R, S, Š, Z, Ž
- Mobile mreža: `grid-cols-3 gap-2` namesto `grid-cols-2 gap-4`
- Mobile aspect: `aspect-[4/3]` namesto `aspect-square`
- Mobile padding: `p-1.5` namesto `p-3`
- Mobile font: `text-xs` namesto `text-lg`
- Desktop: `p-6`, `text-xl`, `gap-8`
- Hover barva: `text-app-blue` namesto `text-primary`
- Naslov za Zabavno pot: "Zabavna pot - izberi glas"
- Opisi: uskladiti z uporabniškim portalom (vključno s pozicijo glasov)

### Korak 3: AdminSpominGames — posebna uskladitev
- Prestrukturirati kartice na enak vzorec kot ostale admin strani (oranžen gradient oz. unikatni gradienti kot v uporabniškem portalu)

Skupaj **12 datotek**, pretežno mehanske spremembe (vrstni red, CSS razredi, besedila).

