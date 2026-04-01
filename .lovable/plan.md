

## Plan: Dodaj glasove F, G, H, V v 7 govornih iger

### Besede za nove črke (popravljene + dodatne)

**F** (13 besed):
| Beseda | Slika | Zvok |
|--------|-------|------|
| FARAON | faraon.webp | Faraon.mp3 |
| FAZAN | fazan.webp | Fazan.mp3 |
| FEFERON | feferon.webp | Feferon.mp3 |
| FIGA | figa.webp | Figa.mp3 |
| FLAVTA | flavta.webp | Flavta.mp3 |
| FORMULA | formula.webp | Formula.mp3 |
| FOTELJ | fotelj.webp | Fotelj.mp3 |
| FRAČA | fraca.webp | Fraca.mp3 |
| FRIZER | frizer.webp | Frizer.mp3 |
| FRNIKOLA | frnikola.webp | Frnikola.mp3 |
| FANT | fant1.webp | Fant.mp3 |
| FEN | fen1.webp | Fen.mp3 |
| FIŽOL | fizol1.webp | Fizol.mp3 |

**G** (16 besed):
| Beseda | Slika | Zvok |
|--------|-------|------|
| GASILEC | gasilec.webp | Gasilec.mp3 |
| GLAVNIK | glavnik.webp | Glavnik.mp3 |
| GOLOB | golob.webp | Golob.mp3 |
| GOS | gos.webp | Gos.mp3 |
| GOZDAR | gozdar.webp | Gozdar.mp3 |
| GRAD | grad.webp | Grad.mp3 |
| GRAH | grah.webp | Grah.mp3 |
| GUGALNICA | gugalnica.webp | Gugalnica.mp3 |
| GUSAR | gusar.webp | Gusar.mp3 |
| GOBA | goba1.webp | Goba.mp3 |
| GOL | gol1.webp | Gol.mp3 |
| GUMA | guma1.webp | Guma.mp3 |
| GARAŽA | garaza1.webp | Garaza.mp3 |
| GNEZDO | gnezdo1.webp | Gnezdo.mp3 |
| GROZDJE | grozdje1.webp | Grozdje.mp3 |
| GLAVA | glava1.webp | Glava.mp3 |

**H** (14 besed):
| Beseda | Slika | Zvok |
|--------|-------|------|
| HARFA | harfa.webp | Harfa.mp3 |
| HARMONIKA | harmonika.webp | Harmonika.mp3 |
| HELIKOPTER | helikopter.webp | Helikopter.mp3 |
| HIJENA | hijena.webp | Hijena.mp3 |
| HLEV | hlev.webp | Hlev.mp3 |
| HOBOTNICA | hobotnica.webp | Hobotnica.mp3 |
| HOKEJ | hokej.webp | Hokej.mp3 |
| HOTEL | hotel.webp | Hotel.mp3 |
| HRČEK | hrcek.webp | Hrcek.mp3 |
| HRIB | hrib.webp | Hrib.mp3 |
| HUPA | hupa.webp | Hupa.mp3 |
| HIŠA | hisa1.webp | Hisa.mp3 |
| HLAČE | hlace1.webp | Hlace.mp3 |
| HRUŠKA | hruska1.webp | Hruska.mp3 |

**V** (22 besed):
| Beseda | Slika | Zvok |
|--------|-------|------|
| VAFELJ | vafelj.webp | Vafelj.mp3 |
| VEDRO | vedro.webp | Vedro.mp3 |
| VESLO | veslo.webp | Veslo.mp3 |
| VEVERICA | veverica.webp | Veverica.mp3 |
| VILE | vile.webp | Vile.mp3 |
| VITEZ | vitez.webp | Vitez.mp3 |
| VOLK | volk.webp | Volk.mp3 |
| VOLNA | volna.webp | Volna.mp3 |
| VOZIČEK | vozicek.webp | Vozicek.mp3 |
| VRATA | vrata.webp | Vrata.mp3 |
| VULKAN | vulkan.webp | Vulkan.mp3 |
| VAZA | vaza1.webp | Vaza.mp3 |
| VEJA | veja1.webp | Veja.mp3 |
| VETRNICA | veternica1.webp | Vetrnica.mp3 |
| VILICE | vilica1.webp | Vilice.mp3 |
| VODA | voda1.webp | Voda.mp3 |
| VOLAN | volan1.webp | Volan.mp3 |
| VOZ | voz1.webp | Voz.mp3 |
| VERIŽICA | verizica1.webp | Verizica.mp3 |
| VEZALKE | vezalke1.webp | Vezalke.mp3 |
| VIŠNJA | visnja1.webp | Visnja.mp3 |
| VRABEC | vrabec1.webp | Vrabec.mp3 |

**Opomba**: Nove slike (faraon.webp, fazan.webp itd.) nimajo sufiksa `1`, obstoječe (fant1.webp, gol1.webp itd.) pa ga imajo — tako kot je v bucket-u.

---

### Spremembe po datotekah

#### 1. `src/data/puzzleImages.ts`
- Dodaj 4 nove `PuzzleImage[]` arraye: `fImages`, `gImages`, `hImages`, `vImages`
- Dodaj v `imagesByLetter` map
- Exportaj nove arraye

