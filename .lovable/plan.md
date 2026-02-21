

## Spremembe v headerju in navigaciji

### Pregled sprememb

1. **Odstrani gumb CENIK** iz desktop in mobile navigacije
2. **Preimenuj "Moje aplikacije" v "Govor"** povsod (header, breadcrumbs, mobile menu, footer, NavigationLinks, KakoDeluje stran)
3. **Dodaj nov gumb "JEZIK"** -- odpre novo prazno stran `/jezik`
4. **Dodaj nov gumb "POSLUŠANJE"** -- odpre novo prazno stran `/poslusanje`
5. **Vrstni red v headerju**: LOGOPEDSKI NASVETI, POSLUŠANJE, GOVOR, JEZIK, MOJA STRAN

### Datoteke, ki se spremenijo

**1. `src/components/header/DesktopNavigation.tsx`**
- Odstrani gumb "Cenik" iz navigacije
- Preimenuj "Moje aplikacije" v "Govor"
- Dodaj gumba "Poslušanje" in "Jezik" (oba zaščitena s subscription check)
- Vrstni red: Logopedski nasveti, Poslušanje, Govor, Jezik, Moja stran
- Odstrani `onCenikNavigate` prop

**2. `src/components/header/MobileMenu.tsx`**
- Odstrani gumb "Cenik" iz navigacije (vrstica 228-232)
- Preimenuj "Moje aplikacije" v "Govor" (vrstica 198)
- Dodaj gumba "Poslušanje" in "Jezik" v navigacijski del
- Vrstni red: Logopedski nasveti, Poslušanje, Govor, Jezik, Moja stran
- Odstrani `onCenikNavigate` prop

**3. `src/components/Header.tsx`**
- Odstrani `handleCenikNavigate` funkcijo in `onCenikNavigate` prop iz DesktopNavigation in MobileMenu

**4. `src/components/header/NavigationLinks.tsx`**
- Preimenuj "Moje aplikacije" v "Govor"
- Dodaj "Poslušanje" in "Jezik" vnosa
- Posodobi vrstni red

**5. `src/components/BreadcrumbNavigation.tsx`**
- Spremeni label za `/moje-aplikacije` iz "Moje aplikacije" v "Govor"
- Dodaj breadcrumb vnosa za `/jezik` in `/poslusanje`

**6. `src/config/routes.tsx`**
- Dodaj novi poti `/jezik` in `/poslusanje` (zaščiteni)

**7. Nova datoteka: `src/pages/Jezik.tsx`**
- Prazna stran z naslovom "Jezik"

**8. Nova datoteka: `src/pages/Poslusanje.tsx`**
- Prazna stran z naslovom "Poslušanje"

**9. `src/components/home/FooterSection.tsx`**
- Preimenuj "MOJE APLIKACIJE" v "GOVOR" v footerju

**10. `src/pages/KakoDeluje.tsx`**
- Posodobi omembe "Moje aplikacije" v "Govor"

### Podrobnosti

- Gumba "Jezik" in "Poslušanje" sta vidna samo prijavljenim uporabnikom (enako kot "Govor" in "Moja stran")
- Obe novi strani sta zaščiteni s `ProtectedLazyRoute` in subscription check
- Poti ostanejo nespremenjene (`/moje-aplikacije` se ne preimenuje -- samo prikaz v UI)
- Cenik stran (`/cenik`) ostane dostopna preko URL-ja, samo gumb v headerju se odstrani

