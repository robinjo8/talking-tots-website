

## Plan: Zamenjaj SplashScreen z intro videom

### Problem
Trenutni splash screen prikazuje animirano TOMITALK besedilo + zmajčka. Uporabnik želi namesto tega predvajati video `Intro_video.mp4` iz Supabase bucketa `video`.

### Popravek

**1 datoteka: `src/components/SplashScreen.tsx`**

Celotna komponenta se prepiše:
- Odstrani se vsa Framer Motion animacija (zvezdice, črke, zmajček)
- Namesto tega se prikaže `<video>` element s `src` iz Supabase: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video/Intro_video.mp4`
- Video se avtomatsko predvaja (`autoPlay`, `muted` za dovoljenje brskalnika, `playsInline`)
- Ko se video konča (`onEnded`), pokliče `onComplete()` za prehod na aplikacijo
- Dodan tudi "Preskoči" gumb za uporabnike, ki ne želijo čakati

**Prikaz videa:**
- **Telefon (pokončno):** `fixed inset-0`, video zapolni celoten zaslon z `object-cover`, belo/temno ozadje za morebitne robove
- **Tablica (pokončno ali ležeče):** Enako — `object-contain` ali `object-cover` za prilagoditev obema orientacijama
- **Desktop:** Video centriran na sredini zaslona z `object-contain`, da je viden v celoti brez obrezovanja, belo ozadje

Konkretno:
- Zunanji `div`: `fixed inset-0 z-[100] bg-white flex items-center justify-center`
- Video: `w-full h-full object-contain` — video se prikaže v celoti, brez obrezovanja, z belim ozadjem za morebitne prazne dele
- Fade-out animacija z `AnimatePresence` ostane (lep prehod ko se video konča)
- Gumb "Preskoči" v spodnjem desnem kotu

**2 datoteka: `src/App.tsx`**

- Ponovno omogočim `sessionStorage` preverjanje, da se video prikaže samo enkrat na sejo (ne ob vsakem osveževanju)

### Obseg
- 2 datoteki
- SplashScreen se poenostavi (manj kode kot prej)
- Video URL: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video/Intro_video.mp4`

