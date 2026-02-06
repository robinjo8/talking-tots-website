

# Plan: Popravki admin strani + pojasnilo AI agenta

## 1. Kateri AI agent bo to delal?

**NE potrebujete OpenAI Platform Agent Builder.** Ne potrebujete iti na platform.openai.com in tam karkoli nastavljati.

"AI agent" za mesecni nacrt bo **lastna edge funkcija** (`generate-monthly-plan`) v vasem Supabase projektu - popolnoma enako kot ze deluje vas AI asistent Tomi (`chat-assistant` edge funkcija). Gre za isto tehnologijo:

- Edge funkcija v vasem projektu (`supabase/functions/generate-monthly-plan/index.ts`)
- Uporablja isti `OPENAI_API_KEY` ki ga ze imate konfiguriranega
- Poklice OpenAI API z natancnim promptom in strukturiranim izhodom (tool calling)
- Vi ne potrebujete nastaviti nicesar na OpenAI platformi

Razlika med nasim pristopom in OpenAI Agent Builder:

| | Nas pristop (edge funkcija) | OpenAI Agent Builder |
|---|---|---|
| Kje tece | V vasem Supabase projektu | Na OpenAI strežnikih |
| Kontrola | Popolna - vi pisete kodo | Omejena na njihov vmesnik |
| Podatki | Ostanejo v vasem sistemu | Gredo cez OpenAI platformo |
| Strosek | Samo API klici (~0.01-0.05 EUR/nacrt) | Dodatni stroski platforme |
| Prilagodljivost | Neomejena | Omejena na predloge |

Vas `OPENAI_API_KEY` je ze nastavljen. Ko bomo napisali edge funkcijo, jo le deployamo in deluje.

## 2. Popravek posnetkov za uporabnika kujavec.robert@gmail.com

### Problem

V bazi obstaja ena sama seja za tega otroka:
- ID: `fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03`
- `session_number = 2`

V Storage pa sta dve mapi:
- `Seja-1` — 3 stari/napacni posnetki
- `Seja-2` — 60 pravilnih posnetkov

Na AdminUserDetail strani se prikazejo obe mapi iz Storage-a. Na AdminSessionReview strani pa koda ze prikazuje kot "Seja-1" ne glede na dejansko mapo.

### Resitev

Ustvarimo enkratno edge funkcijo `fix-session-recordings` ki bo:

1. Izbrisala 3 stale posnetke iz mape `Seja-1`
2. Prestavila vseh 60 posnetkov iz `Seja-2` v `Seja-1` (Supabase Storage ima `move` metodo)
3. Posodobila `session_number` v bazi iz 2 na 1

Po zagonu te edge funkcije bosta obe strani (AdminUserDetail in AdminSessionReview) prikazovali "Seja-1" s 60 posnetki.

### Tehnicno

Nova datoteka: `supabase/functions/fix-session-recordings/index.ts`

```text
Tok izvajanja:
1. Pridobi seznam datotek v Seja-1 mapi
2. Izbrisi vse datoteke v Seja-1
3. Pridobi seznam datotek v Seja-2 mapi
4. Za vsako datoteko: move iz Seja-2/{filename} v Seja-1/{filename}
5. UPDATE articulation_test_sessions SET session_number = 1 WHERE id = 'fc3dd757...'
6. Vrni rezultat
```

To funkcijo poklicemo enkrat in jo potem lahko izbrisemo.

## 3. Sprememba naslova "PREDLOG ZA VAJE:" v "PREDLOG ZA IGRE IN VAJE:"

### Datoteke za spremembo

**ReportTemplateEditor.tsx** (vrstica 166-167):
- Naslov: `PREDLOG ZA VAJE:` --> `PREDLOG ZA IGRE IN VAJE:`
- Placeholder: `Vnesite predlog za vaje...` --> `Vnesite predlog za igre in vaje...`

**generateReportPdf.ts** (vrstica 261):
- V PDF sekciji: `Predlog za vaje` --> `Predlog za igre in vaje`

**generateReportText()** funkcija (vrstica 255):
- V tekstovnem porocilu: `PREDLOG ZA VAJE:` --> `PREDLOG ZA IGRE IN VAJE:`

## 4. Spustni seznam za izbiro problematicnih crk

### Opis

V sekciji "PREDLOG ZA IGRE IN VAJE:" namesto samo prostega besedila:

1. Najprej je fiksno besedilo: **"Priporocamo igre in vaje za"**
2. Pod njim je multi-select dropdown z vsemi 20 crkami (P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, S, Z, C, R)
3. Ko logopedinja izbere crke, se avtomatsko generira besedilo:
   - 1 crka: `"Priporocamo igre in vaje za crko R."`
   - 2 crki: `"Priporocamo igre in vaje za crko R in za crko L."`
   - 3+ crk: `"Priporocamo igre in vaje za crko R, crko K in za crko L."`
