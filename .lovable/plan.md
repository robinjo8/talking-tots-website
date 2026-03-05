

# Plan: Preoblikovanje /info-moja-stran po vzoru /kako-deluje

## Spremembe v `src/pages/InfoMojaStran.tsx`

### Oblikovanje (po vzoru KakoDeluje)
- Odstraniti `text-center` iz `h1`
- Zamenjati `prose dark:prose-invert` z `prose prose-slate max-w-none space-y-8 text-justify`
- Vsako sekcijo zaviti v `<section>`
- `h2`: `text-2xl font-semibold text-foreground mb-4` (namesto `text-dragon-green`)
- `h4`: `text-lg font-medium text-foreground mb-2 mt-6`
- Odstavki: dodati `text-muted-foreground leading-relaxed`
- Seznami: `list-disc list-inside text-muted-foreground space-y-2 mt-4`
- Dodati številke pred naslove (1., 2., 3. ...)

### Brisanje vsebine
1. Vrstica 104: `Stolpci so obarvani v različne barve...` — izbrisati
2. Vrstica 120: `Dialog vsebuje čestitke z imenom otroka...` — izbrisati
3. Vrstice 165-171: Celotna sekcija "Nasvet zmajčka Tomija" — izbrisati
4. Vrstice 173-179: Celotna sekcija "Navigacija" — izbrisati
5. Vrstice 181-193: Celotna sekcija "Tehnični podatki za starše" — izbrisati

### Sprememba vsebine
- Vrstica 116: zamenjati "se samodejno odpre praznovanje" → "se samodejno odpre obvestilo, kjer se prikaže poseben dialog s sliko zmajčka Tomija s pokalom"
- Sekcija "Kje otrok dobi zvezdice" (vrstice 130-163): zamenjati celotno vsebino s poenostavljenim besedilom: "Otrok zvezdice zbira na različne načine, in sicer skozi igre in vaje. Govorne igre prinesejo 1 zvezdico za vsako opravljeno igro. Pri vajah za motoriko govora pa otrok po uspešno opravljenih vajah prejme 2 zvezdici."

### Tudi odstraniti iz vrstice 29-32
Odstavek ki omenja "Nasvet zmajčka Tomija" in "drobtinice" — izbrisati.

