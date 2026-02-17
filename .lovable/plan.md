

## Zamenjava besede "črka" z "glas" po celotni aplikaciji

Beseda "črka" se v uporabniškem vmesniku zamenja z besedo "glas" v ustreznem sklonu povsod, kjer se nanaša na govorne glasove (S, Z, C, Š, Ž, Č, K, L, R). Beseda "črka" ostane le tam, kjer se dejansko nanaša na pisno črko (npr. beseda "ČRKE" v bingo/puzzle podatkih).

### Pravila sklanjanja

| Izvirno | Novo |
|---------|------|
| izgovorjavo **črke** S | izgovorjavo **glasu** S |
| izgovorjavo **črk** | izgovorjavo **glasov** |
| Izberi **črko** | Izberi **glas** |
| s **črko** S | z **glasom** S |
| za **črko** S | za **glas** S |
| **Črka** S | **Glas** S |
| po **črkah** | po **glasovih** |
| na **črko** | na **glas** |
| IZBERI **ČRKO** | IZBERI **GLAS** |

### Datoteke s spremembami (samo uporabniški vmesnik)

**Strani za izbiro glasov (hero podnaslov + opisi kartic):**
1. `src/pages/KoloSreceGames.tsx` -- "izgovorjavo glasu X" x9, "Izberi glas"
2. `src/pages/MetKockeGames.tsx` -- "z glasom X", "Izberi glas"
3. `src/pages/BingoGames.tsx` -- "Izberi glas"
4. `src/pages/SpominGames.tsx` -- "Izberi glas"
5. `src/pages/SestavljankeGames.tsx` -- "Izberi glas"
6. `src/pages/DrsnaSestavljanka.tsx` -- "Izberi glas"
7. `src/pages/Labirint.tsx` -- "z glasom X" x9, "Izberi glas", "Glas X"
8. `src/pages/IgraUjemanja.tsx` -- "z glasom X", "Izberi glas"
9. `src/pages/Zaporedja.tsx` -- "Izberi glas"
10. `src/pages/PonoviPoved.tsx` -- "Izberi glas"
11. `src/pages/ArtikulacijaVaje.tsx` -- "Izberi glas"
12. `src/pages/ArtIzgovorjavaPage.tsx` -- "Glas X"

**Komponente iger:**
13. `src/components/games/GamesList.tsx` -- "izgovorjavo glasov"
14. `src/components/games/GenericVideoNavodila.tsx` -- "Glas X", "izgovorjavo glasu"
15. `src/components/games/GenericSpominGame.tsx` -- "Glas X"
16. `src/components/games/GenericPoveziPareSelection.tsx` -- "Glas X", "Izberi glas", "IZBERI GLAS"
17. `src/components/games/GenericPoveziPareGame.tsx` -- "za glas"
18. `src/components/games/MemoryGameTestControls.tsx` -- "za glas"
19. `src/components/wheel/ProgressModal.tsx` -- "Glas X"
20. `src/components/articulation/LetterSlider.tsx` -- "na glas"
21. `src/components/articulation/ArticulationTestInstructionsDialog.tsx` -- zamenjava vseh pojavitev

**Testimoniali:**
22. `src/components/TestimonialsCarousel.tsx` -- "izgovorjavo glasu R"
23. `src/components/home/TestimonialsSection.tsx` -- "izgovorjavo glasu R"

**Admin strani:**
24. `src/components/admin/DifficultiesPieChart.tsx` -- "po glasovih"
25. `src/components/admin/LetterSelector.tsx` -- "za glas"
26. `src/pages/admin/AdminSessionReview.tsx` -- "za glas"
27. `src/pages/admin/games/AdminKoloSreceGames.tsx` -- "izgovorjavo glasu"
28. `src/pages/admin/games/AdminBingoGames.tsx` -- "izberi glas"
29. `src/pages/admin/games/AdminSpominGames.tsx` -- "izberi glas"
30. `src/pages/admin/games/AdminSestavljankeGames.tsx` -- "z glasom", "izberi glas"
31. `src/pages/admin/games/AdminPonoviPovedGames.tsx` -- "izberi glas"
32. `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx` -- "izberi glas"
33. `src/pages/admin/games/AdminIgraUjemanjaGames.tsx` -- "izberi glas"
34. `src/pages/admin/games/AdminLabirintGames.tsx` -- "izberi glas"
35. `src/pages/admin/games/AdminZaporedjaGames.tsx` -- "izberi glas"
36. `src/components/routing/admin/AdminVideoNavodilaRouter.tsx` -- "Glas X", "izgovorjavo glasu"
37. `src/models/SpeechDevelopment.ts` -- "glasu" namesto "glasu/črke"

**Se NE spreminja** (komentarji v kodi, imena spremenljivk, dejanske besede "ČRKE" v bingo/puzzle podatkih).

