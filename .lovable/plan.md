

## Analiza: Ikona se prikaže pred videom ob zagonu PWA

### Kaj se dogaja

Ko zaženete PWA aplikacijo s klikom na ikono, operacijski sistem (Android/iOS) najprej prikaže **nativni splash screen** — to je sistemska funkcija, ki jo brskalnik/OS generira avtomatsko iz `manifest.json` (ikona + ime + bela barva ozadja). Šele ko se aplikacija naloži, se prikaže vaš video splash screen.

Ta nativni splash screen **ni pod nadzorom spletne aplikacije** — ga generira OS. Ne moremo ga popolnoma odstraniti, lahko pa ga minimiziramo.

### Kaj lahko naredimo

**iOS (iPhone/iPad):** Že imamo nastavljene `apple-touch-startup-image` slike kot bele 1×1 piksle — torej na iOS bi moral biti splash že bel. Če še vedno vidite ikono, je potrebno generirati **prave polne bele slike** v pravih resolucijah za vsako napravo.

**Android:** Nativni splash screen vedno prikaže ikono iz manifesta. Edina možnost za minimizacijo:
1. Naredimo poseben set ikon z `purpose: "any"` ki so **samo bele** (prazne) — te se uporabijo za splash screen
2. Obstoječe ikone z zmajčkom označimo kot `purpose: "maskable"` — te se uporabijo za ikono na domačem zaslonu

### Plan popravka

**1. Generiranje belih splash ikon**
- Ustvarim bele PNG ikone (72, 144, 192, 512px) brez vsebine — samo belo ozadje
- Shranim jih kot `/public/icons/splash-72x72.png` itd.

**2. `public/manifest.json`**
- Dodam bele ikone s `purpose: "any"` (OS jih uporabi za splash)
- Obstoječe zmajček ikone obdržim samo s `purpose: "maskable"` (za ikono na zaslonu)

**3. `index.html`**
- Generiram prave polne bele slike za `apple-touch-startup-image` v pravilnih resolucijah namesto 1×1 pikselnih base64 slik

### Opozorilo
Na Androidu se kratek prikaz nativnega splash screena **ne da popolnoma izogniti** — je vgrajen v OS. S tem popravkom bo namesto zmajčka prikazan samo bel zaslon za ~0.5s pred videom, kar bo delovalo kot gladek prehod v video.

### Obseg
- 2 datoteki (`manifest.json`, `index.html`)
- Generiranje belih PNG slik
- Brez sprememb logike aplikacije

