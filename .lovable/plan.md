
# Načrt: Podrobnosti otroka in integracija z artikulacijskim testom za zunanje organizacije

## Povzetek zahteve

Logopedi iz zunanjih organizacij (npr. "OŠ Test") morajo imeti enako funkcionalnost kot interni TomiTalk logopedi:

1. **Gumb "Podrobnosti"** na kartici otroka v `/admin/children` - odpre enako stran kot `/admin/users/:userId/:childId`
2. **Artikulacijski testi** otrok logopeda morajo:
   - Ustvariti sejo v "V čakanju" za vse logopede iste organizacije
   - Biti prevzeti in pregledani s strani logopedov organizacije
   - Podatki morajo biti popolnoma izolirani med organizacijami

## Ključni tehnični izzivi

### Problem 1: Struktura tabele `articulation_test_sessions`

Trenutna struktura:
- `child_id` - referenca na tabelo `children` (otroci staršev)
- `parent_id` - referenca na starša

Za otroke logopedov potrebujemo:
- `logopedist_child_id` - referenca na tabelo `logopedist_children`
- `organization_id` - za filtriranje po organizaciji

### Problem 2: Izolacija podatkov po organizacijah

Trenutno "V čakanju" prikazuje VSE pending seje. Potrebna je sprememba za:
- TomiTalk (internal) logopedi vidijo seje iz tabele `children` (starši)
- Zunanje organizacije (OŠ Test itd.) vidijo SAMO seje svojih otrok

---

## Arhitekturna rešitev

### Opcija A: Razširitev obstoječe tabele (PRIPOROČENO)

Razširimo tabelo `articulation_test_sessions` z dodatnimi stolpci:

```sql
ALTER TABLE articulation_test_sessions 
ADD COLUMN logopedist_child_id UUID REFERENCES logopedist_children(id),
ADD COLUMN organization_id UUID REFERENCES organizations(id),
ADD COLUMN source_type TEXT DEFAULT 'parent' CHECK (source_type IN ('parent', 'logopedist'));
```

**Prednosti:**
- Ohrani obstoječo logiko
- Minimalne spremembe v obstoječih hooki in komponentah
- Enostavno filtriranje po organizaciji

---

## Koraki implementacije

### 1. Shema baze podatkov

Razširitev tabele `articulation_test_sessions`:

```text
articulation_test_sessions
├── id (obstoječe)
├── child_id (obstoječe, NULL za otroke logopedov)
├── parent_id (obstoječe, NULL za otroke logopedov)
├── logopedist_child_id (NOVO, NULL za otroke staršev)
├── organization_id (NOVO, vedno izpolnjeno)
├── source_type (NOVO: 'parent' | 'logopedist')
├── status, assigned_to, ...
```

### 2. RLS politike

Posodobitev RLS politik za filtriranje po organizaciji:

```sql
-- Logopedisti vidijo samo seje svoje organizacije
CREATE POLICY "logopedists_see_own_org_sessions" ON articulation_test_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.organization_id = articulation_test_sessions.organization_id
  )
);

-- Logopedisti lahko prevzamejo seje svoje organizacije
CREATE POLICY "logopedists_claim_own_org_pending" ON articulation_test_sessions
FOR UPDATE USING (
  status = 'pending' 
  AND assigned_to IS NULL
  AND EXISTS (
    SELECT 1 FROM logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.organization_id = articulation_test_sessions.organization_id
  )
);
```

### 3. Nove datoteke

| Datoteka | Opis |
|----------|------|
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Stran za podrobnosti otroka logopeda (podobna AdminUserDetail) |
| `src/hooks/useLogopedistChildStorageFiles.ts` | Hook za pridobivanje dokumentov in posnetkov otroka logopeda |
| `src/hooks/useLogopedistChildPendingTests.ts` | Hook za pending teste po organizaciji |

### 4. Posodobitve obstoječih datotek

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminChildren.tsx` | Dodaj gumb "Podrobnosti" |
| `src/hooks/usePendingTests.ts` | Filtriranje po organizaciji in source_type |
| `src/hooks/useArticulationTestNew.ts` | Podpora za logopedist_child_id in organization_id |
| `src/config/routes.tsx` | Nova ruta `/admin/children/:childId/details` |

---

## Podrobnosti implementacije

### AdminChildren.tsx - Gumb "Podrobnosti"

```typescript
// Dodaj gumb levo od "Napredek"
<Button
  variant="outline"
  size="sm"
  onClick={() => navigate(`/admin/children/${child.id}/details`)}
>
  <FileText className="h-4 w-4 mr-1" />
  <span className="hidden sm:inline">Podrobnosti</span>
