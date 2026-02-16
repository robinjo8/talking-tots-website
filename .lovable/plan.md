

# Plan: Izbris testnih uporabnikov iz baze

## Situacija

9 testnih uporabnikov (Nina Kovač, Eva Krajnc, Luka Zupan, Jan Potočnik, Nik Mlakar, Tim Kos, Zala Vidmar, Sara Golob, Ana Novak) obstaja samo v tabelah `profiles` in `children`. NE obstajajo v `auth.users` -- to so bili ročno vstavljeni testni podatki.

Vsak ima enega otroka in 1 testno sejo v `articulation_test_sessions` (+ morebitne `articulation_word_results`).

## Kaj bo SQL migracija naredila

1. Izbrisala `articulation_word_results` za testne seje
2. Izbrisala `articulation_test_sessions` za testne otroke
3. Izbrisala `children` za testne starše
4. Izbrisala `profiles` za testne starše

Vrstni red je pomemben zaradi tujih ključev (foreign keys).

## Podatki za izbris

| Starš | ID | Otrok | Otrok ID |
|-------|----|-------|----------|
| Ana Novak | a1000000-...-000000000001 | Miha (4, M) | 8fd195da... |
| Nina Kovač | a1000000-...-000000000003 | Žan (6, M) | 304c4a67... |
| Eva Krajnc | a1000000-...-000000000004 | Tina (4, Ž) | 1be0ca99... |
| Luka Zupan | a1000000-...-000000000005 | Filip (5, M) | 4930181c... |
| Jan Potočnik | a1000000-...-000000000006 | Ema (6, Ž) | 0a9f5c8a... |
| Nik Mlakar | a1000000-...-000000000007 | Jakob (4, M) | dfef9e48... |
| Tim Kos | a1000000-...-000000000008 | Julija (5, Ž) | 689e79c1... |
| Zala Vidmar | a1000000-...-000000000009 | Gašper (6, M) | 01fd5846... |
| Sara Golob | a1000000-...-000000000010 | Pia (4, Ž) | 3df220d4... |

## Tehnični detajli

Ena SQL migracija z DELETE stavki v pravilnem vrstnem redu (najprej word_results, nato sessions, children, profiles).

Nobene spremembe v kodi -- samo brisanje testnih podatkov iz baze.

