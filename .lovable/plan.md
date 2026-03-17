

# Video stran — belo ozadje + desktop overlay kontrole

## Spremembe

### `GenericVideoNavodila.tsx`
1. **Ozadje**: `bg-dragon-green` → `bg-white` (belo ozadje za vse naprave)
2. **Desktop kontrole znotraj videa**: Odstrani ločene desktop kontrole pod videom. Namesto tega uporabi enak overlay pristop kot na mobilni verziji — progress bar + kontrole čez video z `overlay` in `compact` prop-i
3. **Auto-hide overlay**: Razširi auto-hide logiko tudi na desktop (ne samo `isMobile`) — overlay se skrije po 3s med predvajanjem, ob premiku miške ali kliku se prikaže
4. **Dinamična višina**: Prilagodi `controlsHeight` za desktop na ~16px (enako kot mobile), ker kontrole zdaj niso več pod videom
5. **handleVideoTap**: Razširi na desktop — ob kliku/premiku miške pokaži overlay

### Datoteke
- `src/components/games/GenericVideoNavodila.tsx`

