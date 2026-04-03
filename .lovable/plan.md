

## Plan: Puščice za navigacijo v fullscreen + popravek landscape prikaza na tablici

### Problemi

1. **Fullscreen layout (mobilni/tablični)** nima puščic levo/desno ob "1/15" — samo swipe
2. **Landscape na tablici**: navigacijska vrstica ima `pb-20` (80px padding), kar potisne "1/15" izven zaslona. Vsebina strani ni omejena na viewport in zahteva scrollanje

### Popravki

**1. `src/components/album/AlbumBook.tsx` — fullscreen blok (vrstice 155-163)**

Zamenjaj navigacijsko vrstico z vrstico ki vsebuje puščice + page picker (enako kot desktop):

```tsx
<div className="flex items-center justify-center gap-4 py-2 pb-6">
  <button
    onClick={goPrev}
    disabled={currentSpread === 0}
    className="p-2 rounded-full bg-white/30 backdrop-blur-sm disabled:opacity-30"
  >
    <ChevronLeft className="w-5 h-5 text-[hsl(30,30%,30%)]" />
  </button>
  
  <button
    onClick={() => setShowPagePicker(true)}
    className="text-sm font-medium ..."
  >
    {currentSpread + 1} / {totalSpreads}
  </button>
  
  <button
    onClick={goNext}
    disabled={currentSpread >= totalSpreads - 1}
    className="p-2 rounded-full bg-white/30 backdrop-blur-sm disabled:opacity-30"
  >
    <ChevronRight className="w-5 h-5 text-[hsl(30,30%,30%)]" />
  </button>
</div>
```

Ključna sprememba: `pb-20` → `pb-6` — zmanjša spodnji padding, da navigacija ostane vidna tudi v landscape. Gumba Nazaj in ? sta `fixed bottom-6`, zato `pb-6` zadostuje.

**2. Landscape vsebina** — flex-1 z overflow-hidden na vsebinskem delu že pravilno omejuje višino. Problem je samo prekomeren `pb-20`. Z `pb-6` bo navigacija vidna, vsebina pa zapolni preostali prostor brez scrollanja.

### Obseg
- 1 datoteka: `AlbumBook.tsx`
- ~15 vrstic spremenjenih (zamenjava navigacijske vrstice v fullscreen bloku)
- Desktop in mobilni prikaz ostaneta nespremenjena

