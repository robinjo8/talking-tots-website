
# Plan: Popravek organizacijske vidnosti otrok v useLogopedistChild hook

## Povzetek problema

Hook `useLogopedistChild(childId)` trenutno filtrira po `.eq('logopedist_id', profile.id)`, kar pomeni:
- Logoped v organizaciji "OŠ Test" NE more odpreti podrobnosti otroka, ki ga je dodal kolega
- Strani kot Workspace, Podrobnosti, Artikulacijski test prikažejo "Otrok ni bil najden"

## Prizadete strani

| Stran | Pot | Kaj se zgodi |
|-------|-----|--------------|
| AdminChildWorkspace | `/admin/children/{childId}/workspace` | "Otrok ni bil najden." |
| AdminLogopedistChildDetail | `/admin/children/{childId}` | Prazni podatki |
| AdminArtikulacijskiTest | `/admin/children/{childId}/test` | Manjkajoči podatki otroka |
| AdminGameWrapper | Vse igre | "Otrok ni bil najden." |
| AdminGameFullscreenWrapper | Celozaslonske igre | Preusmeritev na /admin/children |

## Zakaj je popravek varen

### RLS politike (že implementirane v bazi)

```text
SELECT (organizacijska vidnost):
- LASTNI otroci: logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
- ALI organizacijski: EXISTS (aktivna organization_license IN isti organizaciji)

UPDATE: samo logopedist_id = moj id (lastnik)
DELETE: samo logopedist_id = moj id (lastnik)
INSERT: samo za sebe
```

Baza že skrbi za varnost - če odstranim filter v hook-u, RLS politika še vedno prepreči dostop nepooblaščenim uporabnikom.

## Sprememba

### Datoteka: `src/hooks/useLogopedistChildren.ts`

**Trenutna koda (vrstica 222-246):**
```typescript
export function useLogopedistChild(childId: string | undefined) {
  const { profile } = useAdminAuth();

  return useQuery({
    queryKey: ['logopedist-child', childId],
    queryFn: async (): Promise<LogopedistChild | null> => {
      if (!childId || !profile?.id) return null;

      const { data, error } = await supabase
        .from('logopedist_children')
        .select('*')
        .eq('id', childId)
        .eq('logopedist_id', profile.id)  // ← PROBLEM: blokira organizacijske otroke
        .eq('is_active', true)
        .single();
      // ...
    },
  });
}
```

**Nova koda:**
```typescript
export function useLogopedistChild(childId: string | undefined) {
  const { profile } = useAdminAuth();

  return useQuery({
    queryKey: ['logopedist-child', childId],
    queryFn: async (): Promise<LogopedistChild | null> => {
      if (!childId || !profile?.id) return null;

      // RLS politika na bazi že skrbi za organizacijsko vidnost
      // Odstranjen filter .eq('logopedist_id', profile.id)
      const { data, error } = await supabase
        .from('logopedist_children')
        .select(`
          *,
          logopedist_profiles!inner(
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', childId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching child:', error);
        return null;
      }

      // Dodaj metadata za UI
      return {
        ...data,
        logopedist_name: data.logopedist_profiles 
          ? `${data.logopedist_profiles.first_name} ${data.logopedist_profiles.last_name}`
          : undefined,
        is_own_child: data.logopedist_id === profile.id,
      } as LogopedistChild;
    },
    enabled: !!childId && !!profile?.id,
  });
}
```

## Kaj se spremeni

| Scenarij | Prej | Potem |
|----------|------|-------|
| Logoped A odpre otroka, ki ga je dodal sam | Deluje ✓ | Deluje ✓ |
| Logoped A odpre otroka, ki ga je dodal kolega B v isti org | "Otrok ni bil najden" ✗ | Deluje ✓ |
| Logoped iz druge organizacije poskuša dostopati | RLS blokira ✓ | RLS blokira ✓ |
| Neprijavljen uporabnik | Preusmeritev ✓ | Preusmeritev ✓ |

## Dodatne informacije v UI

Po spremembi bo hook vrnil tudi:
- `logopedist_name` - ime logopeda, ki je otroka dodal
- `is_own_child` - boolean, ali je to tvoj otrok

To omogoča prikaz informacije "Dodal: Janez Novak" na strani podrobnosti.

## Tveganja in mitigacija

| Tveganje | Verjetnost | Mitigacija |
|----------|------------|------------|
| Nepooblaščen dostop | Nizka | RLS politika v bazi je aktivna in testirana |
| Urejanje tujega otroka | Nizka | UPDATE RLS politika še vedno zahteva lastništvo |
| Brisanje tujega otroka | Nizka | DELETE RLS politika še vedno zahteva lastništvo |

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useLogopedistChildren.ts` | Odstrani `.eq('logopedist_id', profile.id)` iz `useLogopedistChild`, dodaj JOIN za ime logopeda |

## Testiranje po implementaciji

1. Prijavi se kot logoped v organizaciji "OŠ Test" (NE Janez Novak)
2. Pojdi na "Moji otroci" - moral bi videti otroka Tian
3. Klikni na otroka Tian - Workspace mora delovati
4. Odpri "Podrobnosti" - podatki morajo biti vidni
5. Poskusi "Preverjanje izgovorjave" - test mora delovati
6. Poskusi urediti otroka - bi moralo biti onemogočeno (ker ni tvoj otrok)
