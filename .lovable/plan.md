

# Celostno varnostno in zmogljivostno porocilo TomiTalk
**Datum: 10. februar 2026**

---

## 1. PREGLED STANJA PO POPRAVKIH

Od zadnjega pregleda smo izvedli naslednje popravke:
- JWT avtentikacija na `chat-assistant` in `transcribe-articulation` (OpenAI zascita)
- RLS politike na tabeli `progress` (izolacija podatkov otrok)
- CORS omejitev na vseh 13 Edge funkcijah (samo tomitalk.com)
- `media_files` INSERT omejen na admin-e

---

## 2. PREOSTALE KRITICNE RANLJIVOSTI

### 2.1 KRITICNO: `mfa_codes` tabela BREZ RLS politik
- **Resnost:** KRITICNA
- **Problem:** Tabela `mfa_codes` ima vklopljen RLS, ampak NIMA NOBENE politike. To pomeni, da nihce ne more brati/pisati podatkov skozi Supabase klienta (kar je "fail closed"), AMPAK to pomeni tudi, da Edge funkcija `send-mfa-code` uporablja `service_role` kljuc za dostop.
- **Dejanski vpliv:** Nizek, ker Edge funkcija pravilno uporablja service_role kljuc. Vendar bi moral obstajati vsaj RLS policy za branje lastnih kod.

### 2.2 KRITICNO: `get_parent_emails()` funkcija razkriva e-poste
- **Resnost:** VISOKA
- **Problem:** Funkcija `get_parent_emails(parent_ids uuid[])` je `SECURITY DEFINER` in sprejme KATERIKOLI UUID array. Vsak prijavljen uporabnik (tudi navaden stars) lahko poklice `supabase.rpc('get_parent_emails', { parent_ids: [...] })` in pridobi e-postne naslove VSEH uporabnikov.
- **Posledica:** Zbiranje e-postnih naslovov, phishing napadi.
- **Resitev:** Omejiti na logopede iz iste organizacije ali super admin-e.

### 2.3 VISOKA: `children` tabela - logopedi vidijo VSE otroke
- **Resnost:** VISOKA
- **Problem:** Politika `children_logopedist_view` dovoljuje VSAKEMU logopedu branje VSEH otrok v sistemu, vkljucno z medicinskimi podatki (govorne tezave, datum rojstva, razvojni podatki).
- **Resitev:** Omejiti na otroke dodeljene logopedu ali interno organizacijo.

### 2.4 SREDNJA: `generate-monthly-plan` BREZ JWT avtentikacije
- **Resnost:** SREDNJA
- **Problem:** Funkcija `generate-monthly-plan` ne preverja JWT tokena. Kdorkoli z anon kljucem lahko klice to funkcijo z poljubnim `reportId`.
- **Resitev:** Dodati JWT preverjanje, da lahko funkcijo klicejo samo prijavljeni uporabniki.

### 2.5 SREDNJA: `send-mfa-code` BREZ JWT avtentikacije
- **Resnost:** SREDNJA
- **Problem:** Funkcija `send-mfa-code` sprejme `user_id` in `email` brez avtentikacije. Napadalec lahko poslje MFA kode na poljuben email (spam, izkoriscanje Resend API kvote).
- **Pozitivno:** Ima rate limiting (60 sekund med kodami), preveri da je uporabnik logoped in da je verificiran.
- **Resitev:** Dodati JWT preverjanje.

---

## 3. PLACILNA VARNOST (Stripe)

### 3.1 Kaj je VARNO
- Stripe webhook podpisan s `stripe-webhook-secret` - onemogoča lazne dogodke
- `create-checkout` zahteva JWT avtentikacijo
- Preverjanje obstojece narocnine pred ustvarjanjem nove
- `customer-portal` zahteva JWT avtentikacijo
- Stripe cene (Price ID-ji) so javni, ampak to ni varnostna tezava - nihce ne more placati brez Stripe checkout seje

### 3.2 Obhoditev placljive verzije
- **Omejitev brezplacnih iger (3/dan):** Temelji na `localStorage`. Uporabnik lahko obrisi `localStorage`, odpre incognito okno, ali rocno nastavi stevec na 0.
- **Dejanski vpliv:** NIZEK za vase prihodke. Brezplacne igre so "demo" za neregistrirane uporabnike. Ko se uporabnik registrira in placa, se omejitve preverjajo serversko.
- **Resitev:** Premik stevca na streznik (v Supabase tabelo) bi bil idealen, ampak zahteva registracijo za brezplacne igre, kar zmanjsa konverzijo.

### 3.3 Preverjanje narocnine
- `check-subscription` funkcija pravilno preverja JWT token
- Tabela `user_subscriptions` je edini vir resnice
- RLS politika dovoljuje uporabniku branje SAMO lastne narocnine
- Webhook posodablja status narocnine v realnem casu

---

## 4. ALI LAHKO HEKER PRIDE DO KODE?

### 4.1 Frontend koda (JAVNA)
- **Da**, vsa React/TypeScript koda je javno vidna v brskalniku (DevTools > Sources). To je NORMALNO za vsako spletno stran.
- **Kaj vidi:** UI komponente, Supabase anon kljuc, Stripe Price ID-je, logiko aplikacije.
- **Kaj NE vidi:** Edge funkcij, OpenAI kljuca, Stripe secret kljuca, service_role kljuca.

