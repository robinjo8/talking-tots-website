

## Plan: Dodaj manjkajoče vprašanje na /clanki/pogosta-vprasanja

### Problem
Stran `/clanki/pogosta-vprasanja` ima 10 vprašanj, prva stran pa 11. Manjka zadnje vprašanje:
- **"Ali lahko TomiTalk uporabljajo otroci starejši od 10 let?"** z odgovorom o prilagoditvi na starostno skupino 9-10 let.

### Sprememba
**Datoteka:** `src/pages/clanki/PogostaVprasanja.tsx`

Dodaj na konec `faqData` arraya (za vrstico 51) nov objekt:
```js
{
  question: "Ali lahko TomiTalk uporabljajo otroci starejši od 10 let?",
  answer: "Da. Za otroke, starejše od 10 let, se uporabljajo igre, vaje in preverjanje izgovorjave, ki so prilagojeni starostni skupini 9–10 let. Vsebine so tako še vedno ustrezne in koristne za krepitev govornih sposobnosti."
}
```

### Obseg
1 datoteka, 1 vrstica dodana.

