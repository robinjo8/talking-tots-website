

# Sekcija "Kdo smo" na prvi strani

## Kaj se naredi

Nova komponenta `TeamSection.tsx` s 4 clani ekipe v 2x2 mrezi (na mobilnih 1 stolpec). Vsak clan ima okroglo sliko (placeholder ikona), ime in kratek opis.

### Opisi clanov

- **Spela Kastelic**: "je logopedinja z vec kot desetletnimi izkusnjami, ki dela z otroki z govorno-jezikovnimi motnjami in je clanica komisije za usmerjanje otrok s posebnimi potrebami."
- **Ema Erzar Vidmar**: "Ema Erzar Vidmar je logopedinja z vec kot desetletnimi izkusnjami v solskem okolju, kjer s sodobnimi pristopi in lastnimi didakticnimi materiali podpira razvoj govorno-jezikovnih sposobnosti otrok."
- **Jasna Kastigar Kujavec**: "Jasna je magistra varstvoslovja, specializirana za informacijsko in kibernetsko varnost, ki v projektu TomiTalk skrbi za varnostni in zakonodajni vidik razvoja ter skladnost z veljavnimi predpisi."
- **Robert Kujavec**: "Robert Kujavec je pobudnik projekta TomiTalk z jasno vizijo omogociti otrokom hiter in ucinkovit dostop do podpore pri govorno-jezikovnih tezavah."

### Razsiritev opisov

Gumb "Prikazi vec" razshiri prikaz in pokaze celoten opis iz strani /kdo-smo za vsakega clana. Gumb "Prikazi manj" ga skrije nazaj.

## Tehnicne spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/home/TeamSection.tsx` | **Nova datoteka** -- 2x2 mreza clanov s kratkimi opisi in moznostjo razsiritve |
| `src/pages/Index.tsx` | Dodamo `<TeamSection />` med `<FeaturesCardsSection />` in `<FAQSection />` |

### Postavitev
- Naslov: "Kdo smo"
- Mreza: `grid grid-cols-1 md:grid-cols-2 gap-8`
- Vsak clan: okrogla slika (User ikona), ime, kratek opis
- Spodaj: gumb za prikaz celotnih opisov (iz KdoSmo strani)

