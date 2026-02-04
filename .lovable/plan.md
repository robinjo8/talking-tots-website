

# Plan: Popravi kartice iger in gumb X v dialogu

## Pregled

Potrebni sta dve popravki:
1. **Kartice iger** na strani `/brezplacne-igre` morajo izgledati enako kot na strani `/govorne-igre` - z zlatim ozadjem, pravimi slikami in enakim stilom
2. **Gumb X** (križec) v dialogu za izbiro starosti ne dela - potrebno je dodati handler za zapiranje

## Trenutno stanje

### Kartice iger
- **FreeGamesList**: Uporablja emoji ikone in barvne gradiente (npr. `from-pink-400 to-rose-500`)
- **GamesList**: Uporablja prave slike iger z zlatim ozadjem (`radial-gradient(ellipse at center, hsl(45, 100%, 95%)...)`)

### Dialog za starost
- V `AgeSelectionDialog` je `onOpenChange={() => {}}` - prazna funkcija, ki blokira zapiranje
- Gumb X v DialogContent pokliče `onOpenChange(false)`, ampak ta funkcija ne naredi nič

## Tehnična rešitev

### 1. FreeGamesList.tsx - Popolna prenova

Zamenjamo strukturo kartic z enako kot v `GamesList.tsx`:

| Lastnost | Staro | Novo |
|----------|-------|------|
| Ozadje | Barvni gradienti | Zlato radial-gradient ozadje |
| Ikona | Emoji (🎯, 🧠, 🧩...) | Prave slike iz Supabase storage |
| Struktura | Enostavna Card komponenta | Div z aspect-ratio, slike z hover efekti |
| Tekst | Bel tekst na ozadju | Črn tekst pod kartico |

Spremembe:
- Dodamo enake slike kot v `GamesList` za vsako igro
- Uporabimo `customBackground` z zlatim gradientom
- Uporabimo enako strukturo kartice (slika zgoraj, tekst spodaj)
- Dodamo `imageScale` za vsako igro
- Uporabimo responsive grid (2 stolpca na mobilni, 3 na tablici, 4 na desktopu)

```text
Igre za vključiti (brez "Kolo besed"):
- BINGO → slika: bingo_nova_2.webp
- SPOMIN → slika: spomin_nova_2.webp
- SESTAVLJANKE → slika: sestavljanka_nova_1.webp
- ZAPOREDJA → slika: zaporedja_nova_2.webp
- DRSNA IGRA → slika: drsna_sestavljanka_nova_2.webp
- IGRA UJEMANJA → slika: igra_ujemanja_2.webp
- LABIRINT → slika: labirint_nova_2.webp
- SMEŠNE POVEDI → slika: Smesne_besede_21.webp
- PONOVI POVED → slika: Zmajcek_1.webp
```

### 2. AgeSelectionDialog.tsx - Popravek X gumba

Spremembe:
- Dodamo nov prop `onClose?: () => void` za zapiranje dialoga
- V `onOpenChange` pokličemo `onClose` če je definiran
- V `BrezplacneIgre.tsx` posredujemo `onClose={() => setShowAgeDialog(false)}`

Alternativno (če uporabnik še ni izbral starosti):
- Če je starost že shranjena (uporabnik jo spreminja), dovolimo zapiranje
- Če starost še ni vnešena, X gumb navigira nazaj na domačo stran

## Datoteke za spremembo

### src/components/free-games/FreeGamesList.tsx

Popolna prenova z enako strukturo kot `GamesList.tsx`:
- Uporabi `useIsMobile` hook za responsive prikaz
- Zamenjaj emoji ikone s pravimi slikami iz Supabase storage
- Uporabi zlato radial-gradient ozadje
- Dodaj hover efekte (scale, shadow)
- Uporabi enako strukturo kartice (slika + tekst)

### src/components/free-games/AgeSelectionDialog.tsx

- Dodaj prop `onClose?: () => void`
- Spremeni `onOpenChange` iz prazne funkcije v funkcijo ki pokliče `onClose`
- Alternativno: če starost ni vnešena in uporabnik pritisne X, navigiraj na domačo stran

### src/pages/BrezplacneIgre.tsx

- Posreduj `onClose` prop v `AgeSelectionDialog`

## Vizualni rezultat

Kartice bodo imele:
- Zlato ozadje z gradientom
- Prave slike iger (enake kot na /govorne-igre)
- Hover efekt s povečavo in senco
- Naslov igre in kratek opis pod sliko
- Responsive grid (2/3/3 stolpci glede na velikost zaslona)

X gumb v dialogu bo:
- Če je starost že shranjena: zapre dialog in ostane na strani
- Če starost ni vnešena: navigira nazaj na domačo stran (uporabnik ne more igrati brez vnosa starosti)

