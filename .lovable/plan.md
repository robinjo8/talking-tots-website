

# Vizualna prenova LetterSelector in MotorikaFrequencySelector

## 1. LetterSelector -- vertikalni prikaz izbranih glasov

Trenutno so izbrani glasovi prikazani v eni vrstici skupaj z besedilom "Priporocamo igre in vaje za". Sprememba:

- Zgoraj: besedilo "Priporocamo igre in vaje za:" kot naslov
- Spodaj: vsak izbrani glas v svoji vrstici s pozicijo (npr. "P - Zacetek", "B - Sredina/konec"), z gumbom za odstranitev in dropdownom za pozicijo
- Pod seznamom: gumb "+ Dodaj glas"
- Na dnu: generirano besedilo (ostane nespremenjeno)

### Datoteka: `src/components/admin/LetterSelector.tsx`

Sprememba renderja (vrstice 90-151):
- Zamenjati `flex items-center gap-2 flex-wrap` z vertikalnim layoutom
- Naslov "Priporocamo igre in vaje za:" kot `span`
- Vsak glas v svoji vrstici: `flex items-center gap-2` z Badge, Select za pozicijo
- Gumb "+ Dodaj glas" pod seznamom

## 2. MotorikaFrequencySelector -- dropdown namesto radio gumbov

Trenutno so opcije prikazane kot RadioGroup. Sprememba na Select (dropdown):

- Zamenjati RadioGroup z enim Select dropdownom
- Opcije: "Vsak dan", "Enkrat na teden", "Enkrat na mesec", "Po meri"
- Ce je izbrano "Po meri", se pod dropdownom pojavi vnosno polje za stevilko + Select za enoto (kot zdaj)
- Generirano besedilo ostane nespremenjeno

### Datoteka: `src/components/admin/MotorikaFrequencySelector.tsx`

Sprememba renderja (vrstice 56-115):
- Zamenjati `RadioGroup` z `Select` komponento
- Value mapping: `daily` -> "Vsak dan", `weekly` -> "Enkrat na teden", `monthly` -> "Enkrat na mesec", `custom` -> "Po meri"
- Ohraniti pogojni prikaz za "Po meri" (stevilka + enota)
- Ohraniti prikaz generiranega besedila

