

# Načrt: Poenostavitev statusov poročil

## Pregled sprememb

### Nova logika statusov

| Status | Slovensko ime | Pomen |
|--------|---------------|-------|
| `submitted` | **Oddano** | Končno, aktivno poročilo, ki je vidno staršem |
| `revised` | **Popravljena** | Prejšnja verzija poročila, ki je bila nadomeščena z novo |

> Status `draft` (Osnutek) se odstrani iz uporabe - vsa generirana poročila bodo takoj označena kot "Oddano".

---

## Diagram toka dela

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  SCENARIJ 1: Novo poročilo                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Logoped napiše poročilo                                             │
│  2. Klikne "Generiraj"                                                  │
│  3. Ustvari se PDF + zapis v bazi s status = 'submitted' (Oddano)       │
│  4. Poročilo je takoj vidno staršem                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  SCENARIJ 2: Popravljanje obstoječega poročila                          │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Logoped klikne "Popravi" na obstoječem poročilu (Oddano)            │
│  2. Podatki se naložijo v urejevalnik                                   │
│  3. Logoped naredi popravke                                             │
│  4. Klikne "Generiraj"                                                  │
│  5. STARO poročilo dobi status = 'revised' (Popravljena)                │
│  6. NOVO poročilo dobi status = 'submitted' (Oddano)                    │
│  7. Starš vidi le novo poročilo                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tehnične spremembe

### 1. AdminUserDetail.tsx - handleGeneratePdf

**Trenutna koda (vrstica 393):**
```typescript
status: editingReportName ? 'revised' as const : 'draft' as const,
```

**Nova koda:**
```typescript
// Če popravljamo obstoječe poročilo, najprej posodobimo staro na 'revised'
if (editingReportName) {
  const { error: updateError } = await supabase
    .from('logopedist_reports')
    .update({ status: 'revised' })
    .ilike('pdf_url', `%${editingReportName.replace('.pdf', '')}%`);
  
  if (updateError) {
    console.error('Error updating old report status:', updateError);
  }
}

// Novo poročilo vedno dobi status 'submitted'
const { error: insertError } = await supabase
  .from('logopedist_reports')
  .insert({
    // ... ostala polja ...
    status: 'submitted' as const,
  });
```

### 2. AdminReports.tsx - Posodobitev oznak statusov

**Sprememba v reportStatusOptions (vrstice 43-48):**
```typescript
const reportStatusOptions = [
  { value: 'all', label: 'Vsi statusi' },
  { value: 'submitted', label: 'Oddano' },
  { value: 'revised', label: 'Popravljena' },
];
```

**Sprememba v getStatusBadge (vrstice 154-165):**
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'revised':
      return <Badge variant="outline" className="text-orange-600 border-orange-300">Popravljena</Badge>;
    case 'submitted':
      return <Badge className="bg-green-600">Oddano</Badge>;
    default:
      // Za morebitne stare 'draft' zapise prikaži kot "Oddano"
      return <Badge className="bg-green-600">Oddano</Badge>;
  }
};
```

### 3. Migracija obstoječih podatkov (opcijsko)

SQL za pretvorbo obstoječih `draft` zapisov v `submitted`:
```sql
UPDATE public.logopedist_reports 
SET status = 'submitted' 
WHERE status = 'draft';
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/pages/admin/AdminUserDetail.tsx` | Posodobi | 1) Pred vstavljanjem novega poročila posodobi staro na 'revised', 2) Nova poročila vedno dobijo status 'submitted' |
| `src/pages/admin/AdminReports.tsx` | Posodobi | 1) Odstrani 'draft' iz filtrov, 2) Spremeni oznako iz "Revidirano" v "Popravljena", 3) Posodobi barve značk |
| Nova SQL migracija | Ustvari | Pretvori obstoječe 'draft' zapise v 'submitted' |

---

## Vizualni prikaz sprememb

### Značke statusov (pred/po)

**PREJ:**
- Osnutek: siva značka
- Revidirano: obroba
- Oddano: primarna barva

**POTEM:**
- Popravljena: oranžna obroba (za stare verzije)
- Oddano: zelena značka (za aktivna poročila)

---

## Pričakovani rezultat

Po implementaciji:
1. Vsako generirano poročilo (novo ali popravljeno) bo takoj označeno kot "Oddano"
2. Ko logoped popravi poročilo, se stara verzija označi kot "Popravljena"
3. Starši vidijo le poročila s statusom "Oddano" (aktivna poročila)
4. Logopedi lahko v arhivu vidijo tudi "Popravljena" poročila za zgodovino

