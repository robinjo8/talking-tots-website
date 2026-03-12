

# Preoblikovanje sekcije "PREDLOG ZA IGRE IN VAJE"

## Trenutno stanje

Tri ločene sekcije z velikimi naslovi (UPPERCASE, bold):
1. **"PREDLOG ZA IGRE IN VAJE:"** — LetterSelector (popover z checkboxi + badge-i + position select per letter) + Textarea
2. **"PRIPOROČAMO VAJE ZA MOTORIKO GOVORIL:"** — MotorikaFrequencySelector (dropdown)
3. **"PRIPOROČAMO OGLED VIDEO NAVODIL:"** — VideoLetterSelector (popover z checkboxi + badge-i)

Vsaka sekcija ima svoj preview tekst (sivi box) znotraj komponente.

## Želeno stanje

Ena sekcija **"PREDLOG ZA IGRE IN VAJE:"** z tremi vrsticami, kjer je label + kontrola na isti vrstici:

```text
PREDLOG ZA IGRE IN VAJE: *

Priporočamo igre in vaje za glas:    [+ Dodaj glas]  (badge-i izbranih + position select)
Vaje za motoriko govoril:            [Izberi pogostost ▾]  (+ custom polja če "Po meri")
Ogled video navodil:                 [+ Dodaj glas]  (badge-i izbranih)

┌─────────────────────────────────────────────────────┐
│ Priporočamo igre in vaje za glas P na začetku...   │
│                                                     │
│ Priporočamo vaje za motoriko govoril vsak dan.     │
│                                                     │
│ Priporočamo ogled video navodil za glas R.          │
└─────────────────────────────────────────────────────┘

[Dodatne opombe textarea]
```

Ključne spremembe:
- Vsi trije labeli imajo **enako pisavo** (text-sm font-medium, ne uppercase bold)
- Kontrole (dropdown/popover) so **desno od labela** na isti vrstici
- Preview teksti se **ne prikazujejo znotraj posamezne komponente** ampak v enem skupnem boxu pod vsemi tremi vrsticami, vsak v svojem odstavku
- Textarea za dodatne opombe ostane pod skupnim preview boxom

## Tehnični plan

### 1. `src/components/admin/LetterSelector.tsx`
- Dodaj prop `hidePreview?: boolean` (privzeto false za nazaj-kompatibilnost)
- Ko `hidePreview = true`, ne prikaži sivi preview box znotraj komponente
- Spremeni layout: label "Priporočamo igre in vaje za glas:" + gumb "+ Dodaj glas" na isti vrstici, badge-i z position selecti pod tem

### 2. `src/components/admin/MotorikaFrequencySelector.tsx`
- Dodaj prop `hidePreview?: boolean`
- Dodaj prop `inline?: boolean` — ko true, prikaži label + dropdown na isti vrstici (flex row)
- Ko `hidePreview = true`, ne prikaži sivi preview box

### 3. `src/components/admin/VideoLetterSelector.tsx`
- Dodaj prop `hidePreview?: boolean`
- Ko `hidePreview = true`, ne prikaži sivi preview box

### 4. `src/components/admin/ReportTemplateEditor.tsx`
- Zamenjaj tri ločene sekcije z eno sekcijo "PREDLOG ZA IGRE IN VAJE:"
- Znotraj: tri vrstice z inline layout (label levo, kontrola desno)
- Pod vsemi tremi: en skupni preview box ki prikaže izbire v ločenih odstavkih
- Pod preview: textarea za dodatne opombe
- Posodobi `generateReportText` da ohranja enak format

### Datoteke za spremembo:
1. `src/components/admin/LetterSelector.tsx`
2. `src/components/admin/MotorikaFrequencySelector.tsx`
3. `src/components/admin/VideoLetterSelector.tsx`
4. `src/components/admin/ReportTemplateEditor.tsx`

