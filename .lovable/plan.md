

# Plan: Takojšnje zmanjšanje števca obvestil ob kliku

## Povzetek problema

Ko uporabnik (admin ali starš) klikne na obvestilo v zvončku, se številka nad zvončkom ne zmanjša takoj, ker admin hook (`useNotifications.ts`) počaka na odgovor iz baze (Supabase), preden posodobi lokalno stanje. Vmes se popover zapre in uporabnik vidi staro številko.

## Analiza obeh portalov

### Admin portal (`useNotifications.ts`)

**Problem:** `markAsRead` je asinhrona funkcija, ki **najprej piše v bazo**, nato šele posodobi lokalni state:

```text
1. Klik na obvestilo
2. markAsRead() se pokliče
3. await supabase.insert(...)   ← ČAKA na bazo (200-500ms)
4. setUnreadCount(prev - 1)     ← Šele zdaj se posodobi števec
5. onClose()                    ← Popover se zapre
```

Uporabnik vidi staro številko, ker se popover zapre preden se čakanje na bazo konča.

### Uporabniški portal (`useUserNotifications.ts`)

**Stanje:** Deluje pravilno, ker je `markAsRead` sinhrona funkcija (localStorage). Števec se posodobi takoj.

## Rešitev: Optimistično posodabljanje (Optimistic Update)

Spremenimo vrstni red operacij v admin hooku - **najprej posodobimo lokalno stanje** (takoj), **nato zapišemo v bazo**. Če zapis v bazo ne uspe, povrnemo staro stanje.

### Spremembe v `src/hooks/useNotifications.ts`

#### `markAsRead` - nova logika:

```text
1. Klik na obvestilo
2. markAsRead() se pokliče
3. setUnreadCount(prev - 1)     ← TAKOJ posodobi števec
4. setNotifications(...)        ← TAKOJ označi kot prebrano
5. supabase.insert(...)         ← V ozadju zapiši v bazo
6. Če napaka → povrni stanje   ← Rollback pri napaki
```

Konkretno:

```typescript
const markAsRead = useCallback(async (notificationId: string) => {
  if (!user?.id) return;

  // 1. Preveri ali je že prebrano (prepreči dvojno zmanjšanje)
  const notification = notifications.find(n => n.id === notificationId);
  if (!notification || notification.is_read) return;

  // 2. Optimistično posodobi stanje TAKOJ
  setNotifications(prev =>
    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
  );
  setUnreadCount(prev => Math.max(0, prev - 1));

  // 3. Zapiši v bazo v ozadju
  try {
    const { error } = await supabase
      .from('notification_reads')
      .insert({ notification_id: notificationId, user_id: user.id });

    if (error && error.code !== '23505') {
      // Povrni stanje pri napaki
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    }
  } catch (error) {
    // Povrni stanje pri napaki
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
    );
    setUnreadCount(prev => prev + 1);
  }
}, [user?.id, notifications]);
```

#### `markAllAsRead` - nova logika:

Enako - najprej posodobi stanje, nato zapiši v bazo:

```typescript
const markAllAsRead = useCallback(async () => {
  if (!user?.id) return;

  const unreadNotifications = notifications.filter(n => !n.is_read);
  if (unreadNotifications.length === 0) return;

  // 1. Optimistično posodobi TAKOJ
  setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  setUnreadCount(0);

  // 2. V ozadju zapiši v bazo
  try {
    const inserts = unreadNotifications.map(n => ({
      notification_id: n.id,
      user_id: user.id,
    }));

    const { error } = await supabase
      .from('notification_reads')
      .upsert(inserts, { onConflict: 'notification_id,user_id' });

    if (error) {
      // Povrni stanje
      setNotifications(prev =>
        prev.map(n => {
          const wasUnread = unreadNotifications.some(u => u.id === n.id);
          return wasUnread ? { ...n, is_read: false } : n;
        })
      );
      setUnreadCount(unreadNotifications.length);
    }
  } catch (error) {
    // Povrni stanje
    setNotifications(prev =>
      prev.map(n => {
        const wasUnread = unreadNotifications.some(u => u.id === n.id);
        return wasUnread ? { ...n, is_read: false } : n;
      })
    );
    setUnreadCount(unreadNotifications.length);
  }
}, [notifications, user?.id]);
```

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useNotifications.ts` | Optimistično posodabljanje v `markAsRead` in `markAllAsRead` |

Uporabniški portal (`useUserNotifications.ts`) **ne potrebuje sprememb** - tam je `markAsRead` že sinhrona in deluje pravilno.

## Rezultat

| Scenarij | Prej | Potem |
|----------|------|-------|
| Admin klikne 1 obvestilo | Števec se posodobi z zamikom (200-500ms) | Števec se posodobi takoj |
| Admin klikne "Označi vse" | Števec se posodobi z zamikom | Števec se posodobi takoj |
| Napaka pri zapisu v bazo | Števec se ne posodobi (ostane stara vrednost) | Števec se takoj posodobi, ob napaki se povrne nazaj |
| Uporabniški portal | Deluje pravilno (brez sprememb) | Deluje pravilno (brez sprememb) |

## Testiranje

1. Prijavi se kot logoped v admin portal
2. Klikni zvonček - preveri, da so obvestila prikazana
3. Klikni na eno obvestilo - preveri, da se števec nad zvončkom takoj zmanjša za 1
4. Klikni "Označi vse" - preveri, da števec takoj pokaže 0
5. Prijavi se kot starš - preveri, da tudi tam obvestila pravilno delujejo

