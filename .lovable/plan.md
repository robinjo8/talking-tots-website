

## Plan: Popravi napake pri dodajanju otroka + prikaži dejanska vprašanja

### Problem 1: Napake (toast obvestila) pri dodajanju otroka

V `AddChildForm.tsx` (vrstica 202-231) se dokumenti nalagajo v ozadju ("fire and forget"). Hook `useChildDocuments` pri napaki prikaže `toast.error` (vrstica 87). Najverjetneje Edge funkcija `upload-child-document` vrne napako (npr. manjkajoči bucket, RLS pravice, ali timeout), kar sproži toast obvestilo, čeprav je otrok uspešno dodan v bazo.

**Sprememba:** V `uploadDocumentsInBackground` funkciji (AddChildForm.tsx, vrstice 202-231) prepreči prikaz toast napak, ker gre za nekritično operacijo v ozadju. Namesto klica `uploadDocument` (ki sproži toast.error) uporabi tihi try/catch brez toast-a — ali pa kliči `resetStatus()` po vsakem uploadu, da se error ne razširi.

Konkretno: v `useChildDocuments.ts` vrstica 87 toast.error NE sme sprožiti za background uploade. Rešitev: dodaj opcijski parameter `silent: boolean` v `uploadDocument`, ki preskoči toast pri napaki.

### Problem 2: "Vprašanje 1" namesto dejanskega besedila

V `ChildCompletedView.tsx` (vrstica 122) piše `Vprašanje {index + 1}` namesto dejanskega besedila iz `SPEECH_DEVELOPMENT_QUESTIONS` in `SPEECH_DEVELOPMENT_TEXT_QUESTIONS`.

**Sprememba:** Uvozi `SPEECH_DEVELOPMENT_QUESTIONS` in `SPEECH_DEVELOPMENT_TEXT_QUESTIONS` iz `@/models/SpeechDevelopment`. V `getAnswerLabels` funkciji (vrstica 26) za vsak `key` poišči ustrezno vprašanje in vrni njegovo besedilo. Na vrstici 122 zamenjaj `Vprašanje {index + 1}` z `item.questionText`.

Enako popravi v `AdminChildCompletedView.tsx` (vrstica 145).

### Spremembe

**1. `src/hooks/useChildDocuments.ts`**
- Dodaj opcijski `silent` parameter v `uploadDocument`
- Ko je `silent = true`, preskoči `toast.error` in `setUploadStatus('error')`

**2. `src/components/AddChildForm.tsx`**
- V `uploadDocumentsInBackground` kliči `uploadDocument` s `silent: true`

**3. `src/components/children/ChildCompletedView.tsx`**
- Uvozi `SPEECH_DEVELOPMENT_QUESTIONS` in `SPEECH_DEVELOPMENT_TEXT_QUESTIONS`
- V `getAnswerLabels` za vsak key poišči besedilo vprašanja
- Zamenjaj `Vprašanje {index + 1}` z dejanskim besedilom

**4. `src/components/admin/children/AdminChildCompletedView.tsx`**
- Enaka sprememba kot pri ChildCompletedView

### Obseg
4 datoteke spremenjene.

