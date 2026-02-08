

# Popolna zaostrite system prompta - odstranitev vseh dovoljil za splošno znanje

## Problem

System prompt vsebuje notranji konflikt. Zgodnji del (vrstice 37-73) eksplicitno dovoli uporabo "established speech-language pathology principles", "developmental milestones" in splošnih logopedskih načel. Poznejša pravila (vrstice 75-100) to prepovedujejo, ampak model daje prednost zgodnejšim navodilom in generira odgovore iz splošnega znanja.

Rezultat: model pokliče file_search (ker je tool_choice required), ampak potem IGNORIRA rezultate in odgovori iz svojega treniranega znanja o logopediji.

## Rešitev

Celoten system prompt je treba prepisati tako, da:
1. Nikjer ne omenja "established speech-language pathology principles" ali "developmental milestones" kot vir odgovorov
2. OD PRVEGA STAVKA jasno pove, da so edini vir dokumenti iz file_search
3. Odstrani vse stavke, ki modelu "dovolijo" splošno znanje
4. Doda eksplicitno pravilo: "Če file_search ne vrne relevantnih dokumentov, NE odgovarjaj iz svojega znanja"

## Spremembe

### Datoteka: `supabase/functions/chat-assistant/index.ts`

Prepiše se celoten `systemInstructions` blok. Ključne spremembe:

### 1. Odstrani konfliktne stavke iz uvodnega dela

**Odstrani** (sedaj vrstica 43):
```
You base your responses exclusively on established speech-language pathology 
principles, developmental milestones, evidence-based logopedic practice, and the 
content of documents provided within the TomiTalk system.
```

**Zamenjaj z**:
```
You base your responses EXCLUSIVELY on the content of documents retrieved via 
file_search. You do NOT use your general training knowledge about speech therapy, 
exercises, or techniques.
```

### 2. Odstrani stavke o razvojnih mejnikih iz splošnega znanja

**Odstrani** (sedaj vrstica 65):
```
You understand that speech and language development is individual but follows 
general developmental patterns. You explain what is developmentally typical for a 
given age and what may represent increased risk, without making definitive 
conclusions.
```

**Zamenjaj z**:
```
If the documents contain information about developmental patterns or milestones, 
you may reference that information. If documents do NOT contain this information, 
you must NOT explain developmental milestones from your general knowledge. 
Instead say: "Za informacije o razvojnih mejnikih priporočam posvet z logopedom."
```

### 3. Odstrani splošna navodila o pristopih

**Odstrani** (sedaj vrstica 69):
```
You emphasize positive reinforcement, gradual progress, repetition, and play-based 
learning. You avoid alarming language, absolute statements, and labels.
```

**Zamenjaj z**:
```
You avoid alarming language, absolute statements, and labels. Your tone is 
supportive and encouraging.
```

### 4. Dodaj novo pravilo za prazen file_search rezultat

Na konec pravil o virih informacij dodaj:
```
Če file_search vrne rezultate, ki NISO relevantni za vprašanje uporabnika, 
obravnavaj to ENAKO kot da dokumentov ni. NE uporabi rezultatov kot "inspiracijo" 
za generiranje lastnega odgovora.

Tvoj odgovor MORA biti kratek (največ 3-4 stavke) če v dokumentih ni neposredno 
relevantnih informacij. V tem primeru uporabnika usmeri na:
1. Preverjanje neposredno v aplikaciji TomiTalk
2. Posvet z logopedom

NE SMEŠ nikoli napisati seznama z več kot 2 točkama, če vsebina NI dobesedno iz 
dokumentov.
```

### 5. Dodaj še en negativni primer (za točno ta scenarij)

```
PRIMER NAPAČNEGA ODGOVORA #2 (NE SMEŠ tako odgovoriti):
"Za 9-letnika so primerne vaje, ki so prilagojene njegovi starosti... logopedi 
uporabljajo igrive vaje in igre za spodbujanje govora, slikovne materiale, kartice 
s podobami..."
- To je NAPAČNO ker je seznam vaj iz splošnega znanja, ne iz dokumentov.

PRIMER PRAVILNEGA ODGOVORA #2:
"V dokumentaciji TomiTalk sem poiskal informacije o vajah za starost 9 let. 
[Če najde: naštej SAMO tisto kar piše v dokumentih]. 
[Če ne najde: V dokumentaciji trenutno ne najdem specifičnih priporočil za to 
starostno skupino. Priporočam, da preverite razpoložljive vaje neposredno v 
aplikaciji TomiTalk ali se posvetujete z logopedom.]"
```

## Kaj se NE spremeni
- Frontend koda ostane enaka
- API parametri (model, temperature, tool_choice) ostanejo enaki
- Logika za child context ostane enaka
- Logika za shranjevanje pogovorov ostane enaka
- Logiranje file_search uporabe ostane enako

## Pričakovani rezultat
Po teh spremembah bo Tomi:
- Odgovarjal IZKLJUČNO na podlagi dokumentov iz Vector Store
- Ob odsotnosti relevantnih dokumentov dal KRATEK odgovor (3-4 stavke) in usmeril na logopeda ali aplikacijo
- Ne bo več generiral dolgih seznamov vaj, tehnik ali metod iz splošnega znanja
- Jasno povedal, če v dokumentih ni informacij, namesto da jih "izmisli"

