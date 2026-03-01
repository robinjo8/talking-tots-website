

# Popravek: posnetki simulacije niso vidni v pregledu seje

## Vzrok problema

Simulacija (`simulate-articulation-test`) nalaga avdio datoteke s koncnico `.m4a` (vrstica 205):
```
${basePath}/${safeLetter}-${i}-${safeWord}-${timestamp}.m4a
```

Hook `useSessionReview.ts` pa pri nalaganju posnetkov filtrira samo datoteke s koncnicami `.webm`, `.mp3` in `.wav` (vrstica 182-185):
```typescript
const audioFiles = files.filter(file => 
  file.name.endsWith('.webm') || 
  file.name.endsWith('.mp3') || 
  file.name.endsWith('.wav')
);
```

Datoteke `.m4a` se torej nalagajo v Storage pravilno, a se pri prikazu v pregledu seje ignorirajo.

## Popravek

### Datoteka: `src/hooks/useSessionReview.ts`

Dodati `.m4a` v filter avdio datotek:

```typescript
const audioFiles = files.filter(file => 
  file.name.endsWith('.webm') || 
  file.name.endsWith('.mp3') || 
  file.name.endsWith('.wav') ||
  file.name.endsWith('.m4a')
);
```

To je edina sprememba, ki je potrebna. Vsa ostala logika (parsanje imen datotek, grupiranje po crkah, deduplikacija, signed URL-ji) ze pravilno deluje za `.m4a` datoteke.

