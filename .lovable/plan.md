

# Popravki kartic na strani Govorne vaje

## Spremembe (`src/pages/GovornojezicovneVaje.tsx`)

### 1. Odstrani oranžno ozadje s kartic
Zamenjaj `customBackground` radial gradient z belim ozadjem (`background: 'white'` ali odstrani `customBackground` in uporabi `bg-white` na image container div).

### 2. Mobilni naslovi v dveh vrsticah
Dodaj `mobileTitle` polje vsaki kartici za ročno prelomljene naslove:
- **VAJE MOTORIKE GOVORIL** → `"VAJE MOTORIKE\nGOVORIL"`
- **MOJI PRVI GLASOVI** → `"MOJI PRVI\nGLASOVI"`
- **VIZUALNI PRIKAZ USTNIC** → `"VIZUALNI PRIKAZ\nUSTNIC"`
- **VIDEO NAVODILA** → `"VIDEO\nNAVODILA"`

Na mobilnem prikažemo `mobileTitle` z `whitespace-pre-line`, na desktopu pa navaden `title`.

