

# Izboljšave PWA namestitve - boljša iOS izkušnja in vizualna povratna informacija

## Zakaj na iOS ni mogoce narediti enako kot na Android

Apple ne podpira `beforeinstallprompt` API-ja. To je omejitev operacijskega sistema iOS -- nobena spletna aplikacija na svetu ne more ponuditi enoklicne namestitve na iPhone. Edini nacin je rocni postopek v brskalniku Safari (Deli > Dodaj na zacetni zaslon).

Kar PA lahko naredimo je izboljsati celotno izkusnjo:

## Plan izboljsav

### 1. Boljsi iOS navodila modal z vizualnimi prikazi
- Dodaj dejanske slike/ikone Safari gumbov (Share ikona, Plus ikona) namesto samo besedila
- Dodaj animiran poudarek na vsakem koraku (korak 1, 2, 3) da je bolj jasno
- Dodaj sliko TomiTalk ikone z besedilom "TomiTalk ikona se bo pojavila na tvojem zacetnem zaslonu"
- Loci iOS 15+ (Share gumb spodaj) od starejsih verzij

### 2. Android: loading indikator po potrditvi namestitve
- Ko uporabnik na Androidu potrdi namestitev v nativnem dialogu, prikazi animiran loading toast: "TomiTalk se namesca... Ikona bo vidna na zacetnem zaslonu."
- Po `appinstalled` eventu prikazi uspesno sporocilo: "TomiTalk je namescen! Odpri ga na zacetnem zaslonu."
- Ce uporabnik zavrne namestitev, prikazi kratek toast: "Namestitev preklicana. Lahko namestis kadarkoli."

### 3. iOS: potrditev po zaprtju navodil
- Ko uporabnik zapre navodila (klikne "Razumem"), prikazi toast sporocilo: "Ko dokoncas korake, bo TomiTalk ikona vidna na tvojem zacetnem zaslonu."
- Gumb v modalu naj se preimenuje iz "Razumem" v "Odpri navodila za deljenje" -- bolj akcijsko usmerjeno

### 4. iOS ne-Safari: boljse obvestilo
- Namesto kratkega toasta, prikazi modal z jasnim sporocilom in gumbom za kopiranje URL-ja, da ga lahko uporabnik prilepi v Safari

## Tehnicne spremembe

### `src/components/pwa/ManualInstallButton.tsx`
- Dodaj stanje `isInstalling` za Android loading prikaz
- Izboljsaj iOS navodila modal:
  - Vecje, jasnejse ikone za Share in Plus gumba
  - Prikaz TomiTalk ikone s sporocilom "Ikona se pojavi na zaslonu"
  - Animirani koraki z barvnimi poudarki
- Dodaj iOS ne-Safari modal (namesto toast) z gumbom "Kopiraj povezavo"
- Po Android namestitvi prikazi loading toast in nato uspesno sporocilo

### `src/hooks/usePWA.tsx`
- Dodaj `isInstalling` stanje ki se nastavi med Android namestitvijo
- Ob `appinstalled` eventu resetiraj `isInstalling` in sproži uspesno sporocilo

### `src/components/pwa/ManualInstallButton.tsx` - iOS ne-Safari modal
- Nov prikaz: namesto toast.info prikazi modal z:
  - Sporocilom: "Za namestitev odpri TomiTalk v brskalniku Safari"
  - Gumb: "Kopiraj povezavo" ki kopira URL v odlozisce
  - Navodilo: "Prilepi povezavo v Safari in sledi navodilom"

## Kaj se bo spremenilo za uporabnika

**Android uporabnik:**
1. Klikne "Prenesi aplikacijo"
2. Pojavi se Chromov nativni dialog
3. Potrdi -> vidi animirani loading "TomiTalk se namesca..."
4. Po namestitvi vidi uspesno sporocilo z ikono

**iOS Safari uporabnik:**
1. Klikne "Prenesi aplikacijo"
2. Odpre se lep modal z vizualnimi navodili in slikami
3. Sledi korakom (Deli > Dodaj na zacetni zaslon)
4. TomiTalk ikona se pojavi na zaslonu

**iOS Chrome/Firefox uporabnik:**
1. Klikne "Prenesi aplikacijo"
2. Odpre se modal z razlago in gumbom "Kopiraj povezavo"
3. Odpre Safari, prilepi povezavo, sledi navodilom

## Datoteke za urejanje
- `src/components/pwa/ManualInstallButton.tsx` -- glavne vizualne izboljsave
- `src/hooks/usePWA.tsx` -- dodaj isInstalling stanje

