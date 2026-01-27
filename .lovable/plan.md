

# Nacrt: Popravek nalaganja slik v vseh igrah

## Identificiran problem

Po temeljiti analizi sem odkril glavni vzrok, zakaj se slike ne prikazujejo v nobeni igri:

### Artikulacijski test - NAPACEN BUCKET

Oba hooka za artikulacijski test uporabljata napacen Supabase bucket:

```text
+---------------------------------------+---------------------------+
| Datoteka                              | Bucket (napacen)          |
+---------------------------------------+---------------------------+
| src/hooks/useArticulationTestNew.ts   | "artikulacijski-test"     |
| src/hooks/useArticulationTest.ts      | "artikulacijski-test"     |
+---------------------------------------+---------------------------+
```

**Pravilni bucket za vse slike je `"slike"`**, ki ga uporabljajo ostale igre (Bingo, Sestavljanke, Povezi Pare).

### Kako slike nalagajo druge igre (pravilno)

| Igra | Datoteka | Bucket |
|------|----------|--------|
| Sestavljanke | GenericSestavljankaGame.tsx | `slike` |
| Bingo | BingoGrid.tsx, BingoReel.tsx | `slike` |
| Povezi Pare | matchingGameData.ts | `slike` |

### Zakaj se problem pojavlja

Ko sem posodobil `articulationTestData.ts` in zamenjal `.png` v `.webp`, so slike ostale v bucketu `"slike"`, ampak hook isce v napacnem bucketu `"artikulacijski-test"`.

---

## Resitev

### 1. Popravek `useArticulationTestNew.ts`

Zamenjati bucket iz `"artikulacijski-test"` v `"slike"`:

```typescript
// Vrstica 102-104 - PREJ (napacno)
const { data } = supabase.storage
  .from("artikulacijski-test")
  .getPublicUrl(currentData.word.image);

// PO POPRAVKU (pravilno)
const { data } = supabase.storage
  .from("slike")
  .getPublicUrl(currentData.word.image);
```

### 2. Popravek `useArticulationTest.ts`

Enaka sprememba (vrstica 50-52):

```typescript
// PREJ (napacno)
const { data } = await supabase.storage
  .from('artikulacijski-test')
  .getPublicUrl(word.image);

// PO POPRAVKU (pravilno)
const { data } = await supabase.storage
  .from('slike')
  .getPublicUrl(word.image);
```

---

## Datoteke za spremembo

| Datoteka | Vrstica | Sprememba |
|----------|---------|-----------|
| `src/hooks/useArticulationTestNew.ts` | 103 | `"artikulacijski-test"` -> `"slike"` |
| `src/hooks/useArticulationTest.ts` | 51 | `"artikulacijski-test"` -> `"slike"` |

---

## Povzetek

Po tej spremembi bodo vse igre uporabljale isti bucket `"slike"` za nalaganje slik:

```text
+------------------------+--------+
| Komponenta             | Bucket |
+------------------------+--------+
| Artikulacijski test    | slike  |  <-- POPRAVLJENO
| Sestavljanke           | slike  |
| Bingo                  | slike  |
| Povezi Pare            | slike  |
| Spomin                 | slike  |
+------------------------+--------+
```

Ta popravek bo odpravil problem s prikazovanjem slik v artikulacijskem testu in zagotovil konsistentno delovanje preko vseh iger.

