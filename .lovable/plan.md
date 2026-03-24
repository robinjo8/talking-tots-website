

## Plan: Posodobitve albuma

### Spremembe

**1. `src/pages/Album.tsx`**
- Odstrani header z naslovom "TomiTalk čarobni svet" in opisom
- Album ostane samo s progress info in book komponento

**2. `src/components/album/AlbumProgress.tsx`**
- Odstrani inline world breakdown grid
- Dodaj info gumb (ikona `Info` iz lucide) desno spodaj poleg progress bara
- Ob kliku odpre Dialog/popup z razčlenitvijo po svetovih (ikona, ime sveta, owned/total za vsako področje)

**3. `src/components/album/AlbumBook.tsx`**
- Dodaj naslovno stran albuma kot prvo stran (cover image iz `Zmajcek_album_naslovna.webp`)
- Povečaj višino albuma — `min-h-[500px] md:min-h-[650px]` za bolj pokončen videz
- Na mobilnem prikazu prikaži samo eno stran naenkrat (že je `grid-cols-1`)

**4. `src/components/album/AlbumPage.tsx`**
- Namesto urejenega 3x2 grida, razporedi sličice naključno/razpršeno po strani z absolutnim pozicioniranjem
- Vsaka sličica dobi rahlo naključen odmik in rotacijo za bolj naraven videz, kot da so nalepljene

**5. DB migracija — dodaj 5 sličic za super_junake**
- INSERT 5 novih sličic za `super_junaki` (sort_order 11-15), da jih bo skupaj 15 namesto 10
- Skupno število sličic postane 105

### Tehnični detajli

- Za razpršeno pozicioniranje sličic uporabim vnaprej definirane pozicije (ne Math.random ob vsakem renderju) — seed iz sticker sort_order
- Info popup uporabi obstoječo `Dialog` komponento iz shadcn/ui
- Cover stran albuma je nova `type: 'album_cover'` stran v `buildPages`, prikazana pred prvim svetom