</Button>
```

### AdminLogopedistChildDetail.tsx

Nova stran z dvema stolpcema (enako kot AdminUserDetail):

**Levi stolpec:**
- Dokumenti otroka (iz storage)
- Preverjanje izgovorjave (posnetki po sejah)

**Desni stolpec:**
- Poročila (generator PDF, obstoječa poročila)

### usePendingTests.ts - Filtriranje po organizaciji

```typescript
// Obstoječa logika za 'internal' organizacije
if (profile?.organization_type === 'internal') {
  // Prikaži seje iz 'children' tabele (starši)
  query = query.eq('source_type', 'parent');
} else {
  // Prikaži samo seje iz logopedist_children za svojo organizacijo
  query = query
    .eq('source_type', 'logopedist')
    .eq('organization_id', profile.organization_id);
}
```

### Shranjevanje posnetkov za otroke logopeda

Obstoječa pot: `{parent_id}/{child_id}/Preverjanje-izgovorjave/Seja-X/`

Nova pot za otroke logopeda: `logopedist-children/{logopedist_id}/{child_id}/Preverjanje-izgovorjave/Seja-X/`

---

## Vizualni tok

### Kartica otroka (posodobljena)

```text
┌─────────────────────────────────────────────────────────────────────┐
│  [🐲 Avatar]  Otrok Ena                                             │
│               Starost: 5 let • Govorne težave: Motnja izreke       │
│                                                                     │
│  [📋 Podrobnosti]  [📊 Napredek]  [▶ Začni delo]  [✏️] [🗑️]         │
└─────────────────────────────────────────────────────────────────────┘
```

### Stran podrobnosti (`/admin/children/:id/details`)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Nazaj                                                                    │
│                                                                            │
│ Podrobnosti otroka                                                         │
│ Otrok: Otrok Ena • 5 let • Logoped: Janez Novak                           │
├──────────────────────────────────┬─────────────────────────────────────────┤
│ 📄 Dokumenti                     │ 📋 Poročila                              │
│ Naloženi dokumenti               │ Poročilo za otroka Otrok Ena            │
│                                  │                                         │
│ ┌──────────────────────────────┐ │ ┌─────────────────────────────────────┐ │
│ │ 📄 opis-tezav.pdf    👁️ ⬇️  │ │ │ TOMITALK LOGOPEDSKO POROČILO        │ │
│ │ 📄 vprašalnik.txt    👁️ ⬇️  │ │ │                                     │ │
│ └──────────────────────────────┘ │ │ Datum preverjanja: [Izberite]       │ │
│                                  │ │ Datum poročila: 2. 2. 2026          │ │
│ 🎙️ Preverjanje izgovorjave      │ │                                     │ │
│ Posnetki artikulacijskega testa │ │ ANAMNEZA:                           │ │
│                                  │ │ [___________________________]       │ │
│ ▶ Seja-1 (3 posnetkov)          │ │                                     │ │
│ ▶ Seja-2 (60 posnetkov)         │ │ [💾 Shrani]  [📄 Generiraj PDF]     │ │
│                                  │ └─────────────────────────────────────┘ │
│ ✨ Generirana poročila           │                                         │
│ ┌──────────────────────────────┐ │                                         │
│ │ 📄 porocilo.pdf   ✏️ 👁️ ⬇️🗑│ │                                         │
│ └──────────────────────────────┘ │                                         │
└──────────────────────────────────┴─────────────────────────────────────────┘
```

---

## Tok podatkov - artikulacijski test

```text
1. Logoped začne test za otroka "Otrok Ena"
                    ↓
2. Test se izvede v /admin/children/:id/test
                    ↓
3. Ob zaključku se ustvari seja v articulation_test_sessions:
   - logopedist_child_id: "ad1d4d05-..."
   - organization_id: "4bd0b8b8-..." (OŠ Test)
   - source_type: "logopedist"
   - status: "pending"
                    ↓
4. Seja se pojavi v "V čakanju" za VSE logopede organizacije OŠ Test
                    ↓
5. Logoped (Janez ali drug iz OŠ Test) prevzame sejo
                    ↓
6. Seja se premakne v "Moji pregledi" za tega logopeda
                    ↓
7. Logoped oceni izgovorjavo in generira poročilo
```

---

## Varnostna izolacija podatkov

| Scenarij | Rezultat |
|----------|----------|
| Logoped iz OŠ Test odpre "V čakanju" | Vidi SAMO pending seje otrok iz OŠ Test |
| Logoped iz TomiTalk odpre "V čakanju" | Vidi SAMO pending seje iz uporabniških profilov (starši) |
| Logoped iz OŠ Test poskusi dostopati do otroka TomiTalk | RLS blokira dostop |
| Logoped iz OŠ Test poskusi dostopati do otroka druge šole | RLS blokira dostop |

---

## Prioriteta implementacije

1. **Faza 1 - Baza podatkov**
   - Dodaj stolpce v `articulation_test_sessions`
   - Ustvari RLS politike za izolacijo organizacij
   - Migriraj obstoječe podatke (nastavi organization_id za TomiTalk)

2. **Faza 2 - Stran podrobnosti**
   - Ustvari `AdminLogopedistChildDetail.tsx`
   - Dodaj gumb "Podrobnosti" v `AdminChildren.tsx`
   - Dodaj ruto v `routes.tsx`

3. **Faza 3 - Integracija artikulacijskega testa**
   - Posodobi `useArticulationTestNew.ts` za shranjevanje v novo strukturo
   - Posodobi `transcribe-articulation` edge funkcijo za novo pot storage

4. **Faza 4 - Pending testi**
   - Posodobi `usePendingTests.ts` za filtriranje po organizaciji
   - Posodobi `AdminPending.tsx` za prikaz otrok logopedov
   - Posodobi `useClaimTestSession.ts` za podporo novih stolpcev
