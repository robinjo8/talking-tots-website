

## Spremembe na strani /govorno-jezikovne-vaje

### 1. Dodaj kartico "Video navodila" na stran /govorno-jezikovne-vaje

Nova kartica bo dodana v array `exerciseTypes` v datoteki `src/pages/GovornojezicovneVaje.tsx`. Oblikovana bo enako kot ostale kartice (gradient header z naslovom, opis spodaj). Povezava vodi na `/video-navodila`.

- **Naslov:** VIDEO NAVODILA
- **Opis:** "Video navodila logopeda za pravilno izgovorjavo posameznih glasov. Kratki posnetki prikazujejo položaj govoril in tehniko izgovorjave."
- **Barva:** `text-app-teal`, gradient `from-app-teal/10 to-dragon-green/10`
- **Path:** `/video-navodila`
- **Available:** true

### 2. Odstrani kartico "Video navodila" iz strani /moje-aplikacije

V datoteki `src/components/ActivityOptions.tsx` odstrani objekt z `id: 'video'` iz arraya `activities`.

### 3. Odstrani "Primer:" vrstico iz kartice VAJE MOTORIKE GOVORIL

V `src/pages/GovornojezicovneVaje.tsx` pri kartici `vaje-motorike-govoril` spremeniti `example` iz `"Primer: gibanje jezika gor, dol, lažkamo in razpiranje."` v prazen string `""`.

### 4. Preimenuj kartico VAJE ZA IZGOVORJAVO GLASOV v MOJI PRVI GLASOVI

V `src/pages/GovornojezicovneVaje.tsx` pri kartici `motnja-izreke`:
- **Naslov:** `"MOJI PRVI GLASOVI"`
- **Opis:** `"Zabavna animacija, ki otroke uči prepoznavati in posnemati glasove. Barviti liki in interaktivni prizori spodbujajo poslušanje, ponavljanje in igro z glasovi, kar krepi govor in fonološke sposobnosti."`
- **Example:** prazen string (odstrani primer)

### 5. Odstrani vse ostale kartice

Odstrani kartice: MOTNJA RITMA IN TEMPA GOVORA, SIBEK BESEDNI ZAKLAD, NEUSTREZNA DOLZINA IN STRUKTURA STAVKA, SLOVNICNO NEUSTREZNI ALI SKOPI STAVKI, NAPACNA RABA BESEDNIH KONCNIC, NAPACNA RABA BESED PRI SPOROCANJU, SLABA SPOSOBNOST ZAVEDANJA IN LOCEVANJA GLASOV.

Po spremembah bodo na strani /govorno-jezikovne-vaje ostale samo **3 kartice**:
1. VAJE MOTORIKE GOVORIL (brez primera)
2. MOJI PRVI GLASOVI (nov naslov in opis)
3. VIDEO NAVODILA (nova kartica)

### Datoteke za spremembo

| Datoteka | Sprememba |
|---|---|
| `src/pages/GovornojezicovneVaje.tsx` | Preoblikovanje exerciseTypes arraya (3 kartice) |
| `src/components/ActivityOptions.tsx` | Odstranitev video kartice iz activities |

