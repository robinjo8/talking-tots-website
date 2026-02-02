

# Popravek centriranja obvestil na mobilni verziji

## Analiza problema

Iz slike je razvidno, da se okno z obvestili odpira na vrhu zaslona (kot Popover), namesto da bi se odprlo kot modal na sredini zaslona.

### Vzrok: Neusklajenost breakpointov

V kodi obstaja **neskladje med CSS breakpointi in JavaScript detekcijo**:

| Vir | Breakpoint | Logika |
|-----|------------|--------|
| CSS (`sm:hidden`) | 640px | Mobilni gumb viden pod 640px |
| CSS (`hidden sm:block`) | 640px | Desktop gumb viden nad 640px |
| `useIsMobile()` hook | 768px | Vrne `true` pod 768px |

**Problem v praksi:**
Pri širini zaslona med 640px-768px (npr. večji telefon v landscape načinu):
- CSS prikaže **desktop verzijo** z Popover-jem
- `useIsMobile()` vrne `true`, ampak to ni relevantno, ker je desktop gumb prikazan

Pri širini pod 640px:
- CSS prikaže **mobilni gumb**
- Ob kliku se izvede `handleBellClick()`, ki nastavi `mobileOpen = true`
- Modal bi se moral prikazati, ampak iz slike je vidno, da se prikazuje Popover

### Dejanski vzrok

Glede na sliko, ki prikazuje Popover na vrhu zaslona, je najverjetneje:
1. Uporabnik ima napravo s širino ≥640px (tablet ali večji telefon)
2. Prikazuje se desktop verzija z Popover-jem, ki se pozicionira glede na trigger element

## Rešitev

### Poenostavi na eno verzijo z dinamičnim preklopom

Namesto dveh ločenih DOM struktur (desktop in mobile) uporabi **eno strukturo**, ki se dinamično preklopi glede na `isMobile` vrednost:

1. **En sam gumb za zvonček** - brez CSS hide/show logike
2. **Pogojno odpiranje** - če je mobile, odpri modal; če je desktop, odpri Popover
3. **Uskladi breakpointe** - uporabi 768px tudi za CSS ali pa prilagodi hook na 640px

### Implementacija

```text
┌─────────────────────────────────────────┐
│           UserNotificationBell          │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │     Button (zvonček) - vedno    │    │
│  │     viden, en sam element       │    │
│  └─────────────────────────────────┘    │
│                  │                       │
│          onClick handler                 │
│                  │                       │
│     ┌────────────┴────────────┐         │
│     ▼                         ▼         │
│  isMobile?                 !isMobile?   │
│     │                         │         │
│  setMobileOpen(true)    setOpen(true)   │
│     │                         │         │
│  ┌──┴───────────┐     ┌──────┴──────┐  │
│  │ Fixed Modal  │     │   Popover   │  │
│  │ (centered)   │     │ (pod gumb)  │  │
│  └──────────────┘     └─────────────┘  │
└─────────────────────────────────────────┘
```

## Tehnične spremembe

**Datoteka:** `src/components/header/UserNotificationBell.tsx`

### 1. Odstrani ločene desktop/mobile sekcije

Zamenjaj dva ločena `<div>` elementa (eden z `hidden sm:block`, drugi z `sm:hidden`) z enim samim gumbom.

### 2. Prilagodi onClick logiko

```tsx
const handleBellClick = () => {
  if (isMobile) {
    setMobileOpen(true);
  } else {
    setOpen(true);
  }
};
```

### 3. Nova struktura komponente

```tsx
export function UserNotificationBell() {
  // ... obstoječa logika ...

  return (
    <>
      {/* En sam gumb - brez CSS breakpoint logike */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-8 w-8"
        onClick={handleBellClick}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="...">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Desktop: Popover - odprt samo ko !isMobile && open */}
      {!isMobile && open && (
        <Popover open={open} onOpenChange={setOpen}>
          {/* ... */}
        </Popover>
      )}

      {/* Mobile: Modal - odprt samo ko isMobile && mobileOpen */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-background rounded-xl shadow-xl w-[90vw] max-w-[350px] max-h-[80vh] overflow-hidden">
            {/* ... vsebina ... */}
          </div>
        </div>
      )}
    </>
  );
}
```

### 4. Pravilno pozicioniran Popover za desktop

Uporabi Popover z ročnim triggerjem, da se pravilno pozicionira:

```tsx
{!isMobile && (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <span /> {/* Neviden trigger za pozicioniranje */}
    </PopoverTrigger>
    <PopoverContent 
      className="w-80 p-0 z-50 bg-background border shadow-lg" 
      align="end" 
      sideOffset={8}
    >
      <NotificationContent ... />
    </PopoverContent>
  </Popover>
)}
```

## Rezultat

- **Na telefonu (< 768px):** Klik na zvonček odpre modal točno na sredini zaslona
- **Na desktopu (≥ 768px):** Klik na zvonček odpre Popover pod gumbom
- **Brez CSS breakpoint konfliktov** - logika je v celoti v JavaScript-u

