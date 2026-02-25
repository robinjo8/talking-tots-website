
Cilj: odpraviti primer, ko Tomi pri vprašanju “J namesto R” vrne generičen odgovor o vajah, namesto jasne usmeritve k logopedu ne glede na starost.

1) Kaj sem preveril (dejstva)
- Edge logs za `chat-assistant` kažejo: `file_search orodje UPORABLJENO` pri zadnjih klicih.
- To pomeni, da funkcija in povezava na Vector Store delujeta; težava ni v tem, da `file_search` sploh ne bi tekel.
- V kodi (`supabase/functions/chat-assistant/index.ts`) je `tool_choice: "required"` in `vector_store_ids: [OPENAI_VECTOR_STORE_ID]`, torej model vedno kliče iskanje po dokumentih.
- Secret `OPENAI_VECTOR_STORE_ID` obstaja v projektu.

2) Odgovor na tvoje vprašanje “Files ali Vector stores?”
- Za AI odgovor je ključno: datoteka mora biti v Vector Store, ki je nastavljen v `OPENAI_VECTOR_STORE_ID`.
- “Files” je samo skladišče datotek; samo upload v Files NI dovolj.
- Pravilno zaporedje:
  1. datoteko naložiš v Files
  2. to datoteko dodaš (attach) v pravi Vector Store
  3. počakaš, da je status “Ready”
- Če imaš več datotek z istim imenom, je pomembno, da je v Vector Store pripeta točno nova verzija (staro odstraniš).

3) Zakaj še vedno dobivaš napačen/generičen odgovor
Najverjetnejši razlog ni “ni v vector store”, ampak retrieval-ujemanje:
- Uporabniško vprašanje je formulirano kot “katere vaje”, model pa iz dokumentov morda ne dobi chunka z opozorilom “J namesto R/L -> logoped ne glede na starost”.
- Zaradi obstoječih pravil v promptu potem model varno preklopi na generični fallback (“v dokumentaciji ni specifičnih vaj ... posvet z logopedom”).

4) Predlagan tehnični popravek (brez posega v UI, samo backend)
A) V `supabase/functions/chat-assistant/index.ts` dodam “hard guardrail” v sistemska navodila:
- Če uporabnik omenja, da otrok glas R ali L zamenjuje z J, mora odgovor vključiti:
  “Če otrok glas L ali glas R zamenjuje z glasom J, je potreben obisk logopeda, ne glede na starost otroka.”
- Ta stavek bo zapisan dobesedno in visoko prioriteten.

B) Dodam lahkotno semantično normalizacijo vprašanja pred klicem Responses API:
- ob zaznavi vzorcev (`j namesto r`, `r z j`, `l z j`) se internemu poizvedovalnemu kontekstu doda še “zamenjuje z glasom J ne glede na starost logoped”.
- S tem povečamo verjetnost, da retrieval vrne pravi odstavek.

C) Dodam diagnostično logiranje (varno, brez osebnih podatkov):
- log, ali je bil zaznan “J↔R/L” vzorec
- log, ali je model vrnil fallback
- to omogoča hitro preverjanje, če se edge case ponovi.

5) Verifikacija po implementaciji
- Test 1: “moj otrok izgovarja J namesto R. katere vaje naj delamo?”
  - pričakovano: jasna usmeritev, da je potreben obisk logopeda ne glede na starost.
- Test 2: “moj otrok izgovarja J namesto L”
  - enako pričakovano vedenje.
- Test 3: splošno vprašanje o vajah brez J↔R/L
  - pričakovano: obstoječa logika ostane enaka (brez regresije).
- Test 4: end-to-end test v aplikaciji (UI + stream) na `/chat` toku, da se potrdi, da nič ne vpliva na delovanje klepeta.

6) Kaj to reši
- Odpravi konkretni primer, ki ga poročaš.
- Ohrani trenutno arhitekturo (Supabase Edge + file_search).
- Ne posega v igre, UI ali obstoječe podatkovne tokove, zato je tveganje za regresije nizko.
