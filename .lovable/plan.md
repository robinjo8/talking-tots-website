
# Napolnitev strani /info-govor z informacijami o razdelku Govor

Stran `/info-govor` je trenutno placeholder. Napolniti jo je treba z opisom vseh stirih aktivnosti, ki so na voljo na strani `/moje-aplikacije` (Govor): Moj osebni nacrt, Govorne igre, Govorne vaje in Preverjanje izgovorjave.

## Spremembe

### Datoteka: `src/pages/InfoGovor.tsx`

Celotna stran se nadomesti z informativno stranjo v enakem vizualnem stilu kot `DelovanjeTest.tsx` (prose, text-justify, sekcije z h2/h4, text-muted-foreground).

**Struktura vsebine:**

1. **Uvod** -- kratka predstavitev razdelka Govor: kaj uporabnik najde na tej strani, namen (vadba izgovorjave, igre, vaje, preverjanje, osebni nacrt)

2. **Govorne igre** -- opis kaj so govorne igre, namen (zabavna vadba izgovorjave posameznih glasov), seznam vseh 11 iger s kratkim opisom:
   - Kolo besed, Igra ujemanja, Zaporedja, Spomin, Drsna igra, Labirint, Sestavljanke (glasovi na zacetku besed)
   - Zabavna pot, Bingo (glasovi na sredini in koncu besed)
   - Ponovi poved, Smesne povedi (glasovi na zacetku, sredini in koncu)
   - Pobarvanke, Povezi pike (kmalu na voljo)
   - Opis, da igre pokrivajo razlicne polozaje glasov in razlicne starostne skupine

3. **Govorne vaje** -- opis treh vrst vaj:
   - Vaje motorike govoril -- razgibavanje govoril (usta, ustnice, jezik)
   - Moji prvi glasovi -- animacija za prepoznavanje in posnemanje glasov
   - Video navodila -- video logopeda za pravilno izgovorjavo

4. **Preverjanje izgovorjave** -- kratek opis kaj je, kako deluje (sistematicno preverjanje 20 soglasnikov), standardna in prilagojena razlicica, s povezavo (Link) na `/delovanje-testa` za vec informacij

5. **Moj osebni nacrt (TomiTalk Pro)** -- opis kaj je osebni nacrt, kako nastane (na podlagi rezultatov preverjanja), kaj vsebuje (90-dnevni nacrt vaj in iger, prilagojen otrokovim izzivom), da je na voljo v okviru narocnine TomiTalk Pro

6. **Sistem nagrajevanja** -- kratka omemba zvezdic in dnevnega spremljanja napredka

7. **Za koga je namenjeno** -- starostne skupine (3-4, 5-6, 7-8, 9-10 let)

**Vizualni stil:**
- Header komponenta na vrhu
- Naslov "Govor" z razredom text-dragon-green
- max-w-4xl, prose prose-slate, text-justify
- Sekcije z h2, h4, ul, p -- enako kot DelovanjeTest.tsx
- Link komponenta iz react-router-dom za interno povezavo na /delovanje-testa
