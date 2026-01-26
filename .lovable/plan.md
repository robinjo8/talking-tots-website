

# Načrt: Nova stran "Kdo smo" (/kdo-smo)

## Povzetek
Ustvarjena bo nova stran `/kdo-smo` (KdoSmo.tsx) s predstavitvijo ekipe TomiTalk. Stran bo oblikovana enako kot `/splosni-pogoji` in bo vsebovala 4 profile članov ekipe s krožnimi prostori za slike.

---

## Struktura vsebine

Stran bo vsebovala:
- Glavni naslov "Kdo smo"
- 4 kartice članov ekipe z:
  - Krožnim prostorom za sliko (placeholder za kasnejše dodajanje)
  - Imenom osebe
  - Podrobnim opisom

### Člani ekipe:

| Oseba | Vloga/fokus |
|-------|-------------|
| Špela Kastelic | Logopedinja, 10+ let izkušenj |
| Ema Erzar Vidmar | Logopedinja, šolsko okolje |
| Jasna Kastigar Kujavec | Varstvoslovka, varnost in skladnost |
| Robert Kujavec | Ustanovitelj, IT varnost in razvoj |

---

## Oblikovanje

### Osnovna struktura (enako kot /splosni-pogoji)

| Element | CSS razredi |
|---------|-------------|
| Container | `max-w-4xl mx-auto px-4 py-8 pt-24` |
| Glavni naslov (h1) | `text-3xl font-bold text-dragon-green mb-8` |
| Vsebinski wrapper | `prose prose-slate max-w-none space-y-8` |

### Kartica člana ekipe

| Element | CSS razredi |
|---------|-------------|
| Wrapper kartice | `flex flex-col md:flex-row items-center md:items-start gap-6` |
| Prostor za sliko | `w-40 h-40 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden` |
| Placeholder ikona | `w-full h-full flex items-center justify-center text-gray-400` |
| Ime osebe (h3) | `text-xl font-semibold text-foreground mb-2` |
| Opis | `text-muted-foreground leading-relaxed text-justify` |

---

## Spremembe datotek

| Datoteka | Akcija |
|----------|--------|
| `src/pages/KdoSmo.tsx` | Nova datoteka - stran ekipe |
| `src/config/routes.tsx` | Dodaj lazy import in route za /kdo-smo |

---

## Tehnična implementacija

### KdoSmo.tsx

```typescript
import { FooterSection } from "@/components/home/FooterSection";
import Header from "@/components/Header";
import { User } from "lucide-react";

interface TeamMember {
  name: string;
  description: string;
  imagePlaceholder?: string; // za kasnejše dodajanje slik
}

const teamMembers: TeamMember[] = [
  {
    name: "Špela Kastelic",
    description: "Špela Kastelic je logopedinja, ki se z govorno-jezikovnimi motnjami ukvarja že več kot deset let..."
  },
  // ... ostali člani
];

const KdoSmo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Kdo smo
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Krožni prostor za sliko */}
              <div className="w-40 h-40 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-20 h-20" />
                </div>
              </div>
              
              {/* Ime in opis */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default KdoSmo;
```

### routes.tsx spremembe

```typescript
// Dodaj lazy import
const KdoSmo = lazy(() => import("@/pages/KdoSmo"));

// Dodaj route (med footer pages)
<Route path="/kdo-smo" element={<LazyRoute><KdoSmo /></LazyRoute>} />
```

---

## Priprava za kasnejše dodajanje slik

Krožni prostor za slike bo pripravljen tako, da boste lahko enostavno zamenjali placeholder z dejanskimi slikami:

```typescript
// Ko boste imeli slike, zamenjajte:
<div className="w-full h-full flex items-center justify-center text-gray-400">
  <User className="w-20 h-20" />
</div>

// Z:
<img 
  src="/path/to/image.jpg" 
  alt="Ime osebe" 
  className="w-full h-full object-cover"
/>
```

---

## Končni rezultat

Po implementaciji bo stran `/kdo-smo` vsebovala:
- Naslov "Kdo smo"
- 4 profile članov ekipe s krožnimi prostori za slike
- Podrobne opise za vsako osebo
- Enako oblikovanje kot stran `/splosni-pogoji`
- Odzivno oblikovanje za mobilne naprave

