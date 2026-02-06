

# Prilagoditev: otrok omenjen samo ko je relevantno

## Problem

Trenutno navodilo v edge funkciji pravi:

> "VEDNO uporabi te podatke. NE ugibaj starosti ali govornih tezav otroka."

To povzroci, da asistent v VSAKEM odgovoru omeni ime otroka in njegove govorne tezave - tudi pri splosnih vprasanjih kot je "Kako sodelovati z vzgojitelji?"

## Resitev

Spremeniti navodilo v edge funkciji, da asistent **pozna** podatke o otroku, ampak jih uporabi samo takrat ko so za odgovor relevantni.

### Sprememba v datoteki

**`supabase/functions/chat-assistant/index.ts`** - sprememba bloka z navodili za otrokov kontekst (vrstica 93):

Trenutno:
```
VEDNO uporabi te podatke. NE ugibaj starosti ali govornih tezav otroka.
Ce uporabnik vprasa o otroku, odgovarjaj na podlagi teh podatkov.
```

Novo:
```
Te podatke IMAS na voljo kot ozadje. Uporabi jih SAMO kadar so neposredno relevantni za vprasanje uporabnika.
NE omenjaj imena otroka, starosti ali govornih tezav v VSAKEM odgovoru.
Ce uporabnik postavi splosno vprasanje (npr. o tehnikah, vajah, sodelovanju z vzgojitelji), odgovori splosno brez omenjanja specificnih podatkov otroka.
Ce uporabnik vprasanje neposredno nanasa na svojega otroka ali na specificne govorne tezave, TAKRAT uporabi te podatke za personaliziran odgovor.
NE ugibaj ali dodajaj podatkov ki niso na voljo.
```

Ta sprememba pomeni:
- Pri vprasanju "Kako sodelovati z vzgojitelji?" bo asistent odgovoril splosno, brez "Ker ima vas otrok Masa tezave z..."
- Pri vprasanju "Ali moj otrok pravilno izgovarja R za svojo starost?" pa bo asistent uporabil podatke o starosti in govornih tezavah

### Tehnicno

Samo ena datoteka se spremeni: `supabase/functions/chat-assistant/index.ts` (vrstica 93). Po spremembi se edge funkcija ponovno deploja.

