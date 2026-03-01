

# Popravek: Avtomatsko polnjenje UGOTOVITEV ne deluje

## Vzrok problema

Avtomatsko polnjenje polja UGOTOVITVE se izvede SAMO ko logoped rocno izbere sejo iz dropdown menija (`handleSessionChange`, vrstica 238). To pomeni:

1. Ko logoped pride na stran podrobnosti uporabnika, je polje UGOTOVITVE prazno
2. Logoped mora ROCNO izbrati sejo (datum preverjanja), sele takrat se ugotovitve napolnijo
3. Ce je react-query cache zastarel (ker so bile ocene pravkar shranjene na drugi strani), se lahko zgodi da so podatki prazni tudi po izbiri seje

## Popravek

### 1. Dodati avtomatsko izbiro seje in polnjenje ugotovitev

Ko se nalozijo testne seje (`testSessions`) IN ocene (`childEvaluations`), se naj avtomatsko:
- Izbere zadnja (najnovejsa) seja
- Napolni polje UGOTOVITVE iz ocen te seje

To se naredi z novim `useEffect`, ki se sprozi ko sta oba podatka na voljo.

### 2. Osveziti cache ob prihodu na stran

Dodati `refetchOnMount: 'always'` v `useChildEvaluations` hook, da se ob vsakem obisku strani podatki sveze preberejo iz baze.

### Datoteke za spremembo

**`src/hooks/useChildEvaluations.ts`**
- Dodati `refetchOnMount: 'always'` v useQuery konfiguracijo, da se ob prihodu na stran ocene vedno na novo nalozijo

**`src/pages/admin/AdminUserDetail.tsx`**
- Dodati `useEffect`, ki ob nalozitvi `testSessions` in `childEvaluations` avtomatsko izbere zadnjo sejo in napolni ugotovitve (ce ugotovitve se niso bile rocno vnesene)
- Logika za generiranje besedila ugotovitev se premakne v loceno pomocno funkcijo `generateAutoUgotovitve(childEvaluations, sessionId)`, da se lahko uporabi tako v `handleSessionChange` kot v novem `useEffect`

**`src/pages/admin/AdminLogopedistChildDetail.tsx`**
- Enaka sprememba kot za AdminUserDetail -- dodati avtomatsko izbiro seje in polnjenje ugotovitev ob nalozitvi podatkov

### Logika avtomatskega polnjenja

```text
useEffect:
  ce testSessions.length > 0 IN childEvaluations naloženi IN selectedSessionId je null:
    1. Izberi zadnjo sejo (testSessions[0])
    2. Generiraj besedilo ugotovitev iz ocen te seje
    3. Nastavi reportData: selectedSessionId, testDate, ugotovitve
```

To zagotavlja, da se ugotovitve napolnijo takoj ko logoped pride na stran, brez rocne izbire seje. Logoped lahko se vedno rocno spremeni sejo ali uredi besedilo.

