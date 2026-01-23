

# Načrt: Poenostavljen mobilni header z logom

## Povzetek sprememb

Header na telefonu bo imel sledečo postavitev:
- **Levo**: Hamburger meni (tri črtice)
- **Desno od menija**: Logo TomiTalk (brez oznake "Admin")
- **Desno od loga**: Zvonček (obvestila)
- **Skrajno desno**: Ikona uporabnika

Iskalnik bo odstranjen iz headerja - dodan bo na posamezne strani, kjer je potreben.

---

## Vizualna struktura

### Mobilni header (nov):
```text
┌────────────────────────────────────────┐
│  ☰   TomiTalk              🔔     👤   │
└────────────────────────────────────────┘
```

### Desktop header (ostane podobno, brez iskalnika):
```text
┌────────────────────────────────────────────────────────┐
│                                    🔔   👤 Ime Priimek │
└────────────────────────────────────────────────────────┘
```

---

## Spremembe

### 1. AdminHeader.tsx

**Odstrani:**
- Celoten iskalnik (Input komponenta)
- `useState` za searchQuery (ni več potreben)

**Dodaj:**
- Logo TomiTalk takoj za hamburger menijem
- Logo viden samo na mobilnih napravah (`lg:hidden`)
- Stil loga: "Tomi" v zeleni (dragon-green), "Talk" v oranžni (app-orange)

**Posodobi:**
- Header postane `fixed` za fiksno pozicijo med scrollanjem
- Manjši gap med elementi na mobilnem za boljšo razporeditev

**Nova struktura:**
```tsx
<header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
  {/* Leva stran: hamburger + logo */}
  <div className="flex items-center gap-3">
    {/* Hamburger meni - samo mobile */}
    <Sheet>...</Sheet>
    
    {/* Logo - samo mobile */}
    <div className="lg:hidden flex items-center">
      <span className="text-lg font-extrabold text-dragon-green">Tomi</span>
      <span className="text-lg font-extrabold text-app-orange">Talk</span>
    </div>
  </div>

  {/* Desna stran: obvestila + uporabnik */}
  <div className="flex items-center gap-2 lg:gap-4">
    <Button>🔔</Button>
    <div>👤</div>
  </div>
</header>
```

### 2. AdminLayout.tsx

**Dodaj:**
- `pt-16` na vsebinski wrapper za kompenzacijo fiksnega headerja (64px)

**Posodobi:**
```tsx
<div className="lg:pl-64 pt-16">
  <AdminHeader />
  <main className="p-6">
    {children}
  </main>
</div>
```

---

## Tehnične podrobnosti

### Spremembe v AdminHeader.tsx

| Element | Prej | Potem |
|---------|------|-------|
| Pozicija | `sticky top-0` | `fixed top-0 left-0 right-0` |
| Iskalnik | Prisoten | Odstranjen |
| Logo | Ni bil | Dodan (samo mobile) |
| Gap | `gap-4` | `gap-2 lg:gap-4` (manjši na mobile) |
| Padding | `px-6` | `px-4 lg:px-6` (manjši na mobile) |

### Razporeditev elementov

```text
Mobile:  [☰] [TomiTalk]  ←spacer→  [🔔] [👤]
Desktop: ←spacer→                  [🔔] [👤 + Ime]
```

---

## Rezultat

Po implementaciji:
- Header bo fiksen med scrollanjem na vseh napravah
- Na telefonu bo jasno viden logo TomiTalk
- Čista, preprosta navigacija brez nepotrebnih elementov
- Iskalnik se bo dodal na posamezne strani po potrebi

