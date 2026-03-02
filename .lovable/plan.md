

# Napolnitev strani /delovanje-testa z vsebino o preverjanju izgovorjave

Stran `/delovanje-testa` je trenutno prazna (samo placeholder "Vsebina strani bo kmalu na voljo"). Napolniti jo je treba s celotno vsebino o delovanju preverjanja izgovorjave -- kombinacija informacij iz obeh dialogov (Obvestilo pred zacetkom + Kako deluje) ter besedila s strani /kako-deluje.

## Spremembe

### Datoteka: `src/pages/DelovanjeTest.tsx`

Celotna stran se nadomesti z bogato vsebinsko stranjo, ki vkljucuje:

**Struktura vsebine (sekcije):**

1. **Uvod** -- kaj je preverjanje izgovorjave, namen, kratek povzetek
2. **Kaj se preverja** -- 20 soglasnikov, trije polozaji (zacetek, sredina, konec)
3. **Struktura preverjanja** -- Standardna razlicica (60 besed) in Prilagojena razlicica (20 besed, 3-4 let)
4. **Nastavitve preverjanja** -- Stopnja zahtevnosti (Nizka/Srednja/Visoka) in Cas snemanja (3/4/5 sekund)
5. **Prikaz napredka med preverjanjem** -- opis progress grida z glasovi + slika (`test_izgovorjave_1.png`)
6. **Potek izgovorjave posamezne besede** -- 6 korakov s slikami:
   - Korak 1: Ogled slike
   - Korak 2: Klik na gumb "Izgovori besedo" + slika (`bik_1.png`)
   - Korak 3: Izgovorjava med odstevanjem
   - Korak 4: Casovnik + slika (`bik_2.png`)
   - Korak 5: Gumb "Naprej" + slika (`bik_3.png`)
   - Korak 6: Premik na naslednjo besedo
7. **Snemanje in zaznavanje govora** -- RMS analiza, tisina vs. zaznan zvok
8. **Takojsnja povratna informacija** -- uspesna/neuspesna izgovorjava, maskota
9. **Shranjevanje in analiza rezultatov** -- testni sklop, kasnejsi pregled
10. **Zakljucek testa in ponovljivost** -- samodejni zakljucek, periodika (vsake 3 mesece)
11. **Kdaj se preverjanje izvaja** -- ob zacetku, periodicno
12. **Povezava z osebnim nacrtom in vloga starsev**
13. **Pomembno obvestilo za starse** -- ni diagnosticno orodje
14. **Kako lahko otroku pomagate** -- mirno okolje, brez pritiska

**Vizualni stil:**
- Enak stil kot KakoDeluje.tsx (h2, h4, ul, p z razredi text-muted-foreground, leading-relaxed)
- Header komponenta na vrhu
- Slike iz Supabase storage (`slike-ostalo` bucket) -- enake kot v InstructionsDialog
- Responsive layout z max-w-4xl

**Slike ki se uporabijo:**
- `test_izgovorjave_1.png` -- prikaz napredka (progress grid)
- `bik_1.png` -- gumb "Izgovori besedo"
- `bik_2.png` -- casovnik odstevanja
- `bik_3.png` -- gumb "Naprej"
