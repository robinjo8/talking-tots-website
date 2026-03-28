

## Plan: Omeji upravljanje otrok za zunanje organizacije (ne TomiTalk)

### Problem
Logopedi zunanjih organizacij (npr. OŠ Test) lahko na `/admin/children` kliknejo Podrobnosti, Napredek, Začni delo za otroke drugih logopedov. Na `/admin/all-tests` lahko kliknejo Ogled in odprejo seje/posnetke tujih otrok. To mora biti omejeno — samo za svoje otroke.

**TomiTalk (internal) logopedi ostanejo nespremenjeni** — popoln dostop kot doslej.

### Spremembe

**1. `src/hooks/useAdminTests.ts` — dodaj `logopedist_id` v `TestSessionData`**

Dodaj polje `logopedist_id: string | null` v interface `TestSessionData`. V build rezultatu nastavi vrednost iz `logopedistChildrenMap` (že se fetcha). Dodaj tudi v `ChildGroup` interface.

**2. `src/pages/admin/AdminChildren.tsx` — omeji gumbe Podrobnosti, Napredek, Začni delo**

Dodaj pogoj `canManage` za vse akcijske gumbe (ne samo Uredi/Izbriši):
```ts
const canManage = !isOrgLicense || child.is_own_child || profile?.organization_type === 'internal';
```
- Podrobnosti: `disabled={!canManage}`
- Napredek: `disabled={!canManage}`
- Začni delo: `disabled={!canManage}`
- Uredi, Izbriši: že imajo pogoj — ostanejo kot so

**3. `src/pages/admin/AdminTests.tsx` — omeji gumb Ogled**

Uvozi `useAdminAuth`. Za vsako sejo v razširjeni vrstici (desktop + mobile) preveri:
```ts
const canView = profile?.organization_type === 'internal' 
  || session.source_type === 'parent'  // parent sessions vidijo samo interni
  || session.logopedist_id === profile?.id;  // svoja seja
```
Gumb Ogled dobi `disabled={!canView}` s tooltipom "Lahko gledate samo seje svojih otrok".

**4. `src/pages/admin/AdminSessionReview.tsx` — zaščita na nivoju strani**

Dodaj preverjanje po nalaganju podatkov: če logopedist ni interni IN seja ne pripada njegovemu otroku (`logopedist_child_id` → `logopedist_children.logopedist_id !== profile.id`), preusmeri na `/admin/all-tests` s toast sporočilom.

### Kaj ostane nespremenjeno
- TomiTalk (internal) logopedi: brez kakršnihkoli sprememb
- Vidnost seznama otrok na `/admin/children`: vsi v org še vedno vidijo vse otroke
- Vidnost seznama sej na `/admin/all-tests`: vsi v org še vedno vidijo vse seje v tabeli
- RLS politike: brez sprememb (UI omejitev zadošča, RLS že preprečuje nepooblaščene operacije)

### Obseg
- `src/hooks/useAdminTests.ts` — dodaj `logopedist_id` polje (~5 vrstic)
- `src/pages/admin/AdminChildren.tsx` — dodaj `disabled` na 3 gumbe (~6 vrstic)
- `src/pages/admin/AdminTests.tsx` — pogojno onemogoči Ogled (~15 vrstic)
- `src/pages/admin/AdminSessionReview.tsx` — zaščita dostopa (~10 vrstic)

