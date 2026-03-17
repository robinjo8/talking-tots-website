

# Mobilna prilagoditev: vse na eni strani brez scrollanja

## Pregled
Obe strani (`VizualniPrikazUstnic` in `VideoNavodila`) trenutno uporabljata `min-h-screen` scrollable layout. Na mobilni verziji ju moramo prilagoditi, da se vse prikaže znotraj viewporta brez scrollanja — po vzoru Bingo igre (`fixed inset-0 overflow-hidden`).

**Desktop ostane nespremenjen.**

## Spremembe

### 1. `src/pages/VizualniPrikazUstnic.tsx`
Na mobilni verziji:
- Zunanji div dobi `fixed inset-0 overflow-hidden` namesto `min-h-screen`
- Odstrani `pt-28 pb-20` padding, uporabi `h-full flex flex-col` za razporeditev
- Naslov: zmanjšaj na `text-2xl`, opis skrij ali zmanjšaj, zmanjšaj `mb` razmike
- Kartica: zmanjšaj `cardHeight` iz `420px` na dinamično vrednost (npr. `calc(100vh - 200px)` ali cca `55vh`)
- Slika na zadnji strani: zmanjšaj `max-h-[250px]` na `max-h-[180px]`
- Pikice: zmanjšaj `mt-6` na `mt-2`
- Header ostane, floating back gumb ostane
- Na desktopu se nič ne spremeni (pogoj `isMobile`)

### 2. `src/pages/VideoNavodila.tsx`
Na mobilni verziji:
- Zunanji div dobi `fixed inset-0 overflow-hidden` namesto `min-h-screen`
- Vsebina postane `h-full flex flex-col overflow-hidden`
- Naslov: zmanjšaj na `text-2xl`, zmanjšaj margin
- Odstrani breadcrumb na mobilni
- Grid (`grid-cols-2 gap-4`): zmanjšaj `gap` na `gap-2`, dodaj `overflow-y-hidden`, zmanjšaj padding kartice
- Kartice: zmanjšaj aspect-square na manjši aspect ratio ali fiksno višino, zmanjšaj padding in font
- Na desktopu se nič ne spremeni

