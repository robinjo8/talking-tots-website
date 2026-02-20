
## Spremembe v KaceLestveSettingsModal

### Kaj je treba popraviti

#### 1. Avatar logika — 2 igralca brez izbire

Trenutno: pri 2 igralcih se še vedno prikaže sekcija za izbiro avatarja za Igralca 1, spodaj pa se izpiše "Igralec 2: Modri/Rdeči zmajček".

Novo:
- **1 igralec**: prikazi oba gumba (modri/rdeči), uporabnik izbere. Naslov ostane "Izberi zmajčka".
- **2 igralca**: sekcija za izbiro avatarja se **sploh ne prikaže**. Avtomatsko: Igralec 1 = modri, Igralec 2 = rdeči.
- Vrstica "Igralec 2: ..." se **odstrani**.

```tsx
{/* Avatar section — samo za 1 igralca */}
{!isInGame && selectedPlayers === 1 && (
  <div className="space-y-3">
    <p className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
      Izberi zmajčka
    </p>
    <div className="flex gap-3">
      {[BLUE_AVATAR, RED_AVATAR].map((av) => (
        <button key={av} onClick={() => setPlayer1Avatar(av)} ...>
          <img ... />
          <span>{av === BLUE_AVATAR ? "Modri" : "Rdeči"}</span>
        </button>
      ))}
    </div>
    {/* BREZ "Igralec 2" vrstice */}
  </div>
)}
```

In `handleConfirm`:
```tsx
const avatars = selectedPlayers === 2
  ? [BLUE_AVATAR, RED_AVATAR]   // fiksno za 2 igralca
  : [player1Avatar, player2Avatar];  // za 1 igralca
```

---

#### 2. Težavnost — enaka težavnostna lestvica kot Preverjanje izgovorjave

Trenutno: `KaceDifficulty = 'lahka' | 'srednja' | 'tezka'` se pošilja v edge function, ki pa pričakuje `'nizka' | 'srednja' | 'visoka'`. To pomeni da igra **nikoli ne pošlje pravilnih vrednosti** — vedno pade na default "srednja".

Rešitev: preoblikuj `KaceDifficulty` da uporablja enake ključe kot preverjanje izgovorjave: `'nizka' | 'srednja' | 'visoka'`.

**Spremembe v `kaceLestveConfig.ts`**:
```typescript
export type KaceDifficulty = 'nizka' | 'srednja' | 'visoka';

export const DIFFICULTY_BONUS: Record<KaceDifficulty, number> = {
  nizka: 2,
  srednja: 1,
  visoka: 0,
};
```

**Opis v nastavitvah** — brez omembe bonusa, samo Levenshtein kriterij:

Pragovi so enaki kot pri preverjanju izgovorjave:
- **Nizka** (`nizka`): Vsaka beseda je sprejeta (prag = 0 %) — idealno za začetnike
- **Srednja** (`srednja`): Beseda mora biti vsaj 33–50 % podobna glede na dolžino — za večino otrok
- **Visoka** (`visoka`): Beseda mora biti 65–75 % podobna glede na dolžino — za naprednejše

Opisi v modalnem oknu (brez bonusa, z opisom kriterija):

```typescript
const difficultyOptions = [
  {
    value: "nizka",
    label: "Lahka",
    description: "Vsaka izgovorjena beseda je sprejeta",
  },
  {
    value: "srednja",
    label: "Srednja",
    badge: "priporočeno",
    description: "Beseda mora biti 33–50 % podobna pravilni izgovorjavi",
  },
  {
    value: "visoka",
    label: "Težka",
    description: "Beseda mora biti 65–75 % podobna pravilni izgovorjavi",
  },
];
```

> Opomba: Kriterij je **enak** kot pri `/artikulacijski-test` — isti Levenshtein pragovi, isto pošiljanje v edge function.

---

#### 3. Kateri % se prikaže v opisu?

Ker se prag razlikuje glede na dolžino besede, bomo prikazali razpon:

| Težavnost | Prag (3 črke) | Prag (4–6 črk) |
|-----------|--------------|---------------|
| Lahka     | 0 %          | 0 %           |
| Srednja   | 33 %         | 50 %          |
| Težka     | 65–75 %      | 65–75 %       |

V opisu prikažemo **razpon** za vsako stopnjo.

---

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | `KaceDifficulty` preimenuj na `'nizka' \| 'srednja' \| 'visoka'`, posodobi `DIFFICULTY_BONUS` ključe |
| `src/components/games/KaceLestveSettingsModal.tsx` | Odstrani "Igralec 2" vrstico, skrij avatar sekcijo za 2 igralca, posodobi opise težavnosti, posodobi vrednosti |
| `src/components/games/KaceLestveGame.tsx` | Posodobi `difficulty` začetno vrednost iz `"srednja"` (ostane enako), avatarji za 2 igralca fiksirani |

### Opomba glede bonusa

Ker `DIFFICULTY_BONUS` zdaj uporablja ključe `nizka/srednja/visoka`, bonus logika v `KaceLestveGame.tsx` (`handleWordResult`) bo delovala pravilno — polja `nizka: 2`, `srednja: 1`, `visoka: 0`.

Bonus za pomik po poljih se **ohrani** v igri (to je ločeno od Levenshtein kriterija) — samo opisa tega ne bomo prikazali v nastavitvah, ker to ni del tega zahtevka.
