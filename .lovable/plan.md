
# Plan: Popravek napake pri generiranju porocila + validacija polj

## Problem

Ko logopedinja izbere sejo in generira PDF porocilo, se pojavi napaka:
```
invalid input syntax for type uuid: "Seja-1"
```

Vzrok: koda na vrsticah 160-198 v `AdminUserDetail.tsx` polni `testSessions` iz imen map v Storage-u (npr. "Seja-1"). Ko logopedinja izbere sejo v spustnem seznamu, se `selectedSessionId` nastavi na "Seja-1" namesto na dejanski UUID seje iz baze (`fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03`). Ta vrednost se nato uporabi pri insertu v `logopedist_reports.session_id`, kar povzroci napako.

## Resitev

### 1. Popravek mapiranja sej (AdminUserDetail.tsx)

Namesto da se `id` seje nastavi na ime mape iz Storage-a, se bo izvedla poizvedba v tabelo `articulation_test_sessions` za pridobitev dejanskih UUID-jev sej. Mapiranje bo delovalo tako:

- Iz Storage-a pridobimo ime mape (npr. "Seja-1") in iz njega izluscimo stevilko seje (1)
- Iz baze pridobimo vse seje za tega otroka (`articulation_test_sessions WHERE child_id = childId`)
- Povezemo po `session_number`: Storage mapa "Seja-1" -> baza `session_number = 1` -> UUID `fc3dd757...`

Sprememba v `useEffect` za `testSessions` (vrstice 156-199):

```text
// PREJ:
sessionsMap[sessionName] = {
  id: sessionName,          // "Seja-1" - NAPACNO
  ...
};

// POTEM:
// 1. Fetch sej iz baze
const { data: dbSessions } = await supabase
  .from('articulation_test_sessions')
  .select('id, session_number')
  .eq('child_id', childId);

// 2. Mapiranje po session_number
const dbSessionMap = new Map(dbSessions?.map(s => [s.session_number, s.id]));

// 3. Uporaba pravega UUID
const sessionNum = parseInt(sessionName.replace('Seja-', ''));
const dbSessionId = dbSessionMap.get(sessionNum);

sessionsMap[sessionName] = {
  id: dbSessionId || sessionName,  // Pravi UUID iz baze
  ...
};
```

### 2. Enaka popravka v AdminLogopedistChildDetail.tsx

Ista logika se ponovi tudi v tej datoteki (vrstice 87-128), kjer se prav tako `id` nastavi na ime mape namesto na UUID.

### 3. Validacija pred generiranjem PDF

Trenutno `hasReportContent()` preveri samo ali je karkoli vpisano v kateremkoli polju. Nova validacija bo strozja:

V obeh datotekah (AdminUserDetail.tsx in AdminLogopedistChildDetail.tsx) se `handleGeneratePdf` posodobi:

```text
// Na zacetku handleGeneratePdf:

// 1. Preveri ali je seja izbrana
if (!reportData.selectedSessionId) {
  toast.error('Izberite datum preverjanja izgovorjave');
  return;
}

// 2. Preveri ali je anamneza izpolnjena
if (!reportData.anamneza.trim()) {
  toast.error('Vnesite anamnezo');
  return;
}

// 3. Preveri ali so ugotovitve izpolnjene
if (!reportData.ugotovitve.trim()) {
  toast.error('Vnesite ugotovitve');
  return;
}

// 4. Preveri ali je izbrana vsaj ena crka
if (!reportData.recommendedLetters || reportData.recommendedLetters.length === 0) {
  toast.error('Izberite vsaj eno crko v razdelku "Priporocamo igre in vaje za"');
  return;
}
```

Stara preverba `hasReportContent()` se ohrani za gumb "Shrani osnutek", nova strozja validacija pa velja samo za "Generiraj PDF".

### 4. Vizualna indikacija obveznih polj

V `ReportTemplateEditor.tsx` se doda rdeca zvezdica (*) poleg naslovov obveznih sekcij:
- ANAMNEZA: *
- UGOTOVITVE: *
- PREDLOG ZA IGRE IN VAJE: * (za crke)

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminUserDetail.tsx` | Popravek mapiranja sej (UUID namesto "Seja-1"), nova validacija |
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Enako kot zgoraj |
| `src/components/admin/ReportTemplateEditor.tsx` | Rdeca zvezdica pri obveznih poljih |
