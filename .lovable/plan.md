

# Načrt: Popravki slik in velikosti na strani /govorne-igre

## Povzetek sprememb

Posodobitev konfiguracij iger v `GamesList.tsx` z novimi slikami, ozadji in povečanimi velikostmi slik.

---

## Spremembe

### 1. SMEŠNE POVEDI (met-kocke)
- **Nova slika**: `Smesne_besede_2.webp` (namesto `Smesne_besede.webp`)
- **Oranžno ozadje**: Zamenjava zelenega ozadja z oranžnim gradientom (kot pri drugih karticah)

### 2. SESTAVLJANKE
- **Nova slika**: `sestavljanka_21.webp` (namesto `sestavljanka_nova_2.webp`)

### 3. Povečanje slik na karticah
Spremeni `imageScale` iz `75%` na `90%` za naslednje igre (da bodo enake velikosti kot SPOMIN):

| Igra | Trenutno | Novo |
|------|----------|------|
| KOLO BESED | 75% | 90% |
| BINGO | 75% | 90% |
| SESTAVLJANKE | 75% | 90% |
| DRSNA IGRA | 75% | 90% |
| LABIRINT | 75% | 90% |

---

## Datoteka za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/components/games/GamesList.tsx` | Posodobi | Zamenjaj slike, ozadje in imageScale vrednosti |

---

## Tehnična implementacija

### Spremembe v konfiguraciji iger:

```typescript
// KOLO BESED - povečaj sliko
imageScale: "90%"  // bilo: 75%

// BINGO - povečaj sliko
imageScale: "90%"  // bilo: 75%

// SESTAVLJANKE - nova slika + povečaj
image: ".../sestavljanka_21.webp"  // bilo: sestavljanka_nova_2.webp
imageScale: "90%"  // bilo: 75%

// DRSNA IGRA - povečaj sliko
imageScale: "90%"  // bilo: 75%

// LABIRINT - povečaj sliko
imageScale: "90%"  // bilo: 75%

// SMEŠNE POVEDI - nova slika + oranžno ozadje
image: ".../Smesne_besede_2.webp"  // bilo: Smesne_besede.webp
customBackground: "radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)"  
// bilo: zeleno ozadje s hsl(120, ...)
```

---

## Končni rezultat

Po implementaciji bodo vse kartice imele:
- Poenotene velikosti slik (90%) za boljšo vidnost
- SMEŠNE POVEDI bo imela oranžno ozadje kot ostale kartice
- SESTAVLJANKE bo uporabljala novo sliko sestavljanka_21.webp

