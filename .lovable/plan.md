

# Performance popravki (PageSpeed Mobile)

## Trenutno stanje
- Performance: 83%
- LCP: 4.5s (počasno)
- 8 opozoril

## Kaj LAHKO varno popravimo (brez vpliva na igre)

### 1. Google Sign-In skripta: odloži nalaganje (prihranek ~77 KiB neuporabljenega JS)
- **Kje:** `index.html` (vrstice 70-77)
- **Zdaj:** Google GSI skripta se naloži ob `DOMContentLoaded` -- torej takoj, ko se HTML naloži, čeprav uporabnik takrat sploh ne potrebuje Google prijave.
- **Novo:** Naložimo jo šele ob `requestIdleCallback` (ko ima brskalnik čas) ALI šele ko uporabnik pride na login stran. To zmanjša neuporabljen JavaScript za ~77 KiB.
- **Vpliv na uporabnika:** Nobeden. Google prijava bo še vedno delovala, le naložila se bo malce pozneje. Igre niso prizadete.

### 2. SplashScreen slika: dodaj `width` in `height` (manjši CLS)
- **Kje:** `src/components/SplashScreen.tsx` (vrstica 136-138)
- **Zdaj:** Slika `Zmajcek_6.webp` (splash screen zmajček) nima eksplicitnih dimenzij `width`/`height`, kar povzroča layout shift.
- **Novo:** Dodamo `width={468}` in `height={533}` (dejanske dimenzije slike) na `<motion.img>`.
- **Vpliv na uporabnika:** Nobeden vizualen. Splash screen izgleda enako, le brskalnik rezervira prostor vnaprej. Igre niso prizadete.

### 3. Hero slika: boljši `sizes` atribut za mobilne naprave (prihranek ~66 KiB)
- **Kje:** `src/components/home/HeroSection.tsx` (vrstice 87-96 za mobile, 152-161 za desktop)
- **Zdaj:** `sizes="(max-width: 768px) 80vw, 500px"` -- a na mobilni je container dejansko `max-w-xs` (320px) skaliran na 0.8 = ~256px. Brskalnik naloži preveliko verzijo.
- **Novo:** Posodobimo `sizes` na bolj natančno: `"(max-width: 768px) 256px, 500px"` za mobilni `<img>` in `"500px"` za desktop-only `<img>`. Brskalnik bo izbral manjšo sliko, če jo ponuja CDN.
- **Vpliv na uporabnika:** Zmajček izgleda popolnoma enako. Igre niso prizadete.

---

## Kaj NE MOREMO popraviti (ali ni varno)

| Problem | Zakaj ne | 
|---------|----------|
| **Forced reflow (56ms)** | Povzroča ga minificiran JS bundle (framer-motion, React). Popravek bi zahteval zamenjavo knjižnic -- preveliko tveganje za igre. |
| **Reduce unused CSS (20 KiB)** | Tailwind generira vse utility klase v en CSS. Za PurgeCSS bi morali spremeniti build konfiguracijo, kar lahko polomni stile iger. |
| **Reduce unused JS (145 KiB iz glavnega bundla)** | Glavni bundle vsebuje React, Supabase, framer-motion itd. Že imate lazy loading za vse podstrani. Nadaljnje deljenje bi bilo tvegano. |
| **Render blocking CSS (320ms)** | CSS mora biti naložen pred renderom, sicer stran utripa brez stilov. To je pričakovano vedenje. |
| **Cache lifetimes (407 KiB)** | To je nastavitev na strežniku/hostingu (Lovable). Iz kode ne moremo vplivati na HTTP cache headerje. |

---

## Tehnični povzetek sprememb

### Datoteke ki se spremenijo:
1. `index.html` -- Google GSI skripta se naloži pozneje
2. `src/components/SplashScreen.tsx` -- dodamo width/height na sliko
3. `src/components/home/HeroSection.tsx` -- popravimo sizes atribut

### Kaj ostane nedotaknjeno:
- Vse igre (canvas, logika, komponente)
- Routing in lazy loading
- CSS stili
- Vsi ostali komponenti

### Pričakovan učinek:
- LCP bi se moral izboljšati za ~0.5-1s (manjša slika + poznejši Google JS)
- Unused JS se zmanjša za ~77 KiB
- CLS se izboljša (splash screen slika ima dimenzije)
- Performance score: pričakujemo ~85-90%
