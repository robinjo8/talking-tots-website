

## Popravek: Ime in priimek starsa pri dodajanju otroka

### Problem

Uporabniki, ki se registrirajo z Google racunom, nimajo izpolnjenega imena in priimka v tabeli `profiles`, ker Supabase trigger `handle_new_user()` bere podatke iz `raw_user_meta_data->>'first_name'` in `raw_user_meta_data->>'last_name'`, Google OAuth pa shrani ime pod kljucem `full_name` ali `name`. Zato je v zavihku "Moj profil" polje Ime in Priimek prazno.

### Resitev

#### 1. Posodobitev `SimpleChildForm.tsx`

Dodaj polja za ime in priimek starsa **nad** poljem za ime otroka. Polja se prikazejo samo ce profil nima izpolnjenega imena (`first_name` je prazen v `profiles` tabeli).

- Dodaj state: `parentFirstName`, `parentLastName`
- Dodaj `useEffect` ki ob mount preveri ali ima uporabnik ze izpolnjeno ime v `profiles` tabeli
- Ce ime ze obstaja, skrij polja za starsa
- Ce ime ne obstaja, prikazi polja z naslovom "Podatki starsa" pred polji otroka
- Validacija: ce so polja vidna, morata biti obe polji izpolnjeni za nadaljevanje (`canContinue` pogoj)

#### 2. Posodobitev `AddChildForm.tsx` (ali `SimpleChildForm`)

Ko se otrok shranjuje, najprej posodobi `profiles` tabelo z imenom in priimkom starsa (ce sta bila vnesena):

```text
// Pred shranjevanjem otroka (v handleContinue ali handleSubmit)
if (parentFirstName && parentLastName) {
  await supabase.from('profiles').update({
    first_name: parentFirstName,
    last_name: parentLastName
  }).eq('id', user.id);
}
```

Podatke o starsevem imenu je potrebno posredovati iz `SimpleChildForm` v `AddChildForm` preko novih props ali pa shraniti ze v `SimpleChildForm` ob kliku "Nadaljuj".

#### 3. SQL posodobitev za obstojecega uporabnika

Za uporabnika `kujavec.robert@gmail.com` neposredno posodobiti `profiles` tabelo:

```text
UPDATE profiles 
SET first_name = 'Robert', last_name = 'Kujavec' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'kujavec.robert@gmail.com');
```

To se izvede z uporabo insert tool-a (data update, ne schema change).

### Spremembe datotek

- **`src/components/profile/SimpleChildForm.tsx`** - dodaj polja za ime/priimek starsa, preverjanje ali so podatki ze izpolnjeni, shranjevanje v profiles ob "Nadaljuj"
- **Supabase data update** - posodobitev profila za `kujavec.robert@gmail.com`

### Vizualni izgled forme

```text
+----------------------------------+
| Dodaj otroka                     |
+----------------------------------+
| Podatki starsa                   |
| [Ime starsa        ]            |
| [Priimek starsa    ]            |
|                                  |
| Ime otroka ali vzdevek          |
| [                   ]            |
| Spol (neobvezno)               |
| ( ) M  ( ) Z  ( ) Ne zelim      |
| Datum rojstva otroka (obvezno)  |
| [Izberite datum rojstva]         |
|                                  |
| [Nazaj]            [Nadaljuj]   |
+----------------------------------+
```

Sekcija "Podatki starsa" se prikaze samo ce uporabnik nima izpolnjenega imena v profilu. Ko vnese podatke in klikne "Nadaljuj", se ime shrani v `profiles` tabelo in ob naslednjem dodajanju otroka se ta sekcija ne prikaze vec.

