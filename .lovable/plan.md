

## Zamenjava Drsne sestavljanke z Zabavno potjo v 90-dnevnem načrtu

### Sprememba

**Datoteka: `supabase/functions/generate-monthly-plan/index.ts`**

1. **Odstrani** igro "Drsna igra" iz seznama `AGE_GAMES` (vrstica 41)
2. **Dodaj** igro "Zabavna pot" v seznam `NO_AGE_GAMES` (brez starostnega sufiksa):
   ```
   { name: "Zabavna pot", gameId: "kace", pathTemplate: "/govorne-igre/kace/{urlKey}" }
   ```

Zabavna pot ne potrebuje starostnega ključa (`ageKey`), zato spada med `NO_AGE_GAMES` -- enako kot Labirint, Spomin itd.

### Tehnični detajli

- `AGE_GAMES` se zmanjša iz 4 na 3 igre (Sestavljanke, Zaporedja, Igra ujemanja)
- `NO_AGE_GAMES` se poveča iz 6 na 7 iger
- Skupno ostane 10 iger namesto prejšnjih 10 -- le zamenjava
- Po spremembi je potreben deploy edge funkcije `generate-monthly-plan`
- Obstoječi že generirani načrti se ne spremenijo; sprememba velja za nove načrte
