

# Plan: Ponovi Poved - iPhone orientacija + Yoga header

## Problem 1: iPhone se obrne v ležeči položaj
Igra Ponovi Poved nima nobene zaščite pred obračanjem zaslona na iOS. Na Androidu to deluje, ker druge igre zaklenejo orientacijo, ampak ta igra tega ne počne.

### Rešitev
Dodati CSS overlay, ki se prikaže ko je telefon v landscape načinu in zahteva od uporabnika, da telefon obrne nazaj v pokončni položaj. Na iOS `screen.orientation.lock()` ne deluje, zato uporabimo CSS pristop (enako kot pri drugih igrah v projektu).

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`
- Dodati detekcijo landscape orientacije na mobilnih napravah
- Prikazati overlay z ikono rotacije in sporočilom "Obrni telefon v pokončni položaj" ko je naprava v landscape

## Problem 2: Lenovo Yoga - header gumbi se prekrivajo
Trenutni breakpoint za prehod med desktop in mobilno navigacijo je `lg` (1024px). Lenovo Yoga in podobni manjši prenosniki imajo širino zaslona okrog 1024-1280px, kjer se absolutno centrirani navigacijski gumbi prekrivajo z desnimi ikonami.

### Rešitev
Povečati breakpoint iz `lg` (1024px) na `xl` (1280px), tako da bodo naprave kot Yoga dobile mobilno/tablično navigacijo s hamburger menijem namesto desktop navigacije.

**Datoteke za spremembo:**
- `src/components/Header.tsx`: zamenjati `lg:hidden` → `xl:hidden` za mobilni layout
- `src/components/header/DesktopNavigation.tsx`: zamenjati `hidden lg:flex` → `hidden xl:flex` za desktop nav (in morebitne druge `lg:` reference)

## Problem 3: Yoga - igra odreže zgornji del
Na manjših zaslonih (Yoga ~1280x800) lahko desktop layout igre z `offsetY` -80 odreže vrh. Preveriti in prilagoditi `offsetY` izračun, da ne gre v negativno.

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`
- Prilagoditi `offsetY` izračun za desktop, da upošteva manjše zaslone (zmanjšati ali odstraniti -80 offset)

## Povzetek sprememb
1. `src/components/games/PonoviPovedGame.tsx` — landscape overlay za mobilne naprave + offsetY fix
2. `src/components/Header.tsx` — breakpoint `lg` → `xl`
3. `src/components/header/DesktopNavigation.tsx` — breakpoint `lg` → `xl`

