
# Načrt: Popravek sistema obvestil za uporabnika

## Ugotovljeni problemi

1. **Zvonček se ne prikazuje na namizju** - komponenta `UserNotificationBell` je dodana samo v `MobileMenu.tsx`, manjka v `DesktopNavigation.tsx`
2. **Obvestilo samo prenese datoteko** - namesto da preusmeri uporabnika na `/profile?expandSection=myDocuments`
3. **Obvestila se ne označijo kot prebrana** ko uporabnik odpre zavihek "Moji dokumenti"

---

## Vizualni cilj

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  DESKTOP HEADER                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  TomiTalk | Cenik | Logopedski nasveti | ...      [🔔 2] [Avatar ŽAK ▾] │
│                                                     ↑                   │
│                                            Zvonček z števcem            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  MOBILE HEADER                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  TomiTalk                                       [🔔 2] [ŽAK] [☰]        │
│                                                   ↑                     │
│                                          Zvonček levo od imena          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Spremembe

### 1. DesktopNavigation.tsx - Dodaj zvonček

Dodaj `UserNotificationBell` levo od uporabniškega profila:

```typescript
import { UserNotificationBell } from "./UserNotificationBell";

// V return statement, desno pred UserProfile:
<div className="flex items-center gap-2">
  {user && <UserNotificationBell />}
  {user ? (
    <UserProfile />
  ) : (
    // ... login buttons
  )}
</div>
```

### 2. UserNotificationBell.tsx - Preusmeri na "Moji dokumenti"

Namesto prenosa datoteke, preusmeri uporabnika na stran `/profile` z odprtim zavihkom "Moji dokumenti":

```typescript
import { useNavigate } from 'react-router-dom';

function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Označi kot prebrano
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    // Zapri popover
    onClose?.();
    // Preusmeri na Moji dokumenti
    navigate('/profile?expandSection=myDocuments');
  };

  return (
    <div onClick={handleClick}>
      {/* ... vsebina obvestila ... */}
      <p>Logopedsko poročilo je bilo naloženo</p>
    </div>
  );
}
```

### 3. MyDocumentsSection.tsx - Označi vsa obvestila kot prebrana

Ko uporabnik odpre zavihek "Moji dokumenti", označi vsa obvestila kot prebrana:

```typescript
import { useUserNotifications } from '@/hooks/useUserNotifications';

export function MyDocumentsSection() {
  const { markAllAsRead } = useUserNotifications();

  // Ko se komponenta prikaže, označi vsa obvestila kot prebrana
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);
  
  // ... ostala koda
}
```

### 4. Izboljšaj izgled obvestila

Besedilo obvestila naj bo bolj jasno:

```text
┌─────────────────────────────────────────────────────┐
│  🟠  📄  Logopedsko poročilo naloženo               │
│           Za otroka: Žak                            │
│           pred 2 h                                  │
│                                          [Odpri →] │
└─────────────────────────────────────────────────────┘
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/components/header/DesktopNavigation.tsx` | Posodobi | Dodaj `UserNotificationBell` levo od `UserProfile` |
| `src/components/header/UserNotificationBell.tsx` | Posodobi | Spremeni klik na navigacijo namesto prenosa, izboljšaj besedilo |
| `src/components/profile/MyDocumentsSection.tsx` | Posodobi | Dodaj `useEffect` za označitev vseh obvestil kot prebrana |

---

## Tok uporabnika (po popravku)

```text
1. Uporabnik prejme novo poročilo logopeda
   ↓
2. Zvonček v headerju prikaže število (npr. "1")
   ↓
3. Uporabnik klikne na zvonček → odpre se popover
   ↓
4. V popover-ju vidi: "Logopedsko poročilo naloženo - Za otroka: Žak"
   ↓
5. Klikne na obvestilo → preusmeri na /profile?expandSection=myDocuments
   ↓
6. Zavihek "Moji dokumenti" se odpre
   ↓
7. Ob odprtju zavihka se vsa obvestila označijo kot prebrana
   ↓
8. Število na zvončku izgine
```

---

## Pričakovani rezultat

- Zvonček je viden na **namizju IN mobilni napravi**
- Obvestilo prikaže jasno sporočilo "Logopedsko poročilo naloženo"
- Klik na obvestilo preusmeri na zavihek "Moji dokumenti"
- Ob odprtju zavihka se obvestila **samodejno označijo kot prebrana**
- Število na zvončku izgine, ko uporabnik pregleda dokumente
