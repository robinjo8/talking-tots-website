
# Načrt: Dodajanje konfiguracij za igro "Ponovi poved" za vse črke

## Pregled

Igra "Ponovi poved" trenutno deluje samo za črko K. Potrebno je dodati konfiguracije za 8 dodatnih črk: **L, R, S, Z, C, Š, Ž, Č**.

Za vsako črko so potrebne 4 povedi s po 3 besedami. Vsaka beseda potrebuje:
- Besedilo za prikaz
- Sliko iz bucketa `slike`
- Zvočni posnetek iz bucketa `zvocni-posnetki`

---

## Preslikava besed na obstoječe slike

Na podlagi analize obstoječih podatkov in bucket `slike` so identificirane naslednje slike:

### GLAS L
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Lisica je list. | Lisica | lisica1.webp | je | Stickman_jesti.webp | list | list1.webp |
| Lev nese led. | Lev | lev1.webp | nese | Stickman_nesti.webp | led | led1.webp |
| Lovec vidi letalo. | Lovec | lovec1.webp | vidi | Stickman_gledati.webp | letalo | letalo1.webp |
| Slon ima liziko. | Slon | slon1.webp | ima | Stickman_imeti.webp | liziko | lizika1.webp |

### GLAS R
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Riba vidi raka. | Riba | riba1.webp | vidi | Stickman_gledati.webp | raka | rak1.webp |
| Raca je repo. | Raca | raca1.webp | je | Stickman_jesti.webp | repo | repa1.webp |
| Ris riše rožo. | Ris | ris1.webp | riše | Stickman_risati.webp | rožo | roza1.webp |
| Robot ima rolko. | Robot | robot1.webp | ima | Stickman_imeti.webp | rolko | rolka1.webp |

### GLAS S
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Sova nese sir. | Sova | sova1.webp | nese | Stickman_nesti.webp | sir | sir1.webp |
| Slon je sladoled. | Slon | slon1.webp | je | Stickman_jesti.webp | sladoled | sladoled1.webp |
| Snežak vidi sneg. | Snežak | snezak1.webp | vidi | Stickman_gledati.webp | sneg | sneg1.webp |
| Osa ima sok. | Osa | osa1.webp | ima | Stickman_imeti.webp | sok | sok1.webp |

### GLAS Z
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Zajec ima zob. | Zajec | zajec1.webp | ima | Stickman_imeti.webp | zob | zob1.webp |
| Zmaj nese zlato. | Zmaj | zmaj1.webp | nese | Stickman_nesti.webp | zlato | zlato1.webp |
| Zebra vidi zvezdo. | Zebra | zebra1.webp | vidi | Stickman_gledati.webp | zvezdo | zvezda1.webp |
| Meduza je grozdje. | Meduza | meduza1.webp | je | Stickman_jesti.webp | grozdje | grozdje1.webp |

### GLAS C
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Raca nese cekin. | Raca | raca1.webp | nese | Stickman_nesti.webp | cekin | cekin1.webp |
| Muca je cvet. | Muca | muca1.webp | je | Stickman_jesti.webp | cvet | cvet1.webp |
| Lovec ima copat. | Lovec | lovec1.webp | ima | Stickman_imeti.webp | copat | copat1.webp |
| Opica vidi cirkus. | Opica | opica1.webp | vidi | Stickman_gledati.webp | cirkus | cirkus1.webp |

### GLAS Š
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Šofer nese šopek. | Šofer | sofer1.webp | nese | Stickman_nesti.webp | šopek | sopek1.webp |
| Štorklja je školjko. | Štorklja | storklja1.webp | je | Stickman_jesti.webp | školjko | skoljka1.webp |
| Kokoš ima šal. | Kokoš | kokos1.webp | ima | Stickman_imeti.webp | šal | sal1.webp |
| Miš vidi šotor. | Miš | mis1.webp | vidi | Stickman_gledati.webp | šotor | sotor1.webp |

### GLAS Ž
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Žaba želi žago. | Žaba | zaba1.webp | želi | Stickman_zeleti.png.webp | žago | zaga1.webp |
| Želva nese žogo. | Želva | zelva1.webp | nese | Stickman_nesti.webp | žogo | zoga1.webp |
| Žirafa vidi žerjav. | Žirafa | zirafa1.webp | vidi | Stickman_gledati.webp | žerjav | zerjav1.webp |
| Žolna ima žlico. | Žolna | zolna1.webp | ima | Stickman_imeti.webp | žlico | zlica1.webp |

