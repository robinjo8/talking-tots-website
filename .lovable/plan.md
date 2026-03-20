

## Problem

Ko shranite poročilo kot `.txt`, se strukturirani podatki (izbrani glasovi, motorika, video navodila) shranijo **samo kot besedilo** v stavku "Priporočamo igre in vaje za glas R..." znotraj sekcije PREDLOG ZA IGRE IN VAJE. 

Ko naložite `.txt` nazaj:
1. **Ni zapisa v bazi** — `logopedist_reports` zapis se ustvari šele ob generiranju PDF-ja, zato iskanje v bazi ne vrne rezultata
2. **Celoten tekst** (vključno z generirano poved) se naloži v polje `predlogVaj` → to povzroči **podvajanje** (generirani stavek + ponovna izbira glasov)
3. Strukturirani izbirniki (glasovi, motorika, video) ostanejo prazni → validacija sproži napako

## Rešitev

Ob shranjevanju `.txt` datoteke dodati **JSON metapodatke** na konec datoteke, ločene z markerjem. Ob nalaganju jih razčleniti in pravilno nastaviti.

### Spremembe

**1. `src/components/admin/ReportTemplateEditor.tsx` — `generateReportText()`**

Na konec besedila dodati JSON blok s strukturiranimi podatki:

```
───METADATA───
{"letters":[{"letter":"R","positions":["start","middle-end","initial-exercises"]}],"motorika":{"type":"weekly"},"videoLetters":["R"],"predlogVaj":"moje dodatne opombe"}
```

Polje `predlogVaj` v besedilnem delu ostane sestavljeno samo iz `combinedText` (brez uporabnikovih dodatnih opomb — te gredo v metadata JSON).

**2. `src/pages/admin/AdminUserDetail.tsx` — `handleEditReport()`**

- Razčleni JSON metapodatke iz `.txt` datoteke (marker `───METADATA───`)
- Nastavi `recommendedLetters`, `motorikaFrequency`, `motorikaCustomCount`, `motorikaCustomUnit`, `recommendedVideoLetters` iz JSON-a
- Nastavi `predlogVaj` iz JSON polja `predlogVaj` (samo uporabnikove dodatne opombe, NE generirani stavek)
- Če metadata ni prisotna (stare datoteke), uporabi obstoječi fallback z iskanjem v bazi

**3. `src/pages/admin/AdminLogopedistChildDetail.tsx`** — enaka sprememba kot #2

**4. `handleSaveReport()` v obeh datotekah**

Posodobiti `generateReportText` klic, da vključi metadata (ali pa se metadata doda neposredno v save logiko).

### Obseg
- `src/components/admin/ReportTemplateEditor.tsx` — posodobi `generateReportText()` z metadata blokom
- `src/pages/admin/AdminUserDetail.tsx` — posodobi `handleEditReport()` za parsanje metadat + `handleSaveReport()` za pravilno besedilo
- `src/pages/admin/AdminLogopedistChildDetail.tsx` — enake spremembe

