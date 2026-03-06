

# Desktop kartica: stil in gumbi

## Spremembe v `src/pages/VizualniPrikazUstnic.tsx`

### 1. Odstrani senčenje kartice
- Vrstica 216: `shadow-lg` → brez shadow, `hover:shadow-xl` → brez
- Ohrani `bg-white`, dodaj `border border-gray-200` za tanko sivo obrobo

### 2. Obroba na zadnji strani (flip-card-back)
- Vrstica 230: dodaj `border border-gray-200` na flip-card-back

### 3. Gumbi za navigacijo 2x večji, črno ozadje, bele puščice
- Vrstici 245-246: `CarouselPrevious` in `CarouselNext` dobita className za večjo velikost in barve:
  ```tsx
  <CarouselPrevious className="h-16 w-16 bg-black text-white border-black hover:bg-black/80 hover:text-white" />
  <CarouselNext className="h-16 w-16 bg-black text-white border-black hover:bg-black/80 hover:text-white" />
  ```
  (privzeta velikost je h-8 w-8, torej h-16 w-16 = 100% povečanje)

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx`