### 4.2 Backend koda (VARNA)
- Edge funkcije se izvajajo na Supabase strezniku - koda NI dostopna.
- `.env` spremenljivke (STRIPE_SECRET_KEY, OPENAI_API_KEY) so varne.
- Service Role Key NI izpostavljen.

### 4.3 Ali lahko nekdo vdre v vas racun?
- **Lovable racun:** Zascitten z vasim geslom. Omogocite 2FA ce je na voljo.
- **Supabase racun:** Zascitten z vasim geslom. Omogocite 2FA v Supabase nastavitvah.
- **Stripe racun:** Zascitten z vasim geslom + Stripe ima lastno zascito.
- **Koda na Lovable:** Kodo gosti Lovable. Ce bi nekdo vdrl v vas Lovable racun, bi imel dostop do kode. Priporocam mocno geslo.

---

## 5. ZMOGLJIVOST IN SKALABILNOST

### 5.1 Trenutno stanje
- **Baza podatkov:** 24 MB od 500 MB (Supabase Free plan) = 4.8% zasedeno
- **Stevilo uporabnikov:** 10
- **Edge funkcije:** 15

### 5.2 Supabase Free Plan omejitve

| Vir | Omejitev | Tvoje stanje |
|-----|----------|--------------|
| Baza podatkov | 500 MB | 24 MB (OK) |
| Shranjevanje datotek | 1 GB | Neznano |
| Pasovna sirina | 2 GB/mesec | Neznano |
| Edge funkcije | 500.000 klicev/mesec | Dovolj za ~10k uporabnikov |
| Sočasne povezave DB | ~20 | Omejujoc faktor! |

### 5.3 Scenarij: 10.000 uporabnikov naenkrat

**Ozka grla:**

1. **Supabase socasne povezave (KRITICNO):** Free plan podpira ~20 socasnih DB povezav. Ce 100 uporabnikov hkrati nalaga stran, bo baza podatkov vrnila napako "too many connections". Potrebna nadgradnja na Pro plan ($25/mesec) za 60+ povezav.

2. **Edge funkcije:** Ce 100 uporabnikov hkrati klice `chat-assistant` (OpenAI), bo vsak klic trajal 5-15 sekund. Supabase ima limit socasnih Edge funkcij. Ob konicah se bo pojavil timeout.

3. **OpenAI API:** 10.000 uporabnikov ki dnevno uporabljajo chat asistenta = potencialno 10.000+ API klicev/dan. Pri ceni ~$0.01-0.05/klic je to $100-500/dan. Postavite opozorila o stroskih v OpenAI nadzorni plosci.

4. **Resend email:** Brezplacni Resend plan dovoljuje 100 emailov/dan. Ce se registrira 100 uporabnikov na dan, bo email posiljanje blokirano. Nadgradite na placljiv plan.

### 5.4 Scenarij: 100 registracij naenkrat
- **Supabase Auth:** Supabase zmore ~100 registracij brez tezav.
- **Email posiljanje:** Resend Free plan omejuje na 100/dan. Ce jih je vec, bodo emaili zavrnjeni.
- **Resitev:** Nadgradnja Resend plana ($20/mesec za 5.000 emailov/dan).

### 5.5 Lovable gostovanje
- Lovable gostuje frontend kot staticno spletno stran (CDN). To pomeni:
  - **Kapaciteta:** Prakticno neomejena za frontend (staticne datoteke).
  - **Latenca:** Nizka, ker se vsebina servira iz najblizjega CDN vozlisca.
  - **Omejitev:** Backend (Supabase) je dejanski omejujoci faktor, ne Lovable gostovanje.

---

## 6. PRIPOROCILA PO PRIORITETI

### NUJNO (pred lansiranjem)
1. Zascititi `get_parent_emails()` funkcijo - omejiti na logopede/admin-e
2. Omejiti `children_logopedist_view` RLS politiko na dodeljene otroke
3. Dodati JWT na `generate-monthly-plan` in `send-mfa-code`
4. Dodati RLS politike na `mfa_codes` tabelo

### PRED 1.000 UPORABNIKI
5. Nadgraditi Supabase na Pro plan ($25/mesec) za vec DB povezav
6. Nadgraditi Resend na placljiv plan za vec emailov
7. Nastaviti opozorila o stroskih za OpenAI API
8. Razmisliti o rate limiting na `chat-assistant` (npr. 20 sporocil/uro/uporabnika)

### PRED 10.000 UPORABNIKI
9. Razmisliti o Supabase connection pooling (Supavisor)
10. Implementirati caching za pogosta Stripe preverjanja narocnin
11. Premik brezplacne igre stevca na streznik (opcijsko)

---

## 7. SKUPNA OCENA

| Kategorija | Ocena | Komentar |
|------------|-------|----------|
| Stripe varnost | 9/10 | Webhook podpisan, JWT na checkout, dvojno preverjanje |
| OpenAI varnost | 8/10 | JWT dodan, manjka rate limiting |
| Podatkovna izolacija | 6/10 | Progress popravljen, children in get_parent_emails se kriticna |
| Edge Function varnost | 7/10 | CORS omejen, 2 funkciji se brez JWT |
| Skalabilnost | 5/10 | Za 10 uporabnikov OK, za 1.000+ potrebna nadgradnja plana |
| Koda zasebnost | 9/10 | Backend koda varna, frontend javna (normalno) |

**Skupna ocena: 7.3/10** - Stran je solidno zasnovana za manjse stevilo uporabnikov. Pred vecjim lansiranjem je treba popraviti 4 kriticne tocke in nadgraditi Supabase plan.

