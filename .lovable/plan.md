

# Preoblikovanje sekcije "PREDLOG ZA IGRE IN VAJE"

## Spremembe

### 1. Layout: vertikalen namesto horizontalen
Vsaka od treh vrstic dobi **label zgoraj, kontrola spodaj** (namesto na isti vrstici):

```text
Priporočamo igre in vaje za glas:
[Izberi glas ▾]   [B × ] [Sredina/konec ▾]

Vaje za motoriko govoril:
[Enkrat na teden ▾]

Ogled video navodil:
[Izberi glas ▾]   [R ×]
```

### 2. "Dodaj glas" → "Izberi glas" kot dropdown
Zamenjaj Popover z checkboxi za **Select dropdown** (enak stil kot motorika). Ob izbiri glasa se ta doda v seznam. Gumb se preimenuje iz "+ Dodaj glas" v "Izberi glas".

- **LetterSelector**: Popover zamenjam s Select dropdownom. Ob izbiri se glas doda (toggle).
- **VideoLetterSelector**: Enaka sprememba — Popover → Select dropdown "Izberi glas".

### 3. Preview tekst: en stavek namesto treh
Namesto treh ločenih stavkov s "Priporočamo..." ustvarim **eno kombinirano besedilo**:

> Priporočamo igre in vaje za glas B na začetku besed, vaje za motoriko govoril enkrat na teden in ogled video navodil za glas R in za glas Z.

Logika:
- Zberem dele brez "Priporočamo" predpone (razen prvega)
- Med deli uporabim vejico, zadnji del pa "in"
- Nova funkcija `formatCombinedRecommendationText()` v ReportTemplateEditor

### Datoteke za spremembo:
1. **`src/components/admin/LetterSelector.tsx`** — Popover → Select dropdown "Izberi glas"
2. **`src/components/admin/VideoLetterSelector.tsx`** — Popover → Select dropdown "Izberi glas"
3. **`src/components/admin/ReportTemplateEditor.tsx`** — vertikalen layout + kombiniran preview stavek
4. **`src/components/admin/MotorikaFrequencySelector.tsx`** — odstrani `inline` prop uporabo (layout se premakne v parent)

