

## Plan: Poenotenje stilov treh sekcij na AdminUserDetail

### Problem
Na strani `/admin/users/.../...` imajo tri sekcije (Dokumenti, Generirana poročila logopeda, Preverjanje izgovorjave) različno oblikovane naslove:
- **Dokumenti**: `<CardHeader>` brez dodatnih razredov, `<CardTitle>` brez dodatnih razredov — privzeto (text-2xl)
- **Generirana poročila logopeda**: `<CardHeader className="pb-3">` + `<CardTitle className="text-base">` — manjši naslov, manj paddinga
- **Preverjanje izgovorjave**: privzeto — brez dodatnih razredov

### Popravek v `src/pages/admin/AdminUserDetail.tsx`

1. **Vrstica 882**: Odstrani `className="pb-3"` iz `CardHeader` → `<CardHeader>`
2. **Vrstica 885**: Odstrani `className="text-base"` iz `CardTitle` → `<CardTitle>Generirana poročila logopeda</CardTitle>`

S tem bodo vse tri sekcije uporabljale identičen privzeti stil `CardHeader` in `CardTitle`.

