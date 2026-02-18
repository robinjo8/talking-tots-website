
## Popravek: CORS blokira transkripcijo v razvojnem okolju

### Ugotovljen vzrok

Edge funkcija `transcribe-articulation` ima v CORS konfiguraciji (vrstica 13) preverjanje dovoljenih izvorov (origins):

```
origin.endsWith(".lovable.app")
```

Vaš predogled/testno okolje pa teče na domeni:
```
*.lovableproject.com
```

Brskalnik zato **blokira** zahtevo za transkripcijo (CORS napaka "Failed to fetch"). Posledica:

1. Zvok se posname (mikrofon deluje)
2. Zahteva za transkripcijo se poslje, a brskalnik jo blokira
3. Nobena povratna informacija ne pride nazaj
4. Slika posivi, gumb se vrne na "Izgovori besedo"
5. Napredek se ne shrani (ker transkripcija ni uspela)

### Zakaj prej delalo, zdaj pa ne

Ta CORS pravilo je bilo dodano med varnostnimi popravki. Pred tem je edge funkcija dovoljevala vse izvore (`*`). Sedanji seznam dovoljenih izvorov ne vkljucuje `lovableproject.com`, ki je domena za razvojno okolje.

### Popravek

**Datoteka:** `supabase/functions/transcribe-articulation/index.ts`, vrstica 13

Trenutna koda:
```typescript
const isAllowed = allowedOrigins.includes(origin) || 
  (origin.startsWith("https://") && origin.endsWith(".lovable.app"));
```

Popravljena koda:
```typescript
const isAllowed = allowedOrigins.includes(origin) || 
  (origin.startsWith("https://") && 
   (origin.endsWith(".lovable.app") || origin.endsWith(".lovableproject.com")));
```

To doda domeno `lovableproject.com` (razvojno okolje) med dovoljene izvore, medtem ko ohranja varnostno omejitev samo na Lovable domene.

### Po popravku

1. Brskalnik bo dovolil zahtevo za transkripcijo
2. Whisper API bo prejel zvocni posnetek in vrnil transkripcijo
3. Ce je beseda pravilna, se prikaze gumb "NAPREJ" in pozitivno sporocilo
4. Ce je beseda napacna, se prikaze sporocilo s transkribirano besedo
5. Napredek se shrani v bazo (`current_word_index = 1` po prvi besedi)
6. Ob vrnitvi v test se prikaze dialog za nadaljevanje

### Spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `supabase/functions/transcribe-articulation/index.ts` | Vrstica 13: dodana domena `.lovableproject.com` v CORS preverjanje |

Po spremembi je potreben ponovni deploy edge funkcije.
