

# Popravek: Ema ne more dodajati otrok v OŠ Test

## Problem

Na tabeli `logopedist_children` sta **dva BEFORE INSERT triggerja**:

1. `check_child_limit_trigger` → `check_organization_child_limit()` — pravilno preverja organizacijsko licenco
2. `enforce_child_limit` → `check_logopedist_child_limit()` — preverja **samo individualno licenco**

Oba triggerja se izvedeta ob vsakem INSERT. Funkcija `check_organization_child_limit()` pravilno najprej preveri organizacijsko licenco in šele nato individualno kot fallback. Vendar `check_logopedist_child_limit()` vedno išče individualno licenco — in ker Ema nima individualne licence, ta trigger vrže napako.

Janez in Špela imata obe licenci (individualno + organizacijsko), zato gresta skozi oba triggerja brez težav.

## Rešitev

Odstranimo odvečni trigger `enforce_child_limit`, ki kliče `check_logopedist_child_limit()`. Funkcija `check_organization_child_limit()` že vsebuje fallback logiko za individualno licenco, zato en trigger zadošča.

## Spremembe

### Supabase migracija

```sql
DROP TRIGGER IF EXISTS enforce_child_limit ON public.logopedist_children;
```

To je ena vrstica. Po tej spremembi bo za vse člane OŠ Test (vključno z Emo) veljala organizacijska licenca s 100 otroki.

