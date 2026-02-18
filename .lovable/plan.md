

## Popravek: Manjkajoča RLS politika za posodabljanje sej

### Ugotovljen korenski vzrok

Starši (uporabniki v uporabniškem portalu) **nimajo dovoljenja za posodabljanje** (`UPDATE`) svojih sej v tabeli `articulation_test_sessions`. Imajo samo dovoljenje za ustvarjanje (`INSERT`) in ogled (`SELECT`).

Ko uporabnik izgovori besedo in sistem poskusi posodobiti `current_word_index` v bazi, klic `updateProgress` **tiho odpove** (Supabase RLS ne vrne napake, samo ignorira operacijo). Zato:

- `current_word_index` ostane vedno 0
- Ob vrnitvi v test ni resume dialoga
- Test se vedno začne od začetka

To je verjetno posledica varnostnih popravkov ali sprememb RLS politik, ki so bile narejene v zadnjih dneh.

### Trenutne RLS politike za starše

| Operacija | Politika | Status |
|-----------|----------|--------|
| INSERT | "Parents can create sessions for their children" | Deluje |
| SELECT | "Parents can view their children's sessions" | Deluje |
| UPDATE | **Manjka!** | Ne deluje |
| DELETE | Ni potrebna | / |

### Popravek

Dodati je treba novo RLS politiko za UPDATE:

```sql
CREATE POLICY "Parents can update their children sessions"
  ON articulation_test_sessions
  FOR UPDATE
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());
```

Ta politika dovoljuje staršem posodabljanje samo svojih lastnih sej (kjer je `parent_id` enak prijavljenemu uporabniku). To je varno, ker:
- Starši ne morejo posodobiti tujih sej
- Politika je enakega vzorca kot obstoječa INSERT/SELECT politika

### Kaj se bo zgodilo po popravku

1. Uporabnik izgovori besedo PAJEK (index 0)
2. `updateProgress(1)` se uspešno shrani v bazo (`current_word_index = 1`)
3. Uporabnik zapusti test in se vrne
4. Sistem najde sejo z `current_word_index = 1`
5. Resume dialog se prikaže: "Zadnja izgovorjena beseda: PAJEK"
6. Uporabnik klikne "Nadaljuj" in test nadaljuje pri KAPA

### Spremembe

| Datoteka/Vir | Sprememba |
|--------------|-----------|
| Supabase RLS (SQL migracija) | Dodana UPDATE politika za starše |

Nobenih sprememb v kodi ni potrebnih -- vsa logika ze deluje pravilno, samo baza je blokirala posodobitve.
