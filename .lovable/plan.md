

## Plan: Virtualni album sličic "TomiTalk čarobni svet"

### Pregled

Gradimo book-style album z listanjem strani, 100 sličicami v 7 tematskih sklopih, sistemom redkosti, naključnim dodeljevanjem in animacijami ob pridobitvi sličic.

### Struktura baze podatkov (3 nove tabele)

**1. `album_stickers`** — definicija vseh 100 sličic
- `id`, `world` (enum: tomijev_gozd, carobni_grad, vesolje, dzungla, pod_morjem, dino_svet, super_junaki)
- `name`, `description`, `image_url`, `rarity` (enum: common/special/rare/legendary)
- `sort_order`, `is_golden` (boolean)

**2. `child_stickers`** — katere sličice ima otrok
- `id`, `child_id` (FK children), `sticker_id` (FK album_stickers)
- `earned_at`, `earned_reason` (text: streak_7, articulation_test, daily_5_games, plan_20_sets)
- `is_golden_version` (boolean)

**3. `child_album_stats`** — agregirane statistike za hitre poizvedbe
- `child_id`, `total_stickers`, `total_golden`, `last_sticker_at`

### Pravila dodeljevanja sličic

Sistem naključno izbere sličico iz tistih, ki jih otrok še nima. Redkost se upošteva z uteženim naključjem:
- 60% navadna, 25% posebna, 10% redka, 5% legendarna
- Če v izbrani redkosti ni več prostih sličic, se izbere iz naslednje

**Triggerji za dodelitev:**

| Pogoj | Sličice | Zlata |
|-------|---------|-------|
| 7 dni zapored vadbe | 5 | 1 zlata |
| Opravljen artikulacijski test | 2 | — |
| 5 različnih iger v enem dnevu | 1 | — |
| Vsakih 20 opravljenih setov | 5 | 1 zlata |

Edge funkcija `award-stickers` bo preverjala pogoje in dodelila sličice.

### Frontend komponente

**Nove datoteke:**

```text
src/pages/Album.tsx                          — glavna stran
src/components/album/
  AlbumBook.tsx                              — book-style page flip z CSS 3D transformacijami
  AlbumPage.tsx                              — posamezna stran (grid 3x2 sličic)
  AlbumWorldCover.tsx                        — naslovna stran teme (ime sveta + ilustracija)
  StickerSlot.tsx                            — posamezna sličica (prazna/polna/zlata)
  StickerRevealAnimation.tsx                 — animacija ob pridobitvi sličic
  AlbumProgress.tsx                          — napredek po temah
  useAlbumData.ts                            — hook za fetch sličic otroka
  useAwardStickers.ts                        — hook za preverjanje pogojev in dodelitev
  albumTypes.ts                              — tipi
```

**Book-style page flip:**
- CSS 3D perspective + transform za efekt listanja
- Swipe podpora za mobilne naprave
- Leva/desna puščica za navigacijo
- Vsaka tema ima naslovnico + 2-3 strani sličic (po 6 na stran)

**Animacija ob pridobitvi:**
1. Sparkle/confetti animacija
2. Album se "odpre" (scale-in)
3. Sličica leti v svoj slot z bounce efektom
4. Prikaz redkosti z barvnim okvirjem (zlata/vijolična/modra/siva)

### Navigacija

- Nova povezava v meniju/MojeAplikacije → `/album`
- SubscriptionGate za zaščito

### Vizualni stil sličic (placeholder)

- Barvni okvirji po redkosti: siv (navadna), moder (posebna), vijoličen (redka), zlat (legendarna)
- Placeholder ikone glede na temo (drevo za gozd, raketa za vesolje, itd.)
- Prazni sloti prikazani kot senčen okvir s silhueto

### Tehnični detajli

- Uporaba `turn.js` koncepta z čistim CSS 3D (brez zunanje knjižnice) za page flip
- Stanje albuma se bere iz Supabase (`child_stickers` JOIN `album_stickers`)
- Dodeljevanje sličic poteka preko edge funkcije z race-condition zaščito (upsert + unique constraint na `child_id + sticker_id`)
- Začetni seed 100 sličic v `album_stickers` z INSERT migracijo

### Faze implementacije

1. **DB migracija**: Tabele, enum tipi, RLS, seed 100 placeholder sličic
2. **Edge funkcija `award-stickers`**: Logika za preverjanje pogojev + naključno dodelitev
3. **Frontend album UI**: Book-style prikaz z listanjem
4. **Animacije**: Reveal sličice ob pridobitvi
5. **Integracija**: Klici award-stickers ob ustreznih triggerjih (po igrah, vajah, testih)

