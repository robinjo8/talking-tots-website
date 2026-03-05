

# Plan: Flip kartice za Vizualni prikaz ustnic

## Kaj se spremeni

Kartice na strani `/govorno-jezikovne-vaje/vizualni-prikaz-ustnic` bodo uporabljale 3D flip animacijo (CSS klase `flip-card` že obstajajo v `index.css`). Sprednja stran kartice bo zakrita (prikaže le naslov glasu), ob kliku se obrne in prikaže sliko + gumb za zvočna navodila. Hkrati bo lahko odprta le ena kartica. Hero sekcija bo oblikovana enako kot na strani artikulacije (`bg-dragon-green`).

## Datoteka: `src/pages/VizualniPrikazUstnic.tsx`

### Spremembe:
1. **Hero sekcija**: Zamenjaj `bg-app-teal` z `bg-dragon-green` (enako kot artikulacija).

2. **State**: Zamenjaj `selectedCard` (dialog) z `flippedCardId: string | null` — hrani ID obrnjene kartice.

3. **Kartice z flip animacijo**: Vsaka kartica uporabi obstoječe CSS razrede iz `index.css`:
   - `flip-card` wrapper (ohrani trenutne dimenzije)
   - `flip-card-inner` z `.flipped` ko je `flippedCardId === card.id`
   - `flip-card-front`: Prikaže naslov glasu (gradient ozadje + naslov, npr. "Glas K")
   - `flip-card-back`: Prikaže sliko artikulacije + gumb za zvočna navodila (disabled)
   - Ob kliku na drugo kartico se prejšnja zapre

4. **Odstrani Dialog**: Ni več potreben, ker se vsebina prikaže na kartici sami.

5. **Flip logika**: Klik na kartico togglea flip; klik na drugo kartico zapre prejšnjo in odpre novo.

## Obstoječi CSS (ni sprememb potrebnih)

Razredi `flip-card`, `flip-card-inner`, `flip-card-front`, `flip-card-back` že obstajajo v `index.css` s 3D transform animacijo.

## Povzetek
- 1 datoteka za urejanje: `src/pages/VizualniPrikazUstnic.tsx`
- Flip kartice z obstoječimi CSS animacijami
- Hero sekcija v `bg-dragon-green`
- Brez dialoga — vsebina na zadnji strani kartice

