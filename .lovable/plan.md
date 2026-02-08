

# Zaostrite omejitev AI odgovorov na Vector Store dokumente

## Problem

Kljub temu da `tool_choice: "required"` prisili model da pokliče `file_search`, model VSEENO dopolnjuje odgovore s svojim splosnim znanjem o logopediji. Rezultat je dolg seznam vaj in tehnik, ki jih model "izmisli" iz svojega treniranega znanja, namesto da bi se omejil na vsebino dokumentov.

Vzrok je v tem, da system prompt vsebuje vrstico: "Za splosna vprasanja o govorno-jezikovnem razvoju lahko uporabis strokovno logopedsko znanje" - model to izkorisca tako, da vecino vprasanj obravnava kot "splosna" in odgovori iz lastnega znanja.

## Spremembe

### Datoteka: `supabase/functions/chat-assistant/index.ts`

### 1. Dodaj `temperature: 0` v API klic
Nizka temperatura zmanjsa kreativnost modela in ga naredi bolj konzervativnega pri odgovorih. To pomeni, da bo manj verjetno, da bo dodajal vsebino iz svojega splosnega znanja.

```typescript
body: JSON.stringify({
  model: "gpt-4.1",
  instructions: finalInstructions,
  input,
  tools: [...],
  tool_choice: "required",
  temperature: 0,    // NOVO
  stream: true,
}),
```

### 2. Zaostri system prompt - odstrani dovoljenje za splosno znanje
Kljucna sprememba: odstranimo stavek ki dovoljuje uporabo "strokovnega logopedskega znanja" in ga nadomestimo s strozjim pravilom.

Namesto:
```
Za splosna vprasanja o govorno-jezikovnem razvoju (ki niso specificna za TomiTalk) 
lahko uporabis strokovno logopedsko znanje, vendar VEDNO jasno loci med splosnimi 
strokovnimi nasveti in specificnimi funkcijami TomiTalk aplikacije.
```

Nova pravila:
```
VEDNO moras odgovarjati na podlagi dokumentov iz file_search. Tudi pri splosnih 
vprasanjih o govorno-jezikovnem razvoju NAJPREJ poiscis informacije v dokumentih.

Ce v dokumentih najdes relevantne informacije, odgovori IZKLJUCNO na podlagi teh 
dokumentov.

Ce v dokumentih NE najdes dovolj informacij, lahko KRATKO omenis splosno strokovno 
nacelo (1-2 stavka), vendar MORAS dodati: "Za podrobnejse informacije priporocam 
posvet z logopedom."

NIKOLI NE SMES napisati dolgih seznamov vaj, tehnik ali metod iz svojega splosnega 
znanja. Ce nimas podatkov v dokumentih, RAJE odgovori KRAJSE in usmeri uporabnika 
na logopeda ali na aplikacijo TomiTalk.

NIKOLI NE SMES trditi da TomiTalk "vsebuje" ali "ponuja" doloceno funkcionalnost,
ce tega ne potrjujejo dokumenti. Namesto tega reci: "Priporocam, da preverite 
neposredno v aplikaciji TomiTalk."
```

### 3. Dodaj eksplicitne negativne primere
V prompt dodamo primere odgovorov ki jih model NE SME dati, da se model laze nauci meje:

```
PRIMER NAPACNEGA ODGOVORA (NE SMES tako odgovoriti):
"Artikulacijske vaje: Te vaje so namenjene vadbi pravilnih polozajev jezika, 
ustnic in celjusti pri posameznih glasovih..."
- To je NAPACNO ker je dolg seznam iz splosnega znanja, ne iz dokumentov.

PRIMER PRAVILNEGA ODGOVORA:
"Glede na dokumentacijo TomiTalk so na voljo naslednje vaje: [tocno kar pise v 
dokumentih]. Za dodatne vaje in pristope priporocam posvet z logopedom."
```

## Kaj se NE spremeni
- Frontend koda ostane enaka
- Logika za child context ostane enaka
- Logika za shranjevanje pogovorov ostane enaka
- Logiranje file_search uporabe ostane enako

## Pricakovani rezultat
Po teh spremembah bo Tomi:
- Odgovarjal krajse in bolj jedrnato
- Navajal SAMO vsebine ki jih najde v Vector Store dokumentih
- Pri vprasanjih brez dokumentacije jasno povedal da nima podatkov
- Uporabnike usmeril na aplikacijo ali na logopeda namesto da izmisljuje vaje
