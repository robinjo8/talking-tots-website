

## Popravek: Odstranitev testnega nacina za "OS Test" organizacijo

### Problem

V datoteki `src/pages/admin/AdminArtikulacijskiTest.tsx` je bila za organizacijo "OS Test" vkljucena zacasna testna logika, ki:
- Zacne test pri glasu R (indeks 57) namesto pri P (indeks 0)
- Omeji test na samo 3 besede namesto celotnega testa

Ta logika je bila namenjena razvoju in testiranju, zdaj pa organizacija "OS Test" dejansko uporabljajo portal v produkciji. Logopedinja Spela zato vidi test, ki se zacne pri glasu R, kot da so vsi prejsnji glasovi ze opravljeni.

### Resitev

Odstraniti celotno `isTestOrganization` logiko iz `AdminArtikulacijskiTest.tsx`:

1. **Odstrani spremenljivki** `isTestOrganization` in `testMaxWords` (vrstici 137-138)
2. **Poenostavi `effectiveStartIndex`** - vedno zacni pri 0 (ali pri resume indeksu ce gre za nadaljevanje)
3. **Odstrani `testMaxWords`** iz klica `useArticulationTestNew` - test vedno pokriva vse besede

### Spremembe

**`src/pages/admin/AdminArtikulacijskiTest.tsx`**:

- Vrstica 137-138: Odstrani `isTestOrganization` in `testMaxWords`
- Vrstica 142: `effectiveStartIndex` privzeto `0` namesto pogojnega `57`
- Vrstice 149-150: Odstrani `else if (isTestOrganization)` vejo
- Vsi ostali deli, ki referencirajo `isTestOrganization` ali `testMaxWords`, se posodobijo

### Kaj ostane nespremenjeno

- Logika za starostno skupino 3-4 (20 besed, 1 beseda na glas) ostane nespremenjena
- Logika za starostno skupino 5+ (60 besed, 3 besede na glas) ostane nespremenjena
- Uporabniski portal (stran `/artikulacijski-test`) ni prizadet - ta nima `isTestOrganization` logike
- Simulacija na profilu deluje neodvisno od tega popravka

### Rezultat

Po popravku bo logopedinja Spela (in vsi logopedi v OS Test) videla preverjanje izgovorjave, ki se zacne pri glasu P (prva beseda) in pokriva celoten nabor besed glede na starost otroka.
