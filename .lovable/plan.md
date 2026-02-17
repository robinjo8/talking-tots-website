

# Odstranitev VirusTotal skeniranja in varnostnega obvestila

## Kaj se spremeni

### 1. PdfUploader.tsx -- odstranitev obvestila
Odstranitev vrstice "Vse naložene datoteke so varnostno pregledane" (vrstica 229-232) skupaj z ikono Shield. Odstranitev tudi stanja `scanning` iz prikaza statusa (ikona in besedilo "Varnostno preverjanje..."), ker skeniranja ne bo vec.

### 2. Edge funkcija upload-child-document -- odstranitev VirusTotal logike
Celoten blok VirusTotal skeniranja (funkcije `uploadToVirusTotal`, `getVirusTotalAnalysis`, `waitForVirusTotalResult` in klic v glavnem handleru) se odstrani. Datoteka se samo nalozi v storage in shrani v bazo z `virus_scan_status: 'skipped'`. Validacija (velikost, MIME tip, magic bytes) ostane.

### 3. useChildDocuments.ts -- odstranitev scanning statusa
Odstranitev stanja `scanning` iz `setUploadStatus` in sprememba sporocila ob uspehu iz "Dokument uspesno nalozen in varnostno preverjen" v "Dokument uspesno nalozen".

## Tehnicni detajli

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/speech/PdfUploader.tsx` | Brisanje vrstic 229-232 (Shield + tekst), odstranitev `scanning` statusa iz ikon/teksta, odstranitev neuporabljenih importov (Shield) |
| `supabase/functions/upload-child-document/index.ts` | Brisanje VirusTotal funkcij (vrstice 23-85) in skenirnega bloka (vrstice 209-248), vedno nastavi `virus_scan_status: 'skipped'` |
| `src/hooks/useChildDocuments.ts` | Odstranitev `setUploadStatus('scanning')` (vrstica 66), sprememba toast sporocila (vrstica 82) |