#### 2. `src/data/artikulacijaVajeConfig.ts`
- Dodaj 4 nove `WordData[]` arraye: `wordsDataF`, `wordsDataG`, `wordsDataH`, `wordsDataV`
- Dodaj 4 nove wheel config zapise v `artikulacijaConfigs` map
- `lipsImage`: preveri obstoječe slike ustnic ali uporabi generično

#### 3. `src/data/labirintConfig.ts`
- Importiraj `fImages, gImages, hImages, vImages`
- Dodaj 4 nove `LabirintConfig` zapise (abecedni vrstni red: C, Č, **F**, **G**, **H**, K, L, ...)

#### 4. `src/data/drsnaSestavljankaConfig.ts`
- Importiraj nove image arraye
- Dodaj F, G, H, V v `letterConfigs`

#### 5. `src/data/igraUjemanjaConfig.ts`
- Dodaj F, G, H, V v `letterConfigs`
- Posodobi `digraphToLetter` in `letterToDigraph` mape

#### 6. `src/data/sestavljankeGameConfig.ts`
- Importiraj nove image arraye
- Dodaj F, G, H, V v `letterConfigs`

#### 7. `src/data/spominConfig.ts`
- Razširi `SpominConfig` interface z opcijskim `localData` poljem
- Dodaj 4 nove zapise za F, G, H, V z `localData` namesto `tableName`

#### 8. `src/data/zaporedjaConfig.ts`
- Razširi `ZaporedjaGameConfig` interface z opcijskim `localData` poljem
- Dodaj F, G, H, V v `letterConfigs` in `letterTableMap` z `localData`

#### 9. `src/hooks/useGenericMemoryGame.tsx` — lokalni fallback
- Če `config.localData` obstaja, pretvori v format `MemoryCard[]` z generiranimi ID-ji in polnimi URL-ji
- Sicer uporabi obstoječo Supabase poizvedbo (C, Č, K, itd. ostanejo nespremenjene)

#### 10. `src/hooks/useSequenceGame.ts` — lokalni fallback
- Dodaj opcijski parameter `localData`
- Če podan, preskoči DB query in uporabi lokalne podatke

#### 11. `src/components/exercises/SequenceGame56Base.tsx`
- Dodaj opcijski `localData` prop; če podan, preskoči DB

#### 12. `src/components/exercises/SequenceGameBase.tsx`
- Dodaj opcijski `localData` prop; če podan, preskoči DB

#### 13. `src/components/games/GenericZaporedjaGame.tsx`
- Za `config.gameType === '34'` dodaj nove case-e za `f`, `g`, `h`, `v` ki uporabijo generično `SequenceGameC`-like komponento
- Alternativno: ustvari novo generično `SequenceGameLocal34` ki sprejme lokalne podatke in se obnaša enako kot `SequenceGameC`
- Za `56`, `78`, `910` posreduj `localData` prop naprej v `SequenceGame56Base` / `SequenceGameBase`

#### 14. Selekcijske strani — 7 datotek
Dodaj 4 nove kartice v abecednem vrstnem redu (po Č, pred K):

| Datoteka | Array |
|----------|-------|
| `src/pages/KoloSreceGames.tsx` | `wheelLetters` |
| `src/pages/SpominGames.tsx` | `memoryGames` |
| `src/pages/IgraUjemanja.tsx` | `matchingGames` |
| `src/pages/Zaporedja.tsx` | `sequenceGames` |
| `src/pages/DrsnaSestavljanka.tsx` | `memoryGames` |
| `src/pages/Labirint.tsx` | `labirintGames` |
| `src/pages/SestavljankeGames.tsx` | `memoryGames` |

Vsaka kartica:
- F: `zmajcek_crka_F.webp`, gradient `from-app-orange/20 to-app-yellow/20`
- G: `zmajcek_crka_G.webp`, gradient `from-dragon-green/20 to-app-teal/20`
- H: `zmajcek_crka_H.webp`, gradient `from-app-blue/20 to-app-purple/20`
- V: `zmajcek_crka_V.webp`, gradient `from-app-purple/20 to-app-teal/20`

---

### Ključna arhitekturna odločitev: lokalni fallback

Spomin in Zaporedja trenutno vedno bereta iz Supabase tabel (`memory_cards_*`). Za F, G, H, V ni tabel — implementiram **lokalni fallback**:

1. Config interface dobi opcijsko polje `localData?: { word: string; image_url: string; audio_url: string }[]`
2. Hooki (`useGenericMemoryGame`, `useSequenceGame`) preverijo ali ima config `localData` — če da, preskočijo DB query
3. Obstoječe črke (C, Č, K, ...) ostanejo popolnoma nespremenjene in še vedno berejo iz DB

Za Zaporedja starostna skupina 3-4 (`SequenceGameC` itd.) ustvarim novo generično komponento `SequenceGameLocal` ki sprejme `localData` in deluje identično kot obstoječe `SequenceGameC`, le da ne bere iz DB.

### Obseg
- ~18 datotek spremenjenih/ustvarjenih
- ~300 vrstic novih word/image podatkov
- ~50 vrstic lokalnih fallback sprememb v hookah
- ~100 vrstic novih kartic na selection straneh
- Brez novih route-ov (obstoječi dinamični routerji že podpirajo nove URL ključe)
- Brez novih Supabase tabel

