

# Spremembe na informacijskih straneh

## 1. KakoDeluje.tsx -- Sprememba naslova tocke 1
- Vrstica 19: "1. Uvod -- Kaj je TomiTalk in komu je namenjen" se spremeni v "1. Kaj je TomiTalk in komu je namenjen"

## 2. KakoDeluje.tsx -- Odstranitev footerja
- Odstranimo import `FooterSection` (vrstica 2)
- Odstranimo `<FooterSection />` (vrstica 839)

## 3. Informacije.tsx -- Odstranitev footerja
- Odstranimo import `FooterSection` (vrstica 2)
- Odstranimo `<FooterSection />` (vrstica 48)

## 4. Informacije.tsx -- Sprememba kartice /delovanje-testa
- Vrstica 10: naslov se spremeni iz "Kako delujejo\nigre" v "Preverjanje\nizgovorjave"
- Ikona ostane ali se zamenja v ustreznejso (npr. Mic ali ohranimo Gamepad2)

## 5. Odstranitev footerja s podstrani
Naslednje strani dobijo footer odstranjen:
- **KdoSmo.tsx** (vrstica 61) -- odstranimo import in `<FooterSection />`
- **Kontakt.tsx** (vrstica 27) -- odstranimo import in `<FooterSection />`
- **DelovanjeTest.tsx** (vrstica 23) -- odstranimo import in `<FooterSection />`
- **ZaPosameznike.tsx** -- nima footerja, ostane kot je
- **ZaPodjetja.tsx** -- nima footerja, ostane kot je
- **PomocInPodpora.tsx** -- nima footerja, ostane kot je

## 6. PomocInPodpora.tsx in ZaPodjetja.tsx -- "Stran v izdelavi" z zmajckom
Obe strani dobita:
- Sliko iz bucketa: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_stran_v_izdelavi.webp`
- Obvestilo: "Stran je trenutno v izdelavi. Kmalu bo na voljo."
- Odstranimo gumb "Nazaj" in zamenjamo z lepso postavitvijo (centriran zmajcek + besedilo)

### Tehnicni povzetek
Skupno se ureja 7 datotek:
1. `src/pages/KakoDeluje.tsx` -- naslov tocke 1 + odstranitev footerja
2. `src/pages/Informacije.tsx` -- odstranitev footerja + sprememba kartice
3. `src/pages/KdoSmo.tsx` -- odstranitev footerja
4. `src/pages/Kontakt.tsx` -- odstranitev footerja
5. `src/pages/DelovanjeTest.tsx` -- odstranitev footerja
6. `src/pages/PomocInPodpora.tsx` -- "v izdelavi" dizajn z zmajckom
7. `src/pages/ZaPodjetja.tsx` -- "v izdelavi" dizajn z zmajckom

Nobena igra ali canvas komponenta ni prizadeta.

