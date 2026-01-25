
# Načrt: Prenova strani Video navodila in podstrani

## Povzetek

Prenova dizajna strani `/video-navodila` in `/video-navodila/:letter` z naslednjimi spremembami:
1. Postavitev navigacijske poti enako kot na `/logopedski-koticek`
2. Odstranitev zelenega polja "HEJ, ŽAK!"
3. Prilagoditev kartic zmajčkov
4. Modern dizajn glave na podstraneh z videom

---

## Primerjava postavitve

### Trenutno stanje `/video-navodila`:
```text
┌────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    Video navodila                               │
│                    ═══════════════                              │
│                                                                  │
│          Domov > Moje aplikacije > Video navodila               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  HEJ, ŽAK! IZBERI ČRKO IN POGLEJ SI VIDEO NAVODILA...  │   │
│  │  Z VAJAMI POSTAJAMO VEDNO BOLJŠI!                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│    │  Zmajček │  │  Zmajček │  │  Zmajček │                     │
│    │    C     │  │    Č     │  │    K     │                     │
│    └──────────┘  └──────────┘  └──────────┘                     │
└────────────────────────────────────────────────────────────────┘
```

### Želeno stanje (enako kot `/logopedski-koticek`):
```text
┌────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    Video navodila                               │
│                    ═══════════════                              │
│                                                                  │
│          Domov > Moje aplikacije > Video navodila               │
│                                                                  │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│    │  Zmajček │  │  Zmajček │  │  Zmajček │                     │
│    │    C     │  │    Č     │  │    K     │                     │
│    │ Opis... │  │ Opis... │  │ Opis... │                     │
│    └──────────┘  └──────────┘  └──────────┘                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 1. Spremembe v `VideoNavodila.tsx`

### 1.1 Odstranitev zelenega polja
Odstrani celoten blok `Card` z "HEJ, ŽAK!" (vrstice 139-159).

### 1.2 Ohranitev iste strukture kot LogopedskiKoticek
Struktura ostane enaka:
- Naslov na sredini z rumeno črto
- Breadcrumb pod naslovom
- Kartice v mreži

### 1.3 Odstranitev neuporabljenih importov
- Odstrani `Card, CardContent, CardHeader, CardTitle`
- Odstrani `MessageSquare`
- Odstrani `useAuth` (ker ne potrebujemo več `childName`)

---

## 2. Prenova podstrani `/video-navodila/:letter`

### Trenutni dizajn:
```text
┌────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
├────────────────────────────────────────────────────────────────┤
│  ←  │           Video navodila - C            │      │        │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      VIDEO PLAYER                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Nov moderni dizajn:
```text
┌────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Domov > Moje aplikacije > Video navodila > C                 │
│                                                                  │
│                      Črka C                                     │
│              Poglej video navodila za                          │
│          pravilno izgovorjavo črke C                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      VIDEO PLAYER                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Značilnosti novega dizajna:
- Odstranitev starega `PageHeader` z ←
- Dodajanje breadcrumb navigacije na vrhu
- Velik naslov črke na sredini
- Podnaslov z opisom
- Čist, minimalističen izgled

---

## 3. Posodobitev BreadcrumbNavigation

### 3.1 Posodobitev konfiguracije za nove URL-je
Ker so URL-ji sedaj brez "crka-" predpone, je treba posodobiti:

```typescript
// Staro (ne deluje več):
{ path: "/video-navodila/crka-c", label: "Črka C", parent: "/video-navodila" },

// Novo (pravilni URL-ji):
{ path: "/video-navodila/c", label: "C", parent: "/video-navodila" },
{ path: "/video-navodila/ch", label: "Č", parent: "/video-navodila" },
// ... itd.
```

### 3.2 Odstranitev iz excludedPaths
Odstrani `/video-navodila/crka-` iz seznama izključenih poti, da se breadcrumb prikaže na video straneh.

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/pages/VideoNavodila.tsx` | Posodobi | Odstrani zeleno polje, očisti importe |
| `src/components/games/GenericVideoNavodila.tsx` | Posodobi | Nov moderni dizajn z breadcrumb in naslovom |
| `src/components/BreadcrumbNavigation.tsx` | Posodobi | Posodobi konfiguracijo za nove URL-je |

---

## Tehnične podrobnosti

### `src/pages/VideoNavodila.tsx`
- Odstrani vrstice 139-159 (zeleno polje)
- Odstrani neuporabljene importe: `Card, CardContent, CardHeader, CardTitle, MessageSquare, useAuth`
- Ohrani strukturo: naslov → breadcrumb → kartice

### `src/components/games/GenericVideoNavodila.tsx`
- Zamenjaj `PageHeader` z novim dizajnom:
  - Breadcrumb navigacija
  - Naslov črke (npr. "Črka C")
  - Opis pod naslovom
- Prenesi podatke o črki iz `videoNavodilaConfig` za prikaz

### `src/components/BreadcrumbNavigation.tsx`
- Posodobi poti za video navodila:
  ```typescript
  { path: "/video-navodila/c", label: "C", parent: "/video-navodila" },
  { path: "/video-navodila/ch", label: "Č", parent: "/video-navodila" },
  { path: "/video-navodila/k", label: "K", parent: "/video-navodila" },
  { path: "/video-navodila/l", label: "L", parent: "/video-navodila" },
  { path: "/video-navodila/r", label: "R", parent: "/video-navodila" },
  { path: "/video-navodila/s", label: "S", parent: "/video-navodila" },
  { path: "/video-navodila/sh", label: "Š", parent: "/video-navodila" },
  { path: "/video-navodila/z", label: "Z", parent: "/video-navodila" },
  { path: "/video-navodila/zh", label: "Ž", parent: "/video-navodila" },
  ```
- Odstrani `/video-navodila/crka-` iz `excludedPaths`
- Odstrani stare `/video-navodila/crka-*` vnose

---

## Vizualni rezultat

### Stran `/video-navodila`:
- Čista stran brez zelenega polja
- Enaka postavitev kot `/logopedski-koticek`
- Kartice z zmajčki so takoj vidne

### Stran `/video-navodila/c`:
- Elegantna glava z breadcrumb navigacijo
- Velik naslov "Črka C" na sredini
- Opis pod naslovom
- Video predvajalnik pod opisom
- Brez starega "← Video navodila - C" dizajna
