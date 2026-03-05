

# Plan: Mobilni carousel za kartice ustnic — enak stil kot "Kaj ponuja TomiTalk?"

## Spremembe

### `src/pages/VizualniPrikazUstnic.tsx` (mobilni del, vrstice 139-182)

Zamenjam trenutni mobilni carousel z enako strukturo kot `MobileFeatureCarousel` iz FeaturesCardsSection:

- **Carousel opts**: `align: "center"`, `loop: false` — enako kot na prvi strani
- **CarouselItem**: `basis-full flex justify-center` z notranjo `div` `w-full max-w-sm p-1`
- **Pagination pike**: Zamenjam `CarouselPagination` komponento z inline pikami v stilu FeaturesCardsSection — pike so `bg-dragon-green` (aktivna) in `bg-muted-foreground/40` (neaktivna), namesto belih pik ki so za temno ozadje

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx`

