
# Napolnitev strani /info-moja-stran z opisom delovanja strani Moja stran

Stran `/info-moja-stran` je trenutno placeholder. Napolniti jo je treba s celotnim opisom strani `/moja-stran` -- kaj uporabnik vidi, kako deluje sistem nagrajevanja, kaj so posamezne komponente in kako so med seboj povezane.

## Spremembe

### Datoteka: `src/pages/InfoMojaStran.tsx`

Celotna stran se nadomesti z informativno stranjo v enakem vizualnem stilu kot `DelovanjeTest.tsx` in `InfoGovor.tsx` (prose, text-justify, max-w-4xl).

**Struktura vsebine:**

1. **Uvod** -- kaj je stran Moja stran, namen (pregled napredka otroka na enem mestu), dostopna prijavljenim uporabnikom z aktivno narocnino

2. **Kaj uporabnik vidi na strani** -- kratek pregled vseh treh kartic (Pokali, Zmajcki, Igre in vaje) ter dodatnih elementov (Nasvet zmajcka Tomija, navigacija)

3. **Sistem nagrajevanja -- Zvezdice** -- podroben opis:
   - Kaj je zvezdica (nagrada za opravljeno vajo ali igro)
   - Kako jo otrok dobi (ob zakljucku igre ali vaje s klikom na gumb "Vzemi zvezdico")
   - Prikaz: 10 zvezdic v mrezi 5x2, polne (zvezda) in prazne (obris)
   - Stevec: "X od 10 zvezdic do naslednjega zmajcka" + skupno stevilo
   - Info gumb (i) z razlago

4. **Sistem nagrajevanja -- Zmajcki** -- podroben opis:
   - Kaj je zmajcek (nagrada za 10 zbranih zvezdic)
   - Prikaz: 10 zmajckov v mrezi 5x2, barvni (osvojeni) in sivi (neosvojeni)
   - Stevec: "X od 10 zmajckov do naslednjega pokala" + skupno stevilo
   - Info gumb (i) z razlago

5. **Sistem nagrajevanja -- Pokali** -- podroben opis:
   - Kaj je pokal (najvecja nagrada za 10 zmajckov = 100 zvezdic)
   - Graf napredka: 10 stolpcev v razlicnih barvah, narasscajoce visine, stevilo zmajckov
   - Zmajcek na vrhu trenutnega stolpca, siv pokal na 10. stolpcu (ali Zmajcek_pokal ko je dosezen)
   - Prikaz osvojenih pokalov pod grafom
   - Info gumb (i) z razlago

6. **Kaj se zgodi ob 100 zvezdicah (pokal)** -- podroben opis:
   - Samodejno se odpre praznovalniDialog (TrophyDialog)
   - Prikaz Zmajcek_pokal.webp, cestike z imenom otroka
   - Stevilo dosezenih zvezdic in zaporedni pokal
   - Gumb "Vzemi pokal" -- shrani v lokalno shrambo, da se ne prikaze ponovno
   - Ponovi se pri vsakih naslednjih 100 zvezdicah (200, 300...)

7. **Kje otrok dobi zvezdice** -- seznam vseh aktivnosti ki podelijo zvezdice:
   - Govorne igre (Kolo besed, Spomin, Bingo, Zabavna pot, Smesne povedi, Ponovi poved, Povezi pare itd.) -- ob kliku na gumb "Vzemi zvezdico" po koncani igri
   - Govorne vaje (Vaje motorike govoril) -- ob zakljucku vseh 27 kartic, podeli 2 zvezdici
   - Zvezdice se NE podelijo samodejno -- vedno je potreben rocni klik

8. **Nasvet zmajcka Tomija** -- kartica s stalnim nasvetom za redno vadbo

9. **Navigacija (Breadcrumb)** -- drobtinice na vrhu strani za lazjo orientacijo

10. **Tehnicni podatki za starse** -- podatki se shranjujejo v Supabase bazo za vsakega otroka posebej, napredek se osvezuje v realnem casu

**Vizualni stil:**
- Enak stil kot DelovanjeTest.tsx (Header, max-w-4xl, prose prose-slate, text-justify, sekcije z h2/h4)
- Naslov "Moja stran" z razredom text-dragon-green
