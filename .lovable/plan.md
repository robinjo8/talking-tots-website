

# Premik AI Klepeta v hamburger meni in poenostavitev v "messenger" stil

## Povzetek
Klepet (prej "AI Klepet") se odstrani iz strani /profile in se premakne pod hamburger meni kot poseben zavihek pod "NASTAVITVE". Poleg tega se klepet poenostavi tako, da ima uporabnik samo eno neprekinjeno zgodovino pogovorov (messenger stil) -- brez vec locenih pogovorov in brez gumba "+ Nov pogovor".

## Spremembe

### 1. Dodaj "KLEPET" gumb v hamburger meni (MobileMenu.tsx)
- V sekciji "Nastavitve" (pod "Moja narocnina") dodaj nov gumb **Klepet** z ikono `MessageCircle`
- Ob kliku odpre novo stran `/klepet`

### 2. Dodaj "KLEPET" gumb v desktop navigacijo (DesktopNavigation.tsx)
- Dodaj gumb "Klepet" pod zavihek "Nastavitve" v desktop headerju (ali kot locen zavihek poleg nastavitev)

### 3. Ustvari novo stran /klepet (src/pages/Klepet.tsx)
- Samostojna stran s headerjem in ChatInterface komponento
- Polna visina zaslona za messenger obcutek

### 4. Registriraj novo pot v routes (src/config/routes.tsx)
- Dodaj lazy-loaded route za `/klepet`

### 5. Poenostavi useChatAssistant hook
- Namesto 5 locenih pogovorov: uporabnik ima samo **eno** conversation (messenger stil)
- Ob prvem sporocilu se ustvari conversation (ce se ne obstaja), sicer se uporabi obstojecega
- Ob nalaganju se avtomatsko nalozi vsa zgodovina sporocil
- Odstrani: `conversations` seznam, `loadConversation`, `startNewConversation`, `activeConversationId`
- Dodaj: avtomatsko nalaganje edine konverzacije ob inicializaciji

### 6. Poenostavi ChatInterface.tsx
- Odstrani vrstico s preteklimi pogovori (conversation history bar) in gumb "+ Nov pogovor"
- Ohrani vse ostalo: predlagana vprasanja, sporocila, input, disclaimer

### 7. Odstrani klepet iz /profile
- Iz ProfileSidebar.tsx odstrani "AI Klepet" vnos
- Iz ProfileMobileTabs.tsx odstrani "AI Klepet" tab
- Iz Profile.tsx odstrani prikaz AIChatSection
- AIChatSection.tsx se lahko ohrani ali preoblikuje za uporabo na novi strani

---

## Tehnicni podrobnosti

### useChatAssistant -- nova logika (messenger stil)
```text
1. Ob mount-u (useEffect):
   - Poisci prvo (edino) chat_conversation za user_id
   - Ce obstaja: nalozi vsa sporocila iz chat_messages
   - Ce ne obstaja: ne naredi nicesar (ustvari ob prvem sporocilu)

2. Ob posiljanju sporocila:
   - Ce ni conversation: ustvari eno z naslovom "Klepet"
   - Shrani user sporocilo
   - Poklic edge function
   - Shrani assistant odgovor
```

### Datoteke za urejanje:
1. `src/hooks/useChatAssistant.ts` -- poenostavitev na 1 konverzacijo
2. `src/components/chat/ChatInterface.tsx` -- odstranitev conversation bar
3. `src/components/header/MobileMenu.tsx` -- dodaj Klepet gumb
4. `src/components/header/DesktopNavigation.tsx` -- dodaj Klepet gumb
5. `src/components/profile/ProfileSidebar.tsx` -- odstrani AI Klepet
6. `src/components/profile/ProfileMobileTabs.tsx` -- odstrani AI Klepet tab
7. `src/pages/Profile.tsx` -- odstrani AIChatSection
8. `src/pages/Klepet.tsx` -- nova stran (ustvari)
9. `src/config/routes.tsx` -- dodaj route

