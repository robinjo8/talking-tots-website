
# Načrt: Odstranitev sekcije starša in prikaz dokumentov za otroke logopeda

## Povzetek problemov

Na strani `/admin/children/:id/details` sta dva problema:

1. **Sekcija "PODATKI O STARŠU / SKRBNIKU"** - Ta sekcija je nepotrebna za otroke logopeda, ker jih logoped dodaja sam brez starša
2. **Dokumenti se ne prikazujejo** - Ko logoped ustvari otroka (npr. "Tian") in vnese opis govornih težav ter osnovni vprašalnik, se ti podatki shranijo le v bazo podatkov, NE pa v storage (mapo Dokumenti)

---

## 1. Odstranitev sekcije starša

### Problem

Komponenta `ReportTemplateEditor` je deljena med:
- TomiTalk logopedi (imajo podatke o staršu - prikazati)
- Logopedi zunanjih organizacij (nimajo starša - ne prikazati)

### Rešitev

Dodati prop `hideParentSection` v komponento `ReportTemplateEditor`:

```typescript
interface ReportTemplateEditorProps {
  data: ReportData;
  testSessions: TestSession[];
  hideParentSection?: boolean;  // NOVO
  onFieldChange: ...
  onSessionChange: ...
}
```

V komponenti pogojno prikazati sekcijo:

```typescript
{/* Parent/Guardian Data - samo če ni skrita */}
{!hideParentSection && (
  <div className="space-y-2">
    <h2>PODATKI O STARŠU / SKRBNIKU</h2>
    ...
  </div>
)}
```

V `AdminLogopedistChildDetail.tsx` uporabiti:
```typescript
<ReportTemplateEditor
  data={reportData}
  testSessions={testSessions}
  hideParentSection={true}  // Skrij sekcijo starša
  onFieldChange={handleReportFieldChange}
  onSessionChange={handleSessionChange}
/>
```

---

## 2. Prikaz dokumentov iz baze podatkov

### Problem

Ko logoped doda otroka preko čarovnika (`AdminAddChildWizard`), se podatki shranijo v bazo:
- `speech_difficulties_description` → opis govornih težav
- `speech_development` → odgovori na vprašalnik

AMPAK dokumenti se NE naložijo v storage, zato `useLogopedistChildStorageFiles` ne najde ničesar.

### Primerjava z uporabniškim portalom

| Korak | Uporabniški portal (`AddChildForm.tsx`) | Admin portal (`AdminAddChildWizard.tsx`) |
|-------|----------------------------------------|------------------------------------------|
| 1. Shrani v bazo | ✅ Da | ✅ Da |
| 2. Naloži v storage | ✅ Da - `opis-govornih-tezav.txt`, `osnovni-vprasalnik.txt` | ❌ Ne |

### Rešitev A: Naložiti dokumente v storage ob ustvarjanju otroka (PRIPOROČENO)

Posodobiti `AdminAddChildWizard.tsx` ali hook `useLogopedistChildren.ts`, da po uspešnem ustvarjanju otroka naloži dokumente v storage:

```typescript
// Po uspešnem createChild.mutateAsync(input):
const newChild = await createChild.mutateAsync(input);

// Pot za storage
const basePath = `logopedist-children/${logopedistId}/${newChild.id}/Dokumenti`;

// 1. Naloži opis govornih težav
if (childData.speechDifficultiesDescription) {
  const textBlob = new Blob([childData.speechDifficultiesDescription], { type: 'text/plain' });
  await supabase.storage
    .from('uporabniski-profili')
    .upload(`${basePath}/opis-govornih-tezav-${Date.now()}.txt`, textBlob);
}

// 2. Naloži vprašalnik
if (Object.keys(childData.speechDevelopment).length > 0) {
  const questionnaireText = formatQuestionnaireAsText(childData.speechDevelopment, childData.name);
  const questionnaireBlob = new Blob([questionnaireText], { type: 'text/plain' });
  await supabase.storage
    .from('uporabniski-profili')
    .upload(`${basePath}/${newChild.id}-osnovni-vprasalnik.txt`, questionnaireBlob);
}
```

### Rešitev B: Prikazati podatke iz baze namesto storage (ALTERNATIVA)

Če ne želimo podvajati podatkov v storage, lahko `AdminLogopedistChildDetail.tsx` prikaže podatke direktno iz baze:

```typescript
// Prikaz iz baze namesto storage
{childData?.speech_difficulties_description && (
  <div className="border rounded-lg p-3">
    <span>📄 Opis govornih težav</span>
    <pre className="text-sm whitespace-pre-wrap mt-2">
      {childData.speech_difficulties_description}
    </pre>
  </div>
)}

{childData?.speech_development && (
  <div className="border rounded-lg p-3">
    <span>📄 Osnovni vprašalnik</span>
    <pre className="text-sm whitespace-pre-wrap mt-2">
      {formatQuestionnaireAsText(childData.speech_development)}
    </pre>
  </div>
)}
```

**Priporočam Rešitev A**, ker je bolj konsistentna z obstoječim sistemom in omogoča enoten prikaz dokumentov.

---

## Datoteke za posodobiti

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/admin/ReportTemplateEditor.tsx` | Dodaj prop `hideParentSection` za pogojno skrivanje sekcije starša |
| `src/utils/generateReportPdf.ts` | Posodobi PDF generiranje za pogojno vključitev sekcije starša |
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Uporabi `hideParentSection={true}` |
| `src/components/admin/children/AdminAddChildWizard.tsx` | Dodaj nalaganje dokumentov v storage po ustvarjanju otroka |

---

## Rezultat

### Pred spremembo:
```text
PODATKI O STARŠU / SKRBNIKU
Ime in priimek: Ni podatka
E-poštni naslov: Ni podatka

DOKUMENTI
Ni naloženih dokumentov
```

### Po spremembi:
```text
(Sekcija starša je skrita)

DOKUMENTI
📄 opis-govornih-tezav-1738501234567.txt  [👁️] [⬇️]
📄 aac44986-1077-4c55-9804-2aa9a3682dd2-osnovni-vprasalnik.txt  [👁️] [⬇️]
```
