
# Načrt: Predogled dokumentov znotraj strani /profile

## Povzetek

Implementacija funkcionalnosti za predogled dokumentov neposredno na uporabniški strani `/profile`, enako kot deluje na admin portalu pri "Podrobnosti uporabnika". Ob kliku na ikono očesa se dokument razširi navzdol in prikaže vsebino (PDF ali besedilo).

---

## Trenutno stanje

Stran `/profile` ima v razdelku "Moji dokumenti" dve sekciji:
- **Naloženi dokumenti**: Dokumenti, ki jih je uporabnik naložil
- **Poročila**: PDF poročila od logopedov

Trenutno obe sekciji imata gumba za "Ogled" in "Prenesi", vendar oba odpreta dokument v novem zavihku brskalnika.

---

## Rešitev

Uporabiti enak pristop kot na admin portalu (`AdminUserDetail.tsx`):

1. Dodati stanje `expandedDocId` za sledenje odprtemu dokumentu
2. Gumb z ikono očesa spremeni ikono v puščico navzgor ko je dokument odprt
3. Ob kliku se pod vrstico dokumenta prikaže `DocumentPreview` komponenta z animacijo
4. Podprti bodo PDF in TXT dokumenti s celotnim predogledom

---

## Vizualni prikaz

```text
┌─────────────────────────────────────────────────────────────────┐
│  📄 1769171059631_osnovni-vprasalnik.txt              👁️↑  ⬇️  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OSNOVNI VPRAŠALNIK - Žak                                       │
│  Datum: 23. 1. 2026                                             │
│                                                                  │
│  ================================================               │
│                                                                  │
│  Ali druge osebe (izven vaše družine) razumejo kaj vaš         │
│  otrok govori?                                                   │
│  Odgovor: Da                                                     │
│                                                                  │
│  Vaš otrok lahko reče:                                          │
│  Odgovor: Več kot 200 besed                                     │
│                                                                  │
│  ...                                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tehnična implementacija

### 1. Posodobi MyDocumentsSection.tsx

#### Dodaj potrebne importe:
```typescript
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DocumentPreview } from "@/components/admin/DocumentPreview";
```

#### Dodaj stanje za sledenje odprtemu dokumentu:
```typescript
const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
```

#### Dodaj funkcijo za preklop predogleda:
```typescript
const toggleDocumentPreview = useCallback((docPath: string) => {
  setExpandedDocId(prev => prev === docPath ? null : docPath);
}, []);
```

#### Posodobi prikaz dokumentov (Naloženi dokumenti):

Za vsak dokument:
- Preveri ali je `expandedDocId === doc.storage_path`
- Spremeni gumb očesa: prikaže `ChevronUp` če je odprt, sicer `Eye`
- Dodaj `AnimatePresence` z `motion.div` pod vrstico dokumenta
- Znotraj animacije prikaži `DocumentPreview` komponento

```typescript
{group.documents.map(doc => {
  const isExpanded = expandedDocId === doc.storage_path;
  return (
    <div key={doc.id} className="border rounded-lg overflow-hidden">
      {/* Vrstica dokumenta */}
      <div className="flex items-center justify-between p-3 bg-gray-50">
        {/* Ime in metapodatki */}
        <div className="flex gap-1 shrink-0">
          <Button onClick={() => toggleDocumentPreview(doc.storage_path)}>
            {isExpanded ? <ChevronUp /> : <Eye />}
          </Button>
          <Button onClick={() => handleDownload(doc.storage_path)}>
            <Download />
          </Button>
          <Button onClick={() => handleDelete(...)}>
            <Trash2 />
          </Button>
        </div>
      </div>
      
      {/* Razširljiv predogled */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t bg-background">
              <DocumentPreview 
                fileName={doc.original_filename}
                getSignedUrl={() => getDocumentUrl(doc.storage_path)}
                onDownload={() => handleDownload(doc.storage_path)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})}
```

#### Posodobi prikaz poročil (Poročila):

Enaka logika za poročila:
```typescript
{reports.map((report, idx) => {
  const isExpanded = expandedDocId === report.path;
  return (
    <div key={idx} className="border rounded-lg overflow-hidden">
      {/* Vrstica poročila */}
      <div className="flex items-center justify-between p-3 bg-gray-50">
        {/* Ime in metapodatki */}
        <div className="flex gap-1 shrink-0">
          <Button onClick={() => toggleDocumentPreview(report.path)}>
            {isExpanded ? <ChevronUp /> : <Eye />}
          </Button>
          <Button onClick={() => handleDownloadReport(report.path)}>
            <Download />
          </Button>
        </div>
      </div>
      
      {/* Razširljiv predogled */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div ...>
            <DocumentPreview 
              fileName={report.name}
              getSignedUrl={async () => {
                const { data } = await supabase.storage
                  .from('uporabniski-profili')
                  .createSignedUrl(report.path, 3600);
                return data?.signedUrl || null;
              }}
              onDownload={() => handleDownloadReport(report.path)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})}
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/components/profile/MyDocumentsSection.tsx` | Posodobi | Dodaj razširljiv predogled dokumentov |

---

## Komponenta DocumentPreview

Obstoječa komponenta `DocumentPreview` že podpira:
- **PDF datoteke**: Celoten PDF pregledovalnik z navigacijo po straneh in povečavo
- **TXT datoteke**: Prikaz besedila v monospace pisavi
- **DOCX datoteke**: Obvestilo, da predogled ni mogoč, z gumbom za prenos
- Vsa besedila so že pravilno napisana s šumniki (npr. "Nalaganje predogleda...", "Prenesi dokument")

---

## Končni rezultat

Po implementaciji bo uporabnik lahko:
1. Klikne na ikono očesa pri kateremkoli dokumentu
2. Vidi vsebino dokumenta neposredno na strani (brez odpiranja novega zavihka)
3. Za PDF: uporabi kontrole za navigacijo med stranmi in povečavo
4. Za TXT: vidi formatirano besedilo z vprašanji in odgovori
5. Klikne ponovno za zaprtje predogleda ali odpre drug dokument

