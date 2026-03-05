

# Analiza razlik in popravek

## Problem
Ključna razlika med karticama: homepage `FeatureCard` uporablja `<Card className="overflow-hidden border-0 shadow-lg">` — komponenta Card ima zaobljene robove IN `overflow-hidden`, ki obreže vso vsebino znotraj zaobljenih robov.

Pri flip karticah pa CSS pravilo `.flip-card-front, .flip-card-back` (index.css, vrstica 170) nastavi `overflow: visible`. To pomeni, da **gradientno ozadje znotraj kartice štrli čez zaobljene robove** — zato se vidijo pravokotni robovi in "podlaga" v ozadju.

## Popravek

### `src/index.css`
- Vrstica 163-174: Spremenim `overflow: visible` v `overflow: hidden` za `.flip-card-front, .flip-card-back` — to bo obrezalo gradientno vsebino na zaobljene robove kartice
- Odstranim ločeno pravilo `.flip-card-back { overflow-y: auto }` (vrstica 176-178) ker zadnja stran ne potrebuje scrollanja
- Dodam `border-0` in uporabim `shadow-lg hover:shadow-xl` stil iz homepage Card komponente za enako osenčenost

### `src/pages/VizualniPrikazUstnic.tsx`
- Odstranim morebitne redundantne inline border/shadow razrede na mobilnih karticah, ker bo CSS razred `.flip-card-front` že pravilno poskrbel za videz

### Datoteke
- `src/index.css`
- `src/pages/VizualniPrikazUstnic.tsx`

