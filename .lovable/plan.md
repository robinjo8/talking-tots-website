
# Načrt: Posodobitev slik in imen kartic na strani /govorne-igre

## Povzetek

Posodobitev konfiguracij iger v `GamesList.tsx` z novimi slikami in preimenovanji.

---

## Ugotovljene slike v Supabase storage (bucket: slike-ostalo)

Vse zahtevane slike so potrjene:
- `kolo_srece_nova_2.webp`
- `bingo_nova_2.webp`
- `spomin_nova_2.webp`
- `sestavljanka_nova_2.webp`
- `zaporedja_nova_2.webp`
- `drsna_sestavljanka_nova_2.webp`
- `igra_ujemanja_2.webp`
- `labirint_nova_2.webp` (za LABIRINT - pravilna slika namesto igra_ujemanja_2.webp)
- `Smesne_besede.webp`

---

## Spremembe

| Igra | Staro ime | Novo ime | Stara slika | Nova slika |
|------|-----------|----------|-------------|------------|
| kolo-srece | KOLO SREČE | **KOLO BESED** | kolo_srece_nova_1.webp | kolo_srece_nova_2.webp |
| bingo | BINGO | BINGO | bingo_nova_1.webp | bingo_nova_2.webp |
| spomin | SPOMIN | SPOMIN | spomin_nova_2.webp | spomin_nova_2.webp (že pravilna) |
| sestavljanke | SESTAVLJANKE | SESTAVLJANKE | sestavljanka_nova_1.webp | sestavljanka_nova_2.webp |
| zaporedja | ZAPOREDJA | ZAPOREDJA | zaporedja_nova_1.webp | zaporedja_nova_2.webp |
| drsna-sestavljanka | DRSNA IGRA | DRSNA IGRA | drsna_sestavljanka_nova_1.webp | drsna_sestavljanka_nova_2.webp |
| povezi-pare-matching | IGRA UJEMANJA | IGRA UJEMANJA | igra_ujemanja_1.webp | igra_ujemanja_2.webp |
| labirint | LABIRINT | LABIRINT | labirint_nova_1.webp | labirint_nova_2.webp |
| met-kocke | MET KOCKE | **SMEŠNE POVEDI** | met_kocke.webp | Smesne_besede.webp |

---

## Datoteka za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/components/games/GamesList.tsx` | Posodobi | Zamenjaj slike in imena (vrstice 4-103) |

---

## Tehnična implementacija

### Spremembe v `GamesList.tsx`

```typescript
// KOLO SREČE → KOLO BESED
{
  id: "kolo-srece",
  title: "KOLO BESED",  // Spremenjeno
  image: ".../kolo_srece_nova_2.webp",  // Spremenjeno
  ...
}

// BINGO
{
  id: "bingo",
  image: ".../bingo_nova_2.webp",  // Spremenjeno
  ...
}

// SPOMIN - že ima pravilno sliko (spomin_nova_2.webp)

// SESTAVLJANKE
{
  id: "sestavljanke",
  image: ".../sestavljanka_nova_2.webp",  // Spremenjeno
  ...
}

// ZAPOREDJA
{
  id: "zaporedja",
  image: ".../zaporedja_nova_2.webp",  // Spremenjeno
  ...
}

// DRSNA IGRA
{
  id: "drsna-sestavljanka",
  image: ".../drsna_sestavljanka_nova_2.webp",  // Spremenjeno
  ...
}

// IGRA UJEMANJA
{
  id: "povezi-pare-matching",
  image: ".../igra_ujemanja_2.webp",  // Spremenjeno
  ...
}

// LABIRINT
{
  id: "labirint",
  image: ".../labirint_nova_2.webp",  // Spremenjeno (pravilna slika)
  ...
}

// MET KOCKE → SMEŠNE POVEDI
{
  id: "met-kocke",
  title: "SMEŠNE POVEDI",  // Spremenjeno
  image: ".../Smesne_besede.webp",  // Spremenjeno
  ...
}
```

---

## Opomba

Za LABIRINT sem uporabil `labirint_nova_2.webp` namesto `igra_ujemanja_2.webp`, ki si jo omenil - to je bila verjetno napaka v zahtevi, saj `labirint_nova_2.webp` obstaja v storage in je logična izbira za to igro.
