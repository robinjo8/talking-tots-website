
# Vizualna prenova razdelka "Aktivni clani"

## Sprememba

Preoblikovati razdelek "Aktivni clani" iz karticnega prikaza v tabelarni prikaz (podobno kot zavihek "Uporabniki"), z naslednjimi stolpci:

| Organizacija | Ime in priimek | Email | Registriran | Zadnja prijava | Status |

## Tehnicni koraki

### Sprememba v `AdminMemberships.tsx` -- komponenta `ActiveMembersSection`

1. **Uvoz Table komponent** -- dodati `Table, TableBody, TableCell, TableHead, TableHeader, TableRow` iz `@/components/ui/table`

2. **Iskalno polje** -- razsiriti iskanje na vse parametre (organizacija, ime, email, datum registracije, datum zadnje prijave), ne samo ime in email

3. **Filtri** -- ohraniti obstojecih dropdown za organizacijo in tip pod iskalnim poljem (podobno kot AdminUsers ima filtre pod search poljem)

4. **Tabelarni prikaz (desktop)** -- zamenjati `space-y-2` karticni seznam s `Table` komponento:
   - Glava: Organizacija | Ime in priimek | Email | Registriran | Zadnja prijava | Status
   - Vrstice: podatki za vsakega aktivnega clana
   - Status stolpec: Badge "Aktiven" + opcijski "Interni" badge

5. **Mobilni prikaz** -- ohraniti karticni prikaz za manjse zaslone (hidden md:block za tabelo, block md:hidden za kartice), podobno kot AdminUsers

6. **Vizualni slog** -- prevzeti isti vzorec iz AdminUsers:
   - Card z CardHeader (naslov + badge stevila) in CardContent
   - Search polje z ikono levo
   - Filtri pod search poljem
   - `rounded-md border overflow-x-auto` okrog tabele
