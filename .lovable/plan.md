

# Priročnik za Admin Portal TomiTalk - Celovita dokumentacija

## Pregled sistema

Admin portal TomiTalk je namenjen logopedom za upravljanje preverjanj izgovorjave, pregledovanje uporabnikov, pisanje poročil in spremljanje napredka otrok. Portal je dostopen na `/admin` in zahteva prijavo z logopedskim računom.

---

## STRUKTURA NAVIGACIJE

Portal ima tri glavne sekcije v stranskem meniju:

### Delovni prostor
1. **Moj portal** (`/admin`) - Nadzorna plošča
2. **Vsa preverjanja** (`/admin/all-tests`) - Seznam vseh preverjanj
3. **V čakanju** (`/admin/pending`) - Neprevzeti primeri (z oranžnim številom)
4. **Moji pregledi** (`/admin/my-reviews`) - Prevzeti primeri (z oranžnim številom)

### Upravljanje
5. **Uporabniki** (`/admin/users`) - Seznam vseh uporabnikov
6. **Poročila** (`/admin/reports`) - Arhiv generiranih poročil logopeda
7. **Sporočila** (`/admin/messages`) - (Še ni implementirano)

### Nastavitve
8. **Nastavitve** (`/admin/settings`) - (Še ni implementirano)
9. **Obvestila** (`/admin/notifications`) - (Še ni implementirano)
10. **Članstva** (`/admin/memberships`) - Samo za Super Admina

---

## PODROBNA DOKUMENTACIJA PO STRANEH

---

### 1. MOJ PORTAL (Nadzorna plošča)
**URL:** `/admin` ali `/admin/dashboard`

#### Kaj se vidi:
- **Pozdravno sporočilo** z imenom in priimkom logopeda
- **4 statistične kartice:**
  - "Vsa preverjanja" - skupno število vseh opravljenih preverjanj
  - "V čakanju na pregled" - število nepregledanih preverjanj
  - "Moji pregledi" - število preverjanj v obravnavi tega logopeda
  - "Zaključeni pregledi" - število preverjanj z oddanim poročilom
- **2 grafa:**
  - Črtni graf preverjanj skozi čas
  - Tortni diagram težav

#### Kaj lahko logoped počne:
- Klikne na katero koli statistično kartico za navigacijo na ustrezno stran
- Pregled splošne statistike sistema

#### Povezava z uporabniškim portalom:
- Podatki se črpajo iz tabele `articulation_test_sessions` v bazi
- Ko uporabnik odda preverjanje na uporabniškem portalu, se števec "V čakanju" poveča

---

### 2. VSA PREVERJANJA
**URL:** `/admin/all-tests`

#### Kaj se vidi:
- **4 statistične kartice:** Vsa preverjanja, V čakanju, V obdelavi, Zaključeni
- **Iskalno polje** za iskanje po imenu starša ali otroka
- **Tabela z vsemi preverjanji:**
  - Ime in priimek starša
  - Ime otroka
  - Starost otroka
  - Spol otroka
  - Status (V čakanju / V obdelavi / Zaključeno)
  - Datum oddaje
  - Akcijski gumbi

#### Kaj lahko logoped počne:
- **Išči** po imenu starša ali otroka
- **Ogled** (`Eye` ikona) - odpre podrobnosti preverjanja
- **Popravi** (`Pencil` ikona) - pojavi se samo pri zaključenih preverjanjih, omogoča urejanje

#### Statusi preverjanj:
| Status | Značka | Opis |
|--------|--------|------|
| `pending` | "V čakanju" (oranžna) | Novo preverjanje, še ni prevzeto |
| `assigned` / `in_review` | "V obdelavi" (modra) | Logoped je prevzel primer |
| `completed` | "Zaključeno" (zelena) | Pregled končan, poročilo oddano |

---

### 3. V ČAKANJU
**URL:** `/admin/pending`

