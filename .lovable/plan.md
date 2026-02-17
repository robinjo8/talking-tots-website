
# Popravek besed s šumniki v bazi podatkov

## Problem
Besede v pop-up oknih iger (Spomin, Zaporedja) se prikazujejo brez šumnikov, ker so v bazi podatkov shranjene napačno. Težava ni v kodi (ta pravilno prikazuje, kar dobi iz baze), ampak v samih podatkih.

## Prizadete tabele in besede

### 1. memory_cards_Š_duplicate (10 napak)
Vse besede razen ŠOFER so brez šumnikov:

| Trenutno v bazi | Pravilno |
|----------------|----------|
| sal | Šal |
| sah | Šah |
| scetka | Ščetka |
| skarje | Škarje |
| skatla | Škatla |
| skoljka | Školjka |
| sopek | Šopek |
| sotor | Šotor |
| stampiljka | Štampiljka |
| storklja | Štorklja |

### 2. memory_cards_S (2 napaki)

| Trenutno v bazi | Pravilno |
|----------------|----------|
| snezak | Snežak |
| svincnik | Svinčnik |

### 3. memory_cards_K (2 napaki)

| Trenutno v bazi | Pravilno |
|----------------|----------|
| kosara | Košara |
| kuza | Kuža |

### 4. memory_cards (tabela za R) (1 napaka)

| Trenutno v bazi | Pravilno |
|----------------|----------|
| roza | Roža |

## Resitev -- SQL posodobitve

Vseh 15 besed bo posodobljenih z enim SQL skriptom. Besede bodo zapisane tako, kot so na seznamu (z veliko zacetnico, ostalo male crke, npr. "Šal", "Snežak").

```sql
-- Tabela: memory_cards_Š_duplicate
UPDATE "memory_cards_Š_duplicate" SET word = 'Šal' WHERE word = 'sal';
UPDATE "memory_cards_Š_duplicate" SET word = 'Šah' WHERE word = 'sah';
UPDATE "memory_cards_Š_duplicate" SET word = 'Ščetka' WHERE word = 'scetka';
UPDATE "memory_cards_Š_duplicate" SET word = 'Škarje' WHERE word = 'skarje';
UPDATE "memory_cards_Š_duplicate" SET word = 'Škatla' WHERE word = 'skatla';
UPDATE "memory_cards_Š_duplicate" SET word = 'Školjka' WHERE word = 'skoljka';
UPDATE "memory_cards_Š_duplicate" SET word = 'Šopek' WHERE word = 'sopek';
UPDATE "memory_cards_Š_duplicate" SET word = 'Šotor' WHERE word = 'sotor';
UPDATE "memory_cards_Š_duplicate" SET word = 'Štampiljka' WHERE word = 'stampiljka';
UPDATE "memory_cards_Š_duplicate" SET word = 'Štorklja' WHERE word = 'storklja';

-- Tabela: memory_cards_S
UPDATE "memory_cards_S" SET word = 'Snežak' WHERE word = 'snezak';
UPDATE "memory_cards_S" SET word = 'Svinčnik' WHERE word = 'svincnik';

-- Tabela: memory_cards_K
UPDATE "memory_cards_K" SET word = 'Košara' WHERE word = 'kosara';
UPDATE "memory_cards_K" SET word = 'Kuža' WHERE word = 'kuza';

-- Tabela: memory_cards (R)
UPDATE "memory_cards" SET word = 'Roža' WHERE word = 'roza';
```

## Kaj ostane nespremenjeno
- **Koda**: Nobenih sprememb -- koda ze pravilno prikazuje besedo iz baze z .toUpperCase()
- **Slike in zvok**: Imena datotek v storage-u ostanejo enaka (brez sumnikov, kot je standard)
- **Tabele brez napak**: memory_cards_c, memory_cards_l, memory_cards_z, memory_cards_Č, memory_cards_Ž, memory_cards_r -- te ze imajo pravilne sumnike
