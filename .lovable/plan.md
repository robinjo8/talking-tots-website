
Cilj: ohraniti pravilo “Zaporedja deluje samo v ležečem položaju”, hkrati pa popraviti bug, da obvestilo v pokončnem načinu ostane tudi po vrnitvi v ležeči položaj.

Kaj bomo naredili
1. Popravimo detekcijo orientacije v `src/components/games/GenericZaporedjaGame.tsx`, da bo primarno temeljila na realnem viewportu (`innerWidth/innerHeight` oziroma `visualViewport`), ne na `screen.orientation.type`.
2. Dodamo robustne poslušalce dogodkov za ponovno preverjanje orientacije:
   - `resize`
   - `orientationchange` (z majhnim `setTimeout`)
   - `fullscreenchange` (ker na Androidu fullscreen pogosto spremeni metrike)
3. Obdržimo obstoječi portrait overlay (to je pravilen UX), ampak ga vežemo na novo zanesljivo stanje `isPortrait`, da se takoj skrije, ko je telefon nazaj ležeče.
4. Ohranimo obstoječe `safeRequestFullscreen` + `safeLockLandscape` ob mountu; dodatno sprožimo “retry lock” ob prehodu nazaj v ležeči položaj (best-effort, brez blokiranja igre).

Tehnične podrobnosti
- Datoteka: `src/components/games/GenericZaporedjaGame.tsx`
- Ključna sprememba: funkcija `checkOrientation()` bo računala:
  - `const width = window.visualViewport?.width ?? window.innerWidth`
  - `const height = window.visualViewport?.height ?? window.innerHeight`
  - `setIsPortrait(height > width)`
- Event cleanup bo simetričen (isti handler reference za add/remove), da ne ostanejo “mrtvi” listenerji.
- S tem ostane iOS kompatibilnost nespremenjena (appleDetection že varno preskoči lock/fullscreen na iOS).

Kaj bo rezultat
- V pokončnem načinu se še vedno pokaže obvestilo.
- Ko uporabnik obrne nazaj v ležeči položaj, obvestilo izgine in igra se normalno nadaljuje brez refresh/restart.
