

## Popravki za Apple naprave (iPhone, iPad, iMac/Safari)

### Ugotovljene težave

Apple naprave (Safari brskalnik) imajo specifične omejitve, ki povzročajo težave v vaši aplikaciji:

### 1. Video navodila ne delajo / prekinjajo na Safari

**Vzrok:** Safari zahteva posebno obravnavo video predvajanja:
- Safari na iOS ne podpira avtomatskega predvajanja brez uporabnikove interakcije
- `preload="metadata"` na Safari pogosto ne naloži dovolj podatkov za gladko predvajanje
- Safari zahteva `playsinline` atribut (že prisoten), vendar potrebuje tudi `webkit-playsinline`
- Safari ima težave z MP4 kodeki -- potrebno je zagotoviti H.264 kompatibilnost
- Fullscreen API na iOS Safari ne deluje na `<video>` elementih preko `requestFullscreen()` -- potrebno je uporabiti `webkitEnterFullscreen()` na samem video elementu

**Popravki v `src/components/video/VideoPlayer.tsx`:**
- Dodati `webkit-playsinline` atribut za starejše verzije Safari
- Spremeniti `preload` iz `"metadata"` v `"auto"` za boljše nalaganje
- Dodati `x-webkit-airplay="allow"` za AirPlay podporo

**Popravki v `src/hooks/useVideoPlayer.ts`:**
- Fullscreen: na iOS uporabiti `webkitEnterFullscreen()` na video elementu namesto `requestFullscreen()` na dokumentu
- Dodati fallback za `webkitFullscreenElement` pri preverjanju stanja
- Dodati `webkitbeginfullscreen` in `webkitendfullscreen` event listenerje za iOS
- Pri `handlePlay`: dodati retry logiko -- ce prvi `play()` ne uspe, poskusiti z `muted=true` in nato `unmute`

### 2. Igre -- Fullscreen in orientacija ne delujeta na iOS

**Vzrok:** iOS Safari NE podpira:
- `document.documentElement.requestFullscreen()` -- ta API na iOS sploh ne obstaja
- `screen.orientation.lock()` -- iOS ne podpira zaklepanja orientacije

Trenutno vseh 7 iger (Spomin, Sestavljanke, Zaporedja, Drsna igra, Igra ujemanja, Labirint, Povezovanje) klice te API-je brez fallbacka za iOS.

**Popravki v vseh 7 igralnih komponentah:**
- Dodati zaznavo iOS naprave (`/iPad|iPhone|iPod/.test(navigator.userAgent)`)
- Na iOS preskociti `requestFullscreen()` in `orientation.lock()` klice (ker ne delata)
- Namesto tega uporabiti CSS pristop: na iOS prikazati sporocilo "Obrni telefon v ležeči položaj" ce je naprava v pokoncnem nacinu
- Dodati CSS `meta viewport` prilagoditve za iOS

**Nova pomozna funkcija `src/utils/appleDetection.ts`:**
- `isIOSDevice()` -- zaznava iOS naprav
- `isSafari()` -- zaznava Safari brskalnika
- `supportsFullscreenAPI()` -- preveri, ali naprava podpira Fullscreen API
- `supportsOrientationLock()` -- preveri, ali naprava podpira zaklep orientacije

### 3. Zvocni posnetki prekinjajo na Safari/iOS

**Vzrok:** Safari ima strožje omejitve za predvajanje zvoka:
- `new Audio()` brez uporabnikove interakcije se blokira
- Vecratno ustvarjanje novih `Audio` objektov povzroca tezave na Safari

**Popravki v `src/hooks/useAudioPlayback.tsx`:**
- Ponovno uporabiti obstoječi `Audio` element namesto ustvarjanja novega vsakic
- Dodati WebKit AudioContext resume za Safari
- Dodati `load()` pred `play()` za zanesljivejše nalaganje

**Popravki v `src/hooks/useFourColumnMatching.ts`, `useThreeColumnMatching.ts`, `useMatchingGame.ts`:**
- Enaka logika ponovne uporabe Audio elementa

### 4. CSS in layout prilagoditve za Safari

**Popravki:**
- Dodati `-webkit-` prefikse za CSS lastnosti, ki jih Safari zahteva (npr. `-webkit-backdrop-filter`)
- Preveriti `aspect-ratio` podporo in dodati fallback za starejši Safari
- Preveriti `gap` v flex kontejnerjih za starejši Safari

### Povzetek datotek za spremembe

| Datoteka | Sprememba |
|----------|----------|
| `src/utils/appleDetection.ts` | NOVA -- pomozne funkcije za zaznavo Apple naprav |
| `src/hooks/useVideoPlayer.ts` | iOS fullscreen, retry play logika |
| `src/components/video/VideoPlayer.tsx` | webkit atributi, preload="auto" |
| `src/components/games/GenericSpominGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericSestavljankaGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericZaporedjaGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericLabirintGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/components/games/GenericPoveziPareGame.tsx` | iOS fullscreen/orientacija fallback |
| `src/hooks/useAudioPlayback.tsx` | Ponovna uporaba Audio elementa za Safari |
| `src/hooks/useFourColumnMatching.ts` | Safari audio popravek |
| `src/hooks/useThreeColumnMatching.ts` | Safari audio popravek |
| `src/hooks/useMatchingGame.ts` | Safari audio popravek |

### Prioriteta

1. **Najpomembnejse:** Video navodila (fullscreen + predvajanje na Safari)
2. **Drugo:** Igre (fullscreen/orientacija fallback za iOS)
3. **Tretje:** Zvocni posnetki (Safari audio omejitve)

