

# Analiza problema: Zakaj manjkajo podatki na /admin/all-tests

## Kaj se je zgodilo

V zadnjem popravku sem v `useAdminTests.ts` (vrstica 190) dodal filter:

```typescript
return allSessions.filter(s => s.is_completed || s.word_count > 0);
```

Ta filter skrije seje kjer je `is_completed = false` **IN** `word_count = 0`. 

**Problem**: Tristanovi seji sta obe `is_completed = false` in `word_count = 0` (ena ima celo `status = 'completed'`), zato sta **obe filtrirani ven** in Tristan popolnoma izgine.

Leina opuščena seja (`is_completed = false`, `word_count = 0`) je prav tako filtrirana, ostane samo 1 dokončana seja.

## Rešitev

Spremeniti filter tako, da ohrani **vse seje ki imajo kakršenkoli status razen 'pending' z is_completed=false in word_count=0**. Konkretno:

**V `src/hooks/useAdminTests.ts`** — spremeniti filter na vrstici 190:
- Skrij samo seje kjer je `is_completed = false` **IN** `word_count = 0` **IN** `status = 'pending'` (privzeti status za novo ustvarjene seje)
- Seje s `status = 'completed'` ali drugimi statusi ohrani, tudi če je `is_completed = false` (nekonsistentno stanje, ki ga mora logoped videti)
- Seje kjer `word_count > 0` vedno prikaži (otrok je začel test ampak ni dokončal)

Nova logika:
```typescript
return allSessions.filter(s => {
  // Always show completed sessions
  if (s.is_completed) return true;
  // Show sessions with recorded words (in progress)
  if (s.word_count > 0) return true;
  // Show sessions with non-default status (manually changed)
  if (s.status !== 'pending') return true;
  // Hide truly abandoned empty sessions
  return false;
});
```

To bo:
- Tristana spet prikazalo (njegova seja ima `status = 'completed'`)
- Leino opuščeno prazno sejo (`status = 'pending'`, `word_count = 0`, `is_completed = false`) še vedno skrilo
- Ohranilo grupiranje po otroku z razširljivimi sejami

Sprememba: **1 datoteka, 1 vrstica logike**.

