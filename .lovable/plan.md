

# Plan: Vizualna prenova kartic na /moji-izzivi

## Povzetek

Trenutno so aktivnosti prikazane kot seznam z majhnimi ikonami in gumbi "Igraj". Prenova jih bo spremenila v vizualno privlacne kartice z velikimi slikami iger, po vzoru referencne slike, ki jih otrok klikne za vstop v igro.

---

## Spremembe v PlanDayCard.tsx

### Odprava seznamskega prikaza

Namesto vertikalnega seznama z malimi ikonami in gumbi "Igraj" se aktivnosti prikazejo kot **horizontalna mreza kartic** (grid ali flex-wrap):

```text
Trenutno (seznam):
  [ikona 10px] Kolo besed - S   [Igraj]
  [ikona 10px] Bingo - Z        [Igraj]
  ...

Novo (kartice v mrezi):
  +------------+  +------------+  +------------+  +------------+  +------------+
  |            |  |            |  |            |  |            |  |            |
  |  [velika   |  |  [velika   |  |  [velika   |  |  [velika   |  |  [velika   |
  |   slika]   |  |   slika]   |  |   slika]   |  |   slika]   |  |   slika]   |
  |            |  |            |  |            |  |            |  |            |
  | Vaje za    |  | Kolo besed |  | Labirint S |  | Sestav. Z  |  | Zaporedja  |
  | motoriko   |  |     S      |  |            |  |            |  |     S      |
  +------------+  +------------+  +------------+  +------------+  +------------+
```

### Lastnosti posamezne kartice

- **Velika slika igre** (iz GameImageMap ali otrokov avatar za motoriko) - zapolni vecino kartice
- **Napis pod sliko** z imenom igre in crko (npr. "Kolo besed S", "Labirint Z")
- **Celotna kartica je klikabilna** - otrok klikne na sliko/kartico za vstop v igro (brez locenaga gumba "Igraj")
- **Zaobljeni robovi** (rounded-xl) z rahlim sencem
- **Onemogocen klik** za ne-danasnje dni (kartica je siva, neklikabilna)

### Stanja kartice

1. **Nedokoncana (aktivna)**: normalen prikaz, klikabilna, rahla senca
2. **Dokoncana (completed)**: svetlo zeleno ozadje (bg-green-100), obroba zelena, rahlo prosojno prekritje s kljukico - kartica je onemogocena (ne mores igrati znova)
3. **Prihodnji/pretekli dan**: siva, onemogocena, neklikabilna

### Glava dnevne kartice

Ohraniti obstojecko strukturo:
- Oznaka "Danes" (ce je danes)
- "PONEDELJEK, 9.2.2026" format
- 10 zvezdic (DayStarDisplay) desno
- ChevronDown za zlaganje

### Vsebina dnevne kartice (ko je odprta)

Namesto `divide-y divide-border` seznama:
- CSS grid: `grid grid-cols-5 gap-3` na desktopu, `grid grid-cols-3 gap-2` na tablici, `grid grid-cols-2 gap-2` na telefonu
- Vsaka celica je samostojna kartica z sliko in napisom

---

## Struktura posamezne aktivnostne kartice

```text
<button onClick={() => onActivityPlay(index, path)} disabled={!isToday || isCompleted}>
  <div class="relative rounded-xl border-2 overflow-hidden shadow-sm 
              hover:shadow-md transition-all cursor-pointer
              {isCompleted ? 'border-green-400 bg-green-50' : 'border-border'}
              {!isToday ? 'opacity-50 pointer-events-none' : ''}">
    
    <!-- Slika igre -->
    <div class="aspect-square bg-muted p-2">
      <img src={gameImage} class="w-full h-full object-contain rounded-lg" />
    </div>
    
    <!-- Ce dokoncano: zeleni overlay s kljukico -->
    {isCompleted && (
      <div class="absolute inset-0 bg-green-200/40 flex items-center justify-center">
        <Check class="h-10 w-10 text-green-600" />
      </div>
    )}
    
    <!-- Napis pod sliko -->
    <div class="px-1 py-1.5 text-center">
      <p class="text-xs font-semibold truncate">Kolo besed S</p>
    </div>
  </div>
</button>
```

### Motorika kartica

- Namesto genericne slike motorike uporabi **otrokov avatar** (childAvatarUrl iz selectedChild)
- Napis: "Vaje za motoriko govoril"

---

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/plan/PlanDayCard.tsx` | Zamenjava seznamskega prikaza z mrezo klikabilnih kartic. Odstranitev gumba "Igraj", celotna kartica postane klikabilna. Zeleno ozadje za dokoncane aktivnosti. |

Nobena druga datoteka se ne spreminja - MojiIzzivi.tsx, GameImageMap.ts, DayStarDisplay.tsx, usePlanProgress.ts ostanejo enake.

---

## Tehnicne podrobnosti

- Responsive grid: `grid-cols-5` na desktopu (5 kartic v vrsti za 5 aktivnosti), `grid-cols-3` na tablici, `grid-cols-2` na telefonu z zadnjo kartico cez polno sirino
- Slike iger iz GameImageMap se prikazejo v `aspect-square` z `object-contain` za ohranjanje razmerij
- Klik na kartico poklice obstojecko `onActivityPlay(activityIndex, path)` funkcijo
- Za dokoncane kartice: `pointer-events-none` + zeleno prekritje + kljukica ikona
- Za ne-danasnje dni: `opacity-50 pointer-events-none` na celotni kartici
- Napis pod sliko prikazuje `activity.title` + crko (ce ni ze v naslovu)

