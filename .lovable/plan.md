

# Plan: Kartice na sredino + navigacijska pot

## 1. Desktop kartice — enak stil kot na `/govorno-jezikovne-vaje`

V `src/pages/VizualniPrikazUstnic.tsx` zamenjam desktop grid (vrstice 184-216) s stilom kartic iz GovornojezicovneVaje:
- Uporabim `grid grid-cols-1 md:grid-cols-2 gap-8` namesto `grid-cols-3`
- Vsaka kartica dobi `bg-white rounded-xl shadow-xl border border-gray-200` z `hover:shadow-2xl hover:scale-[1.02]` efektom
- Ohranim flip logiko znotraj tega stila
- Kartice bodo centrirane in osenčene enako kot na strani Govorne vaje

## 2. Mobilni carousel — centriran

Mobilni del ostane carousel (slide levo/desno), samo zagotovim da je `max-w-sm mx-auto` za centriranje (že implementirano).

## 3. Navigacijska pot — dodaj "Vizualni prikaz ustnic"

V `src/components/BreadcrumbNavigation.tsx` dodam manjkajočo vrstico v breadcrumb konfiguracijo:
```
{ path: "/govorno-jezikovne-vaje/vizualni-prikaz-ustnic", label: "Vizualni prikaz ustnic", parent: "/govorno-jezikovne-vaje" }
```

To bo prikazalo: Domov > Govor > Govorne vaje > Vizualni prikaz ustnic

## Datoteke
- `src/pages/VizualniPrikazUstnic.tsx` — desktop kartice z enakim stilom
- `src/components/BreadcrumbNavigation.tsx` — dodaj breadcrumb vnos

