

## Plan: Omeji AI Klepet na naročnike + Dokumentacija življenjskega cikla

### Del 1: Omeji dostop do AI Klepeta

**Problem:** Trenutno lahko vsak prijavljen uporabnik (tudi brez naročnine) dostopa do strani KLEPET. Gumb v navigaciji je viden vsem prijavljenim uporabnikom.

**Spremembe:**

1. **`src/pages/Klepet.tsx`** — Ovij vsebino ChatInterface z `<SubscriptionGate>`, tako da neprijavljeni uporabniki vidijo poziv za nakup naročnine.

2. **`src/components/header/DesktopNavigation.tsx`** — Gumb za Klepet (MessageCircle ikona) prikaži samo če `isSubscribed` (namesto samo `user`).

3. **`src/components/header/MobileMenu.tsx`** — Gumb "Klepet" v hamburger meniju prikaži samo če `isSubscribed`.

4. **`src/components/profile/AIChatSection.tsx`** — Ovij z `<SubscriptionGate>` (ta komponenta se uporablja na profilu).

### Del 2: Dokumentacija življenjskega cikla

Ustvarim dva artefakta v `/mnt/documents/`:

**`tomitalk_lifecycle_opis.md`** — Podroben pisni opis z naslednjimi stopnjami:

- **STOPNJA 1: Neregistriran obiskovalec** — Dostop do javnih strani (Začetna stran, Logopedski nasveti, Informacije, Cenik, Kako deluje, Kdo smo, Kontakt, Pogosta vprašanja, članki, pravni dokumenti). Brez prijave, brez funkcionalnosti.

- **STOPNJA 2: Registriran uporabnik (brezplačen)** — Brezplačne igre (9 iger), Govorne vaje, Album. NE potrebuje registrirati otroka. BREZ Klepeta, brez Preverjanja, brez Osebnega načrta, brez plačljivih Govornih iger.

- **STOPNJA 3: TomiTalk Start (22€/mesec)** — Vse iz Stopnje 2 + vse Govorne igre, Poslušanje, Govor, Jezik, Moja stran, Klepet. Mora dodati otroka (ime, datum rojstva, spol). BREZ Preverjanja izgovorjave in Osebnega načrta.

- **STOPNJA 4: TomiTalk Pro (120€/leto)** — Vse iz Stopnje 3 + Preverjanje izgovorjave + Moj osebni načrt. Mora izpolniti vprašalnik in govorne težave. Celoten terapevtski cikel.

- **TERAPEVTSKI CIKEL (Pro)** — Podroben opis vseh faz: Preverjanje → Ocena logopeda → Poročilo → Osebni načrt (30 sklopov, 1/24h) → Renewal ob 30. sklopu → Pametni cooldown (90 dni ali skrajšan pred potekom) → Dinamična obvestila → Posodobitev ob novem poročilu → Potek/Podaljšanje naročnine.

- **ODVISNOSTI** — Kaj je od česa odvisno, v kakšnem zaporedju si sledijo postopki.

Pisan v čisti slovenščini, brez tehničnih poti. Namesto "/moja-stran" piše "MOJA STRAN".

**`tomitalk_lifecycle_diagram.mmd`** — Mermaid diagram celotnega cikla od registracije do poteka naročnine, z razvejitvami za Start vs Pro, pametni cooldown, renewal sklopov.

### Obseg
- 4 datoteke spremenjene (Klepet.tsx, DesktopNavigation.tsx, MobileMenu.tsx, AIChatSection.tsx)
- 2 nova dokumenta v `/mnt/documents/`

