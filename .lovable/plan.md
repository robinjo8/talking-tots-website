
# Načrt: Implementacija sistema obvestil za logopede

## Pregled

Sistem obvestil bo deloval podobno kot Facebook-ov sistem - z zvončkom v header-ju, ki prikazuje število novih obvestil in ob kliku odpre dropdown z listo obvestil. Obvestila bodo strogo omejena na organizacijo, v katero je logoped vključen.

## Tipi obvestil

### Osnovna obvestila (prioriteta)
1. **Novo preverjanje** - Ko prispe novo preverjanje izgovorjave (status "pending") za organizacijo

### Dodatna smiselna obvestila
2. **Dodeljen primer** - Ko je logopedu dodeljen nov primer za pregled
3. **Opomnik za stare primere** - Primeri, ki so v obdelavi več kot 7 dni
4. **Zaključeno poročilo** - Ko je poročilo uspešno generirano
5. **Sistemska obvestila** - Pomembne posodobitve aplikacije

## Arhitektura rešitve

```text
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BAZA                            │
├─────────────────────────────────────────────────────────────┤
│  notifications                                              │
│  ├── id (uuid)                                              │
│  ├── organization_id (uuid) ← filtriranje po organizaciji  │
│  ├── recipient_id (uuid, nullable) ← za osebna obvestila   │
│  ├── type (enum: new_test, assigned, reminder, system)     │
│  ├── title (text)                                           │
│  ├── message (text)                                         │
│  ├── link (text, nullable) ← povezava do akcije            │
│  ├── is_read (boolean)                                      │
│  ├── created_at (timestamptz)                               │
│  └── related_session_id (uuid, nullable)                    │
├─────────────────────────────────────────────────────────────┤
│  notification_reads (za sledenje prebranosti)               │
│  ├── id (uuid)                                              │
│  ├── notification_id (uuid)                                 │
│  ├── user_id (uuid)                                         │
│  └── read_at (timestamptz)                                  │
└─────────────────────────────────────────────────────────────┘
```

## RLS politike za varnost

```sql
-- Logopedi lahko vidijo samo obvestila svoje organizacije
CREATE POLICY "Logopedists can view own org notifications"
ON notifications FOR SELECT
USING (
  organization_id = (
    SELECT organization_id FROM logopedist_profiles 
    WHERE user_id = auth.uid()
  )
  AND (recipient_id IS NULL OR recipient_id = auth.uid())
);
```

## Komponente za implementacijo

### 1. Baza podatkov (Supabase migracija)

- Ustvariti tabelo `notifications` z vsemi polji
- Ustvariti tabelo `notification_reads` za sledenje prebranosti
- Definirati RLS politike za omejitev dostopa po organizaciji
- Ustvariti trigger za avtomatsko kreiranje obvestila ob novem preverjanju

### 2. Hook `useNotifications`

```typescript
// src/hooks/useNotifications.ts
- Pridobi obvestila za organizacijo trenutnega uporabnika
- Real-time naročnina na Supabase za takojšnja obvestila
- Funkcije: markAsRead(), markAllAsRead(), getUnreadCount()
- Osvežuje se v realnem času z Supabase Realtime
```

### 3. Komponenta `NotificationDropdown`

```typescript
// src/components/admin/NotificationDropdown.tsx
- Dropdown meni, ki se odpre ob kliku na zvonček
- Prikazuje listo obvestil z ikono, naslovom in časom
- Možnost označiti kot prebrano
- Gumb "Označi vse kot prebrano"
- Povezava do strani /admin/notifications za vse obvestilo
```

### 4. Posodobitev `AdminHeader`

```typescript
// src/components/admin/AdminHeader.tsx
- Zamenjati statični zvonček z NotificationDropdown
- Prikazati število neprebranih obvestil
- Real-time posodobitve števca
```

### 5. Supabase funkcija za kreiranje obvestil

```sql
-- Trigger ob INSERT v articulation_test_sessions
CREATE FUNCTION create_new_test_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Najdi organizacijo (TomiTalk logoped = internal)
  INSERT INTO notifications (organization_id, type, title, message, link, related_session_id)
  SELECT 
    o.id,
    'new_test',
    'Novo preverjanje izgovorjave',
    'Novo preverjanje čaka na pregled',
    '/admin/pending',
    NEW.id
  FROM organizations o
  WHERE o.type = 'internal';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Vizualni dizajn

```text
┌──────────────────────────────────────┐
│  🔔 (3)                              │  ← Zvonček z badge-em
└──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Obvestila                   Vse ▸  │
├──────────────────────────────────────┤
│  ● Novo preverjanje izgovorjave     │
│    Marko, 5 let                      │
│    pred 2 minutama                   │
├──────────────────────────────────────┤
│  ○ Novo preverjanje izgovorjave     │
│    Ana, 4 leta                       │
│    pred 1 uro                        │
├──────────────────────────────────────┤
│  ○ Opomnik: Primer čaka 7+ dni      │
│    Luka, 6 let                       │
│    pred 3 urami                      │
├──────────────────────────────────────┤
│  [Označi vse kot prebrano]          │
└──────────────────────────────────────┘

● = neprebrano (poudarjeno, z modro piko)
○ = prebrano (navadna pisava)
```

## Datoteke za ustvariti/spremeniti

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `supabase/migrations/xxx_notifications.sql` | Nova | Tabele, RLS, trigger |
| `src/hooks/useNotifications.ts` | Nova | Hook za obvestila |
| `src/components/admin/NotificationDropdown.tsx` | Nova | Dropdown komponenta |
| `src/components/admin/NotificationItem.tsx` | Nova | Posamezno obvestilo |
| `src/components/admin/AdminHeader.tsx` | Posodobitev | Integracija dropdown-a |
| `src/integrations/supabase/types.ts` | Posodobitev | Tipi za notifications |

## Varnostni vidiki

1. **RLS politike** zagotavljajo, da logoped vidi samo obvestila svoje organizacije
2. **organization_id** je ključ za filtriranje - vsako obvestilo je vezano na organizacijo
3. **recipient_id** omogoča osebna obvestila (npr. dodeljen primer) samo za določenega uporabnika
4. Funkcija `is_internal_logopedist()` se uporablja za preverjanje dostopa

## Realtime posodobitve

Supabase Realtime se bo uporabljal za takojšnje posodobitve:

```typescript
// V useNotifications.ts
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `organization_id=eq.${profile.organization_id}`
  }, (payload) => {
    // Dodaj novo obvestilo v listo
    // Posodobi števec
  })
  .subscribe();
```

## Zaporedje implementacije

1. Ustvariti Supabase migracijo z tabelami in RLS
2. Posodobiti TypeScript tipe
3. Implementirati `useNotifications` hook
4. Ustvariti `NotificationItem` komponento
5. Ustvariti `NotificationDropdown` komponento
6. Posodobiti `AdminHeader` z integracijo
7. Testirati z različnimi organizacijami
