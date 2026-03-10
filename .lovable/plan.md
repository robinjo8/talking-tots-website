

# Pomoč in podpora — popravljeni plan

## Popravki glede na vaše pripombe

### Sklop 1: Naročnina

**Kako deluje podaljšanje naročnine?**
Naročnina se samodejno podaljša ob koncu obračunskega obdobja. Stripe samodejno pošlje e-poštna obvestila pred podaljšanjem in po uspešnem plačilu (to je vgrajena funkcija Stripe, ki jo je treba vklopiti v Stripe Dashboard > Settings > Customer emails). Trenutno to morda še ni vklopljeno — preveriti moramo nastavitve v Stripe Dashboard.

**Kako lahko prekinem naročnino?**
Popravljeno: naročnino upravljate na strani **Nastavitve** (`/profile`), v razdelku **Naročnina**, s klikom na gumb **Upravljaj naročnino**, ki vas preusmeri na Stripe portal. Tam lahko prekinete naročnino. Po prekinitvi ohranite dostop do konca obračunskega obdobja.

**Kako preverim svojo naročnino?**
Popravljeno: podatke o naročnini najdete na strani **Nastavitve** > razdelek **Naročnina**.

**Kje najdem račun?**
Stripe samodejno generira račune (invoices) ob vsakem plačilu naročnine. Po dokumentaciji Stripe se računi pošljejo po e-pošti samodejno, **če je to vklopljeno** v Stripe Dashboard (Settings > Customer emails > toggle "Successful payments"). Račune lahko uporabnik vidi tudi v Stripe portalu (gumb Upravljaj naročnino). V testnem načinu (test mode) se e-pošta ne pošilja. Predlagam, da v odgovoru napišemo: "Račune najdete v portalu za upravljanje naročnine (Nastavitve > Naročnina > Upravljaj naročnino)."

### Sklop 2: Plačila

**Katere vrste plačil podpirate?**
Da, Stripe omogoča plačila z Visa, Mastercard, American Express in drugimi karticami. To je dejstvo iz Stripe dokumentacije.

**Ali je plačilo varno?**
Stripe je certificiran po standardu PCI DSS Level 1 — to je javno dokumentirano na stripe.com/docs/security. Mi podatkov o karticah nikoli ne vidimo, ker gredo neposredno na Stripe.

**Ali lahko zamenjam plačilno metodo?**
Popravljeno: plačilno metodo spremenite v portalu za upravljanje naročnine, do katerega dostopate na strani **Nastavitve** > razdelek **Naročnina** > gumb **Upravljaj naročnino**.

### Sklop 3: Težave z dostopom
Vsebina ostane enaka (geslo, e-pošta, napake) — ste potrdili, da je OK.

### Sklop 4: Tehnična pomoč
Besedilo s kontaktom in linkom na pogosta vprašanja.

---

## Tehnične spremembe

### Datoteka
- `src/pages/PomocInPodpora.tsx` — celotna preoblikovanje

### Pristop
- Accordion komponenta iz obstoječega UI
- 4 sklopi z ikonami (CreditCard, Wallet, KeyRound, Headphones)
- Popravljeni odgovori z natančnimi referencami (Nastavitve > Naročnina > Upravljaj naročnino)
- Header + BreadcrumbNavigation
- CTA na dnu z linkom na `/clanki/pogosta-vprasanja` in `info@tomitalk.si`
- Stil: `max-w-4xl`, bele zaokrožene kartice

### Vprašanje za vas
Glede pošiljanja računov po e-pošti: Stripe to podpira samodejno, ampak mora biti vklopljeno v Stripe Dashboard (Settings > Customer emails). Ali želite, da to preverim/vklopim, ali za zdaj v odgovoru napišemo le, da so računi dostopni v portalu za upravljanje naročnine?

