
# Načrt: Popravek navigacije za Video navodila

## Ugotovljen problem

Navigacija na strani `/video-navodila` ne deluje zaradi **dveh težav**:

### 1. Neskladnost v URL poti
- **Navigacija** ustvari pot: `/video-navodila/crka-č`
- **Konfiguracija** pričakuje: `/video-navodila/ch`
- Predpona `crka-` povzroča, da router ne najde ujemajočega ključa

### 2. Šumniki v URL-ju
- Navigacija pošilja šumnike (`č`, `š`, `ž`)
- Konfiguracija ima ključe v ASCII obliki (`ch`, `sh`, `zh`)
- Funkcija `getVideoConfigKey` sicer pretvori šumnike, ampak ne odstrani predpone `crka-`

```text
Trenutni tok:
┌──────────────────┐     ┌─────────────────────────┐     ┌──────────────────┐
│ Klik na črko "Č" │ ──► │ navigate(/video-navodila│ ──► │ Router prejme    │
│                  │     │ /crka-č)                │     │ letter = "crka-č"│
└──────────────────┘     └─────────────────────────┘     └────────┬─────────┘
                                                                  │
                                                                  ▼
                         ┌─────────────────────────┐     ┌──────────────────┐
                         │ Preusmeritev nazaj na   │ ◄── │ Config = null    │
                         │ /video-navodila         │     │ (ključ "crka-ch" │
                         └─────────────────────────┘     │ ne obstaja)      │
                                                         └──────────────────┘
```

---

## Rešitev

Obstajata dve možni rešitvi:

**Rešitev A** (priporočena): Popraviti navigacijo, da se ujema s konfiguracijo
**Rešitev B**: Posodobiti konfiguracijo in router za podporo `crka-` predpone

Priporočam **Rešitev A**, ker:
- Je preprostejša (sprememba samo ene datoteke)
- Sledi standardiziranemu vzorcu ASCII URL-jev, ki se uporablja drugod v aplikaciji
- Je skladna s spominskimi zapisi o ASCII URL standardizaciji

---

## Tehnična implementacija

### Sprememba v datoteki `src/pages/VideoNavodila.tsx`

**Trenutna koda (vrstica 79-81):**
```typescript
const handleLetterClick = (letter: string) => {
  navigate(`/video-navodila/crka-${letter.toLowerCase()}`);
};
```

**Popravljena koda:**
```typescript
// Funkcija za pretvorbo šumnikov v ASCII
const toAsciiUrl = (letter: string): string => {
  return letter.toLowerCase()
    .replace('č', 'ch')
    .replace('š', 'sh')
    .replace('ž', 'zh');
};

const handleLetterClick = (letter: string) => {
  navigate(`/video-navodila/${toAsciiUrl(letter)}`);
};
```

---

## Potek po popravku

```text
Popravljen tok:
┌──────────────────┐     ┌─────────────────────────┐     ┌──────────────────┐
│ Klik na črko "Č" │ ──► │ navigate(/video-navodila│ ──► │ Router prejme    │
│                  │     │ /ch)                    │     │ letter = "ch"    │
└──────────────────┘     └─────────────────────────┘     └────────┬─────────┘
                                                                  │
                                                                  ▼
                         ┌─────────────────────────┐     ┌──────────────────┐
                         │ Prikaže se video        │ ◄── │ Config najden!   │
                         │ stran za črko Č         │     │ videoNavodilaConfigs['ch']
                         └─────────────────────────┘     └──────────────────┘
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/pages/VideoNavodila.tsx` | Posodobi | Odstrani predpono `crka-` in dodaj pretvorbo šumnikov v ASCII |

---

## Preslikava črk

Po popravku bodo URL-ji sledeči:

| Črka | Trenutni URL (ne deluje) | Popravljen URL |
|------|--------------------------|----------------|
| C | /video-navodila/crka-c | /video-navodila/c |
| Č | /video-navodila/crka-č | /video-navodila/ch |
| K | /video-navodila/crka-k | /video-navodila/k |
| L | /video-navodila/crka-l | /video-navodila/l |
| R | /video-navodila/crka-r | /video-navodila/r |
| S | /video-navodila/crka-s | /video-navodila/s |
| Š | /video-navodila/crka-š | /video-navodila/sh |
| Z | /video-navodila/crka-z | /video-navodila/z |
| Ž | /video-navodila/crka-ž | /video-navodila/zh |

---

## Končni rezultat

Po implementaciji bo:
1. Klik na katerokoli črko pravilno navigiral na video stran
2. URL-ji bodo standardizirani in skladni z ostalimi igrami v aplikaciji
3. Šumniki bodo pravilno pretvorjeni v ASCII obliko za zanesljivo delovanje
