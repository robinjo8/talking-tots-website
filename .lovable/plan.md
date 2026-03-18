

# Plan: Popravki dialoga + razdelek "Dodatno preverjanje" na admin strani

## 1. Popravki `AdditionalTestAssignDialog.tsx`

### A) Scroll popravek
ScrollArea ima `max-h-[400px]`, a problem je verjetno da `DialogContent` z `max-h-[85vh] flex flex-col` ne daje dovolj prostora. Popravim z:
- Dodam `overflow-hidden` na DialogContent
- ScrollArea dobi `flex-1 min-h-[200px]` namesto fiksne max-h, da zapolni razpoložljiv prostor

### B) Gumb "Počisti"
- Dodam gumb "Počisti" poleg štetja izbranih besed (vrstica 226-230)
- Klik pokliče `setSelectedWords(new Set())`
- Viden samo ko je `selectedWords.size > 0`

## 2. Razdelek "Dodatno preverjanje" na `AdminUserDetail.tsx`

Trenutno stran `/admin/users/{parentId}/{childId}` prikazuje sekcijo "Preverjanje izgovorjave" (vrstice 870-940) z Accordion po sejah.

Dodam **nov Card** razdelek **"Dodatno preverjanje"** pod obstoječim "Preverjanje izgovorjave", z enakim stilom:
- Ikona + naslov "Dodatno preverjanje"
- Opis: "Dodeljene besede za dodatno preverjanje izgovorjave"
- Naloži vse `additional_test_assignments` za tega otroka (`child_id`)
- Za vsako dodelitev prikaže Accordion vrstico z:
  - Datum dodelitve
  - Število besed
  - Status (dodeljeno / v teku / zaključeno)
  - Ko je zaključeno: posnetki iz `articulation_test_sessions` (preko `additional_assignment_id`) + ocene

### Kako deluje za več dodelitev:
Vsaka dodelitev logopeda (npr. po Seja-1, po Seja-2) ustvari **ločen zapis** v `additional_test_assignments`. Na admin strani se vsaka dodelitev prikaže kot svoja Accordion vrstica (npr. "Dodatno preverjanje #1 — 15.3.2026 (10 besed)", "Dodatno preverjanje #2 — 18.6.2026 (8 besed)"). Obstoječe "Preverjanje izgovorjave" ostane popolnoma nedotaknjeno.

## Spremembe datotek

### `src/components/admin/AdditionalTestAssignDialog.tsx`
- Popravek scrollanja (flex layout fix)
- Gumb "Počisti" za ponastavitev izbire

### `src/pages/admin/AdminUserDetail.tsx`
- Nov Card razdelek "Dodatno preverjanje" pod obstoječim "Preverjanje izgovorjave"
- Query za `additional_test_assignments` + `additional_test_words` za child_id
- Prikaz posnetkov iz povezanih sej (preko `additional_assignment_id`)

