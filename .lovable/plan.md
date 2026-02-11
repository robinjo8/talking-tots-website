

# Celostna analiza: Lea Erzar + pregled funkcionalnosti

---

## 1. UPORABNICA LEA ERZAR (lea.erzar@gmail.com)

### 1.1 Registracija in narocnina
- **Registracija:** 10. feb 2026, 21:22 -- OK
- **Profil:** Ime "Lea Erzar" -- OK
- **Narocnina:** Pro plan, status `active`, Stripe subscription `sub_1SzORfGncjlOci0kDNHSENMM`
- **Stripe produkt:** `prod_TwXXpvPhSYVzvN` -- pravilno ustreza TomiTalk Pro v `pricing.ts`
- **Plan ID:** `pro` -- pravilno preneseno iz Stripe

**OPOZORILO:** `current_period_end` je `2026-02-10 21:26:11` (samo 1 minuto po zacetku). To je verjetno testna narocnina v Stripe. Kljub temu frontend v `useSubscription.ts` preverja `status === 'active'`, kar vrne `true`, zato dodajanje otroka deluje. Toda ta narocnina bo v Stripeu morda kmalu potekla in webhook bo spremenil status -- takrat bo uporabnica izgubila dostop.

### 1.2 Dodajanje otroka
- **Otrok:** "Namišljeno Dete" uspesno dodan 10. feb ob 21:28 -- OK
- **Dokumenti:** Vprasalnik samodejno naložen v Storage -- OK
- **Govorne tezave:** `["not_sure"]` -- OK
- **Razvojni podatki:** Pravilno shranjeni (chewing_blowing, ear_infections, itd.) -- OK

### 1.3 Zakaj ni delalo na telefonu?
**Vzrok NI povezan z varnostnimi spremembami.** RLS politike na tabeli `children` za starše (`children_insert_own`, `children_select_own`) niso bile spremenjene -- spremenjena je bila samo `children_logopedist_view` politika, ki vpliva le na logopede.

**Najverjetnejsi vzrok je mobilni UI:** Komponenta `SimpleChildForm` uporablja `Dialog` za izbiro datuma na mobilnih napravah (`md:hidden`). Znani problemi:
- Radix UI Dialog na iOS Safari ima obcasne tezave z dotiki in fokusom
- Calendar komponenta znotraj Dialoga se lahko ne odziva pravilno na manjsih zaslonih
- Gumb "Nadaljuj" je mogoc neaktiven, ker `birthDate` ni bil pravilno nastavljen

**Priporocilo:** Testirati mobilni tok dodajanja otroka na razlicnih napravah in preveriti, ali se datum pravilno nastavi v Dialog komponenti.

---

## 2. VIDNOST OTROKA NA ADMIN PORTALU

### Trenutno stanje
Admin politika `children_restricted_admin_access` (cmd: ALL) preverja:
```
(auth.uid() = parent_id) OR has_admin_role('super_admin')
```
in `children_support_admin_view` (SELECT) preverja `has_admin_role('support_admin')`.

**Rezultat:** Super admin in support admin lahko vidita Leinega otroka na admin portalu. To deluje pravilno.

### TomiTalk logopedinje (Robert, Ema, Spela)
Popravljena politika `children_logopedist_view` zahteva, da ima otrok test sejo (`articulation_test_sessions`) z ustreznim statusom. **Lea se ni naredila testa**, zato logopedinje NE vidijo njenega otroka -- kar je pravilno vedenje. Ko bo Lea naredila test, bodo interni logopedi videli njenega otroka.

---

## 3. PREVERJANJE IZGOVORJAVE (Articulation Test)

### 3.1 Tok delovanja
1. Stars posname besedo (audio)
2. `useTranscription` hook poslje audio na Edge funkcijo `transcribe-articulation`
3. Funkcija poslje audio na OpenAI Whisper API za transkripcijo
4. Funkcija primerja transkripcijo s ciljno besedo
5. Ce je beseda sprejeta, se posnetek shrani v Supabase Storage
6. Rezultat se vrne v frontend

### 3.2 Shranjevanje rezultatov
**OPAZKA:** Edge funkcija `transcribe-articulation` NE shranjuje rezultatov v tabelo `articulation_word_results`. Ta tabela se polni le iz seed podatkov. To pomeni:
- **Logopedinje NE vidijo posameznih besednih rezultatov za realne uporabnike**
- Avdio posnetki SE shranjujejo v Storage (ce je beseda sprejeta)
- Seje se ustvarijo, ampak `current_word_index` ostane na 0

