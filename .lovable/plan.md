
# Popravki klepeta -- zeleno polje, disclaimer, placeholder

## 1. Zeleno polje tik pod headerjem na mobilni verziji
Trenutno ima container `pt-24 md:pt-32` (ali `pt-36` z bannerjem), kar ustvari presledek med app headerjem in zelenim poljem. Na mobilni verziji odstranimo ta padding, da bo zeleno polje tik pod headerjem. Na desktop verziji ohranimo obstoječi padding.

**Datoteka:** `src/pages/Klepet.tsx` (vrstica 69-71)
- Spremenimo padding: na mobilni `pt-0`, na desktop ohranimo `md:pt-32` (oz. `md:pt-44` z bannerjem)
- Prilagodimo: `bannerVisible ? 'md:pt-44' : 'md:pt-32'` (brez `pt-24`/`pt-36` za mobilno)

## 2. Disclaimer besedilo -- dve vrstici na desktop, poravnano na mobilni
Trenutno je vse v enem `<p>` elementu. Spremenimo v dve ločeni vrstici:
- Vrstica 1: "Vsebino je ustvaril AI model na podlagi strokovnih logopedskih smernic; kljub temu so možne napake ali odstopanja."
- Vrstica 2: "Sporočite nam svoje mnenje." (kot link)
- Na mobilni verziji obojestransko poravnano (`text-justify sm:text-center`)

**Datoteka:** `src/components/chat/ChatInterface.tsx` (vrstice 172-179)

## 3. Placeholder besedilo
Zamenjaj `"Vprašajte o govorno-jezikovnem razvoju..."` z `"Vnesite sporočilo"`.

**Datoteka:** `src/components/chat/ChatInterface.tsx` (vrstica 139)

## Datoteke za urejanje
1. `src/pages/Klepet.tsx` -- odstrani mobilni padding za zeleno polje tik pod headerjem
2. `src/components/chat/ChatInterface.tsx` -- disclaimer v dve vrstici + nov placeholder
