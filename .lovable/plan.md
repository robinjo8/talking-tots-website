

## Plan: Popravek emaila in razlaga napake na /odjava-obvestil

### Razlaga napake na sliki

Stran `/odjava-obvestil` zahteva query parameter `?token=...` v URL-ju. Ko obiščeš stran brez tokena (npr. samo `/odjava-obvestil`), se prikaže napaka "Manjka žeton za odjavo" — to je **pričakovano obnašanje**. Uporabnik to stran nikoli ne obišče ročno; nanjo pride samo prek linka v emailu, ki vsebuje token.

### Sprememba: podpora@tomitalk.si → info@tomitalk.si

Edina datoteka z `podpora@tomitalk.si` je `src/pages/OdjavaObvestil.tsx` (vrstica 164-165). Zamenjam `mailto:podpora@tomitalk.si` in prikazano besedilo z `info@tomitalk.si`.