**To je potencialna tezava** -- ce logopedinja odpre sejo za pregled, ne bo videla posameznih besed s posnetki v podatkovni bazi. Mora pregledovati posnetke neposredno v Storage.

### 3.3 CORS
Edge funkcija `transcribe-articulation` dopusca `tomitalk.com`, `www.tomitalk.com`, `tomitalk.lovable.app`. Za produkcijsko uporabo je to pravilno. **Za testiranje prek Lovable preview URL-ja pa ne bo delalo** -- to je treba upostevati pri razvoju.

---

## 4. OŠ TEST -- LOGOPEDIST JANEZ NOVAK

### 4.1 Stanje
- **Profil:** Janez Novak, organizacija "OS Test" (tip: school), verificiran
- **Otroci:** 7 otrok (1 aktiven: "Tian", 6 neaktivnih testnih)
- **Licenca:** Aktivna organizacijska licenca za OS Test
- **Test seje:** 1 seja (`d4bb9391`) -- status `in_review`, `is_completed: true`, `total_words: 3`
- **Besedni rezultati:** 0 -- enako kot pri starsih, funkcija ne shranjuje v DB

### 4.2 Dodajanje otrok
RLS politika `Logopedists can insert own children` preverja:
```
logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
```
**To deluje pravilno.** Janez lahko dodaja, ureja in brise svoje otroke.

### 4.3 Porocila
Janez ima 1 porocilo (id: `6b179209`) s statusom `submitted`, brez `session_id`. To pomeni da je porocilo ustvarjeno rocno, ne vezano na sejo. **Porocila delujejo.**

### 4.4 Progress tabela
RLS politike za logopede na tabeli `progress` zahtevajo `logopedist_child_id IS NOT NULL`. To je pravilno in logopedisti lahko upravljajo napredek svojih otrok.

---

## 5. KRITICNE UGOTOVITVE IN PRIPOROCILA

### 5.1 VISOKA PRIORITETA: Manjka shranjevanje besednih rezultatov v DB
`transcribe-articulation` funkcija ne zapisuje v `articulation_word_results`. Logopedinje zato ne morejo pregledovati posameznih besed prek admin portala. Potrebna je dopolnitev funkcije, da po transkripciji vstavi zapis v tabelo.

### 5.2 SREDNJA PRIORITETA: Mobilni UI za dodajanje otroka
Calendar Dialog na mobilnih napravah (iOS Safari) ima obcasne tezave. Resitev: testirati in po potrebi zamenjati z nativnim `<input type="date">` ali popraviti Dialog interakcijo.

### 5.3 SREDNJA PRIORITETA: Preview URL ni v CORS allowlist
Med razvojem Edge funkcije ne delujejo iz Lovable preview URL-ja. Dodati `id-preview--*.lovable.app` vzorec ali tocen preview URL v CORS seznam za razvoj.

### 5.4 NIZKA PRIORITETA: Lea-ina narocnina s kratkim periodom
`current_period_end` je le 1 minuto po zacetku. Preveriti v Stripe, ali je narocnina pravilno aktivna in ali bo webhook pravilno posodobil status ob obnovi.

---

## 6. POVZETEK

| Funkcionalnost | Status | Komentar |
|----------------|--------|----------|
| Registracija + narocnina Lea | OK | Stripe pravilno sinhroniziran |
| Dodajanje otroka (desktop) | OK | Deluje pravilno |
| Dodajanje otroka (mobil) | TEZAVA | UI tezava s Calendar Dialog |
| Otrok viden na admin portalu | OK | Super admin vidi, logopedi po testu |
| Preverjanje izgovorjave (snemanje) | DELNO | Audio se shrani, DB zapis manjka |
| OŠ Test -- dodajanje otrok | OK | RLS pravilno nastavljene |
| OŠ Test -- pregledi in porocila | OK | Deluje pravilno |
| OŠ Test -- upravljanje napredka | OK | RLS pravilno omejene |
| CORS za produkcijo | OK | Pravilne domene |
| CORS za razvoj (preview) | NE DELUJE | Preview URL ni v allowlist |

### Predlagani popravki (po prioriteti):
1. **Dodati shranjevanje besednih rezultatov** v `articulation_word_results` znotraj `transcribe-articulation` funkcije
2. **Popraviti mobilni Calendar Dialog** za zanesljivo delovanje na iOS
3. **Dodati preview URL v CORS** za cas razvoja (z moznostjo odstranitve pred produkcijo)
4. **Preveriti Lea-ino Stripe narocnino** za pravilnost periodov

