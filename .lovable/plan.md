
Cilj: narediti natančen, izvedljiv SEO plan na podlagi tvojega novega Seobility PDF poročila (8 strani), kjer je glavni problem, da je bilo preverjenih samo 1/18 strani.

## Povzetek dejanskega stanja iz poročila
- Tech & Meta: 50%
- Structure: 65%
- Content: 40%
- Crawled pages: 18
- Pages checked: 1
- Uncheckable pages: 17
- Ključni opozorili:
  1) “All subpages are pointing via canonical link or redirect to the homepage”
  2) “Only 1 pages that can be indexed were found”
  3) “Problems with meta descriptions: 1”
  4) “Problems with H1/headings: 1”
  5) “Pages with only a few internal links: 1”
  6) “Pages with little text / keywords from title not in body: 1”

---

## Točno kaj je treba popraviti (kje, kaj je zdaj, kaj bo novo, vpliv)

### 1) Kritičen canonical problem (najvišja prioriteta)
**Kje:** `index.html` (trenutno vrstica 11)  
**Zdaj:**  
`<link rel="canonical" href="https://tomitalk.lovable.app/" />` je statično v globalnem HTML, zato ga dobijo vse URL poti (`/kako-deluje`, `/kontakt`, …) in vse “kanonizirajo” na home.  
**Nova sprememba:**  
- Odstranimo statični canonical iz `index.html`.
- Uvedemo dinamični canonical po poti v React-u (npr. SEO komponenta, ki na podlagi `location.pathname` nastavi canonical na trenutno javno pot).  
**Vpliv:**  
- Seobility ne bo več razumel vseh podstrani kot “duplikat domače strani”.
- “Pages checked” se začne normalno povečevati (namesto 1).
- To je glavni blokator skoraj vseh ostalih metrik.

---

### 2) Route-level SEO (title + description + og + twitter) namesto enega globalnega seta
**Kje:**  
- `src` (nova SEO komponenta, npr. `src/components/seo/RouteSeo.tsx`)
- javne strani v `src/pages/*` (Index, KakoDeluje, KdoSmo, Kontakt, Cenik, Informacije, članki …)  
**Zdaj:**  
- V `index.html` je en globalni title/description/OG/Twitter set, enak za vse poti.
- V kodi ni route-level SEO sistema (ni Helmet implementacije).  
**Nova sprememba:**  
- Vpeljemo centralni SEO map: pot -> title, description, canonical, OG/Twitter.
- Na vsaki javni strani se nastavijo unikatni metapodatki.
- `og:url` naj bo trenutna pot, ne vedno home.  
**Vpliv:**  
- Rešuje “problematic meta descriptions”, kasneje tudi prepreči duplicate title/description opozorila.
- Boljši snippets v Google/Facebook/X.
- Boljša relevantnost po posamezni podstrani.

---

### 3) Popravilo “H1/headings problem” na strani, ki jo crawler preverja
**Kje:**  
- `src/pages/Index.tsx`
- `src/components/home/HeroSection.tsx` (tam H1 sicer obstaja)
- po potrebi `index.html` fallback del  
**Zdaj:**  
- H1 je v React komponenti (ok za JS crawl), a checker je poročal “Problems with H1/headings: 1”.
- Pri “standard” crawl načinu lahko checker še vedno slabo prebere SPA render.  
**Nova sprememba:**  
- Obdrži obstoječi H1 v Hero (dobro).
- Dodaš še SEO-jasen intro odsek na home z jasnim H2 + kratkim besedilom, kjer se ponovijo ključne fraze iz naslova (“govorne igre”, “vaje za izgovorjavo”, “logopedska podpora”).
- V `noscript` fallback preverimo, da je struktura H1 > H2 dosledna (že je, samo dodatno uskladimo fraze).  
**Vpliv:**  
- Zmanjša možnost false-positive za H1/headings.
- Izboljša povezavo med title ključnimi besedami in body vsebino.

---

### 4) “Keywords from title not used in text body” – uskladitev home vsebine z naslovom
**Kje:**  
- `src/components/home/HeroSection.tsx`
- opcijsko `src/pages/Index.tsx` (nov kratek SEO paragraph)  
**Zdaj:**  
- Naslov strani vsebuje “Govorne igre in vaje za otroke | Logopedska podpora”.
- H1/home copy ima drugačne poudarke (“Odpravite govorne težave brez čakanja…”), manj neposrednega ujemanja ključnih fraz.  
**Nova sprememba:**  
- V prvi vidni vsebini home dodaš 1–2 stavka z exact-ish frazami:
  - “govorne igre”
  - “vaje za izgovorjavo”
  - “logopedska podpora”
