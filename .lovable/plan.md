

# Stran "Informacije" -Hub stran z ikonskimi karticami

## Koncept
Nova stran `/informacije` po vzoru Postojnske jame - centralna informacijska tocka z vizualnimi karticami (ikona + naslov), ki vodijo na podstrani. Dostopna preko ikone "i" v headerju (tako kot pri Postojnski jami).

## Predlagane kartice (8 kartic, mrezha 2x4 na mobilnem, 4x2 na desktopu)

```text
+-------------------+-------------------+-------------------+-------------------+
|                   |                   |                   |                   |
|    [BookOpen]     |    [Users]        |    [Mail]         |    [Gamepad2]     |
|                   |                   |                   |                   |
|  KAKO DELUJE      |   KDO SMO        |   KONTAKT         | KAKO DELUJEJO     |
|  TOMITALK         |                   |                   |   IGRE            |
+-------------------+-------------------+-------------------+-------------------+
|                   |                   |                   |                   |
|    [User]         |    [Building2]    |    [CreditCard]   |    [HelpCircle]   |
|                   |                   |                   |                   |
|  ZA STARSE        | ZA ORGANIZACIJE   |   CENIK           | POMOC IN          |
|                   |                   |                   |   PODPORA         |
+-------------------+-------------------+-------------------+-------------------+
```

### Podrobnosti kartic:

1. **KAKO DELUJE TOMITALK** (ikona: BookOpen, barva: dragon-green)
   - Povezava: `/kako-deluje` (ze obstaja - obsezna stran z navodili)
   - Opis: Navodila za uporabo aplikacije

2. **KDO SMO** (ikona: Users, barva: app-blue)
   - Povezava: `/kdo-smo` (ze obstaja - predstavitev ekipe)
   - Opis: Spoznajte ekipo za TomiTalk

3. **KONTAKT** (ikona: Mail, barva: app-teal)
   - Povezava: `/kontakt` (ze obstaja)
   - Opis: Pisite nam

4. **KAKO DELUJEJO IGRE** (ikona: Gamepad2, barva: app-orange)
   - Povezava: `/delovanje-testa` (ze obstaja - trenutno prazen placeholder, potrebna vsebina)
   - Opis: Razlaga posameznih iger in vaj

5. **ZA STARSE** (ikona: User, barva: app-purple)
   - Povezava: `/za-posameznike` (ze obstaja - trenutno prazen placeholder, potrebna vsebina)
   - Preimenuje se v "Za starse" ker je to bolj smiselno za TomiTalk

6. **ZA ORGANIZACIJE** (ikona: Building2, barva: app-blue)
   - Povezava: `/za-podjetja` (ze obstaja - trenutno prazen placeholder, potrebna vsebina)
   - Preimenuje se v "Za organizacije"

7. **CENIK** (ikona: CreditCard, barva: dragon-green)
   - Povezava: `/cenik` (ze obstaja - delujoce)

8. **POMOC IN PODPORA** (ikona: HelpCircle, barva: app-yellow)
   - Povezava: `/pomoc-in-podpora` (ze obstaja - placeholder)

## Vizualni stil
- Belo ozadje, naslov "Informacije" na vrhu s podnaslovom
- Kartice: brez obrobe, samo ikona (velika, ~64px, barvna z gradientom) + naslov pod njo (bold, uppercase)
- Hover efekt: rahla povecava (scale-105) + senca
- Mrezha: 2 stolpca mobilno, 4 stolpci desktop
- Ikone so v slogu "line art" (Lucide ikone), barvne

## Spremembe po datotekah

### 1. Nova datoteka: `src/pages/Informacije.tsx`
- Header + FooterSection
- Naslov "Informacije" + podnaslov
- Grid z 8 karticami, vsaka je klikljiva in vodi na ustrezno podstran
- Vsaka kartica: ikona (Lucide), naslov

### 2. `src/config/routes.tsx`
- Dodaj import za Informacije stran
- Dodaj Route: `<Route path="/informacije" element={<LazyRoute><Informacije /></LazyRoute>} />`

### 3. `src/components/header/DesktopNavigation.tsx`
- Dodaj ikono "i" (Info) desno zgoraj (pred UserProfile/login gumbi)
- Klik na "i" navigira na `/informacije`
- Stil: okrogel gumb z obrobo, ikona Info iz lucide-react

### 4. `src/components/header/MobileMenu.tsx`
- Dodaj "Informacije" povezavo v mobilni meni

## Kaj NE potrebuje novih podstrani
Vse kartice vodijo na ze obstojece strani. Nekatere (Za posameznike, Za podjetja, Pomoc in podpora, Delovanje testa) so trenutno prazni placeholderji - vsebino se lahko doda pozneje loceno.

## Stanje obstojecih strani
- `/kako-deluje` - POLNA VSEBINA (844 vrstic navodil)
- `/kdo-smo` - POLNA VSEBINA (4 clani ekipe)
- `/kontakt` - POLNA VSEBINA (email + naslov)
- `/cenik` - POLNA VSEBINA (pricing section)
- `/za-posameznike` - PLACEHOLDER (prazna)
- `/za-podjetja` - PLACEHOLDER (prazna)
- `/pomoc-in-podpora` - PLACEHOLDER (prazna)
- `/delovanje-testa` - PLACEHOLDER (prazna)

