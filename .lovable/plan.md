
# Načrt: Implementacija strani za pregled artikulacijske seje

## Problem

Ko klikneš "Ogled" na strani `/admin/my-reviews`, se odpre URL `/admin/tests/:sessionId`, ampak prikaže se seznam vseh testov (Vsa preverjanja) namesto strani za pregled posamezne seje. To se dogaja, ker:

1. Ruta `tests/:sessionId` v `AdminRoutes.tsx` še vedno kaže na `AdminAllTests` komponento
2. Nova stran `AdminSessionReview.tsx` še ni bila ustvarjena
3. Vse komponente in hooki iz načrta še niso implementirani

## Rešitev

Implementirati vse manjkajoče dele iz odobrenega načrta.

---

## Datoteke za ustvariti

### 1. `src/data/evaluationOptions.ts`
Definicije check boxov za ocenjevanje po črkah:
- Za črko S: specifične možnosti (izgovarja kot Š, ne izgovarja, prehitro, prepočasi)
- Za vse ostale črke: 4x "V pripravi" (onemogočeno)

### 2. `src/hooks/useSessionReview.ts`
Hook ki:
- Pridobi podatke o seji iz `articulation_test_sessions`
- Pridobi podatke o otroku iz `children`
- Pridobi podatke o staršu iz `profiles`
- Pridobi posnetke iz Supabase Storage
- Grupira posnetke po črkah v fonetičnem vrstnem redu
- Pridobi obstoječe ocene iz `articulation_evaluations`

### 3. `src/components/admin/RecordingPlayer.tsx`
Preprost predvajalnik zvoka z gumbi Play/Pause/Stop

### 4. `src/components/admin/EvaluationCheckboxes.tsx`
Check boxi za ocenjevanje z možnostjo komentarja

### 5. `src/components/admin/LetterAccordion.tsx`
Zložljiva sekcija za vsako črko ki vsebuje:
- 3 posnetke
- Check boxe
- Polje za komentar

### 6. `src/components/admin/SessionReviewHeader.tsx`
Header z podatki otroka (ime, starost, datum preverjanja)

### 7. `src/pages/admin/AdminSessionReview.tsx`
Glavna stran ki:
- Uporabi `useSessionReview` hook
- Prikaže header z podatki otroka
- Prikaže 20 zložljivih sekcij po črkah
- Omogoča shranjevanje ocen

### 8. Posodobitev `AdminRoutes.tsx`
- Uvozi novo komponento `AdminSessionReview`
- Spremeni ruto `tests/:sessionId` da kaže na novo komponento

---

## Vizualni rezultat

```text
┌─────────────────────────────────────────────────────────────┐
│  ← Nazaj                                                     │
│                                                              │
│  Pregled preverjanja                                         │
│  Otrok: Žak  •  Starost: 5 let  •  Oddano: 23. 1. 2026      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ČRKA P  ▼                                                   │
│  ├─ PAJEK   [▶]                                              │
│  ├─ KAPA    [▶]                                              │
│  └─ REP     [▶]                                              │
│                                                              │
│  □ V pripravi    □ V pripravi                                │
│  □ V pripravi    □ V pripravi                                │
│  Komentar: [___________________________]                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ČRKA S  ▼                                                   │
│  ├─ SOK    [▶]                                               │
│  ├─ OSA    [▶]                                               │
│  └─ NOS    [▶]                                               │
│                                                              │
│  ☑ Črko S izgovarja kot Š    □ Črke S ne izgovarja          │
│  □ Prehitro izgovarja        □ Prepočasi izgovarja          │
│  Komentar: [___________________________]                      │
└─────────────────────────────────────────────────────────────┘

... (18 dodatnih črk) ...

┌─────────────────────────────────────────────────────────────┐
│  [Shrani ocene]              [Zaključi pregled]              │
└─────────────────────────────────────────────────────────────┘
```

---

## Fonetični vrstni red

Črke bodo prikazane v tem vrstnem redu:
P → B → M → T → D → K → G → N → H → V → J → F → L → S → Z → C → Š → Ž → Č → R

---

## Tehnične podrobnosti

### Parsanje imen posnetkov

Ime datoteke: `S-39-SOK-2026-01-15T17-32-57-092Z.webm`

```typescript
function parseRecordingFilename(filename: string) {
  const match = filename.match(/^([A-ZČŠŽ]+)-(\d+)-([A-ZČŠŽ]+)-/i);
  if (!match) return null;
  return {
    letter: match[1].toUpperCase(),  // S
    wordIndex: parseInt(match[2]),   // 39
    word: match[3].toUpperCase(),    // SOK
  };
}
```

### Shranjevanje ocen

Uporaba `UPSERT` (insert on conflict update) za shranjevanje ocen:

```typescript
await supabase
  .from('articulation_evaluations')
  .upsert({
    session_id: sessionId,
    letter: 'S',
    selected_options: ['s_as_sh', 's_too_fast'],
    comment: 'Dodatne opombe...',
  }, { onConflict: 'session_id,letter' });
```

### Pridobivanje posnetkov iz Storage

Pot do posnetkov:
`uporabniski-profili/{parentId}/{childId}/Preverjanje-izgovorjave/Seja-{N}/`

Hook bo:
1. Iz seje dobil `parent_id` in `child_id`
2. Poizvedoval po vseh `Seja-X` mapah v Storage
3. Poiskal sejo ki ustreza času oddaje (`submitted_at`)
4. Grupiral posnetke po črkah

---

## Povzetek sprememb

| Datoteka | Operacija |
|----------|-----------|
| `src/data/evaluationOptions.ts` | USTVARI |
| `src/hooks/useSessionReview.ts` | USTVARI |
| `src/components/admin/RecordingPlayer.tsx` | USTVARI |
| `src/components/admin/EvaluationCheckboxes.tsx` | USTVARI |
| `src/components/admin/LetterAccordion.tsx` | USTVARI |
| `src/components/admin/SessionReviewHeader.tsx` | USTVARI |
| `src/pages/admin/AdminSessionReview.tsx` | USTVARI |
| `src/components/routing/AdminRoutes.tsx` | POSODOBI |
