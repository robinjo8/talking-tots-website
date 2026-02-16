
# Popravek: Neskoncna rekurzija v RLS politiki na logopedist_profiles

---

## VZROK

Konzolni logi jasno kazejo napako:

```
infinite recursion detected in policy for relation "logopedist_profiles"
```

Ta napaka blokira **vse** operacije v aplikaciji za uporabnika kujavec.robert@gmail.com -- vkljucno z nalaganjem profila in dodajanjem otroka.

### Problematicna RLS politika

Na tabeli `logopedist_profiles` obstaja politika "Org members can view org profiles":

```sql
organization_id IN (
  SELECT lp.organization_id
  FROM logopedist_profiles lp
  WHERE lp.user_id = auth.uid()
)
```

Ta politika bere iz **iste tabele** (`logopedist_profiles`) znotraj RLS politike na `logopedist_profiles`. PostgreSQL mora za vsako vrstico preveriti RLS politike, kar povzroci neskoncno zanko.

### Zakaj vpliva na dodajanje otroka

`AuthContext.tsx` (vrstica 52-55) pri vsakem nalaganju profila naredi poizvedbo na `logopedist_profiles` da preveri ali je uporabnik logoped. Ce ta poizvedba odpove zaradi rekurzije, **celoten profil** ne nalozi -- brez profila pa aplikacija ne zazna narocnine in ne dovoli dodajanja otroka.

---

## POPRAVEK

### Korak 1: Zamenjaj rekurzivno politiko z varno verzijo

Izbrisati problematicno politiko in jo zamenjati z novo, ki uporablja ze obstojeco `SECURITY DEFINER` funkcijo `get_user_organization_id()`. Ta funkcija obide RLS in prepreci rekurzijo.

SQL migracija:

```sql
-- Izbrisi problematicno politiko
DROP POLICY IF EXISTS "Org members can view org profiles" 
  ON public.logopedist_profiles;

-- Ustvari novo politiko z SECURITY DEFINER funkcijo
CREATE POLICY "Org members can view org profiles" 
  ON public.logopedist_profiles FOR SELECT
  USING (
    organization_id = get_user_organization_id(auth.uid())
  );
```

Funkcija `get_user_organization_id` ze obstaja kot `SECURITY DEFINER` in naredi:
```sql
SELECT organization_id FROM public.logopedist_profiles 
WHERE user_id = _user_id LIMIT 1
```

Ker je `SECURITY DEFINER`, obide RLS politike in ne povzroci rekurzije.

### Kaj se spremeni v kodi

Nicesar -- popravek je izkljucno v bazi podatkov (SQL migracija). Nobena datoteka v kodi se ne spreminja.

---

## POVZETEK

| Sprememba | Opis |
|-----------|------|
| SQL migracija | Zamenjava rekurzivne RLS politike z varno verzijo |

Po tem popravku:
- Profil se bo pravilno nalozil za vse uporabnike
- Dodajanje otroka bo spet delovalo za kujavec.robert@gmail.com
- Logopedi iz iste organizacije bodo se vedno videli profile drug drugega (enaka funkcionalnost, brez rekurzije)
