
# Načrt: Navodila za uporabo na strani /kako-deluje

## Povzetek
Stran `/kako-deluje` (KakoDeluje.tsx) bo posodobljena z obsežnimi navodili za uporabo aplikacije TomiTalk. Oblikovanje bo enako kot na strani `/splosni-pogoji`.

---

## Struktura vsebine

Stran bo vsebovala 13 poglavij:

1. **Uvod** - Kaj je TomiTalk in komu je namenjen
2. **Dodajanje otroškega profila** - Moj osebni načrt
3. **Stran "Moje aplikacije"** - Osrednja stran z vsemi razdelki
4. **Govorne igre** - 9 vrst interaktivnih iger (Spomin, Sestavljanke, Drsne sestavljanke, Igra ujemanja, Zaporedja, Labirint, Kolo besed, Bingo, Smešne povedi)
5. **Zaključek govornih iger** - Ponavljanje in nagrajevanje
6. **Kako poteka ponavljanje** - 3-sekundno odštevanje, pomoč s predvajanjem
7. **Zaključek in nagrada** - Zvezdice in nadaljevanje
8. **Govorne vaje** - Vaje za motoriko govoril
9. **Preverjanje izgovorjave** - 60 besed, 20 soglasnikov, snemanje
10. **Video navodila** - Strokovni video posnetki za 9 glasov
11. **Logopedski nasveti** - Strokovni članki in nasveti za starše
12. **Sistem nagrajevanja** - Zvezdice, zmajčki, pokali, sledenje napredku
13. **Stran "Moja stran"** - Grafični prikaz napredka, varnost in dostopnost

---

## Oblikovanje (enako kot /splosni-pogoji)

| Element | CSS razredi |
|---------|-------------|
| Container | `max-w-4xl mx-auto px-4 py-8 pt-24` |
| Glavni naslov (h1) | `text-3xl font-bold text-dragon-green mb-8` |
| Vsebinski wrapper | `prose prose-slate max-w-none space-y-6 text-justify` |
| Razdelek | `<section>` |
| Naslov razdelka (h2) | `text-2xl font-semibold text-foreground mb-4` |
| Podnaslov (h4) | `text-lg font-medium text-foreground mb-2 mt-4` |
| Odstavek (p) | `text-muted-foreground leading-relaxed` |
| Naslednji odstavek | `text-muted-foreground leading-relaxed mt-4` |
| Seznam (ul) | `list-disc list-inside text-muted-foreground space-y-2 mt-4` |
| Element seznama | `<li>` z `<strong>` za poudarjene dele |

---

## Spremembe datotek

| Datoteka | Akcija |
|----------|--------|
| `src/pages/KakoDeluje.tsx` | Zamenjava obstoječe vsebine z novimi navodili |

---

## Tehnična implementacija

Datoteka `KakoDeluje.tsx` bo vsebovala:

```typescript
import { FooterSection } from "@/components/home/FooterSection";
import Header from "@/components/Header";

const KakoDeluje = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Navodila za uporabo
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-justify">
          
          {/* 1. Uvod */}
          <section>
            <h2>1. Uvod – Kaj je TomiTalk in komu je namenjen</h2>
            <p>TomiTalk je slovenska digitalna aplikacija...</p>
            {/* Vsa vsebina iz uporabniškega vnosa */}
          </section>

          {/* 2. Dodajanje otroškega profila */}
          <section>
            <h2>2. Dodajanje otroškega profila in funkcija »Moj osebni načrt«</h2>
            <h4>Dodajanje otroka v profil</h4>
            <p>...</p>
            <h4>Spremljanje napredka</h4>
            <p>...</p>
            <h4>Moj osebni načrt (TomiTalk Pro)</h4>
            <p>...</p>
          </section>

          {/* ... nadaljnji razdelki 3-13 ... */}

        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default KakoDeluje;
```

---

## Struktura poglavij z vsebino

### Poglavje 1: Uvod
- Opis aplikacije TomiTalk
- Namen aplikacije (3 alineje)
- Pojasnilo, da ne nadomešča logopeda
- Zapolnjevanje vrzeli (3 alineje)
- Spremljanje napredka za starše

### Poglavje 2: Dodajanje otroškega profila
- Podnaslovi: Dodajanje otroka, Spremljanje napredka, Moj osebni načrt
- Razlaga vprašalnika in prilagajanja
- Primer za glasove š in ž

### Poglavje 3: Stran "Moje aplikacije"
- Seznam 6 razdelkov (Moj osebni načrt, Govorne igre, Govorne vaje, Preverjanje izgovorjave, Video navodila, Logopedski nasveti)

### Poglavje 4: Govorne igre
- 9 podigher z opisi (Spomin, Sestavljanke, Drsne sestavljanke, Igra ujemanja, Zaporedja, Labirint, Kolo besed, Bingo, Smešne povedi)

### Poglavje 5-7: Zaključek iger, ponavljanje, nagrade
- Pojavno okno za ponavljanje
- 3-sekundno odštevanje
- Gumb za predvajanje
- Vzemi zvezdico

### Poglavje 8: Govorne vaje
- Vaje za motoriko govoril
- Animacije in zvočna navodila

### Poglavje 9: Preverjanje izgovorjave
- 60 besed, 20 soglasnikov
- RMS analiza
- Takojšnja povratna informacija
- Ponovljivost (5-krat letno)

### Poglavje 10: Video navodila
- 9 glasov z video posnetki
- Logopedinja razlaga

### Poglavje 11: Logopedski nasveti
- Strokovni članki
- Nasveti za domače delo

### Poglavje 12: Sistem nagrajevanja
- Zvezdice, zmajčki, pokali
- Gamifikacija
- Beleženje aktivnosti

### Poglavje 13: Moja stran in varnost
- Grafični prikaz napredka
- Varna uporaba za otroke
- Vloga staršev
- Dostopnost 24/7

---

## Končni rezultat

Po implementaciji bo stran `/kako-deluje` vsebovala:
- Naslov "Navodila za uporabo"
- 13 poglavij z natančnimi navodili za uporabo TomiTalk
- Enako oblikovanje kot stran `/splosni-pogoji`
- Profesionalen izgled s strukturiranimi razdelki
