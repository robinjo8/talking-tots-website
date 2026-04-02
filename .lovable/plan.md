
## Analiza: Uporabnica logopedskezgodbe@gmail.com ne more dostopati do vsebine in ne more kupiti nove naročnine

### Ugotovitve

**Uporabnica**: Ema Vidmar (logopedskezgodbe@gmail.com), otrok Tristan

**Stanje v bazi** (`user_subscriptions`):
- `status`: **active** (napačno — naročnina je potekla)
- `current_period_end`: **2026-01-30** (pred 2 mesecema!)
- `stripe_product_id`: **prod_TmbZ19RhCaSzrp** — to je **STAR** product ID, ki ni v trenutni konfiguraciji (`stripeTiers` pozna samo `prod_TuvCF2Vlvmvp3M` za Start in `prod_TwXXpvPhSYVzvN` za Pro)
- `stripe_subscription_id`: sub_1Ssec4GncjlOci0kHP3Xwp2W

**Zakaj ne vidi vsebin**: Hook `useSubscription` pravilno preverja `current_period_end > now()` — ker je datum v preteklosti, jo obravnava kot nenaročeno. Pravilno vedenje.

**Zakaj ne more kupiti nove naročnine**: Funkcija `create-checkout` (vrstica 94-108) preverja v Stripe API ali ima uporabnica `active` ali `trialing` naročnino. Če Stripe še vedno vodi staro naročnino kot aktivno (npr. `past_due` ali nezaključeno), jo blokira z napako. Ker frontend ujame napako generično, vidi le "Napaka pri ustvarjanju naročnine."

### Popravki

**1. Podatkovni popravek (SQL migracija)**

Posodobi njen zapis v `user_subscriptions`:
- `status` → `'expired'` (ker je `current_period_end` v preteklosti)

To ne bo rešilo checkout težave (ta je na Stripe strani), ampak bo baza pravilna.

**2. Izboljšaj `create-checkout` edge function**

Trenutna logika (vrstice 94-108) preverja samo `active` in `trialing` naročnine v Stripe. Če ima uporabnik staro naročnino ki je `past_due`, `unpaid` ali kako drugače "živa" v Stripe, jo mora najprej preklicati preden lahko kupi novo.

Popravek: Če najde obstoječo naročnino, preveri ali je `current_period_end` v preteklosti. Če je, naročnino avtomatsko prekliče v Stripe (ali pa jo ignorira) in nadaljuje z novim checkoutom. Dodaj tudi boljše sporočilo napake ki se vrne frontendu.

**3. Izboljšaj frontend error handling**

V `PricingSection.tsx` in `SubscriptionSection.tsx`: namesto generične napake prikaži specifično sporočilo iz edge function (npr. "Že imate aktivno naročnino" ali "Stara naročnina je bila preklicana, poskusite znova").

### Takojšnji ročni popravek za to uporabnico

Preveri stanje naročnine v Stripe dashboardu za `cus_TqLHHHderinuGR` / `sub_1Ssec4GncjlOci0kHP3Xwp2W`. Če je naročnina še "active" ali "past_due", jo ročno prekliči v Stripe. Nato posodobi DB status na `expired`.

### Obseg
- `supabase/functions/create-checkout/index.ts` — dodaj logiko za preklic starih potečenih naročnin (~15 vrstic)
- `src/components/PricingSection.tsx` + `src/components/profile/SubscriptionSection.tsx` — boljši error handling (~5 vrstic vsaka)
- 1 SQL migracija za popravek statusa te uporabnice
- Deploy edge function