#### Kaj se vidi:
- **Statistična kartica** s številom neprevzetih primerov
- **Tabela/kartice čakajočih preverjanj:**
  - Ime starša
  - Ime otroka
  - Starost
  - Spol
  - Datum oddaje
  - Gumb "Prevzemi"

#### Kaj lahko logoped počne:
- **Prevzemi primer** - Klik na "Prevzemi" odpre potrditveno okno. Po potrditvi:
  1. Status seje se spremeni v `assigned`
  2. Polje `assigned_to` se nastavi na ID logopeda
  3. Primer se premakne v "Moji pregledi"
  4. Uporabnik je preusmerjen na `/admin/my-reviews`

#### Povezava z uporabniškim portalom:
- Ko starš odda preverjanje izgovorjave na uporabniškem portalu, se seja pojavi tukaj s statusom `pending`

---

### 4. MOJI PREGLEDI
**URL:** `/admin/my-reviews`

#### Kaj se vidi:
- **Statistična kartica** s številom aktivnih pregledov
- **Tabela/kartice prevzetih preverjanj:**
  - Ime starša
  - Ime otroka
  - Starost, Spol
  - Status (V pregledu / Zaključen)
  - Datum prevzema
  - Akcijski gumbi

#### Kaj lahko logoped počne:
- **Ogled** - Odpre stran za pregled seje (`/admin/tests/:sessionId`)
- **Popravi** - Pojavi se samo pri zaključenih preverjanjih, odpre stran z možnostjo urejanja (`?edit=true`)

#### Prazen seznam:
- Če logoped nima aktivnih pregledov, se prikaže sporočilo z gumbom "Pojdi na V čakanju"

---

### 5. PREGLED PREVERJANJA IZGOVORJAVE
**URL:** `/admin/tests/:sessionId`

To je ključna stran za delo logopeda.

#### Kaj se vidi:
- **Header:**
  - Naslov: "Pregled preverjanja izgovorjave"
  - Podatki o otroku: Ime (Spol) • Starost let

- **5 zložljivih sekcij (Seja-1 do Seja-5):**
  - **Seja-1:** Prikaže dejanski datum oddaje in dejanske posnetke
  - **Seja-2:** Predvideni datum (+3 mesece od Seja-1)
  - **Seja-3:** Predvideni datum (+6 mesecev od Seja-1)
  - **Seja-4:** Predvideni datum (+9 mesecev od Seja-1)
  - **Seja-5:** Predvideni datum (1 teden pred koncem enega leta)

- **Znotraj vsake seje (ko ima podatke):**
  - 20 črk v fonetičnem vrstnem redu: P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R
  - Vsaka črka je zložljiva in vsebuje:
    - Audio posnetke besed (3 besede na črko = 60 besed skupaj)
    - Audio predvajalnik z napredkom in glasnostjo
    - Diagnostične checkboxe za oceno izgovorjave
    - Polje za komentar
    - Gumb "Shrani" za shranjevanje ocene te črke

- **Akcijski gumbi na dnu:**
  - "Zaključi pregled" - Shrani vse ocene in spremeni status v `completed`

#### Kaj lahko logoped počne:
1. **Predvaja posnetke** - vsaka beseda ima svoj audio predvajalnik
2. **Označi diagnoze** - checkboxi za vrsto govorne napake
3. **Piše komentarje** - prosto besedilo za vsako črko
4. **Shrani posamezne ocene** - gumb "Shrani" znotraj vsake črke
5. **Zaključi pregled** - spremeni status v zaključeno

#### Varnostni mehanizmi:
- **Opozorilo ob neshranjenih spremembah:** Če logoped poskuša zapustiti stran z neshranjeni podatki, se pojavi opozorilo brskalnika
- **Način samo za branje:** Zaključena preverjanja so v načinu samo za branje, razen če je dodan `?edit=true`

