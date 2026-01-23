

# Načrt: Popravek manjkajoče seje za Žaka

## Problem

Test za otroka **Žaka** (uporabnik kujavec.robert@gmail.com) je bil opravljen **pred** posodobitvijo kode, zato seja ni bila ustvarjena v tabeli `articulation_test_sessions`. Posledično se test ne prikaže v admin portalu pod "V čakanju".

## Rešitev

### 1. Ročno ustvarjanje manjkajoče seje

Izvedli bomo SQL INSERT, ki bo ustvaril manjkajočo sejo za Žaka:

```sql
INSERT INTO articulation_test_sessions (
  child_id,
  parent_id,
  status,
  submitted_at
) VALUES (
  '0e054bde-ab83-4728-b55d-e02134e6d35b',  -- Žak
  '1a8e5513-a13f-4a8f-b34a-f48ed4992825',  -- kujavec.robert@gmail.com
  'pending',
  '2026-01-23T14:00:45.577Z'  -- Čas originalnega testa
);
```

Ta seja bo takoj vidna v zavihku "V čakanju" za logopede.

### 2. Preverjanje delovanja za nove teste

Po ustvarjanju seje predlagam, da opravite **nov test** za drugega otroka ali uporabnika, da preverimo, ali nova koda pravilno ustvarja seje.

---

## Tehnične podrobnosti

### Podatki za insert

| Polje | Vrednost | Opis |
|-------|----------|------|
| child_id | `0e054bde-ab83-4728-b55d-e02134e6d35b` | ID otroka Žak |
| parent_id | `1a8e5513-a13f-4a8f-b34a-f48ed4992825` | ID starša (kujavec.robert@gmail.com) |
| status | `pending` | Čaka na obravnavo |
| submitted_at | `2026-01-23T14:00:45.577Z` | Čas izvedbe originalnega testa |

### Rezultat

Po izvedbi bo:
- Žak viden v zavihku **"V čakanju"** (`/admin/pending`)
- Logoped bo lahko kliknil **"Prevzemi"** za prevzem primera
- Po prevzemu bo primer viden v **"Moji pregledi"** (`/admin/my-reviews`)

