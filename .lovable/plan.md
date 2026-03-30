

## Plan: Počisti preostale datoteke v Seja-4

### Problem
Po prejšnjem čiščenju je v storage mapi `Seja-4` ostalo 20 datotek (od prvotnih 100 je bilo izbrisanih le 80). To so ostanki prejšnjih simulacij.

### Popravek

**1. Storage čiščenje** — izbriši preostalih 20 datotek iz:
`2a5e4550-413a-4f46-893a-c94b1eaa9215/fd0dbb8a-3ee6-4414-9af9-688bf0534c6a/Preverjanje-izgovorjave/Seja-4/`

Uporabim edge function za listing in brisanje vseh datotek v tej mapi.

**2. Preveri da Seja-5 ne obstaja več** — potrdim da je bila ta mapa uspešno izbrisana.

### Obseg
- Samo storage čiščenje, brez sprememb kode
- Po čiščenju bo AdminUserDetail prikazal le 3 seje (Seja-1, 2, 3)

