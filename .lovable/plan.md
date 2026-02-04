

# Plan: Brezplačne igre s starostno prilagoditvijo

## Pregled

Implementirali bomo sistem brezplačnih iger za registrirane uporabnike (brez naročnine). Ob kliku na gumb "Brezplačne igre" se bo najprej odprlo pop-up okno za vnos starosti otroka, nato pa bodo igre prilagojene tej starosti.

## Kako deluje

1. Uporabnik klikne "Brezplačne igre" na domači strani
2. Odpre se pop-up okno z vnosom starosti (3-10 let) in kratkim opisom
3. Po vnosu se odpre stran z izborom iger (enake kartice kot /govorne-igre)
4. Vsaka igra je prilagojena starosti in omejena na črko K
5. Po 3 odigranih igrah na dan se prikaže obvestilo o omejitvi

## Starostna prilagoditev po igrah

| Igra | 3-4 let | 5-6 let | 7-8 let | 9-10 let |
|------|---------|---------|---------|----------|
| **Sestavljanke** | 3x3 (9 kosov) | 4x3 (12 kosov) | 5x4 (20 kosov) | 6x5 (30 kosov) |
| **Drsna sestavljanka** | Tip 34 | Tip 34 | Tip 78 | Tip 910 |
| **Zaporedja** | Tip 34 | Tip 56 | Tip 78 | Tip 910 |
| **Igra ujemanja** | 2 stolpca | 3 stolpci | 3 stolpci | 4 stolpci |
| **Spomin** | 10 parov | 10 parov | 10 parov | 10 parov |
| **Bingo** | Enako | Enako | Enako | Enako |
| **Smešne povedi** | Enako | Enako | Enako | Enako |
| **Ponovi poved** | 4 povedi | 4 povedi | 4 povedi | 4 povedi |
| **Labirint** | 4 zvezdice | 4 zvezdice | 4 zvezdice | 4 zvezdice |

Igre Spomin, Bingo, Smešne povedi, Ponovi poved in Labirint nimajo različnih težavnosti po starosti - delujejo enako za vse starosti.

## Kdaj se šteje igra kot odigrana

Za vsako igro posebej, ko se prikaže zaključni dialog:

| Igra | Pogoj za "odigrano" |
|------|---------------------|
| **Spomin** | Ko najde vse pare (gameCompleted = true) |
| **Sestavljanke** | Ko sestavi sliko in se pojavi PuzzleSuccessDialog |
| **Labirint** | Ko pobere 4 zvezdice in doseže cilj (PuzzleSuccessDialog) |
| **Zaporedja** | Ko pravilno razvrsti in se pojavi MatchingCompletionDialog |
| **Drsna sestavljanka** | Ko sestavi sliko in se pojavi MatchingCompletionDialog |
| **Igra ujemanja** | Ko poveže vse in se pojavi MatchingCompletionDialog |
| **Bingo** | Ko doseže pogoj za zmago (gameComplete = true) |
| **Smešne povedi** | Ko zapolni 5 pikic (progress = 5) |
| **Ponovi poved** | Ko pride na krog (completedSentences = 1) |

## Pop-up za vnos starosti

Prikaže se ob kliku na "Brezplačne igre":

```text
+----------------------------------+
|         BREZPLAČNE IGRE          |
+----------------------------------+
|                                  |
|  Za najboljšo izkušnjo nam      |
|  povej, koliko let ima tvoj     |
|  otrok. Igre bodo prilagojene   |
|  njegovi starosti.              |
|                                  |
|  Starost otroka:                |
|  [   3   ] [   4   ] [   5   ]  |
|  [   6   ] [   7   ] [   8   ]  |
|  [   9   ] [  10   ]            |
|                                  |
|      [ ZAČNI Z IGRAMI ]         |
+----------------------------------+
```

Starost se shrani v localStorage pod ključem `free_games_child_age`.

## Tehnična implementacija

### 1. Nova komponenta: AgeSelectionDialog

Datoteka: `src/components/free-games/AgeSelectionDialog.tsx`

Prikaže mrežo gumbov za izbiro starosti (3-10) in shrani v localStorage.

### 2. Hook za upravljanje brezplačnih iger

Datoteka: `src/hooks/useFreeGameLimit.ts`

```text
Funkcije:
- getChildAge(): number | null
- setChildAge(age: number): void
- getAgeGroup(): '34' | '56' | '78' | '910'
- canPlayFreeGame(): boolean
- recordFreeGamePlayed(): void
- getRemainingGames(): number

Shranjuje v localStorage:
- free_games_child_age: number
- free_games_played: { date: string, count: number }
```

### 3. Kontekst: FreeGameContext

