

# Nov dizajn za Vizualni prikaz ustnic in Video navodila (posamezna črka)

## Cilj
Obe strani preoblikujemo po vzoru sekcije "Kako deluje TomiTalk?" — zeleno ozadje (`bg-dragon-green`), bele kartice z barvno ikono, bel naslov, bele pike za navigacijo.

**Stran `/video-navodila` (seznam) ostane nespremenjena.**

## Vizualni vzorec (iz FeaturesSection)
- Ozadje: `bg-dragon-green` čez celotno stran
- Naslov: bel, krepak (`text-white`)
- Kartica: `bg-background rounded-xl shadow-md p-6 md:p-8`, brez obrobe
- Znotraj kartice: barvna ikona v zaobljenem kvadratu (`rounded-2xl`), naslov, opis
- Pike: bele (`bg-white` / `bg-white/40`)
- Puščice: bele/svetle na zelenem ozadju (samo desktop)

---

## 1. `src/pages/VizualniPrikazUstnic.tsx`

### Layout
- Celotna stran dobi `bg-dragon-green` namesto `bg-background`
- Na mobilni: ohrani `fixed inset-0 overflow-hidden`
- Na desktopu: `min-h-screen`

### Naslov
- Bel naslov (`text-white`), brez rumene črtice
- Opis tudi bel (`text-white/80`)

### Kartice (carousel, ena naenkrat, BREZ autoplay)
- Ohrani carousel z `loop: false`, brez avtomatskega premikanja
- Kartica: `bg-background rounded-xl shadow-md p-6 md:p-8` (kot FeatureItem)
- Sprednja stran flip kartice: barvna ikona v zaobljenem kvadratu (npr. `bg-gradient-to-br from-app-purple to-app-purple/80 rounded-2xl w-20 h-20`), pod njo naslov glasu (npr. "Glas K"), pod naslovom "Klikni za prikaz"
- Zadnja stran flip kartice: ohrani sliko artikulacije in gumb za zvok
- Ohrani flip logiko (klik odpre/zapre)

### Pike in puščice
- Pike: bele (`bg-white` / `bg-white/40`) kot v CarouselPagination
- Desktop puščice: bele/svetle na zelenem ozadju

### Floating back gumb
- Ohrani obstoječega (oranžen, levo spodaj)

---

## 2. `src/components/games/GenericVideoNavodila.tsx`

### Layout
- Celotna stran dobi `bg-dragon-green` namesto `bg-background`
- Na mobilni: dodaj `fixed inset-0 overflow-hidden flex flex-col` (no-scroll)
- Na desktopu: `min-h-screen`

### Naslov
- Bel naslov (`text-white`), brez rumene črtice
- Opis bel (`text-white/80`)

### Kartica z videom
- Ena sama kartica (ni carousela, ni drsanja) — to je že obstoječe obnašanje
- Kartica: `bg-background rounded-xl shadow-md p-6 md:p-8` (kot FeatureItem), brez obrobe
- Znotraj: ohrani VideoPlayer, VideoProgressBar, VideoControls — vse funkcionalne gumbe

### Floating back gumb
- Na mobilni: ohrani obstoječi oranžni back gumb
- Na desktopu: dodaj back gumb ali ohrani obstoječo navigacijo

---

## Datoteke za spremembo
1. `src/pages/VizualniPrikazUstnic.tsx` — nov zeleni dizajn, bele kartice, bele pike
2. `src/components/games/GenericVideoNavodila.tsx` — nov zeleni dizajn, bela kartica z videom

