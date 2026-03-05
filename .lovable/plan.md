

# Plan: Stran /za-posameznike in sprememba "Za starše" → "Za družine"

## 1. Sprememba naslova na strani Informacije

**Datoteka:** `src/pages/Informacije.tsx` (vrstica 13)
- Zamenjati `"Za starše"` → `"Za družine"`

## 2. Preoblikovanje strani /za-posameznike

**Datoteka:** `src/pages/ZaPosameznike.tsx` — celotna predelava

Stran bo oblikovana enako kot `/kako-deluje`:
- `prose prose-slate max-w-none space-y-8 text-justify`
- `h1`: `text-3xl font-bold text-dragon-green mb-8`
- `h2`: `text-2xl font-semibold text-foreground mb-4`
- `h4`: `text-lg font-medium text-foreground mb-2 mt-6`
- Odstavki: `text-muted-foreground leading-relaxed`
- Seznami: `list-disc list-inside text-muted-foreground space-y-2 mt-4`

### Sekcije po vrsti (iz uporabnikovega besedila):
1. **Za družine** — uvodni opis TomiTalk platforme
2. **Zakaj starši izberejo TomiTalk** — 6 prednosti s kljukicami (✔)
3. **Ali ima vaš otrok težave z izgovorjavo?** — znaki + statistika
4. **Za koga je TomiTalk** — ciljna skupina 3–10 let
5. **Kako TomiTalk pomaga vašemu otroku** — igre, motorika, video, nagrade, napredek
6. **TomiTalk na kratko** — 4 statistike z emoji ikonami
7. **Samo 30 minut na dan** — priporočilo vadbe
8. **Kako deluje TomiTalk** — 4 koraki (preverjanje → analiza → načrt → vadba)
9. **Preverjanje izgovorjave** — opis postopka
10. **Moj osebni načrt** — opis Pro funkcije
11. **Kako začeti** — 3 koraki registracije
12. **Pogosta vprašanja** — 3 FAQ-ji + link na /clanki/pogosta-vprasanja
13. **Začnite z vadbo že danes** — CTA z gumbom za registracijo

Kljukice (✔) in emoji (🎮 🧠 👩‍⚕️ 📈 1️⃣ 2️⃣ itd.) bodo prikazane kot tekst znotraj odstavkov, brez posebnih komponent — enako kot je vsebina strukturirana na /kako-deluje.

CTA gumb na dnu bo `Button` komponenta z `useNavigate` na `/register`.

