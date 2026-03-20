

## Analiza: Napačno grupiranje posnetkov pri 20-besednem testu

### Korenski vzrok

Težava je **v zapisu `total_words` v bazi podatkov**. Tok:

1. Komponenta `AdminArtikulacijskiTest` se naloži → `useEffect` takoj kliče `initSessionManager(childId, totalWordsCount)`
2. Na tej točki `totalWordsCount` = **60** (privzeto za otroke 5+ brez overrida)
3. Seja se ustvari v bazi z `total_words: 60`
4. Šele nato logoped odpre nastavitve in izbere **20 besed** → `setWordCountOverride` posodobi localStorage
5. Test se dejansko izvede z 20 besedami (indeksi 0-19, vsak pripada svoji črki)
6. Toda **seja v bazi obdrži `total_words: 60`**

Na strani pregleda (`useSessionReview.ts`, vrstica 211):
```
const wordsPerLetter = totalWords === 20 ? 1 : 3;
```
Ker je `total_words = 60`, se uporabi `wordsPerLetter = 3`. S tem se indeks 0→P(PAJEK), indeks 1→P(OPICA), indeks 2→P(REP) — namesto pravilnega 0→P, 1→B, 2→M.

### Načrt popravka

**1. Posodobi `total_words` v bazi po potrditvi nastavitev** (`AdminArtikulacijskiTest.tsx`)

V `onClose` začetnega nastavitvenega dialoga, po `initializeSession()`, dodati klic za posodobitev `total_words` v bazi:

```typescript
onClose={async () => {
  setShowInitialSettings(false);
  await initializeSession();
  // Posodobi total_words v bazi, če se je spremenil
  if (sessionInfo?.sessionId) {
    await supabase
      .from('articulation_test_sessions')
      .update({ total_words: totalWordCount })
      .eq('id', sessionInfo.sessionId);
  }
  setTestStarted(true);
}}
```

**2. Popravi obstoječo sejo** (enkratni popravek za sejo `8700b2fe-...`)

Ker ima ta seja `total_words: 60` namesto 20, jo je treba ročno popraviti. Lahko dodamo logiko v `useSessionReview`, ki **šteje dejansko število posnetkov** in na podlagi tega ugotovi pravi `wordsPerLetter` — kot varnostna mreža.

**3. Dodaj detekcijo neskladja v `useSessionReview.ts`**

Kot varnostno mrežo: če je v storage ≤20 posnetkov in `total_words = 60`, uporabi `wordsPerLetter = 1`:

```typescript
const totalWords = session.total_words;
// Varnostna mreža: če je dejansko število datotek ≤ 20, uporabi wordsPerLetter=1
const actualFileCount = audioFiles.length;
const wordsPerLetter = (totalWords === 20 || (totalWords === 60 && actualFileCount <= 20)) ? 1 : 3;
```

**4. Enako popravi za uporabniški portal** (`ArtikulacijskiTest.tsx`)

Preveriti, ali ima enak problem z `useUserSessionManager`.

### Obseg sprememb
- `src/pages/admin/AdminArtikulacijskiTest.tsx` — posodobi `total_words` v bazi po nastavitvah
- `src/hooks/useSessionReview.ts` — dodaj varnostno detekcijo dejanskega števila posnetkov
- Preveriti `src/pages/ArtikulacijskiTest.tsx` za enak vzorec

