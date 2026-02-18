

## Popravek zvočnih posnetkov za tretjo besedo v igri Ponovi Poved

### Problem

V igri "Ponovi Poved" tretja beseda v vsaki povedi uporablja drug sklon (npr. "raka" namesto "rak", "repo" namesto "repa"). Trenutno nekateri zvočni posnetki za tretjo besedo kažejo na osnovni sklon namesto na pravilni.

### Spremembe

**Datoteka:** `src/data/ponoviPovedConfig.ts`

Samo zvočni posnetki (`audio` polje) pri tretji besedi se spremenijo. Nobene druge spremembe (slike, besedila, drugi zvoki) se ne izvajajo.

| Črka | Poved | Trenutni audio | Pravilni audio |
|------|-------|---------------|----------------|
| R | Riba vidi **raka** | rak.m4a | raka.m4a |
| R | Raca je **repo** | repa.m4a | repo.m4a |
| R | Ris riše **rožo** | roza.m4a | rozo.m4a |
| R | Robot ima **rolko** | rolka.m4a | rolko.m4a |
| Z | Zebra vidi **zvezdo** | zvezda.m4a | zvezdo.m4a |
| Š | Štorklja je **školjko** | skoljka.m4a | skoljko.m4a |
| Ž | Žaba želi **žago** | zaga.m4a | zago.m4a |
| Ž | Želva nese **žogo** | zoga.m4a | zogo.m4a |
| Ž | Žolna ima **žlico** | zlica.m4a | zlico.m4a |
| Č | Čebela vidi **čebulo** | cebula.m4a | cebulo.m4a |
| Č | Kača je **čokolado** | cokolada.m4a | cokolado.m4a |

### Brez sprememb (že pravilno)

Črke K, L, S in delno C imajo že pravilne zvočne posnetke za tretjo besedo:
- K: kapo.m4a, kost.m4a, krog.m4a, koruzo.m4a
- L: list.m4a, led.m4a, letalo.m4a, liziko.m4a
- S: sir.m4a, sladoled.m4a, sneg.m4a, sok.m4a
- C: cekin.m4a, cvet.m4a, copat.m4a, cirkus.m4a
- Š: sopek.m4a, sal.m4a, sotor.m4a (pravilni)
- Z: zob.m4a, zlato.m4a, grozdje.m4a (pravilni)
- Ž: zerjav.m4a (pravilno)
- Č: coln.m4a, copic.m4a (pravilna)

### Tehnični detajli

Vseh 11 sprememb je v eni datoteki (`src/data/ponoviPovedConfig.ts`), samo zamenjava vrednosti `audio` polja pri tretji besedi v posamezni povedi. Vrstice: 129, 138, 147, 156, 235, 314, 349, 358, 376, 411, 420.
