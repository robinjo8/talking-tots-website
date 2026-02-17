

## Spremembe v sekciji "Kdo smo" na prvi strani

### 1. Zelena podlaga za "Kdo smo"
- Spremenimo `bg-background` v `bg-dragon-green` z valovitimi SVG ločilniki (zgoraj in spodaj), enako kot pri sekcijah Testimonials in FAQ
- Besedilo (naslov, imena, opisi) spremenimo v belo barvo (`text-white`)

### 2. FAQ sekcija dobi belo podlago
- Ker je zdaj "Kdo smo" zelena, mora FAQ preiti na belo podlago (`bg-white` namesto `bg-dragon-green`)
- Odstranimo valovite SVG ločilnike iz FAQ sekcije
- Besedilo naslova spremenimo nazaj v temno barvo

### 3. Popravki opisov
- Spela: "Spela je logopedinja z vec kot desetletnimi izkusnjami..."
- Ema: "Ema je logopedinja z vec kot desetletnimi izkusnjami..."
- Robert: "Robert je pobudnik projekta TomiTalk..."
- Jasna ostane enaka

### 4. Mobilni prikaz s slideom (carousel)
- Na mobilnih napravah zamenjamo navpicno mrežo (grid-cols-1) s horizontalnim vrtiljakom (Embla Carousel), ki omogoca drsanje levo/desno
- Na namizju ohranimo 2x2 mrežo

### 5. Gumb "Vec o nas" namesto "Prikazi vec"
- Odstranimo toggle logiko (useState, fullDescription)
- Dodamo gumb "Vec o nas" s povezavo (Link) na `/kdo-smo`

---

### Tehnicne spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/home/TeamSection.tsx` | Zelena podlaga z valovi, popravljeni opisi, carousel za mobilno, gumb "Vec o nas" -> /kdo-smo |
| `src/components/home/FAQSection.tsx` | Bela podlaga, odstranitev valov, temno besedilo naslova |
