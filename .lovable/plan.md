

# Plan: Ponastavi generirana poročila za otroka

## Kaj bo narejeno

Izbrisati je treba en zapis iz baze in eno PDF datoteko iz Storage-a, da boste lahko ustvarili novo poročilo z novo funkcionalnostjo izbire črk.

## Koraki

### 1. Izbriši zapis iz baze
Iz tabele `logopedist_reports` se izbriše zapis z ID-jem `ccf4d802-df14-4b79-b566-39c256b36ba6`.

### 2. Izbriši PDF iz Storage-a
Iz bucketa `uporabniski-profili` se izbriše datoteka na poti:
`1a8e5513-a13f-4a8f-b34a-f48ed4992825/0e054bde-ab83-4728-b55d-e02134e6d35b/Generirana-porocila/porocilo-zak-2026-02-06T18-21-52-711Z.pdf`

### 3. Preverjanje
Po brisanju bo razdelek "Generirana porocila logopeda" prazen in pripravljen za novo poročilo s pravilnim prikazom priporočenih črk.

## Tehnični detajli

Brisanje se izvede neposredno z SQL ukazom za bazo in s klicem Storage API-ja za datoteko. Nobenih sprememb kode ni potrebnih - samo podatkovni reset.

