
# Popravek obvestil na mobilni verziji - uporaba Dialog komponente

## Problem

Mobilni modal za obvestila se ne odpira na sredini zaslona, kljub večkratnim poskusom popravka. Ročno narejen overlay z `fixed inset-0 flex items-center justify-center` ne deluje pravilno.

## Rešitev

Uporabi **isto Dialog komponento** iz Radix UI, kot jo uporablja stran `/artikulacijski-test`. Ta komponenta ima vgrajeno pravilno centriranje:

```css
fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
```

## Spremembe

**Datoteka:** `src/components/header/UserNotificationBell.tsx`

### 1. Dodaj import Dialog komponente

```tsx
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
```

### 2. Zamenjaj ročni overlay z Dialog komponento

Namesto:
```tsx
{mobileOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="relative bg-background rounded-xl ...">
      ...
    </div>
  </div>
)}
```

Uporabi:
```tsx
<Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
  <DialogContent className="w-[90vw] max-w-[350px] max-h-[80vh] p-0 overflow-hidden">
    <NotificationContent
      notifications={notifications}
      unreadCount={unreadCount}
      isLoading={isLoading}
      markAsRead={markAsRead}
      markAllAsRead={markAllAsRead}
      onClose={() => setMobileOpen(false)}
    />
  </DialogContent>
</Dialog>
```

### 3. Končna struktura komponente

```tsx
export function UserNotificationBell() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useUserNotifications();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Gumb za zvonček */}
      {isMobile ? (
        <Button onClick={() => setMobileOpen(true)} ...>
          <Bell />
          {/* badge */}
        </Button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          {/* Desktop popover */}
        </Popover>
      )}

      {/* Mobile: Dialog - točno tako kot ArticulationTestInfoDialog */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="w-[90vw] max-w-[350px] max-h-[80vh] p-0 overflow-hidden">
          <NotificationContent ... />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Zakaj bo to delovalo

Dialog komponenta iz `src/components/ui/dialog.tsx` uporablja:
- `DialogPortal` - renderira vsebino izven DOM hierarhije
- `DialogOverlay` - temno ozadje z `fixed inset-0 z-50`
- `DialogContent` - vsebina s `fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`

To je **enaka** tehnika kot jo uporablja `ArticulationTestInfoDialog` na strani `/artikulacijski-test`, ki dokazano deluje.

## Rezultat

Modal za obvestila se bo na telefonu odprl **točno na sredini zaslona** - tako horizontalno kot vertikalno. Gumb X za zapiranje bo vgrajen v Dialog komponento.
