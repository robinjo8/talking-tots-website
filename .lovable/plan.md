

# Načrt: Izboljšave pregleda sej in prikaz ocen na strani uporabnika

## Povzetek ugotovitev in predlaganih sprememb

### 1. Popravek sporočila na strani /admin/tests/:sessionId

**Trenutno stanje:**
```
Ta pregled je zaključen. Za urejanje uporabite gumb "Popravi".
```

**Novo sporočilo:** Vključevalo bo:
- Datum zaključka (iz `session.completed_at` ali iz statusa)
- Ime logopeda (iz `assigned_to` → `logopedist_profiles`)
- Organizacijo logopeda

Primer: *"Ta pregled je bil zaključen 25. 1. 2026 s strani logopeda Robert Kujavec (TomiTalk logoped). Za urejanje uporabite gumb "Popravi"."*

---

### 2. Gumb "Popravi" na strani /admin/tests/:sessionId

Gumb bo dodan levo od "Shrani vse ocene" v glavi pregleda.

**Obnašanje glede na vlogo:**

| Scenarij | Rezultat |
|----------|----------|
| Logoped, ki je dodeljen temu pregledu | Lahko ureja vse ocene |
| Logoped iz **iste organizacije**, ki NI dodeljen | Lahko "prevzame" primer in nato ureja |
| Logoped iz **druge organizacije** | Ne vidi tega pregleda (RLS ga blokira) |

**Predlog: Funkcija "Prevzemi primer"**

Ko logoped iz iste organizacije klikne "Popravi" na primeru, ki mu ni dodeljen:
1. Prikaže se potrditveno okno: *"Ta primer je trenutno dodeljen logopedu [Ime]. Ali želite prevzeti ta primer?"*
2. Ob potrditvi se `assigned_to` posodobi na novega logopeda
3. Dodati bi morali polje `reassigned_at` in `reassigned_from` za sledenje

---

### 3. Zakaj podatki niso vidni na strani /admin/users/.../...

**Vzrok:** Stran `AdminUserDetail.tsx` trenutno **NE pridobiva ocen** iz tabele `articulation_evaluations`. Prikazuje samo surove posnetke iz Storage-a.

**Rešitev:** Razširiti stran, da:
1. Pridobi vse `articulation_test_sessions` za tega otroka
2. Za vsako sejo pridobi ocene iz `articulation_evaluations`
3. Prikaže povzetek ocen (izbrane možnosti, komentarje, ocene 1-5) poleg posnetkov

---

### 4. Logika statusa: "Zaključen pregled" vs "Končno poročilo"

**Trenutno stanje:**
- Status `completed` = logoped je poslušal posnetke in ocenil črke

**Predlog za nov status "Poročilo generirano":**

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DELOVNI TOK LOGOPEDA                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  pending → assigned → in_review → completed → report_generated              │
│     │         │           │           │              │                      │
│   Čaka    Dodeljen    Logoped     Pregled        Poročilo                   │
│           logopedu    pregleduje  posnetkov      generirano                 │
│                       posnetke    zaključen      in shranjeno               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Implementacija:**
- Dodati novo polje `report_generated_at` v tabelo `articulation_test_sessions`
- Ko logoped na strani `/admin/users/:parentId/:childId` generira PDF poročilo, se ta datum nastavi
- Status ostane `completed`, ampak `report_generated_at` pove, da je bil primer v celoti zaključen

---

### 5. Vidnost zavihka "Uporabniki" za vse logopede

**Trenutna logika (po RLS pravilih):**

| Tabela | Kdo vidi | Pogoj |
|--------|----------|-------|
| `articulation_test_sessions` | Interni logopedi | `is_internal_logopedist(auth.uid())` = vsi interni |
| `articulation_evaluations` | Samo dodeljeni logoped | `assigned_to = moj logopedist_profile.id` |

**Problem:** Vsi logopedi iz organizacije "internal" vidijo vse seje, ampak ocene lahko bere in ureja **samo dodeljeni logoped**.

**Predlog za ureditev:**

Možnost A: **Ocene vidijo vsi interni logopedi (read-only)**
- Posodobiti RLS politiko za `articulation_evaluations`:
  ```sql
  ... OR is_internal_logopedist(auth.uid())
  ```
- Urejanje ostane omejeno na dodeljenega logopeda

Možnost B: **Na strani uporabnika prikažemo ocene samo, če je primer dodeljen meni**
- Če nisem dodeljen, vidim uporabnika, ampak ocene so prazne
- To preprečuje zmedo, ampak omejuje preglednost

**Priporočilo:** Možnost A - transparentnost znotraj organizacije

---

## Tehnične spremembe

### Datoteke za posodobitev:

**1. `src/hooks/useSessionReview.ts`**
- Dodati query za logopeda in organizacijo dodeljenega logopeda
- Vrniti podatke o `completedAt`, `assignedLogopedistName`, `organizationName`

