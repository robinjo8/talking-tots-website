
## Plan: Popravi simulacijo — generiraj PDF + pravilne igre v osebnem načrtu

### Problem

Dva glavna problema v akciji `auto_evaluate_and_report`:

**1. Pozicije glasov so napačne (→ ni iger v načrtu)**

V `report_details.letters` simulacija zapiše pozicije kot `["začetek", "sredina/konec"]` (slovensko), vendar `generate-monthly-plan` pričakuje angleške kode: `"start"`, `"middle-end"`, `"initial-exercises"`. Funkcija `buildGameCombinations` ne najde ujemanja → 0 iger → v načrtu je samo "Vaje za motoriko govoril".

**2. Ni PDF poročila (→ pod "Dokumenti" ni ničesar)**

Simulacija shrani le `.txt` datoteko v `Porocila/`, vendar pravi "Generiraj" gumb v admin portalu generira **PDF** in ga shrani v `Generirana-porocila/`. PDF pod `Generirana-porocila/` je tisto, kar se prikaže pod "Dokumenti" na admin strani in uporabniku.

### Spremembe

**`supabase/functions/simulate-plan-lifecycle/index.ts`** — akcija `auto_evaluate_and_report`:

1. **Popravi pozicije glasov** (vrstica 388):
   ```ts
   // Namesto:
   positions: ["začetek", "sredina/konec"]
   // Uporabi:
   positions: ["start", "middle-end", "initial-exercises"]
   ```
   To je ekvivalent izbire "Začetek", "Sredina/konec" in "Začetne vaje" v admin portalu za glas R.

2. **Generiraj PDF in shrani v `Generirana-porocila/`**: 
   - Ker Edge funkcija nima dostopa do `generateReportPdf` (to je frontend utilita, ki uporablja jsPDF), generiramo minimalen PDF v Deno z uporabo osnove (raw PDF bytes) ali pa shranimo `.txt` datoteko v `Generirana-porocila/` namesto `Porocila/`.
   - Realno: admin portal shranjuje PDF-je v `Generirana-porocila/`, `.txt` osnutke pa v `Porocila/`. Simulacija mora storiti oboje — shraniti `.txt` v `Porocila/` (za shranjena poročila) IN kopijo v `Generirana-porocila/` (za razdelek "Dokumenti").
   - Najenostavnejša rešitev: `.txt` shranimo v **oba folderja** (`Porocila/` in `Generirana-porocila/`), ker admin stran pod "Dokumenti" prikazuje datoteke iz `Generirana-porocila/`.

3. **Posodobi `pdf_url` v `logopedist_reports`** da kaže na pot v `Generirana-porocila/`.

### Obseg
- 1 Edge funkcija posodobljena (~10 vrstic spremenjenih)
- Popravek pozicij bo omogočil, da `generate-monthly-plan` pravilno generira 11 iger za vsak sklop
