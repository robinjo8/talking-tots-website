

# Plan: Barve kartic po vzoru Kolo sreče

## Sprememba

V `src/pages/VizualniPrikazUstnic.tsx` zamenjam trenutne HSL gradiente na sprednji strani flip kartic s pastelnimi gradient ozadji iz Kolo sreče (`/govorne-igre/kolo-srece`), brez slik zmajčkov. Črke in naslov ostanejo na sprednji strani.

## Preslikava barv (iz KoloSreceGames.tsx)

| Kartica | Gradient (iz Kolo sreče) |
|---------|--------------------------|
| Glas K | `from-app-orange/20 to-app-yellow/20` |
| Glas L | `from-app-purple/20 to-app-blue/20` |
| Glas R | `from-app-purple/20 to-app-teal/20` |
| C, S, Z | `from-dragon-green/20 to-app-teal/20` |
| Č, Š, Ž | `from-app-blue/20 to-app-purple/20` |

## Tehnično

- Zamenjam `frontBg` (inline `background`) in `frontBorder` s Tailwind `className` gradientom (`bg-gradient-to-br ${gradient}`)
- Besedilo na sprednji strani spremenim v temnejšo barvo (namesto bele, ki ne bo vidna na pastelnem ozadju) — uporabim ustrezno `text-app-*` barvo za vsak glas
- Odstranim inline `boxShadow` in `background` style, uporabim le Tailwind razrede + rahlo senčenje

### Datoteka
- `src/pages/VizualniPrikazUstnic.tsx`

