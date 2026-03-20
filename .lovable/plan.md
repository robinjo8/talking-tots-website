

## Problem

Ko naložite shranjeno poročilo (bodisi .txt osnutek ali PDF), se tekstovna polja (anamneza, ugotovitve, opombe) pravilno naložijo, **strukturirani podatki pa ne**:
- Priporočeni glasovi (recommendedLetters)
- Frekvenca motorike (motorikaFrequency)
- Video navodila (recommendedVideoLetters)

### Vzrok

V `AdminUserDetail.tsx` obstajata **dve poti nalaganja**:

1. **`handleEditGeneratedReport`** (klik na PDF) → poišče zapis v bazi in pravilno naloži vse podatke vključno s strukturiranimi polji iz `report_details`
2. **`handleEditReport`** (klik na .txt osnutek, vrstica 635) → razčleni **samo besedilo** iz .txt datoteke z regexom. **Ne naloži** `recommendedLetters`, `motorikaFrequency`, `recommendedVideoLetters`.

Ko uporabnik klikne uredi na .txt osnutku, se kliče pot #2, ki ne obnovi strukturiranih podatkov → pri generiranju PDF validacija javi napako "Izberite vsaj en glas".

### Popravek

**Datoteka: `src/pages/admin/AdminUserDetail.tsx`**

V funkciji `handleEditReport` (vrstica 635) po razčlenjevanju besedila dodati iskanje v bazi `logopedist_reports` po `session_id` ali po datumu, da se naložijo tudi strukturirani podatki (`report_details`):

```typescript
const handleEditReport = async (file: StorageFile) => {
  // ... obstoječe razčlenjevanje teksta ...

  // Poišči pripadajoč zapis v bazi za strukturirane podatke
  const { data: reportsData } = await supabase
    .from('logopedist_reports')
    .select('*')
    .eq('logopedist_id', logopedistProfile?.id)
    // Match by session or by date pattern in filename
    .order('created_at', { ascending: false })
    .limit(5);

  // Find matching report by filename date
  const dateMatch = file.name.match(/(\d{4}-\d{2}-\d{2})/);
  const matchingReport = reportsData?.find(r => {
    if (r.pdf_url && dateMatch) {
      return r.pdf_url.includes(dateMatch[1]);
    }
    return false;
  });

  if (matchingReport) {
    const reportDetails = matchingReport.report_details as any;
    const recLetters = matchingReport.recommended_letters as string[] | null;
    const letters = reportDetails?.letters 
      ? reportDetails.letters 
      : convertLegacyLetters(recLetters || []);
    
    // Posodobi tudi strukturirane podatke
    setReportData(prev => ({
      ...prev,
      recommendedLetters: letters,
      motorikaFrequency: reportDetails?.motorika?.type || prev.motorikaFrequency,
      motorikaCustomCount: reportDetails?.motorika?.count ?? prev.motorikaCustomCount,
      motorikaCustomUnit: reportDetails?.motorika?.unit || prev.motorikaCustomUnit,
      recommendedVideoLetters: reportDetails?.videoLetters || prev.recommendedVideoLetters,
    }));
  }
};
```

**Enaka sprememba v `AdminLogopedistChildDetail.tsx`** — če ima enak vzorec z .txt nalaganjem.

### Obseg
- `src/pages/admin/AdminUserDetail.tsx` — dopolni `handleEditReport` z iskanjem strukturiranih podatkov v bazi
- Preveri `AdminLogopedistChildDetail.tsx` za enak vzorec

