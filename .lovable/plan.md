

# Popravek predvajanja zvočnega posnetka ob dialogih

## Problem

Auto-play audio v `useArticulationTestNew.ts` se sproži takoj ko se slika naloži (`loading` postane `false`), ne glede na to ali je dialog (Info ali Resume) še odprt. Zato se za prvo besedo (pajek) zvok predvaja medtem ko uporabnik še bere obvestilo.

## Rešitev

Dodaj `autoPlayEnabled` flag v hook, ki ga stran kontrolira. Zvok se predvaja šele ko je flag `true`.

### Spremembe

**1. `src/hooks/useArticulationTestNew.ts`**
- Dodaj parameter `autoPlayEnabled: boolean = true`
- V auto-play `useEffect` dodaj pogoj: `if (!autoPlayEnabled) return;`
- Ko se `autoPlayEnabled` spremeni iz `false` → `true`, sproži predvajanje (za prvi/resume primer)

**2. `src/pages/ArtikuacijskiTest.tsx`**
- Dodaj state `const [testStarted, setTestStarted] = useState(false)`
- Posreduj `autoPlayEnabled={testStarted}` v hook
- V `onClose` info dialoga: nastavi `setTestStarted(true)` (po `initializeSession`)
- V `handleResume`: nastavi `setTestStarted(true)` (po zaprtju resume dialoga)
- Ob resume scenariju (`showResumeDialog = true`): `testStarted` ostane `false` dokler uporabnik ne klikne "Nadaljuj"

**3. `src/pages/admin/AdminArtikulacijskiTest.tsx`**
- Enaka logika z `autoPlayEnabled` flagom

### Tok za prvi zagon
1. Stran se odpre → `showInfoDialog = true`, `testStarted = false`
2. Slika se naloži, ampak `autoPlayEnabled = false` → brez zvoka
3. Uporabnik klikne "Nadaljuj" → `testStarted = true` → auto-play se sproži

### Tok za resume
1. Stran se odpre → `showResumeDialog = true`, `testStarted = false`
2. Slika se naloži, ampak `autoPlayEnabled = false` → brez zvoka
3. Uporabnik klikne "Nadaljuj" → `testStarted = true` → auto-play se sproži

