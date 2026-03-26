

## Plan: Omejitev simulacijskih orodij na dva razvojna uporabnika

### Problem
Trenutno so vsa simulacijska/testna orodja (simulacija preverjanja izgovorjave, ponastavitev testa, ponastavitev dodatnega preverjanja) vidna VSEM prijavljenim uporabnikom na strani Profil. Ko bo stran javna, to predstavlja varnostno tveganje — kdorkoli bi lahko manipuliral svoje podatke.

### Varnostni pristop — dvoslojna zaščita

**Sloj 1 (Frontend):** Orodja se prikažejo samo če je email uporabnika enak `qjavec@gmail.com` ali `kuajvec.robert@gmail.com`. Brez teh emailov se sekcija "Orodja za testiranje" sploh ne renderira.

**Sloj 2 (Backend — Edge funkcije):** Vsaka Edge funkcija (`simulate-articulation-test`, `reset-articulation-test`, `reset-additional-test`, in nova `simulate-plan-lifecycle`) na začetku preveri email uporabnika iz JWT tokena. Če email NI na dovoljeni listi, funkcija vrne `403 Forbidden`. To prepreči klice prek DevTools, Postman ali kateregakoli drugega orodja.

### Spremembe

**1. Nova konstanta za dovoljene emaile**

Ustvarim `src/lib/devAccess.ts`:
```ts
const DEV_EMAILS = ['qjavec@gmail.com', 'kuajvec.robert@gmail.com'];
export const isDevUser = (email?: string | null) => 
  !!email && DEV_EMAILS.includes(email);
```

**2. `src/components/profile/ArticulationTestProfileSection.tsx`**

Uvozim `useAuth` in `isDevUser`. Celotno sekcijo "Orodja za testiranje" (vrstice 197-249) ovij z `{isDevUser(user?.email) && ( ... )}`. Če uporabnik ni razvojni, se sekcija ne prikaže.

**3. `src/components/profile/PlanLifecycleTools.tsx`** (nova komponenta iz odobrenega plana)

Enako — celotna komponenta se prikaže samo za `isDevUser`.

**4. `src/components/profile/ProfileSidebar.tsx`**

Meni element "Lifecycle orodja" se prikaže samo za `isDevUser`.

**5. Edge funkcije — backend zaščita**

V vsako od naslednjih funkcij dodam preverjanje emaila:
- `supabase/functions/simulate-articulation-test/index.ts`
- `supabase/functions/reset-articulation-test/index.ts`
- `supabase/functions/reset-additional-test/index.ts`
- `supabase/functions/simulate-plan-lifecycle/index.ts` (nova)

Logika v vsaki funkciji:
```ts
const ALLOWED_EMAILS = ['qjavec@gmail.com', 'kuajvec.robert@gmail.com'];

// Po ekstrakciji userId iz JWT:
const { data: userData } = await adminClient.auth.admin.getUserById(userId);
if (!userData?.user?.email || !ALLOWED_EMAILS.includes(userData.user.email)) {
  return new Response(JSON.stringify({ error: 'Forbidden' }), { 
    status: 403, headers: corsHeaders 
  });
}
```

Uporabim `service_role` client za pridobitev emaila iz `auth.users`, ker JWT ne vsebuje vedno emaila.

### Zakaj je to varno

1. **Frontend skrije gumbe** — navaden uporabnik ne vidi ničesar
2. **Backend zavrne zahtevo** — tudi če nekdo najde URL Edge funkcije in jo pokliče z DevTools ali Postman, dobi 403
3. **Email se preverja na strežniku** — ni mogoče ponarediti, ker se bere iz `auth.users` tabele z `service_role`
4. **Ni hardcodiranih gesel** — preverjanje temelji na avtentikaciji Supabase

### Obseg
- 1 nova datoteka (`src/lib/devAccess.ts`)
- 1 spremenjena komponenta (ArticulationTestProfileSection.tsx)
- 4 Edge funkcije posodobljene z email preverjanjem
- Sidebar/MobileTabs pogojno prikazujeta lifecycle orodja
- Nova Edge funkcija `simulate-plan-lifecycle` + nova UI komponenta `PlanLifecycleTools.tsx` (iz prej odobrenega plana) — oboje z email omejitvijo

