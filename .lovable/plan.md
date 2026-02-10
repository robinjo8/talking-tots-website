

## Spremembe v `ChildCompletedView.tsx`

Tri sekcije (Osnovni podatki, Govorne tezave, Odgovori na vprasalnik) bodo ovite v `Collapsible` komponente, ki bodo privzeto **zaprte**. Uporabnik jih lahko razpre s klikom na naslov. Gumb na dnu bo preimenovan v "Zakljuci dodajanje otroka" in bo takoj viden brez potrebe po pomikanju.

### Tehnicni detajli

**Datoteka:** `src/components/children/ChildCompletedView.tsx`

- Dodati import za `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` iz `@/components/ui/collapsible` in ikono `ChevronDown` iz `lucide-react`
- Vsako od treh sekcij (Osnovni podatki, Govorne tezave, Odgovori na vprasalnik) oviti v `Collapsible` komponento z `open={false}` privzeto
- Naslov vsake sekcije postane `CollapsibleTrigger` z ikono ChevronDown, ki se zavrti ob odprtju
- Vsebina sekcije gre v `CollapsibleContent`
- Gumb preimenovati iz "Zakljuci registracijo" v "Zakljuci dodajanje otroka" (privzeti `closeButtonText` prop)
- Gumb premakniti takoj pod "Profil uspesno zakljucen" kartico, pred collapsible sekcije, da bo takoj viden

### Vizualna struktura

```text
+----------------------------------+
| [checkmark] Profil uspesno       |
|             zakljucen            |
+----------------------------------+

[ Zakljuci dodajanje otroka ]     <-- gumb takoj viden

> Osnovni podatki          [v]    <-- zaprto, klikni za razpri
> Govorne tezave           [v]    <-- zaprto
> Odgovori na vprasalnik   [v]    <-- zaprto
```

Nobene druge datoteke niso spremenjene. Prop `closeButtonText` ohrani moznost, da klicoce komponente podajo drugo besedilo.

