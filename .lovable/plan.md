

# Plan: Odstranitev ikon, spolno prilagojena slovenscina, cistejsi arhiv

## 1. Odstranitev ikon iz sporocila

V edge funkciji `generate-monthly-plan/index.ts` (vrstica 352) je summary template:
```
"Hej Zak! 🎉 Pripravili smo ti ... pravi sampion! 🌟"
```

Odstraniti oba emoji znaka (🎉 in 🌟) iz template-a.

---

## 2. Prilagoditev za spol otroka (slovenscina)

Tabela `children` ze ima stolpec `gender` z vrednostmi: "male", "female", "M", "F".

Trenutni summary template uporablja mosko obliko:
- "bos **vadil**" (mosko)
- "postani pravi **sampion**" (mosko)

Za deklice mora biti:
- "bos **vadila**" (zensko)
- "postani prava **sampionka**" (zensko)

### Spremembe v edge funkciji:

**a)** Dodati `gender` v SELECT poizvedbo za otroka (vrstica 280):
```text
// PREJ:
.select("id, birth_date, age, name")

// POTEM:
.select("id, birth_date, age, name, gender")
```

**b)** Dolociti spol iz vrednosti v bazi:
```text
const isFemale = ["female", "F", "f"].includes(child.gender || "");
```

**c)** Prilagoditi summary template:
```text
const vadil = isFemale ? "vadila" : "vadil";
const sampion = isFemale ? "prava sampionka" : "pravi sampion";

const summary = `Hej ${childNameCapitalized}! Pripravili smo ti zabaven nacrt vaj in iger, s katerimi bos ${vadil} ${lettersFormatted}. Vsak dan te cakajo nove pustolovscine – vaje za jezik in 4 igrice! Zbiraj zvezdice in postani ${sampion}!`;
```

**Primer za deklico:**
"Hej Masa! Pripravili smo ti zabaven nacrt vaj in iger, s katerimi bos vadila crki S in Z. Vsak dan te cakajo nove pustolovscine – vaje za jezik in 4 igrice! Zbiraj zvezdice in postani prava sampionka!"

**Primer za fanta:**
"Hej Zak! Pripravili smo ti zabaven nacrt vaj in iger, s katerimi bos vadil crki S in Z. Vsak dan te cakajo nove pustolovscine – vaje za jezik in 4 igrice! Zbiraj zvezdice in postani pravi sampion!"

Da. Sporocilo je ze prilagojeno za vsakega otroka - ime in crke so dolocene iz otrokovega profila in logopedskega porocila. Z dodanim spolom bo tekst pravilno slovensko prilagojen.

---

## 3. Odstranitev puscice in naslova na strani /moji-izzivi/arhiv

V `MojiIzziviArhiv.tsx` (vrstice 71-83) sta gumb s puscico nazaj in naslov "Pretekli dnevi". Ker breadcrumb navigacija (vrstica 68-69) ze omogoca navigacijo nazaj, sta ta dva elementa odvecna.

Odstraniti celoten blok:
```text
<motion.div ...>
  <Button variant="ghost" ...>  // puscica nazaj
  <h1>Pretekli dnevi</h1>
</motion.div>
```

---

## 4. Regeneracija nacrta

Po spremembi edge funkcije regenerirati nacrt za testnega otroka Zak, da bo nov summary brez ikon in s pravilno obliko.

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `supabase/functions/generate-monthly-plan/index.ts` | Sprememba | Odstranitev ikon, dodajanje `gender` v SELECT, spolno prilagojen summary |
| `src/pages/MojiIzziviArhiv.tsx` | Sprememba | Odstranitev puscice nazaj in naslova "Pretekli dnevi" |

