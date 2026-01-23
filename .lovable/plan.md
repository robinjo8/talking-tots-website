
# Načrt: Popravek napake pri prevzemu primera

## Problem

Ko kliknete "Prevzemi", dobite napako:
> "insert or update on table 'articulation_test_sessions' violates foreign key constraint 'articulation_test_sessions_assigned_to_fkey'"

**Vzrok**: Hook `useClaimTestSession` poskuša shraniti `user.id` (ID uporabnika iz avtentikacije) v stolpec `assigned_to`, vendar ta stolpec zahteva ID iz tabele `logopedist_profiles`.

## Rešitev

Spremeniti moramo hook, da namesto `user.id` uporabi `profile.id`:

### Sprememba v useClaimTestSession.ts

**Prej:**
```typescript
const { user } = useAdminAuth();
// ...
assigned_to: user.id,
```

**Potem:**
```typescript
const { profile } = useAdminAuth();
// ...
assigned_to: profile.id,
```

---

## Tehnične podrobnosti

### Zakaj se to zgodi?

Tabela `articulation_test_sessions` ima definiran tuji ključ:
```sql
assigned_to UUID REFERENCES public.logopedist_profiles(id)
```

To pomeni, da mora vrednost `assigned_to` obstajati v tabeli `logopedist_profiles.id`.

Tabela `logopedist_profiles` ima svojo strukturo:
- `id` - unikatni ID profila logopeda (ta ID potrebujemo!)
- `user_id` - referenco na `auth.users.id`

### Spremembe v kodi

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useClaimTestSession.ts` | Uporabi `profile.id` namesto `user.id` |

### Posodobljena koda

```typescript
export function useClaimTestSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAdminAuth();  // <-- spremenjeno iz user
  const queryClient = useQueryClient();

  const claimSession = async (sessionId: string) => {
    if (!profile?.id) {  // <-- spremenjeno iz user?.id
      return { success: false, error: 'Niste prijavljeni kot logoped' };
    }

    // ... ostala koda ...

    .update({
      assigned_to: profile.id,  // <-- spremenjeno iz user.id
      // ...
    })
  };
}
```

---

## Rezultat

Po implementaciji:
- Gumb "Prevzemi" bo pravilno deloval
- Seja bo dodeljena logopedovemu profilu
- Primer se bo pojavil v zavihku "Moji pregledi"
