

## Analiza in načrt: Linearna logika sklopov + avtogeneracija novih sklopov

### Trenutno stanje (problemi)

Trenutna koda ima **dva nasprotujoča si pravila**:

1. **`nextSetNumber`** preskoči samo `completed` in `active` sklope → potekli sklopi se **ponavljajo** (otrok ostane na sklopu 1)
2. **`hasCompletedSetToday`** preprečuje začetek novega sklopa, če je bil danes eden že zaključen

To je v nasprotju z željeno logiko: **vedno naprej**, ne glede na rezultat.

### Želena logika (linearna)

```text
Sklop 1: odpri → 24h → arhiviraj (ne glede na rezultat) → Sklop 2
Sklop 2: odpri → 24h → arhiviraj → Sklop 3
...
Sklop 30: odpri → avtomatsko generiraj nov plan (31-60)
```

Pravila:
- Po preteku 24h se sklop arhivira (status: `expired` ali `completed`)
- Naslednji sklop je **vedno** naslednja številka (ne ponovitev)
- **Ni omejitve 1 sklop/dan** — ko poteče eden, je takoj na voljo naslednji
- Ko se **začne** sklop 30, se sproži generacija novega plana (31-60)

### Potencialni problemi

1. **Zloraba**: Otrok odpre sklop, ne naredi nič, po 24h odpre naslednjega → gre skozi 30 sklopov v 30 dneh brez dela. **Rešitev**: To je sprejemljivo, ker logoped vidi v arhivu, kaj je bilo dejansko opravljeno (0 zvezdic).

2. **Avtogeneracija med igro**: Sklop 30 se začne in hkrati se generira nov plan → otrok mora počakati, da se plan raztegne. **Rešitev**: Generacija v ozadju, plan se raztegne (doda sete 31-60) brez prekinitve sklopa 30.

3. **Plan raztezanje vs. nov plan**: Namesto ustvarjanja novega plana je boljše **dodati 30 novih setov k obstoječemu planu** (mode `renewal` v edge funkciji), da se ohrani kontinuiran napredek in arhiv.

4. **Nove igre**: Edge funkcija `generate-monthly-plan` že dinamično izbira igre glede na glasove/pozicije. Če je dodana nova igra v sistem, jo bo samodejno vključila v naslednje sete.

### Spremembe

#### 1. `src/hooks/usePlanProgress.ts`

- **`nextSetNumber` logika premakni v ta hook** ali popravi v MojiIzzivi: preskoči **vse** sklope, ki imajo zapis (completed, expired, active) → naslednji je vedno `max(set_number) + 1`
- **Odstrani `hasCompletedSetToday`** — ni več omejitve 1/dan
- **`startSet`**: Odstrani logiko za restart expired setov — expired seti se ne ponavljajo

#### 2. `src/pages/MojiIzzivi.tsx`

- **`nextSetNumber`**: Spremeni na `max(all tracking set_numbers) + 1` ali `trackingEntries.length + 1` (če ni vrzeli)
- **Odstrani `todayAlreadyDone`** in blok "Danes si že opravil sklop" — to ne velja več
- **Sprožitev generacije pri sklopu 30**: Ko `nextSetNumber === 30` (ali zadnjem sklopu v planu) in se klikne "Odpri", sproži `generate-monthly-plan` v ozadju z `mode: "renewal"`
- Poenostavi prikaz: škatla → kartice → škatla → kartice (brez blokad)

#### 3. Edge funkcija `generate-monthly-plan`

- Preveriti, da `mode: "renewal"` pravilno doda 30 novih setov k obstoječemu planu
- Preveriti, da upošteva morebitne nove igre v sistemu

#### 4. `src/hooks/usePlanProgress.ts` — čiščenje

- Odstrani ali označi kot deprecated: `hasCompletedSetToday`
- Poenostavi `startSet` — samo insert, brez upsert logike za expired

### Datoteke za spremembo

- `src/pages/MojiIzzivi.tsx` — linearna logika, brez dnevne omejitve, trigger za auto-generacijo
- `src/hooks/usePlanProgress.ts` — poenostavitev startSet, odstranitev hasCompletedSetToday
- Morda `supabase/functions/generate-monthly-plan/index.ts` — preveriti renewal mode

### Povzetek

Ključna sprememba: **od "ponovi potekel sklop" na "vedno naprej"**. Otrok nikoli ne zaglavi na enem sklopu. Po 24h se arhivira in gre naprej. Ko doseže zadnji sklop, se avtomatsko generirajo novi.

