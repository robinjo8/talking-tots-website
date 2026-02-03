

# Načrt: Dodaj "Moji otroci" v mobilno navigacijo admin portala

## Problem

Sekcija **"Terapevtsko delo"** z zavihkom **"Moji otroci"** je prisotna v desktop navigaciji (`AdminSidebar.tsx`), vendar manjka v mobilni navigaciji (`AdminMobileNav.tsx`).

To pomeni, da logopedi (npr. robert.kujavec@outlook.com iz organizacije OŠ Test) na mobilnih napravah ne morejo dostopati do modula za upravljanje svojih otrok.

## Primerjava

| Sekcija | Desktop (AdminSidebar) | Mobilno (AdminMobileNav) |
|---------|------------------------|--------------------------|
| Delovni prostor | ✅ | ✅ |
| **Terapevtsko delo** | ✅ | ❌ MANJKA |
| Upravljanje | ✅ (samo internal) | ✅ (samo internal) |
| Nastavitve | ✅ | ✅ |

## Rešitev

Dodaj sekcijo **"Terapevtsko delo"** v `AdminMobileNav.tsx` z:
- Zavihek "Moji otroci" s povezavo na `/admin/children`
- Prikaz licence (število otrok) - enako kot na desktopu
- Ikona ključavnice, če licenca ni aktivna

## Tehnične spremembe

### Datoteka: `src/components/admin/AdminMobileNav.tsx`

1. Uvozi manjkajoče komponente:
   - `Baby` ikono iz lucide-react
   - `Lock` ikono iz lucide-react
   - `useLogopedistLicense` hook

2. Dodaj `LicenseBadge` komponento (kopija iz AdminSidebar)

3. Dodaj `therapyNavigation` array:
```typescript
const therapyNavigation: NavItem[] = [
  { 
    name: 'Moji otroci', 
    href: '/admin/children', 
    icon: Baby,
  },
];
```

4. Dodaj sekcijo "Terapevtsko delo" v JSX (med "Delovni prostor" in "Upravljanje"):
```tsx
<li>
  <div className="text-xs font-semibold ...">
    Terapevtsko delo
  </div>
  <ul>
    {therapyNavigation.map((item) => (
      <li key={item.name}>
        <SheetClose asChild>
          <Link to={item.href}>
            <item.icon />
            {item.name}
            {/* Prikaz licence ali ključavnice */}
          </Link>
        </SheetClose>
      </li>
    ))}
  </ul>
</li>
```

## Seznam datotek

| Datoteka | Akcija |
|----------|--------|
| `src/components/admin/AdminMobileNav.tsx` | Posodobi - dodaj sekcijo Terapevtsko delo |

## Rezultat

Po popravku bo mobilna navigacija vsebovala:

1. **Delovni prostor** - Moj portal, Vsa preverjanja, V čakanju, Moji pregledi
2. **Terapevtsko delo** - Moji otroci (z licenco X/Y)
3. **Upravljanje** - samo za interno organizacijo
4. **Nastavitve** - Nastavitve, Obvestila, (Članstva za super admina)

Vsi logopedi, ne glede na organizacijo, bodo na mobilnih napravah videli zavihek "Moji otroci".

