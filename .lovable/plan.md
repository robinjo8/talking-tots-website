

## Natančna analiza in plan popravka preverjanja izgovorjave

### Kaj je šlo narobe

Preverjanje izgovorjave ima **dva ločena buga**, ki skupaj povzročata obnašanje ki ga vidite.

---

### BUG 1: Edge funkcija `transcribe-articulation` crasha ob zagonu

**Lokacija:** `supabase/functions/transcribe-articulation/index.ts`, vrstica 59

**Vzrok:** Neveljavni regularni izraz `/[.,!?;:\\-'"]/g`. V Deno runtime-u se `\\-` znotraj oglatih oklepajev interpretira kot razpon znakov od `\` (ASCII 92) do `'` (ASCII 39). Ker je 92 vecje od 39, je to neveljaven razpon in Deno vrze napako `SyntaxError: Invalid regular expression` ob zagonu funkcije.

**Posledica:** Funkcija se sploh ne zazene (BootFailure). Ko posnamete besedo, se zvocni posnetek poslje na streznik, a streznik takoj odpove. Brez uspesne transkripcije se gumb ponastavi na "Izgovori besedo" brez kakrsnekoli povratne informacije.

**Logi streznika potrjujejo:**
```
worker boot error: Uncaught SyntaxError: Invalid regular expression:
/[.,!?;:\\-'"]/g: Range out of order in character class
```

**Popravek:** Premik pomicaja na konec character class-a:
```
Vrstica 59: .replace(/[.,!?;:'"\-]/g, '')
```

---

### BUG 2: Test se zacne pri KAPA (index 1) namesto PAJEK (index 0)

**Lokacija:** `src/hooks/useUserSessionManager.ts`, vrstice 76-86

**Vzrok:** Ko uporabnik prvic odpre test, se v bazi ustvari nova seja z `current_word_index = 0` in `is_completed = false`. Ker edge funkcija crasha (Bug 1), snemanje nikoli ne uspe in `current_word_index` ostane 0.

Ko uporabnik znova odpre test, `useUserSessionManager` najde to nedokoncano sejo in izracuna:
- `lastSpoken = current_word_index = 0`
- `startIndex = lastSpoken + 1 = 1` (beseda KAPA)

Problem je v formuli. Ko je `current_word_index = 0`, to pomeni "nobena beseda se ni bila uspesno izgovorjena", a formula vseeno nastavi `startIndex` na 1.

**Popravek:** Dodan pogoj: ce je `current_word_index = 0`, naj `startIndex` ostane 0.

```
Vrstice 76-86 v useUserSessionManager.ts:
const lastSpoken = existingSession.current_word_index ?? 0;
const info: SessionInfo = {
  sessionId: existingSession.id,
  sessionNumber: existingSession.session_number ?? 1,
  startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0,  // POPRAVEK
  lastSpokenIndex: lastSpoken,
  isResume: lastSpoken > 0,
  totalWords: existingSession.total_words ?? totalWords,
};
```

Isti popravek je potreben v `src/hooks/useLogopedistSessionManager.ts` (admin portal), vrstica ~78:
```
startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0,  // POPRAVEK
```

---

### Kaj nisem jaz pokvaril

Noben od mojih danasnjih sprememb (zamenjava "crka" z "glas") ni vplival na te datoteke. Edge funkcija ima ta regex bug ze od prej -- logi kazejo napako od 17. februarja, torej od danes. Mozno je da je bila funkcija pred kratkim na novo deployed in se je takrat pojavil ta bug v Deno runtime-u.

### Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `supabase/functions/transcribe-articulation/index.ts` | Vrstica 59: popravek regexa na `/[.,!?;:'"\-]/g` |
| `src/hooks/useUserSessionManager.ts` | Vrstica 80: `startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0` |
| `src/hooks/useLogopedistSessionManager.ts` | Vrstica ~78: `startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0` |

### Po popravku

Ko bosta oba buga popravljena:
1. Edge funkcija se bo pravilno zagnala in transkripcija bo delovala
2. Test se bo zacel pri PAJEK (index 0) kot je pravilno
3. Po uspesnem snemanju se bo prikazal gumb "Naprej" ali sporocilo o napacni besedi

