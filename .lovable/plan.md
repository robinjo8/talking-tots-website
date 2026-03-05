

# Plan: Preoblikovanje kartic za Vizualni prikaz ustnic

## Problemi
1. **Oranžna sprednja stran kartic** preveč izstopa — ne ustreza dizajnu strani.
2. **Gumb za zvočna navodila ni viden** na zadnji strani — čeprav je v kodi, ga CSS skrije ker `.flip-card-back` ima `overflow: hidden` in fiksno višino, slika pa zavzame ves prostor.

## Spremembe

### 1. Sprednja stran kartic — mehkejši dizajn
Namesto trde oranžne (`flip-card-front` CSS gradient) uporabim mehke pastelne gradiente, ki ustrezajo barvni shemi posamezne kartice:
- Glas K: modra (`from-app-blue to-app-blue/80`)
- Glas L: vijolična (`from-app-purple to-app-purple/80`)
- Glas R: oranžna/topla (`from-app-orange to-app-orange/80`)
- C, S, Z: zelena (`from-dragon-green to-dragon-green/80`)
- Č, Š, Ž: teal (`from-app-teal to-app-teal/80`)

Barve se aplicirajo inline na `.flip-card-front` z `style={{ background: ... }}` da preglasijo privzeti CSS gradient.

### 2. Zadnja stran — gumb viden
- Odstranim `overflow: hidden` na zadnji strani (inline style) ali dodam `overflow-y: auto`
- Zmanjšam padding slike da je več prostora za gumb
- Zagotovim da se `minHeight` kartice prilagodi vsebini (slika + naslov + gumb)

### Datoteka
- `src/pages/VizualniPrikazUstnic.tsx` — posodobim barve sprednje strani per-card in popravim layout zadnje strani
- `src/index.css` — opcijsko: odstranim `overflow: hidden` iz `.flip-card-back` ali ga spremenimo v `overflow-y: auto`

