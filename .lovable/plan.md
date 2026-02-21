

## Ponastavitev preverjanja izgovorjave za kujavec.robert@gmail.com

### Kaj bomo izbrisali

Za otroka **Zak** (child_id: `20b69ea2-f58b-4ac5-8baf-d5c5fcefe3c8`) je treba ponastaviti vse podatke povezane s sejo `508fdcdd-1d1e-4478-bb1b-97a7cc6cb1f7`:

| Podatek | Stevilo zapisov |
|---------|----------------|
| articulation_word_results | 22 zapisov |
| articulation_evaluations | 1 zapis |
| notifications (za to sejo) | 1 zapis |
| articulation_test_sessions | 1 seja |
| Audio posnetki v Storage | mapa Seja-1 |

### Koraki izvedbe

**1. Brisanje word results** (22 zapisov)
```text
DELETE FROM articulation_word_results 
WHERE session_id = '508fdcdd-...'
```

**2. Brisanje evaluations** (1 zapis)
```text
DELETE FROM articulation_evaluations 
WHERE session_id = '508fdcdd-...'
```

**3. Brisanje notifications** (1 zapis)
```text
DELETE FROM notifications 
WHERE related_session_id = '508fdcdd-...'
```

**4. Brisanje seje** (1 zapis)
```text
DELETE FROM articulation_test_sessions 
WHERE id = '508fdcdd-...'
```

**5. Brisanje audio posnetkov iz Storage**
- Bucket: `uporabniski-profili`
- Pot: `629a649f-15fb-44f8-b6f1-6be93ceac221/20b69ea2-f58b-4ac5-8baf-d5c5fcefe3c8/Preverjanje-izgovorjave/Seja-1/`
- Vse datoteke v tej mapi bodo izbrisane

### Kaj to pomeni

- Ko se uporabnik naslednjic prijavi in zacne preverjanje, se ustvari nova seja od zacetka (beseda 0)
- Nobeden drug uporabnik ali otrok ni prizadet
- Na admin portalu ne bo vec vidne te seje
- Vse ostale funkcionalnosti ostanejo nespremenjene

### Tehnicni detajli

Brisanje se izvede z SQL ukazi prek insert orodja (za podatke) in s Supabase Storage API (za datoteke). Vrstni red brisanja je pomemben zaradi morebitnih odvisnosti med tabelami (najprej word_results in evaluations, nato seja).