Datoteka: `src/contexts/FreeGameContext.tsx`

Zagotavlja globalni dostop do:
- Starosti otroka in starostne skupine
- Števila preostalih iger
- Funkcije za beleženje odigrane igre
- Zastavice ali je igra že zabeležena v tej seji

### 4. Stran z izborom iger

Datoteka: `src/pages/BrezplacneIgre.tsx`

- Ob vstopu preveri ali je starost vnešena, če ne prikaže AgeSelectionDialog
- Prikaže kartice iger (brez Kolo besed)
- Vsaka kartica vodi na brezplačno verzijo igre

### 5. Wrapper komponente za igre (9 datotek)

Datoteke v `src/components/free-games/`:
- `FreeSestavljankeGame.tsx`
- `FreeDrsnaSestavljankaGame.tsx`
- `FreeZaporedjaGame.tsx`
- `FreeIgraUjemanjaGame.tsx`
- `FreeSpominGame.tsx`
- `FreeBingoGame.tsx`
- `FreeMetKockeGame.tsx`
- `FreePonoviPovedGame.tsx`
- `FreeLabirintGame.tsx`

Vsaka komponenta:
1. Pridobi starostno skupino iz konteksta
2. Ustvari ustrezno konfiguracijo za črko K in starost
3. Preveri omejitev iger pred prikazom
4. Zabeleži igro ob zaključku (enkrat na sejo)
5. Preda lastnost `onGameComplete` obstoječi generični komponenti

### 6. Dialog ob omejitvi

Datoteka: `src/components/free-games/FreeLimitReachedDialog.tsx`

Besedilo:
- Naslov: "DANES SI ŽE ODIGRAL 3 BREZPLAČNE IGRE"
- Opis: "VEČ IGER, VAJ IN PREVERJANJE IZGOVORJAVE DOBIŠ V TOMITALK PRO PAKETU"
- Gumbi: "POGLEJ PAKETE" in "NAZAJ"

### 7. Spremembe obstoječih datotek

**`src/components/home/HeroSection.tsx`**
- Dodaj gumb "Brezplačne igre" za prijavljene uporabnike brez naročnine

**`src/config/routes.tsx`**
- Dodaj route za `/brezplacne-igre` in vse pod-route za igre

**`src/config/providers.tsx`**
- Dodaj `FreeGameProvider` v hierarhijo providerjev

**Generične igre (9 datotek)**
- Dodaj opcijski prop `onGameComplete?: () => void`
- Pokliči ga ob zaključku igre (na pravilnem mestu za vsako igro)

## Datoteke za ustvarjanje

| Datoteka | Namen |
|----------|-------|
| `src/hooks/useFreeGameLimit.ts` | Hook za localStorage sledenje |
| `src/contexts/FreeGameContext.tsx` | Globalni kontekst |
| `src/pages/BrezplacneIgre.tsx` | Stran z izborom iger |
| `src/components/free-games/AgeSelectionDialog.tsx` | Dialog za vnos starosti |
| `src/components/free-games/FreeLimitReachedDialog.tsx` | Dialog ob omejitvi |
| `src/components/free-games/FreeGamesList.tsx` | Seznam kartic iger |
| `src/components/free-games/FreeSestavljankeGame.tsx` | Wrapper za sestavljanke |
| `src/components/free-games/FreeDrsnaSestavljankaGame.tsx` | Wrapper za drsno |
| `src/components/free-games/FreeZaporedjaGame.tsx` | Wrapper za zaporedja |
| `src/components/free-games/FreeIgraUjemanjaGame.tsx` | Wrapper za ujemanje |
| `src/components/free-games/FreeSpominGame.tsx` | Wrapper za spomin |
| `src/components/free-games/FreeBingoGame.tsx` | Wrapper za bingo |
| `src/components/free-games/FreeMetKockeGame.tsx` | Wrapper za smešne povedi |
| `src/components/free-games/FreePonoviPovedGame.tsx` | Wrapper za ponovi poved |
| `src/components/free-games/FreeLabirintGame.tsx` | Wrapper za labirint |

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/config/routes.tsx` | Dodaj 10 novih route |
| `src/config/providers.tsx` | Dodaj FreeGameProvider |
| `src/components/home/HeroSection.tsx` | Dodaj gumb za brezplačne igre |
| `supabase/functions/create-checkout/index.ts` | Odstrani trial logiko |
| Vse generične igre (9) | Dodaj onGameComplete prop |

## Odstranitev 7-dnevnega trial obdobja

V `supabase/functions/create-checkout/index.ts`:
- Odstrani preverjanje ali je uporabnik že uporabil trial (vrstice 117-143)
- Odstrani `subscription_data` z `trial_period_days` (vrstice 171-173)

