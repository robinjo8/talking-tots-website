
# Popravki klepeta -- mobilna verzija

## Spremembe

### 1. Skrij header na mobilni verziji (samo na strani /klepet)
V `src/pages/Klepet.tsx`:
- Ovij `<Header />` v div z `hidden md:block`, da se na mobilni verziji ne prikaže
- Odstrani mobilni padding (`pt-0` ostane, desktop padding ostane)

### 2. Sredinsko poravnaj besedilo v zelenem polju
V `src/pages/Klepet.tsx`:
- Dodaj `text-center` na zeleni div s "Klepet - Tomi" in "Vas digitalni logopedski pomocnik"

### 3. Gumb za nazaj v zelenem polju (samo mobilno)
V `src/pages/Klepet.tsx`:
- Spremeni zeleni div v `relative` layout
- Dodaj gumb z `ArrowLeft` ikono (iz lucide-react) na levo stran, ki preusmeri na "/"
- Gumb: zelena podlaga (`bg-dragon-green`), bel okrogel rob (`border-2 border-white rounded-full`), bela puscica
- Prikazan samo na mobilni verziji (`md:hidden`)

### 4. Sredinsko poravnaj disclaimer na mobilni verziji
V `src/components/chat/ChatInterface.tsx`:
- Spremeni `text-justify` v `text-center` (sredinsko na obeh velikostih)

## Datoteke za urejanje
1. `src/pages/Klepet.tsx` -- skrij header na mobilni, sredinsko poravnaj zeleno polje, dodaj gumb nazaj
2. `src/components/chat/ChatInterface.tsx` -- sredinsko poravnaj disclaimer na mobilni
