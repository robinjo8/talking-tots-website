

## Kako deluje trenutno (in zakaj je narobe za 20 besed)

**60-besedni test (deluje pravilno):**
- wordIndex 0 → P/PAJEK, 1 → P/OPICA, 2 → P/REP, 3 → B/BIK, 4 → B/OBLAK, ...
- V datoteki posnetka je zapisan ta isti wordIndex (npr. `P-0-PAJEK-...webm`, `P-1-OPICA-...webm`)
- Pregled pravilno mapira nazaj

**20-besedni test (problem):**
- Tu je `wordsPerLetter = 1`, torej vsak glas ima samo 1 besedo
- wordIndex gre: 0 → PAJEK, 1 → BIK, 2 → MED, 3 → TORBA, ...
- Datoteke se shranijo kot `P-0-PAJEK-...webm`, `B-1-BIK-...webm`, `M-2-MED-...webm`
- **Problem:** `parseRecordingFilename` vedno uporablja 60-besedno mapiranje, kjer je wordIndex 1 = OPICA (druga beseda glasu P), ne BIK (glas B). Zato se BIK prikaže pod glasom P kot "OPICA".

## Kako bo delovalo po popravku

Za 20-besedni test se bo v pregledu za vsak glas prikazala samo 1 beseda (pravilna):
- Glas P → PAJEK
- Glas B → BIK
- Glas M → MED
- itd.

Posnetki se bodo pravilno razvrstili pod prave glasove glede na `total_words` iz seje.

## Vpliv na 60-besedni test

**Nič se ne bo pokvarilo.** Sprememba je zasnovana tako:
- Funkcije `getLetterFromWordIndex` in `parseRecordingFilename` dobijo opcijski parameter `wordsPerLetter` s privzeto vrednostjo `3`
- Vsi obstoječi klici brez tega parametra bodo delovali identično kot doslej
- Samo v `useSessionReview.ts` se bo iz seje prebralo `total_words` in na podlagi tega posredovalo `wordsPerLetter = 1` (za 20 besed) ali `3` (za 60 besed)

## Spremembe

### 1. `src/data/evaluationOptions.ts`
- Zgradim **dva** mapiranja: eno za `wordsPerLetter=3` (obstoječe, 60 besed) in eno za `wordsPerLetter=1` (20 besed, samo prva beseda vsakega glasu)
- Funkciji `getLetterFromWordIndex(wordIndex, wordsPerLetter?)` in `getWordFromWordIndex(wordIndex, wordsPerLetter?)` sprejmeta opcijski parameter (privzeto 3)
- `parseRecordingFilename(filename, wordsPerLetter?)` posreduje parameter naprej

### 2. `src/hooks/useSessionReview.ts`
- Iz seje prebere `total_words` (že obstaja v bazi)
- Izračuna `wordsPerLetter = (total_words === 20) ? 1 : 3`
- Posreduje v `parseRecordingFilename` pri parsanju imen datotek

