
Cilj: Album na tablici v ležečem položaju narediti po istem principu kot Labirint — resnično fullscreen, brez vertikalnega scrollanja, z vsebino fizično prilagojeno vidnemu viewportu.

1. Ugotovljen vzrok
- `/album` je sicer v `fixed inset-0`, vendar `AlbumBook` ne računa dejanske vidne višine tablice.
- Trenutno uporablja statične paddige in razmerja (`p-2`, spodnja navigacija, fiksna gumba spodaj), vsebina strani pa ima `h-full`, zato se na nižjih landscape viewportih seštevek elementov ne prilega.
- Labirint deluje bolje, ker uporablja fullscreen pristop z dejanskim viewportom in brez “naravne” višine vsebine, ki bi potiskala layout čez ekran.

2. Kaj bom uskladil z Labirint pristopom
- V `AlbumBook.tsx` dodam merjenje realnega viewporta prek `window.visualViewport` (fallback `window.innerWidth/innerHeight`), enako kot pri drugih fullscreen igrah.
- Za fullscreen album izračunam razpoložljivo višino:
  - minus prostor za spodnjo navigacijo `1/15 + puščice`
  - minus safe area
  - minus prostor, da se ne tepe z lebdečima gumboma Nazaj in `?`
- Knjiga/page container bo dobila eksplicitno izračunano višino in `overflow-hidden`, namesto da raste po vsebini.

3. Konkretne spremembe
- `src/components/album/AlbumBook.tsx`
  - dodam state/effect za `viewportWidth` in `viewportHeight`
  - fullscreen wrapper spremenim v natančno razdeljen layout:
    - zgoraj: page area z izračunano višino
    - spodaj: kompakten navigation bar
  - `motion.div` in page wrapper dobita strogo omejeno višino
  - za tablico v landscape zmanjšam notranje paddinge in gap-e
  - po potrebi ločim mobile fullscreen in tablet fullscreen stil, da tablica ne uporablja enakih dimenzij kot telefon
- `src/components/album/AlbumPage.tsx`
  - za fullscreen/tablični prikaz zmanjšam razmik in velikost sticker slotov, da se vseh 6 sličic vedno prilega brez overflowa
  - page number ostane znotraj vidnega dela strani
- `src/components/album/AlbumWorldCover.tsx`
  - zmanjšam `gap`, `p-6`, velikost ikone in naslova v fullscreen landscape varianti, da se naslovne strani svetov prilegajo brez rezanja
- po potrebi tudi `InstructionsPage` v `AlbumBook.tsx`
  - zmanjšam vertikalne razmake (`space-y`, `mb`, `pb`) za landscape tablice, ker je ta stran pogosto previsoka

4. Oblikovni princip
- Ohranjen bo obstoječ videz albuma.
- Ne bom spreminjal logike listanja ali page pickerja.
- Sprememba bo samo v “physical fit” pristopu: vse se mora prilegati znotraj viewporta, tako kot pri Labirintu.

5. Zakaj trenutni popravek ni bil dovolj
- Prejšnji popravek je zmanjšal samo spodnji padding navigacije.
- Glavni problem pa ni samo navigation bar, ampak to, da sama vsebina strani albuma nima dinamično omejene višine glede na dejanski landscape viewport tablice.

6. Datoteke za spremembo
- `src/components/album/AlbumBook.tsx`
- `src/components/album/AlbumPage.tsx`
- `src/components/album/AlbumWorldCover.tsx`
- verjetno še notranji `InstructionsPage` v `AlbumBook.tsx`

7. Pričakovan rezultat po popravku
- Na tablici v ležečem položaju `/album` zapolni cel zaslon kot Labirint
- brez scrollanja gor/dol
- `1/15` in puščici vedno ostanejo vidni
- vsebina posamezne strani se zmanjša/prilagodi glede na višino zaslona
- mobilni in desktop prikaz ostaneta funkcionalno enaka

Tehnična opomba
- Labirint uporablja fullscreen shell + dinamično prilagajanje vidnemu viewportu.
- Album trenutno uporablja fullscreen shell, ne pa še dinamičnega “fit-to-viewport” izračuna za samo vsebino.
- Popravek je torej: album preklopiti iz statičnega fullscreen layouta v dinamično izračunan fullscreen layout.