**2. `src/pages/admin/AdminSessionReview.tsx`**
- Posodobiti info sporočilo z datumom, logopedistom in organizacijo
- Dodati gumb "Popravi" v glavo (levo od "Shrani vse ocene")
- Dodati logiko za prevzem primera

**3. `src/pages/admin/AdminUserDetail.tsx`**
- Dodati pridobivanje ocen iz `articulation_evaluations` za vse seje otroka
- Prikazati povzetek ocen pod vsako sejo v sekciji "Preverjanje izgovorjave"

**4. Baza podatkov (opcijsko)**
- Dodati polji `report_generated_at`, `reassigned_at`, `reassigned_from` v `articulation_test_sessions`
- Posodobiti RLS za `articulation_evaluations`, da interni logopedi lahko berejo vse ocene

---

## Vizualni predogled sprememb

### Stran /admin/tests/:sessionId (zaključen pregled):

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⬅ Nazaj                                                                    │
│                                                                             │
│  PREGLED PREVERJANJA IZGOVORJAVE                                            │
│  Žak Kujavec • 5 let • Moški                                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ ℹ Ta pregled je bil zaključen 25. 1. 2026 s strani logopeda             ││
│  │   Robert Kujavec (TomiTalk logoped). Za urejanje uporabite gumb         ││
│  │   "Popravi".                                                            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌── Seja-1 (15. 1. 2026) ────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  [✏ Popravi]  [💾 Shrani vse ocene]  [✅ Zaključi pregled]              │ │
│  │                                                                        │ │
│  │  ▸ P - PURAN, ŠAPA,STOP                                               │ │
│  │  ▸ B - BANANA, NEBO, ROB                                               │ │
│  │  ...                                                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stran /admin/users/:parentId/:childId - sekcija "Preverjanje izgovorjave":

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎤 Preverjanje izgovorjave                                                 │
│  Posnetki artikulacijskega testa po sejah                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ▼ Seja-1 (20 posnetkov) - Zaključeno 25. 1. 2026                           │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │ 📊 POVZETEK OCEN:                                                   │  │
│    │                                                                     │  │
│    │ Ž: ⭐⭐⭐⭐⭐ (5/5) - "brez težav"                                     │  │
│    │    ☑ Odlično izgovarja                                              │  │
│    │                                                                     │  │
│    │ R: ⭐⭐⭐ (3/5) - "potrebuje več vaje"                                │  │
│    │    ☑ R izgovarja kot L                                              │  │
│    │    ☑ Delno pravilno                                                 │  │
│    │                                                                     │  │
│    │ ... (ostale črke z ocenami)                                         │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│    🔊 Posnetki:                                                             │
│    ├── Z-57-ZOGA-2026-01-15.webm  [▶ Predvajaj]                             │
│    ├── Z-58-ZEBRA-2026-01-15.webm [▶ Predvajaj]                             │
│    └── ...                                                                  │
│                                                                             │
│  ▸ Seja-2 (predvideno: 15. 4. 2026) - Ni posnetkov                          │
│  ▸ Seja-3 (predvideno: 15. 7. 2026) - Ni posnetkov                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Odgovori na vaša vprašanja

### 1. Kaj se zgodi, ko logoped, ki mu je dodeljen primer, klikne "Popravi"?
Preprosto preide v način urejanja (`?edit=true`) in lahko spreminja ocene.

### 2. Kaj se zgodi, ko logoped iz iste organizacije, ki MU NI dodeljen primer, klikne "Popravi"?
Po trenutni RLS politiki ta logoped **vidi sejo** (ker je internal), ampak **ne more brati/pisati ocen** (ker ni `assigned_to`). 

**Predlog:** Implementirati funkcijo "Prevzemi primer", ki:
- Prikaže opozorilo o prenosu
- Ob potrditvi posodobi `assigned_to` na novega logopeda
- Zabeleži prvotnega logopeda v `reassigned_from`

### 3. Zakaj podatki niso prikazani na strani uporabnika?
Ker stran trenutno ne pridobiva ocen iz baze - samo prikazuje surove posnetke iz Storage-a. To bomo popravili.

### 4. Kako ločiti "Zaključen pregled" od "Končno poročilo generirano"?
Z dodatnim poljem `report_generated_at`. Ko je to polje nastavljeno, pomeni, da je logoped na strani uporabnika generiral PDF poročilo.

### 5. Ali je logično, da vsi logopedi vidijo zavihek Uporabniki?
Da, če so iz iste organizacije (internal). Priporočam, da:
- Vsi interni logopedi **vidijo** vse uporabnike in ocene (read-only)
- **Urejajo** lahko samo tisti, ki jim je primer dodeljen
- Možnost "prevzema" primera omogoča fleksibilnost

