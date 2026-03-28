

## Plan: Interni logopedi (TomiTalk) lahko urejajo vse otroke organizacije

### Trenutno stanje

**UI** (`AdminChildren.tsx`): Gumba Uredi in Izbriši sta `disabled` za vse organizacijske otroke, ki niso "lastni" (`isOrgLicense && !child.is_own_child`). To velja enako za TomiTalk (internal) in šolske organizacije.

**RLS** (`logopedist_children`): UPDATE in DELETE politike dovoljujejo samo operacije nad otroki, kjer je `logopedist_id` enak ID-ju prijavljenega logopeda. Torej tudi če UI omogoči gumb, baza zavrne posodobitev tujega otroka.

### Kaj je treba spremeniti

**1. UI — `AdminChildren.tsx`**
Sprememba pogoja za `disabled` na gumbih Uredi/Izbriši:
```ts
// PREJ:
disabled={isOrgLicense && !child.is_own_child}

// POTEM:
disabled={isOrgLicense && !child.is_own_child && profile?.organization_type !== 'internal'}
```
Interni logopedi (TomiTalk) bodo lahko urejali in brisali vse otroke. Šolski logopedi ostanejo omejeni na svoje.

**2. RLS — nova politika za UPDATE na `logopedist_children`**
```sql
CREATE POLICY "Internal logopedists can update org children"
ON public.logopedist_children
FOR UPDATE
TO authenticated
USING (is_internal_logopedist(auth.uid()))
WITH CHECK (is_internal_logopedist(auth.uid()));
```

**3. RLS — nova politika za DELETE na `logopedist_children`**
```sql
CREATE POLICY "Internal logopedists can delete org children"
ON public.logopedist_children
FOR DELETE
TO authenticated
USING (is_internal_logopedist(auth.uid()));
```

### Kaj ostane nespremenjeno
- Šolske organizacije (`school`, `kindergarten`, `private`): samo lastne otroke lahko urejajo/brišejo
- Vidnost: vsi člani organizacije še vedno vidijo vse otroke (obstoječa SELECT politika)
- `useLogopedistChildren.ts` hook: brez sprememb (podatki se že pravilno nalagajo)

### Obseg
- 1 UI datoteka (`AdminChildren.tsx`) — 2 vrstici spremenjeni
- 1 DB migracija — 2 novi RLS politiki