#### Kam se shranjujejo ocene:
- V tabelo `articulation_evaluations` v bazi podatkov
- Vsaka vrstica vsebuje: `session_id`, `letter`, `selected_options`, `comment`

---

### 6. UPORABNIKI
**URL:** `/admin/users`

#### Kaj se vidi:
- **3 statistične kartice:**
  - Skupaj uporabnikov
  - Uporabniki z otroki
  - Skupaj otrok
- **Iskalno polje** za iskanje po emailu, imenu starša ali otroka
- **Tabela uporabnikov:**
  - Ime in priimek starša
  - Elektronski naslov
  - Ime otroka
  - Starost
  - Spol
  - Status
  - Akcijski gumbi

#### Kaj lahko logoped počne:
- **Išči** po uporabnikih
- **Ogled** (`Eye` ikona) - odpre podrobnosti uporabnika

#### Kaj lahko Super Admin počne dodatno:
- **Izbriši** uporabnika - arhivira uporabnika za 90 dni (soft delete)

---

### 7. PODROBNOSTI UPORABNIKA
**URL:** `/admin/users/:parentId/:childId`

To je osrednja stran za delo z uporabnikom in pisanje poročil.

#### Kaj se vidi:
**Razdelitev na dva stolpca:**

**LEVI STOLPEC:**

1. **Dokumenti:**
   - Seznam vseh naloženih dokumentov starša
   - Avtomatsko generirani dokumenti ob registraciji:
     - `opis-govornih-tezav-{timestamp}.txt` - opis govornih težav
     - `{childId}-osnovni-vprasalnik.txt` - odgovori na vprašalnik
   - Ročno naloženi dokumenti (PDF, TXT)
   - Gumbi: Predogled, Prenos

2. **Preverjanje izgovorjave:**
   - Accordion s sejami (Seja-1, Seja-2, itd.)
   - Znotraj vsake seje so audio posnetki
   - Gumbi: Predvajaj

**DESNI STOLPEC:**

3. **Poročila:**
   - **Predloga poročila** z razdelki:
     - Podatki o staršu (ime, email) - samodejno izpolnjeno
     - Podatki o otroku (ime, starost, spol) - samodejno izpolnjeno
     - Izbira seje (dropdown)
     - Datum pregleda
     - **Vnosna polja:**
       - ANAMNEZA
       - UGOTOVITVE
       - PREDLOG ZA VAJE
       - OPOMBE
     - Ime logopeda - samodejno izpolnjeno
   
   - **Akcijski gumbi:**
     - "Shrani" - shrani kot .txt datoteko v Storage
     - "Naloži dokument" - naloži obstoječ dokument
     - "Generiraj" - generira PDF poročilo
   
   - **Shranjena poročila:** Seznam osnutkov (.txt)
   - **Generirana poročila:** Seznam PDF-jev z možnostjo:
     - Odpri, Prenesi, Izbriši

#### Kaj lahko logoped počne:
1. **Pregleda vse dokumente** o otroku
2. **Posluša posnetke** preverjanja izgovorjave
3. **Piše poročilo** z uporabo strukturirane predloge
4. **Shrani osnutek** poročila kot .txt
5. **Generira PDF** poročilo
6. **Naloži obstoječe** dokumente
7. **Ureja** shranjena poročila
8. **Izbriše** generirana poročila

#### Kam se shranjujejo dokumenti:
Supabase Storage bucket: `uporabniski-profili`
```text
{parentId}/{childId}/
├── Dokumenti/           <- Dokumenti starša in avtomatski
├── Preverjanje-izgovorjave/
│   ├── Seja-1/          <- Audio posnetki
│   └── Seja-2/
├── Porocila/            <- Shranjeni osnutki (.txt)
└── Generirana-porocila/ <- PDF poročila
```

---

### 8. POROČILA (Arhiv logopeda)
**URL:** `/admin/reports`

#### Kaj se vidi:
- **3 statistične kartice:**
  - Skupaj poročil
  - Oddana poročila
  - Ta mesec (nova poročila)
