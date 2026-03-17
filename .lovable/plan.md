

# Desktop overlay — kontrole v širini videa

## Problem
Na desktopju video ne zavzame celotne širine containerja (omejen je z `maxHeight`), vendar overlay kontrole (`absolute inset-0`) se raztegnejo čez celotno širino parent containerja, ker je `VideoPlayer` div nastavljen na `w-full`.

## Rešitev

### `VideoPlayer.tsx`
- Spremeni zunanji div iz `w-full` v `inline-flex flex-col items-center` (ali `w-fit`), da se container skrči na dejansko širino videa
- Dodaj `max-w-full` da ne preseže parent containerja

### `GenericVideoNavodila.tsx`  
- Na parent containerju dodaj `flex items-center justify-center` da centrira skrčen VideoPlayer

Ena sprememba, en učinek: kontrole bodo vedno točno v širini videa.

