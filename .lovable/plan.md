

## Dodajanje novih sprejetih variant besed v preverjanju izgovorjave

### Spremembe

**Datoteka: `src/data/articulationTestData.ts`**

Dodati nove variante k obstojecim `acceptedVariants` poljem za 21 besed:

| Beseda | Nove variante za dodati |
|---|---|
| BOBER (vrstica 30) | BOBEJ, POPEL, POPEJ, BOPEJ, BOPEL |
| CEDILO (vrstica 54) | CEDIJO, SEDIJO |
| COPIC (vrstica 166) | TOPIT, COPIC |
| DEZNIK (vrstica 52) | TEZNIK, DEZNIT, DEZNIT, TEZNIT, TESNIT, TESNIK |
| DREVO (vrstica 93) | DJEVO, TJEVO, TLEVO |
| FANT (vrstica 108) | VANT (ze obstaja) |
| KOZA (vrstica 134) | TOSA, OZA, OSA |
| LADJA (vrstica 53) | JADJA, LATJA, JATJA, ADJA |
| LOS (vrstica 126) | JOS (nova) |
| LUZA (vrstica 158) | LUTA, LUSA, JUZA, JUSA, JUSA |
| NOC (vrstica 76) | NOT, OC, OS |
| OMARA (vrstica 173) | OMAJA, MAJA, MALA |
| OPICA (vrstica 21) | (OPICA in OPISA ze obstajata) |
| PISKOT (vrstica 149) | KOT |
| RACA (vrstica 141) | JASA, RACA |
| RIBA (vrstica 172) | IPA |
| SOVA (vrstica 94) | OVA |
| SOTOR (vrstica 148) | SOTOJ, SOTOL |
| ZMAJ (vrstica 132) | TMAJ |
| ZABA (vrstica 156) | SAPA, ZAPA, ZAVA |
| ZAGA (vrstica 70) | ZADA, SADA, SAGA, SADA |

Pri vsakem vnosu se nove variante samo dodajo na konec obstojecega arraya. Duplikati (variante, ki ze obstajajo) se preskocijo.

### Podrobnosti

- FANT: "VANT" ze obstaja, ni spremembe
- OPICA: "OPICA" in "OPISA" ze obstajata; dodamo samo tiste, ki manjkajo
- Posebne crke (C, S, Z) so pravilno upostevane kot variante brez stresic
- Skupno se doda priblizno 60 novih variant

