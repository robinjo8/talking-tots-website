

## Popravek: Zmanjsanje motece Safari vrstice na Apple napravah

### Kaj je problem

Na sliki vidimo, da se na iPadu/iPhonu v Safariju prikazuje crna vrstica z URL naslovom in zavihki. To je del Safari brskalnika - Apple ne dovoli, da bi spletne strani to vrstico skrile.

**Edina resitev za popolno odstranitev** te vrstice je, da uporabnik aplikacijo **namesti na zacetni zaslon** (Add to Home Screen). Takrat se odpre v "standalone" nacinu brez Safari orodne vrstice.

Kljub temu pa lahko naredimo vec izboljsav, da bo izkusnja na Apple napravah boljsa.

### Kaj bomo naredili

#### 1. Boljsa vrstica stanja (status bar) v PWA nacinu

Trenutno je `apple-mobile-web-app-status-bar-style` nastavljen na `default` (bel). Spremenimo na `black-translucent`, kar pomeni:
- Ko je aplikacija nameščena kot PWA, se vsebina razteza pod vrstico stanja
- Vrstica stanja postane prozorna namesto bele

#### 2. CSS prilagoditev za "safe area" na Apple napravah

Dodamo `viewport-fit=cover` v viewport meta tag in CSS pravila za `env(safe-area-inset-*)`. To zagotovi:
- Vsebina se pravilno prilagodi okroglim robovom zaslona
- Header se razteza do vrha zaslona v standalone nacinu

#### 3. Samodejni poziv za namestitev na iOS

Trenutno se iOS navodila pokazejo samo ob kliku na gumb "Prenesi aplikacijo". Dodamo tudi samodejni banner za iOS Safari uporabnike, ki se prikaze po nekaj sekundah - prijazno sporocilo, da bodo z namestitvijo dobili boljso izkusnjo brez Safari vrstice.

### Tehnicne spremembe

**`index.html`**:
- Sprememba `viewport` meta taga: dodaj `viewport-fit=cover`
- Sprememba `apple-mobile-web-app-status-bar-style` iz `default` v `black-translucent`

**`src/index.css`**:
- Dodaj CSS za safe area padding na `body` in `#root`
- Uporabi `env(safe-area-inset-top)` za header odmik

**`src/components/Header.tsx`**:
- Dodaj padding-top za safe area, da header vsebina ne gre pod status bar v standalone nacinu

**`src/components/pwa/IOSInstallBanner.tsx`** (nova datoteka):
- Samodejni banner za iOS Safari uporabnike
- Prikaze se po 3 sekundah z navodili za namestitev
- Moznost zaprtja (zapomni si za 7 dni)
- Sporocilo: "Namesti TomiTalk za boljso izkusnjo brez naslovne vrstice"

**`src/components/pwa/PWAProvider.tsx`**:
- Vkljuci nov `IOSInstallBanner`

### Kaj to pomeni za uporabnike

- **Ce ze imajo nameščeno aplikacijo (PWA)**: Status bar bo prozoren, aplikacija bo izgledala bolj "nativno"
- **Ce uporabljajo Safari**: Videli bodo prijazen poziv za namestitev. Ko namestijo, crna vrstica izgine
- **Na Androidu**: Brez sprememb (tam ze deluje pravilno)