- Brez keyword stuffing, naravno.  
**Vpliv:**  
- Odpravi opozorilo o neusklajenosti title-keywords vs body.
- Izboljša topical relevance.

---

### 5) “Few internal links” – povečanje crawlable povezav na home
**Kje:**  
- `src/pages/Index.tsx` ali `src/components/home/FooterSection.tsx` + home sekcija  
**Zdaj:**  
- Veliko interakcij je prek button + navigate (programski prehodi), kar crawlerjem ne daje vedno dovolj klasičnih link signalov.
- Footer sicer ima nekaj `<Link>` povezav, vendar checker še vedno označi “few internal links” za preverjeno stran.  
**Nova sprememba:**  
- Na home dodamo “Hitre povezave” sekcijo s klasičnimi `<Link to="...">` na ključne javne strani:
  - /kako-deluje
  - /kdo-smo
  - /kontakt
  - /cenik
  - /informacije
  - /logopedski-koticek  
**Vpliv:**  
- Boljši internal linking score.
- Boljša crawl pot od home do vsebinskih podstrani.

---

### 6) Meta description kvaliteta (dolžina + jasnost namena)
**Kje:** `index.html` + route-level SEO mapa  
**Zdaj:**  
- Description je sicer dober, ampak checker še vedno javlja “Problems with meta descriptions: 1”.
- Ker je globalen, ni prilagojen podstranim.  
**Nova sprememba:**  
- Home description optimiziramo na cca 140–160 znakov (jasen benefit + ključna fraza + slovenski jezik).
- Za vsako javno podstran svoj description (brez duplikatov).  
**Vpliv:**  
- Višja CTR kvaliteta snippetov.
- Manj opozoril v “Meta tags and page attributes”.

---

### 7) Problem “17 URLs found only in sitemap” + “1 checked page”
**Kje:** kombinacija popravkov #1 + #5 + route-level SEO  
**Zdaj:**  
- `public/sitemap.xml` je dober (17 URL), `robots.txt` ima `Sitemap`.
- A crawler jih ne more normalno “validno preveriti”, ker canonical signal ga vrača na home.  
**Nova sprememba:**  
- Po odstranitvi statičnega canonical + uvedbi route-level canonical + več notranjih linkov bo crawler:
  - našel URL-je iz sitemap-a,
  - in jih tudi dejansko preveril kot samostojne strani.  
**Vpliv:**  
- Največji skok pri celotnem poročilu (Tech & Meta + Structure + Content).

---

## Datoteke in konkretni posegi (implementacijski plan)
1) `index.html`
- odstrani statični canonical tag
- pusti global fallback meta (kot “default”), ampak glavnino premakni na route-level SEO
- ohrani `noscript` (že je dober)

2) Nova SEO infrastruktura (predlog)
- `src/components/seo/RouteSeo.tsx` (ali podobno)
- `src/config/seo.ts` (mapa za title/description/canonical/og/twitter po poti)

3) `src/pages/Index.tsx` + `src/components/home/HeroSection.tsx`
- dodaj short SEO-intro text (ujemanje ključnih fraz s title)
- dodaj “Hitre povezave” z `<Link>` elementi

4) Javne strani v `src/pages/*`
- priklop route-level SEO (vsaj: `/`, `/kako-deluje`, `/kdo-smo`, `/kontakt`, `/cenik`, `/informacije`, `/logopedski-koticek`, članki)

---

## Kaj ni možno rešiti samo s kodo v appu
- “www redirect problems”: to je domena/hosting nivo (DNS + redirect pravila), ne React koda.
- Backlinki/External factors: to je off-page SEO (PR, partnerji, objave, social, katalogi).

---

## Predlagan vrstni red izvedbe
1. Canonical fix (#1)  
2. Route-level SEO sistem (#2, #6)  
3. Home vsebina + ključne besede + hitre povezave (#3, #4, #5)  
4. Ponovni crawl in primerjava (Seobility standard + po možnosti render/JS način)

---

## Kako bomo merili uspeh po popravkih
- “Pages checked” mora narasti iz 1 proti večini javnih URL.
- Opozorilo “all subpages canonical to homepage” mora izginiti.
- “Problems with H1/headings/meta description” mora pasti na 0 ali blizu 0.
- “Pages with little text / title keywords not in body” mora izginiti za home.
- “Pages with only few internal links” se mora izboljšati po dodanih crawlable linkih.