### GLAS Č
| Poved | Beseda 1 | Slika | Beseda 2 | Slika | Beseda 3 | Slika |
|-------|----------|-------|----------|-------|----------|-------|
| Čarovnik ima čoln. | Čarovnik | carovnik1.webp | ima | Stickman_imeti.webp | čoln | coln1.webp |
| Čarovnik nese čopič. | Čarovnik | carovnik1.webp | nese | Stickman_nesti.webp | čopič | copic1.webp |
| Čebela vidi čebulo. | Čebela | cebela1.webp | vidi | Stickman_gledati.webp | čebulo | cebula1.webp |
| Kača je čokolado. | Kača | kaca1.webp | je | Stickman_jesti.webp | čokolado | cokolada1.webp |

**Opomba**: Beseda "čuvaj" ne obstaja med slikami, zato sem jo zamenjal s "čarovnik" (carovnik1.webp).

---

## Tehnična implementacija

### Datoteka za posodobitev
`src/data/ponoviPovedConfig.ts`

### Spremembe

1. **Dodaj 8 novih konfiguracij** po vzoru obstoječe `ponoviPovedK`:
   - `ponoviPovedL` (črka L, URL ključ: `l`)
   - `ponoviPovedR` (črka R, URL ključ: `r`)
   - `ponoviPovedS` (črka S, URL ključ: `s`)
   - `ponoviPovedZ` (črka Z, URL ključ: `z`)
   - `ponoviPovedC` (črka C, URL ključ: `c`)
   - `ponoviPovedSH` (črka Š, URL ključ: `sh`)
   - `ponoviPovedZH` (črka Ž, URL ključ: `zh`)
   - `ponoviPovedCH` (črka Č, URL ključ: `ch`)

2. **Posodobi `configMap`** z novimi konfiguracijami:
```text
const configMap: Record<string, PonoviPovedConfig> = {
  k: ponoviPovedK,
  l: ponoviPovedL,
  r: ponoviPovedR,
  s: ponoviPovedS,
  z: ponoviPovedZ,
  c: ponoviPovedC,
  sh: ponoviPovedSH,
  zh: ponoviPovedZH,
  ch: ponoviPovedCH,
};
```

### Format zvočnih posnetkov

Za vsako besedo bo zvočni posnetek sledil vzorcu:
- Osnovne besede: `beseda.m4a` (npr. `lisica.m4a`, `lev.m4a`)
- Sklanjane besede: `beseda.m4a` z osnovno obliko (npr. `liziko` → `lizika.m4a`)
- Glagoli: obstoječi Stickman posnetki (`je.m4a`, `vidi.m4a`, `ima.m4a`, `rise.m4a`, `nese.m4a`, `zeli.m4a`)
- Celotne povedi: `beseda1_beseda2_beseda3.m4a` (npr. `lisica_je_list.m4a`)

---

## Navigacija

Po implementaciji bodo vse kartice na strani `/govorne-igre/ponovi-poved` aktivne in bodo vodile do ustreznih iger:

| Črka | URL pot |
|------|---------|
| C | `/govorne-igre/ponovi-poved/c` |
| Č | `/govorne-igre/ponovi-poved/ch` |
| K | `/govorne-igre/ponovi-poved/k` |
| L | `/govorne-igre/ponovi-poved/l` |
| R | `/govorne-igre/ponovi-poved/r` |
| S | `/govorne-igre/ponovi-poved/s` |
| Š | `/govorne-igre/ponovi-poved/sh` |
| Z | `/govorne-igre/ponovi-poved/z` |
| Ž | `/govorne-igre/ponovi-poved/zh` |

Stran `PonoviPoved.tsx` že uporablja `hasPonoviPovedConfig()` za preverjanje dostopnosti, zato bodo kartice samodejno odkljenjene po dodajanju konfiguracij.

---

## Povzetek sprememb

| Komponenta | Sprememba |
|------------|-----------|
| `src/data/ponoviPovedConfig.ts` | Dodaj 8 novih konfiguracij za črke L, R, S, Z, C, Š, Ž, Č |
| Navigacija | Samodejno odklenjena (brez sprememb) |
| UI | Brez sprememb (obstoječa logika že podpira dinamično nalaganje) |
