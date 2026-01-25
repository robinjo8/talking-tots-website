

# Načrt: Reorganizacija postavitve nadzorne plošče

## Trenutna postavitev
Trenutno je stran organizirana v ločene vrstice:
1. Pozdravno sporočilo
2. 4 kartice za Organizacijo (v eni vrstici)
3. 4 kartice za Moje delo (v eni vrstici)
4. 2 tortna grafa drug ob drugem
5. Graf težav na dnu

## Nova postavitev (po tvoji skici)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Dobrodošli, Robert Kujavec                                                 │
│  TomiTalk logoped • Preglejte status preverjanj izgovorjave                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 Organizacija (TomiTalk logoped)     │     👤 Moje delo                  │
│  ┌──────────────┬──────────────┐        │     ┌──────────────┬──────────────┐
│  │ VSA          │ V ČAKANJU    │        │     │ MOJI         │ V PREGLEDU   │
│  │ PREVERJANJA  │              │        │     │ PREGLEDI     │              │
│  │ 11           │ 1            │        │     │ 2            │ 1            │
│  └──────────────┴──────────────┘        │     └──────────────┴──────────────┘
│  ┌──────────────┬──────────────┐        │     ┌──────────────┬──────────────┐
│  │ PREGLEDANO   │ ZAKLJUČENO   │        │     │ PREGLEDANO   │ ZAKLJUČENO   │
│  │ 5            │ 0            │        │     │ 1            │ 0            │
│  └──────────────┴──────────────┘        │     └──────────────┴──────────────┘
│                                         │                                    │
│  ┌──────────────────────────────┐       │     ┌──────────────────────────────┐
│  │  Statistika preverjanj      │       │     │  Moji pregledi               │
│  │  izgovorjave                │       │     │                              │
│  │       [TORTNI GRAF]         │       │     │       [TORTNI GRAF]          │
│  └──────────────────────────────┘       │     └──────────────────────────────┘
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  Najpogostejši govorni izzivi (polna širina)                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tehnična implementacija

### Spremembe v `AdminDashboard.tsx`

Stran bo reorganizirana z uporabo CSS grid postavitve:

1. **Glavna dvokolonska mreža** - `grid grid-cols-1 lg:grid-cols-2 gap-6`
   - Levi stolpec: Organizacija
   - Desni stolpec: Moje delo

2. **Vsak stolpec vsebuje:**
   - Naslov sekcije (npr. "📊 Organizacija (TomiTalk logoped)")
   - 4 kartice v 2x2 mreži (`grid grid-cols-2 gap-4`)
   - Tortni graf pod karticami

3. **Graf težav** ostane na dnu s polno širino

### Struktura kode

```tsx
<div className="space-y-6">
  {/* Pozdravno sporočilo */}
  
  {/* Dvokolonska postavitev */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* LEVI STOLPEC - Organizacija */}
    <div className="space-y-4">
      <h2>📊 Organizacija (TomiTalk logoped)</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Vsa preverjanja | V čakanju */}
        {/* Pregledano | Zaključeno */}
      </div>
      <OrganizationPieChart />
    </div>
    
    {/* DESNI STOLPEC - Moje delo */}
    <div className="space-y-4">
      <h2>👤 Moje delo</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Moji pregledi | V pregledu */}
        {/* Pregledano | Zaključeno */}
      </div>
      <StatusPieChart />
    </div>
  </div>
  
  {/* Graf težav - polna širina */}
  <DifficultiesPieChart />
</div>
```

## Odzivnost (responsive)

- Na **velikih zaslonih (lg+)**: Dvokolonska postavitev (levo/desno)
- Na **manjših zaslonih**: Stolpca se zložita eden pod drugega (najprej Organizacija, nato Moje delo)

## Datoteka za spremembo

| Datoteka | Akcija |
|----------|--------|
| `src/pages/admin/AdminDashboard.tsx` | Reorganizacija postavitve |