4. Pod generirano besedilo ostane textarea za dodatne opombe

### Spremembe v podatkovnem modelu

**ReportData** vmesnik dobi novo polje:
```text
recommendedLetters: string[]   // npr. ['R', 'L', 'K']
```

**logopedist_reports** tabela dobi nov stolpec:
```text
recommended_letters text[]     // za strukturiran dostop AI agenta
```

Ko logopedinja shrani porocilo, se v `recommendations` zapise generirano besedilo + dodatne opombe, v `recommended_letters` pa samo seznam crk.

### Vizualni prikaz v porocilu

```text
PREDLOG ZA IGRE IN VAJE:
+----------------------------------------------------+
|  Priporocamo igre in vaje za                       |
|                                                     |
|  [R x] [L x] [K x]  [+ Dodaj crko v]              |
|                                                     |
|  Generirano: "Priporocamo igre in vaje za          |
|  crko R, crko K in za crko L."                     |
|                                                     |
|  Dodatne opombe:                                    |
|  [________________________]                         |
+----------------------------------------------------+
```

### Tehnicne datoteke

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/admin/ReportTemplateEditor.tsx` | Dodaj multi-select za crke, generiraj besedilo |
| `src/pages/admin/AdminUserDetail.tsx` | Dodaj `recommendedLetters` v ReportData state, posreduj v ReportTemplateEditor |
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Enako kot AdminUserDetail |
| `src/utils/generateReportPdf.ts` | Uporabi generirano besedilo v PDF |
| SQL migracija | Dodaj `recommended_letters text[]` stolpec v `logopedist_reports` |

## 5. Logika za AI agenta - katere crke vaditi

Ko bo edge funkcija `generate-monthly-plan` generirala nacrt, bo uporabila **tri izvore podatkov** za dolocitev fokusnih crk:

### Izvor 1: Ocene glasov (articulation_evaluations)

Za vsako crko prebere `selected_options`:

| Opcija | AI razume kot | Vkljuci v nacrt? |
|--------|---------------|------------------|
| `acquired` (Glas je usvojen) | Crka je OK | NE |
| `not_automated` (Glas ni avtomatiziran) | Potrebuje vadbo | DA |
| `not_acquired` (Glas ni usvojen) | Potrebuje vadbo | DA |
| `distorted` (Glas je neustrezno usvojen) | Potrebuje vadbo | DA |
| `omitted` (Glas je izpuscen) | Potrebuje vadbo | DA |
| `substituted` (Glas je zamenjan) | Potrebuje vadbo | DA |

Se pravi: samo ce ima crka oznako `acquired`, AI zanjo NE dodeli vaj. Za vse ostale oznake dodeli igre in vaje.

### Izvor 2: Priporocene crke iz porocila (recommended_letters)

Nov stolpec `recommended_letters` v `logopedist_reports` - neposreden seznam crk ki jih je logopedinja izbrala v porocilu (npr. `['R', 'L']`). To je najpomembnejsi signal za AI.

### Izvor 3: Starost otroka

Iz `children.birth_date` se izracuna starost in doloci starostna skupina (3-4, 5-6, 7-8, 9-10). AI na podlagi starosti izbere pravilne variante iger (npr. sestavljanke za 5-6 let: `/sestavljanke/r56`).

### Kako AI kombinira

1. Vzame crke iz `recommended_letters` kot primarni fokus
2. Doda crke iz `articulation_evaluations` ki nimajo oznake `acquired`
3. Odstrani morebitne duplikate
4. Na podlagi starosti izbere pravilne poti do iger
5. Razporedi igre enakomerno cez mesec

## Datoteke za spremembo - celoten seznam

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `supabase/functions/fix-session-recordings/index.ts` | Nova | Enkratna edge funkcija za popravek posnetkov |
| `supabase/config.toml` | Sprememba | Dodaj novo funkcijo |
| SQL migracija | Nova | Dodaj `recommended_letters text[]` v `logopedist_reports` |
| `src/components/admin/ReportTemplateEditor.tsx` | Sprememba | Naslov, multi-select za crke, generirano besedilo |
| `src/pages/admin/AdminUserDetail.tsx` | Sprememba | `recommendedLetters` v ReportData, shranjevanje v DB |
| `src/pages/admin/AdminLogopedistChildDetail.tsx` | Sprememba | Enako kot AdminUserDetail |
| `src/utils/generateReportPdf.ts` | Sprememba | "Predlog za igre in vaje" v PDF |