- **Iskalno polje** za iskanje po imenu otroka, starša ali povzetku
- **Tabela poročil:**
  - Ime otroka
  - Ime starša
  - Povzetek
  - Status (Osnutek / Revidirano / Oddano)
  - Datum ustvaritve
  - Akcijski gumbi

#### Kaj lahko logoped počne:
- **Odpri PDF** - odpre v novem zavihku
- **Prenesi PDF** - prenese na računalnik
- **Izbriši poročilo** - s potrditvenim dialogom

#### Pomembno:
- **Vsak logoped vidi samo svoja poročila** (RLS politika)
- Poročila se shranjujejo v tabelo `logopedist_reports`
- PDF datoteke so v Storage bucket `uporabniski-profili`

---

### 9. ČLANSTVA (Samo Super Admin)
**URL:** `/admin/memberships`

Ta stran je vidna samo Super Adminu (robert.kujavec@gmail.com).

#### Kaj se vidi:
- **Zahtevki za nova članstva:**
  - Seznam neodobrenih logopedov
  - Za vsakega: Ime, Email, Organizacija, Datum registracije
  - Gumba: "Odobri" (zeleno), "Zavrni" (rdeče)

- **Aktivni člani:**
  - Seznam vseh odobrenih logopedov
  - Za vsakega: Ime, Email, Organizacija, Status "Aktiven"

#### Kaj lahko Super Admin počne:
1. **Odobri članstvo:**
   - Potrdi email logopeda (preko Edge funkcije `confirm-logopedist-email`)
   - Nastavi `is_verified = true` v `logopedist_profiles`
   - Logoped se lahko zdaj prijavi

2. **Zavrne članstvo:**
   - Izbriše uporabnika iz `auth.users`
   - Izbriše profil iz `logopedist_profiles` (CASCADE DELETE)
   - Logoped ne more več dostopati do portala

---

## POVEZAVE MED UPORABNIŠKIM IN ADMIN PORTALOM

### 1. Registracija uporabnika → Dokumenti na admin portalu

```text
UPORABNIŠKI PORTAL                          ADMIN PORTAL
─────────────────                          ─────────────
Starš registrira otroka                    
     ↓                                     
Izpolni vprašalnik                         
     ↓                                     
Vpiše opis govornih težav                  
     ↓                                     
[AddChildForm.tsx]                         
     ↓                                     
Generira .txt datoteke:                    
• opis-govornih-tezav-{timestamp}.txt     →  Vidno v Dokumenti
• {childId}-osnovni-vprasalnik.txt        →  Vidno v Dokumenti
     ↓                                     
Shranjeno v Storage:                       
uporabniski-profili/{userId}/{childId}/Dokumenti/
```

### 2. Preverjanje izgovorjave → Pregled na admin portalu

```text
UPORABNIŠKI PORTAL                          ADMIN PORTAL
─────────────────                          ─────────────
Starš začne preverjanje                    
     ↓                                     
Otrok izgovarja 60 besed                   
     ↓                                     
Vsaka beseda se posname                    
     ↓                                     
Posnetki se shranjujejo v:                 
uporabniski-profili/{userId}/{childId}/    
  Preverjanje-izgovorjave/Seja-1/          
     ↓                                     
Starš oddaj preverjanje                    
     ↓                                     
Ustvari se zapis v:                        
articulation_test_sessions                  
(status: pending)                          
     ↓                                     
                                           Logoped vidi v "V čakanju"
                                                ↓
                                           Prevzame primer
                                                ↓
                                           Status: assigned
                                                ↓
                                           Posluša posnetke v:
                                           /admin/tests/:sessionId
                                                ↓
                                           Označi diagnoze
                                                ↓
                                           Shranjeno v:
                                           articulation_evaluations
                                                ↓
                                           Zaključi pregled
                                                ↓
                                           Status: completed
```

### 3. Poročilo → Dostop staršu

