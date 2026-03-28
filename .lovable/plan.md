

## Plan: Popravi odpiranje PDF poročil na iOS/Safari

### Problem
Safari/iOS blokira `window.open()` ko je klican znotraj `async` funkcije. Med uporabnikovim klikom in `window.open` je `await` (za pridobitev signed URL), kar Safari interpretira kot popup brez uporabniške geste.

### Rešitev
Odpri prazen zavihek **sinhrono** (v direktnem click handlerju), nato asinhrono nastavi URL:

```ts
// PREJ (blokirano na Safari):
const url = await getSignedUrl(path);
window.open(url, '_blank');

// POTEM (deluje povsod):
const newTab = window.open('about:blank', '_blank');
const url = await getSignedUrl(path);
if (newTab) {
  newTab.location.href = url;
} else {
  // Fallback: redirect current window
  window.location.href = url;
}
```

### Datoteke za spremembo

**1. `src/components/profile/MyDocumentsSection.tsx`** (vrstice 310-316)
- Eye gumb za odpiranje poročila: dodaj sinhroni `window.open('about:blank')` pred `await`

**2. `src/pages/admin/AdminReports.tsx`** (vrstice 93-104)
- `handleView`: enaka sprememba

**3. `src/pages/admin/AdminLogopedistChildDetail.tsx`** — preveri ali ima enak vzorec za odpiranje dokumentov

**4. `src/pages/admin/AdminUserDetail.tsx`** — preveri ali ima enak vzorec

### Obseg
- 3-4 datoteke, ~5 vrstic spremenjenih v vsaki
- Brez novih odvisnosti

