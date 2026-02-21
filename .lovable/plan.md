

## Popravek navigacijskih poti (breadcrumb) za kartice na strani /govorno-jezikovne-vaje

### Problem
Tri kartice na strani `/govorno-jezikovne-vaje` imajo napacne ali manjkajoce navigacijske poti:

| Kartica | Pot | Trenutna navigacija | Pravilna navigacija |
|---|---|---|---|
| Video navodila | `/video-navodila` | Domov > Moje aplikacije > Video navodila | Domov > Moje aplikacije > Govorne vaje > Video navodila |
| Moji prvi glasovi | `/govorno-jezikovne-vaje/artikulacija` | Ni definirano (breadcrumb se ne prikaze ali prikaze napacno) | Domov > Moje aplikacije > Govorne vaje > Moji prvi glasovi |
| Vaje motorike govoril | `/govorno-jezikovne-vaje/vaje-motorike-govoril` | Pravilno (ze ima parent `/govorno-jezikovne-vaje`) | Brez sprememb |

### Spremembe

**Datoteka: `src/components/BreadcrumbNavigation.tsx`**

1. Spremeniti parent pri `/video-navodila` iz `"/moje-aplikacije"` v `"/govorno-jezikovne-vaje"`
2. Dodati nov vnos za `/govorno-jezikovne-vaje/artikulacija` z labelom `"Moji prvi glasovi"` in parentom `"/govorno-jezikovne-vaje"`

Po popravku bodo vse tri kartice imele pravilno pot:
- Domov > Moje aplikacije > Govorne vaje > [ime kartice]

