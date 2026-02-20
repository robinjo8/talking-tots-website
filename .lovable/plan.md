
## Spremembe v KaceLestveSettingsModal

### Povzetek sprememb

**1 datoteka** za spremembo: `src/components/games/KaceLestveSettingsModal.tsx`

---

### Kaj se spremeni

#### 1. Avatar sekcija — nova postavitev po referenčni sliki

Namesto sedanje sekcije (ki se prikaže samo za 1 igralca) bo nova sekcija **vedno prikazana** (ko ni v igri), a z drugačno vsebino glede na število igralcev.

**1 igralec:**
- Prikazana sta oba vrstici: "Igralec 1" in "Igralec 2"
- Igralec 1: oba gumba klikabilna (modri / rdeči), izbrani ima teal obrobo
- Igralec 2: oba gumba **osivljena** (`opacity-40 pointer-events-none`), prikazuje nasprotni zmajček avtomatsko (vizualno zakrit)
- Logika: izbira Igralca 1 → nasprotni gre Igralcu 2 (prikaz samo)

**2 igralca:**
- Prikazani sta obe vrstici: "Igralec 1" in "Igralec 2"
- Oba imata klikabilna gumba
- Logika: če Igralec 1 klikne modrega → Igralec 2 avtomatsko dobi rdečega in obratno (radio-logika med vrsticama)
- Torej: **player1Avatar** ostane v stanju, **player2Avatar** je vedno nasprotni

Struktura vrstice:
```
Igralec 1   [🔵 Modri]  [🔴 Rdeči]
Igralec 2   [🔵 Modri]  [🔴 Rdeči]  ← osivljeno za 1P, klikabilno za 2P
```

Za 2 igralca: klik na Igralec 1 modri → Igralec 2 rdeči (avtomatsko). Klik na Igralec 2 rdeči → Igralec 1 modri (avtomatsko). En "skupni" `player1Avatar` state zadostuje ker je player2Avatar vedno nasprotni.

#### 2. Težavnost — odstrani opise

Iz `difficultyOptions` se odstrani `description` polje (oz. se ne prikaže v UI).

Ostane samo:
- Ime (`Lahka`, `Srednja`, `Težka`)
- Badge `priporočeno` pri Srednji

```tsx
{/* Odstranimo: */}
<div className="text-xs text-muted-foreground mt-0.5">{d.description}</div>
```

#### 3. Gumbi — odstrani ikone

- "← Nazaj" → "Nazaj" (brez puščice)
- "🎲 Začni igro" → "Začni igro" (brez kocke)
- "✓ Potrdi" ostane enako

---

### Detajli implementacije

**State:** ostane samo `player1Avatar` — `player2Avatar` je vedno `player1Avatar === BLUE_AVATAR ? RED_AVATAR : BLUE_AVATAR`

**Za 2 igralca — handleConfirm:** avatars = `[player1Avatar, player2Avatar]` (ne več `[BLUE_AVATAR, RED_AVATAR]` fiksno)

**Avatar sekcija JSX:**

```tsx
{!isInGame && (
  <div className="space-y-3">
    <p className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
      Izberi zmajčka
    </p>

    {/* Igralec 1 vrstica - vedno klikabilna */}
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium w-16">Igralec 1</span>
      <div className="flex gap-2 flex-1">
        {[BLUE_AVATAR, RED_AVATAR].map((av) => (
          <button
            key={av}
            onClick={() => setPlayer1Avatar(av)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border-2 transition-all ${
              player1Avatar === av
                ? "bg-teal-50 border-teal-500"
                : "bg-background border-border hover:border-gray-300"
            }`}
          >
            <img src={...} className="w-12 h-12 object-contain" />
          </button>
        ))}
      </div>
    </div>

    {/* Igralec 2 vrstica */}
    <div className={`flex items-center gap-3 ${selectedPlayers === 1 ? "opacity-40 pointer-events-none" : ""}`}>
      <span className="text-sm font-medium w-16">Igralec 2</span>
      <div className="flex gap-2 flex-1">
        {[BLUE_AVATAR, RED_AVATAR].map((av) => (
          <button
            key={av}
            onClick={() => setPlayer1Avatar(player2Avatar === av ? BLUE_AVATAR : RED_AVATAR)}
            // Klik na Igralec 2 nastavi nasprotni za Igralca 1
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border-2 transition-all ${
              player2Avatar === av
                ? "bg-teal-50 border-teal-500"
                : "bg-background border-border hover:border-gray-300"
            }`}
          >
            <img src={...} className="w-12 h-12 object-contain" />
          </button>
        ))}
      </div>
    </div>
  </div>
)}
```

**handleConfirm** posodobitev:
```tsx
const avatars = [player1Avatar, player2Avatar]; // velja za oba modusa (1P in 2P)
onStart(selectedPlayers, selectedDifficulty, avatars);
```

Za 1 igralca: `player2Avatar` bo nasprotni (ni prikazan v igri, samo za interno logiko).

---

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveSettingsModal.tsx` | Nova avatar sekcija z obema vrsticama, brez opisov pri težavnosti, brez ikon pri gumbih |