```text
ADMIN PORTAL                               UPORABNIŠKI PORTAL
────────────                               ─────────────────
Logoped odpre:                             
/admin/users/:parentId/:childId            
     ↓                                     
Piše poročilo v predlogi                   
     ↓                                     
Klikne "Generiraj"                         
     ↓                                     
PDF se shrani v:                           
uporabniski-profili/{parentId}/{childId}/  
  Generirana-porocila/                     
     ↓                                     
Metapodatki v tabelo:                      
logopedist_reports                         
     ↓                                     
                                           Starš dostopa do poročila
                                           (prihodnja funkcionalnost)
```

---

## STRUKTURA PODATKOV V BAZI

### Glavne tabele:

| Tabela | Namen |
|--------|-------|
| `profiles` | Uporabniški profili (starši) |
| `children` | Otroci staršev |
| `child_documents` | Metapodatki dokumentov otrok |
| `articulation_test_sessions` | Seje preverjanja izgovorjave |
| `articulation_evaluations` | Ocene logogedov za vsako črko |
| `logopedist_profiles` | Profili logopedov |
| `logopedist_reports` | Metapodatki poročil logopedov |
| `organizations` | Organizacije logopedov |
| `admin_permissions` | Super admin pravice |

### Supabase Storage bucket:

**`uporabniski-profili`:**
```text
{parentId}/
└── {childId}/
    ├── Dokumenti/
    │   ├── opis-govornih-tezav-{timestamp}.txt
    │   ├── {childId}-osnovni-vprasalnik.txt
    │   └── ... (naloženi PDF-ji)
    ├── Preverjanje-izgovorjave/
    │   ├── Seja-1/
    │   │   ├── P-01-PERO-2026-01-15T10-30-00.webm
    │   │   ├── P-02-KAPA-2026-01-15T10-30-15.webm
    │   │   └── ... (60 posnetkov)
    │   └── Seja-2/
    ├── Porocila/
    │   └── porocilo-2026-01-15.txt
    └── Generirana-porocila/
        └── porocilo-Zak-2026-01-15T12-00-00.pdf
```

---

## FONETIČNI VRSTNI RED ČRK

Pri preverjanju izgovorjave se uporablja natančno določen fonetični vrstni red:

**P → B → M → T → D → K → G → N → H → V → J → F → L → S → Z → C → Š → Ž → Č → R**

Za vsako črko so 3 besede, skupaj 60 besed.

---

## STATUSI PREVERJANJ

| Status | Opis | Kdo vidi |
|--------|------|----------|
| `pending` | Novo, čaka na prevzem | Vsi logopedi v "V čakanju" |
| `assigned` | Logoped prevzel | Samo dodeljen logoped v "Moji pregledi" |
| `in_review` | V pregledu | Samo dodeljen logoped |
| `completed` | Zaključeno | Vsi logopedi, z možnostjo "Popravi" |

---

## VARNOSTNI VIDIKI

1. **Avtentikacija:** Vse strani zahtevajo prijavo z logopedskim računom
2. **Odobritev:** Novi logopedi morajo biti odobreni s strani Super Admina
3. **RLS politike:** Poročila so vidna samo logopedu, ki jih je ustvaril
4. **Soft delete:** Izbrisani uporabniki so arhivirani za 90 dni
5. **Opozorila:** Pri neshranjenih spremembah uporabnik dobi opozorilo

---

## OPOMBE ZA LOGOPEDE

1. **Vedno prevzemite primer** preden začnete s pregledom
2. **Shranjujte sproti** - uporabljajte gumb "Shrani" pri vsaki črki
3. **Ne zapirajte brskalnika** z neshranjeni podatki - pojavilo se bo opozorilo
4. **Po zaključku** lahko še vedno popravite oceno z gumbom "Popravi"
5. **Generirana poročila** so shranjena tako v uporabnikovi mapi kot v vašem arhivu

