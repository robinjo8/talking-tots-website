/**
 * Eksplicitne game route
 * 
 * POMEMBNO: Uporabljamo eksplicitne poti namesto dinamičnih parametrov,
 * ker dinamični parametri ne delujejo zanesljivo s šumniki (č, š, ž).
 * 
 * React Router interno normalizira eksplicitne poti in jih pravilno ujame,
 * medtem ko dinamični parametri zahtevajo ročno Unicode normalizacijo,
 * ki ni vedno zanesljiva.
 */
import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LEGACY_GAME_ROUTES } from './routeConfig';

// ============================================
// LAZY IMPORTS - MAIN PAGES
// ============================================
const SpominGames = lazy(() => import('@/pages/SpominGames'));
const SestavljankeGames = lazy(() => import('@/pages/SestavljankeGames'));
const Zaporedja = lazy(() => import('@/pages/Zaporedja'));
const DrsnaSestavljanka = lazy(() => import('@/pages/DrsnaSestavljanka'));
const IgraUjemanja = lazy(() => import('@/pages/IgraUjemanja'));
const Labirint = lazy(() => import('@/pages/Labirint'));
const LabirintLetter = lazy(() => import('@/pages/LabirintLetter'));
const GovorneIgre = lazy(() => import('@/pages/GovorneIgre'));

// ============================================
// LAZY IMPORTS - SPOMIN (9 letters)
// ============================================
const SpominC = lazy(() => import('@/pages/SpominC'));
const SpominČ = lazy(() => import('@/pages/SpominČ'));
const SpominK = lazy(() => import('@/pages/SpominK'));
const SpominL = lazy(() => import('@/pages/SpominL'));
const SpominR = lazy(() => import('@/pages/SpominR'));
const SpominS = lazy(() => import('@/pages/SpominS'));
const SpominŠ = lazy(() => import('@/pages/SpominŠ'));
const SpominZ = lazy(() => import('@/pages/SpominZ'));
const SpominŽ = lazy(() => import('@/pages/SpominŽ'));

// ============================================
// LAZY IMPORTS - SESTAVLJANKE (9 letters x 4 age groups = 36 components)
// ============================================
// C
const SestavljankeC = lazy(() => import('@/pages/SestavljankeC'));
const SestavljankeC56 = lazy(() => import('@/pages/SestavljankeC56'));
const SestavljankeC78 = lazy(() => import('@/pages/SestavljankeC78'));
const SestavljankeC910 = lazy(() => import('@/pages/SestavljankeC910'));
// Č
const SestavljankeČ = lazy(() => import('@/pages/SestavljankeČ'));
const SestavljankeČ56 = lazy(() => import('@/pages/SestavljankeČ56'));
const SestavljankeČ78 = lazy(() => import('@/pages/SestavljankeČ78'));
const SestavljankeČ910 = lazy(() => import('@/pages/SestavljankeČ910'));
// K
const SestavljankeK = lazy(() => import('@/pages/SestavljankeK'));
const SestavljankeK56 = lazy(() => import('@/pages/SestavljankeK56'));
const SestavljankeK78 = lazy(() => import('@/pages/SestavljankeK78'));
const SestavljankeK910 = lazy(() => import('@/pages/SestavljankeK910'));
// L
const SestavljankeL = lazy(() => import('@/pages/SestavljankeL'));
const SestavljankeL56 = lazy(() => import('@/pages/SestavljankeL56'));
const SestavljankeL78 = lazy(() => import('@/pages/SestavljankeL78'));
const SestavljankeL910 = lazy(() => import('@/pages/SestavljankeL910'));
// R
const SestavljankeR = lazy(() => import('@/pages/SestavljankeR'));
const SestavljankeR56 = lazy(() => import('@/pages/SestavljankeR56'));
const SestavljankeR78 = lazy(() => import('@/pages/SestavljankeR78'));
const SestavljankeR910 = lazy(() => import('@/pages/SestavljankeR910'));
// S
const SestavljankeS = lazy(() => import('@/pages/SestavljankeS'));
const SestavljankeS56 = lazy(() => import('@/pages/SestavljankeS56'));
const SestavljankeS78 = lazy(() => import('@/pages/SestavljankeS78'));
const SestavljankeS910 = lazy(() => import('@/pages/SestavljankeS910'));
// Š
const SestavljankeŠ = lazy(() => import('@/pages/SestavljankeŠ'));
const SestavljankeŠ56 = lazy(() => import('@/pages/SestavljankeŠ56'));
const SestavljankeŠ78 = lazy(() => import('@/pages/SestavljankeŠ78'));
const SestavljankeŠ910 = lazy(() => import('@/pages/SestavljankeŠ910'));
// Z
const SestavljankeZ = lazy(() => import('@/pages/SestavljankeZ'));
const SestavljankeZ56 = lazy(() => import('@/pages/SestavljankeZ56'));
const SestavljankeZ78 = lazy(() => import('@/pages/SestavljankeZ78'));
const SestavljankeZ910 = lazy(() => import('@/pages/SestavljankeZ910'));
// Ž
const SestavljankeŽ = lazy(() => import('@/pages/SestavljankeŽ'));
const SestavljankeŽ56 = lazy(() => import('@/pages/SestavljankeŽ56'));
const SestavljankeŽ78 = lazy(() => import('@/pages/SestavljankeŽ78'));
const SestavljankeŽ910 = lazy(() => import('@/pages/SestavljankeŽ910'));

// ============================================
// LAZY IMPORTS - ZAPOREDJA (9 letters x 4 age groups = 36 components)
// ============================================
// C
const ZaporedjaC = lazy(() => import('@/pages/ZaporedjaC'));
const ZaporedjaC56 = lazy(() => import('@/pages/ZaporedjaC56'));
const ZaporedjaC78 = lazy(() => import('@/pages/ZaporedjaC78'));
const ZaporedjaC910 = lazy(() => import('@/pages/ZaporedjaC910'));
// Č
const ZaporedjaČ = lazy(() => import('@/pages/ZaporedjaČ'));
const ZaporedjaČ56 = lazy(() => import('@/pages/ZaporedjaČ56'));
const ZaporedjaČ78 = lazy(() => import('@/pages/ZaporedjaČ78'));
const ZaporedjaČ910 = lazy(() => import('@/pages/ZaporedjaČ910'));
// K
const ZaporedjaK = lazy(() => import('@/pages/ZaporedjaK'));
const ZaporedjaK56 = lazy(() => import('@/pages/ZaporedjaK56'));
const ZaporedjaK78 = lazy(() => import('@/pages/ZaporedjaK78'));
const ZaporedjaK910 = lazy(() => import('@/pages/ZaporedjaK910'));
// L
const ZaporedjaL = lazy(() => import('@/pages/ZaporedjaL'));
const ZaporedjaL56 = lazy(() => import('@/pages/ZaporedjaL56'));
const ZaporedjaL78 = lazy(() => import('@/pages/ZaporedjaL78'));
const ZaporedjaL910 = lazy(() => import('@/pages/ZaporedjaL910'));
// R
const ZaporedjaR = lazy(() => import('@/pages/ZaporedjaR'));
const ZaporedjaR56 = lazy(() => import('@/pages/ZaporedjaR56'));
const ZaporedjaR78 = lazy(() => import('@/pages/ZaporedjaR78'));
const ZaporedjaR910 = lazy(() => import('@/pages/ZaporedjaR910'));
// S
const ZaporedjaS = lazy(() => import('@/pages/ZaporedjaS'));
const ZaporedjaS56 = lazy(() => import('@/pages/ZaporedjaS56'));
const ZaporedjaS78 = lazy(() => import('@/pages/ZaporedjaS78'));
const ZaporedjaS910 = lazy(() => import('@/pages/ZaporedjaS910'));
// Š
const ZaporedjaŠ = lazy(() => import('@/pages/ZaporedjaŠ'));
const ZaporedjaŠ56 = lazy(() => import('@/pages/ZaporedjaŠ56'));
const ZaporedjaŠ78 = lazy(() => import('@/pages/ZaporedjaŠ78'));
const ZaporedjaŠ910 = lazy(() => import('@/pages/ZaporedjaŠ910'));
// Z
const ZaporedjaZ = lazy(() => import('@/pages/ZaporedjaZ'));
const ZaporedjaZ56 = lazy(() => import('@/pages/ZaporedjaZ56'));
const ZaporedjaZ78 = lazy(() => import('@/pages/ZaporedjaZ78'));
const ZaporedjaZ910 = lazy(() => import('@/pages/ZaporedjaZ910'));
// Ž
const ZaporedjaŽ = lazy(() => import('@/pages/ZaporedjaŽ'));
const ZaporedjaŽ56 = lazy(() => import('@/pages/ZaporedjaŽ56'));
const ZaporedjaŽ78 = lazy(() => import('@/pages/ZaporedjaŽ78'));
const ZaporedjaŽ910 = lazy(() => import('@/pages/ZaporedjaŽ910'));

// ============================================
// LAZY IMPORTS - DRSNA SESTAVLJANKA (9 letters x 4 age groups = 36 components)
// ============================================
// C
const DrsnaSestavljankaC34 = lazy(() => import('@/pages/DrsnaSestavljankaC34'));
const DrsnaSestavljankaC56 = lazy(() => import('@/pages/DrsnaSestavljankaC56'));
const DrsnaSestavljankaC78 = lazy(() => import('@/pages/DrsnaSestavljankaC78'));
const DrsnaSestavljankaC910 = lazy(() => import('@/pages/DrsnaSestavljankaC910'));
// Č
const DrsnaSestavljankaČ34 = lazy(() => import('@/pages/DrsnaSestavljankaČ34'));
const DrsnaSestavljankaČ56 = lazy(() => import('@/pages/DrsnaSestavljankaČ56'));
const DrsnaSestavljankaČ78 = lazy(() => import('@/pages/DrsnaSestavljankaČ78'));
const DrsnaSestavljankaČ910 = lazy(() => import('@/pages/DrsnaSestavljankaČ910'));
// K
const DrsnaSestavljankaK34 = lazy(() => import('@/pages/DrsnaSestavljankaK34'));
const DrsnaSestavljankaK56 = lazy(() => import('@/pages/DrsnaSestavljankaK56'));
const DrsnaSestavljankaK78 = lazy(() => import('@/pages/DrsnaSestavljankaK78'));
const DrsnaSestavljankaK910 = lazy(() => import('@/pages/DrsnaSestavljankaK910'));
// L
const DrsnaSestavljankaL34 = lazy(() => import('@/pages/DrsnaSestavljankaL34'));
const DrsnaSestavljankaL56 = lazy(() => import('@/pages/DrsnaSestavljankaL56'));
const DrsnaSestavljankaL78 = lazy(() => import('@/pages/DrsnaSestavljankaL78'));
const DrsnaSestavljankaL910 = lazy(() => import('@/pages/DrsnaSestavljankaL910'));
// R
const DrsnaSestavljankaR34 = lazy(() => import('@/pages/DrsnaSestavljankaR34'));
const DrsnaSestavljankaR56 = lazy(() => import('@/pages/DrsnaSestavljankaR56'));
const DrsnaSestavljankaR78 = lazy(() => import('@/pages/DrsnaSestavljankaR78'));
const DrsnaSestavljankaR910 = lazy(() => import('@/pages/DrsnaSestavljankaR910'));
// S
const DrsnaSestavljankaS34 = lazy(() => import('@/pages/DrsnaSestavljankaS34'));
const DrsnaSestavljankaS56 = lazy(() => import('@/pages/DrsnaSestavljankaS56'));
const DrsnaSestavljankaS78 = lazy(() => import('@/pages/DrsnaSestavljankaS78'));
const DrsnaSestavljankaS910 = lazy(() => import('@/pages/DrsnaSestavljankaS910'));
// Š
const DrsnaSestavljankaŠ34 = lazy(() => import('@/pages/DrsnaSestavljankaŠ34'));
const DrsnaSestavljankaŠ56 = lazy(() => import('@/pages/DrsnaSestavljankaŠ56'));
const DrsnaSestavljankaŠ78 = lazy(() => import('@/pages/DrsnaSestavljankaŠ78'));
const DrsnaSestavljankaŠ910 = lazy(() => import('@/pages/DrsnaSestavljankaŠ910'));
// Z
const DrsnaSestavljankaZ34 = lazy(() => import('@/pages/DrsnaSestavljankaZ34'));
const DrsnaSestavljankaZ56 = lazy(() => import('@/pages/DrsnaSestavljankaZ56'));
const DrsnaSestavljankaZ78 = lazy(() => import('@/pages/DrsnaSestavljankaZ78'));
const DrsnaSestavljankaZ910 = lazy(() => import('@/pages/DrsnaSestavljankaZ910'));
// Ž
const DrsnaSestavljankaŽ34 = lazy(() => import('@/pages/DrsnaSestavljankaŽ34'));
const DrsnaSestavljankaŽ56 = lazy(() => import('@/pages/DrsnaSestavljankaŽ56'));
const DrsnaSestavljankaŽ78 = lazy(() => import('@/pages/DrsnaSestavljankaŽ78'));
const DrsnaSestavljankaŽ910 = lazy(() => import('@/pages/DrsnaSestavljankaŽ910'));

// ============================================
// LAZY IMPORTS - IGRA UJEMANJA (9 letters x 4 age groups = 36 components)
// ============================================
// C
const IgraUjemanjaC = lazy(() => import('@/pages/IgraUjemanjaC'));
const IgraUjemanjaC56 = lazy(() => import('@/pages/IgraUjemanjaC56'));
const IgraUjemanjaC78 = lazy(() => import('@/pages/IgraUjemanjaC78'));
const IgraUjemanjaC910 = lazy(() => import('@/pages/IgraUjemanjaC910'));
// Č
const IgraUjemanjaČ = lazy(() => import('@/pages/IgraUjemanjaČ'));
const IgraUjemanjaČ56 = lazy(() => import('@/pages/IgraUjemanjaČ56'));
const IgraUjemanjaČ78 = lazy(() => import('@/pages/IgraUjemanjaČ78'));
const IgraUjemanjaČ910 = lazy(() => import('@/pages/IgraUjemanjaČ910'));
// K
const IgraUjemanjaK = lazy(() => import('@/pages/IgraUjemanjaK'));
const IgraUjemanjaK56 = lazy(() => import('@/pages/IgraUjemanjaK56'));
const IgraUjemanjaK78 = lazy(() => import('@/pages/IgraUjemanjaK78'));
const IgraUjemanjaK910 = lazy(() => import('@/pages/IgraUjemanjaK910'));
// L
const IgraUjemanjaL = lazy(() => import('@/pages/IgraUjemanjaL'));
const IgraUjemanjaL56 = lazy(() => import('@/pages/IgraUjemanjaL56'));
const IgraUjemanjaL78 = lazy(() => import('@/pages/IgraUjemanjaL78'));
const IgraUjemanjaL910 = lazy(() => import('@/pages/IgraUjemanjaL910'));
// R
const IgraUjemanjaR = lazy(() => import('@/pages/IgraUjemanjaR'));
const IgraUjemanjaR56 = lazy(() => import('@/pages/IgraUjemanjaR56'));
const IgraUjemanjaR78 = lazy(() => import('@/pages/IgraUjemanjaR78'));
const IgraUjemanjaR910 = lazy(() => import('@/pages/IgraUjemanjaR910'));
// S
const IgraUjemanjaS = lazy(() => import('@/pages/IgraUjemanjaS'));
const IgraUjemanjaS56 = lazy(() => import('@/pages/IgraUjemanjaS56'));
const IgraUjemanjaS78 = lazy(() => import('@/pages/IgraUjemanjaS78'));
const IgraUjemanjaS910 = lazy(() => import('@/pages/IgraUjemanjaS910'));
// Š
const IgraUjemanjaŠ = lazy(() => import('@/pages/IgraUjemanjaŠ'));
const IgraUjemanjaŠ56 = lazy(() => import('@/pages/IgraUjemanjaŠ56'));
const IgraUjemanjaŠ78 = lazy(() => import('@/pages/IgraUjemanjaŠ78'));
const IgraUjemanjaŠ910 = lazy(() => import('@/pages/IgraUjemanjaŠ910'));
// Z
const IgraUjemanjaZ = lazy(() => import('@/pages/IgraUjemanjaZ'));
const IgraUjemanjaZ56 = lazy(() => import('@/pages/IgraUjemanjaZ56'));
const IgraUjemanjaZ78 = lazy(() => import('@/pages/IgraUjemanjaZ78'));
const IgraUjemanjaZ910 = lazy(() => import('@/pages/IgraUjemanjaZ910'));
// Ž
const IgraUjemanjaŽ = lazy(() => import('@/pages/IgraUjemanjaŽ'));
const IgraUjemanjaŽ56 = lazy(() => import('@/pages/IgraUjemanjaŽ56'));
const IgraUjemanjaŽ78 = lazy(() => import('@/pages/IgraUjemanjaŽ78'));
const IgraUjemanjaŽ910 = lazy(() => import('@/pages/IgraUjemanjaŽ910'));

// ============================================
// LAZY IMPORTS - LABIRINT
// ============================================
const LabirintC = lazy(() => import('@/pages/LabirintC'));

// ============================================
// EXPLICIT ROUTES - SPOMIN
// ============================================
function generateSpominRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route key="spomin-main" path="/govorne-igre/spomin" element={<ProtectedRoute><SpominGames /></ProtectedRoute>} />,
    
    // Explicit routes for each letter
    <Route key="spomin-c" path="/govorne-igre/spomin/spomin-c" element={<ProtectedRoute><SpominC /></ProtectedRoute>} />,
    <Route key="spomin-č" path="/govorne-igre/spomin/spomin-č" element={<ProtectedRoute><SpominČ /></ProtectedRoute>} />,
    <Route key="spomin-k" path="/govorne-igre/spomin/spomin-k" element={<ProtectedRoute><SpominK /></ProtectedRoute>} />,
    <Route key="spomin-l" path="/govorne-igre/spomin/spomin-l" element={<ProtectedRoute><SpominL /></ProtectedRoute>} />,
    <Route key="spomin-r" path="/govorne-igre/spomin/spomin-r" element={<ProtectedRoute><SpominR /></ProtectedRoute>} />,
    <Route key="spomin-s" path="/govorne-igre/spomin/spomin-s" element={<ProtectedRoute><SpominS /></ProtectedRoute>} />,
    <Route key="spomin-š" path="/govorne-igre/spomin/spomin-š" element={<ProtectedRoute><SpominŠ /></ProtectedRoute>} />,
    <Route key="spomin-z" path="/govorne-igre/spomin/spomin-z" element={<ProtectedRoute><SpominZ /></ProtectedRoute>} />,
    <Route key="spomin-ž" path="/govorne-igre/spomin/spomin-ž" element={<ProtectedRoute><SpominŽ /></ProtectedRoute>} />,
  ];
}

// ============================================
// EXPLICIT ROUTES - SESTAVLJANKE
// ============================================
function generateSestavljankeRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route key="sestavljanke-main" path="/govorne-igre/sestavljanke" element={<ProtectedRoute><SestavljankeGames /></ProtectedRoute>} />,
    
    // C
    <Route key="sest-c" path="/govorne-igre/sestavljanke/c" element={<ProtectedRoute><SestavljankeC /></ProtectedRoute>} />,
    <Route key="sest-c56" path="/govorne-igre/sestavljanke/c56" element={<ProtectedRoute><SestavljankeC56 /></ProtectedRoute>} />,
    <Route key="sest-c78" path="/govorne-igre/sestavljanke/c78" element={<ProtectedRoute><SestavljankeC78 /></ProtectedRoute>} />,
    <Route key="sest-c910" path="/govorne-igre/sestavljanke/c910" element={<ProtectedRoute><SestavljankeC910 /></ProtectedRoute>} />,
    
    // Č
    <Route key="sest-č" path="/govorne-igre/sestavljanke/č" element={<ProtectedRoute><SestavljankeČ /></ProtectedRoute>} />,
    <Route key="sest-č56" path="/govorne-igre/sestavljanke/č56" element={<ProtectedRoute><SestavljankeČ56 /></ProtectedRoute>} />,
    <Route key="sest-č78" path="/govorne-igre/sestavljanke/č78" element={<ProtectedRoute><SestavljankeČ78 /></ProtectedRoute>} />,
    <Route key="sest-č910" path="/govorne-igre/sestavljanke/č910" element={<ProtectedRoute><SestavljankeČ910 /></ProtectedRoute>} />,
    
    // K
    <Route key="sest-k" path="/govorne-igre/sestavljanke/k" element={<ProtectedRoute><SestavljankeK /></ProtectedRoute>} />,
    <Route key="sest-k56" path="/govorne-igre/sestavljanke/k56" element={<ProtectedRoute><SestavljankeK56 /></ProtectedRoute>} />,
    <Route key="sest-k78" path="/govorne-igre/sestavljanke/k78" element={<ProtectedRoute><SestavljankeK78 /></ProtectedRoute>} />,
    <Route key="sest-k910" path="/govorne-igre/sestavljanke/k910" element={<ProtectedRoute><SestavljankeK910 /></ProtectedRoute>} />,
    
    // L
    <Route key="sest-l" path="/govorne-igre/sestavljanke/l" element={<ProtectedRoute><SestavljankeL /></ProtectedRoute>} />,
    <Route key="sest-l56" path="/govorne-igre/sestavljanke/l56" element={<ProtectedRoute><SestavljankeL56 /></ProtectedRoute>} />,
    <Route key="sest-l78" path="/govorne-igre/sestavljanke/l78" element={<ProtectedRoute><SestavljankeL78 /></ProtectedRoute>} />,
    <Route key="sest-l910" path="/govorne-igre/sestavljanke/l910" element={<ProtectedRoute><SestavljankeL910 /></ProtectedRoute>} />,
    
    // R
    <Route key="sest-r" path="/govorne-igre/sestavljanke/r" element={<ProtectedRoute><SestavljankeR /></ProtectedRoute>} />,
    <Route key="sest-r56" path="/govorne-igre/sestavljanke/r56" element={<ProtectedRoute><SestavljankeR56 /></ProtectedRoute>} />,
    <Route key="sest-r78" path="/govorne-igre/sestavljanke/r78" element={<ProtectedRoute><SestavljankeR78 /></ProtectedRoute>} />,
    <Route key="sest-r910" path="/govorne-igre/sestavljanke/r910" element={<ProtectedRoute><SestavljankeR910 /></ProtectedRoute>} />,
    
    // S
    <Route key="sest-s" path="/govorne-igre/sestavljanke/s" element={<ProtectedRoute><SestavljankeS /></ProtectedRoute>} />,
    <Route key="sest-s56" path="/govorne-igre/sestavljanke/s56" element={<ProtectedRoute><SestavljankeS56 /></ProtectedRoute>} />,
    <Route key="sest-s78" path="/govorne-igre/sestavljanke/s78" element={<ProtectedRoute><SestavljankeS78 /></ProtectedRoute>} />,
    <Route key="sest-s910" path="/govorne-igre/sestavljanke/s910" element={<ProtectedRoute><SestavljankeS910 /></ProtectedRoute>} />,
    
    // Š
    <Route key="sest-š" path="/govorne-igre/sestavljanke/š" element={<ProtectedRoute><SestavljankeŠ /></ProtectedRoute>} />,
    <Route key="sest-š56" path="/govorne-igre/sestavljanke/š56" element={<ProtectedRoute><SestavljankeŠ56 /></ProtectedRoute>} />,
    <Route key="sest-š78" path="/govorne-igre/sestavljanke/š78" element={<ProtectedRoute><SestavljankeŠ78 /></ProtectedRoute>} />,
    <Route key="sest-š910" path="/govorne-igre/sestavljanke/š910" element={<ProtectedRoute><SestavljankeŠ910 /></ProtectedRoute>} />,
    
    // Z
    <Route key="sest-z" path="/govorne-igre/sestavljanke/z" element={<ProtectedRoute><SestavljankeZ /></ProtectedRoute>} />,
    <Route key="sest-z56" path="/govorne-igre/sestavljanke/z56" element={<ProtectedRoute><SestavljankeZ56 /></ProtectedRoute>} />,
    <Route key="sest-z78" path="/govorne-igre/sestavljanke/z78" element={<ProtectedRoute><SestavljankeZ78 /></ProtectedRoute>} />,
    <Route key="sest-z910" path="/govorne-igre/sestavljanke/z910" element={<ProtectedRoute><SestavljankeZ910 /></ProtectedRoute>} />,
    
    // Ž
    <Route key="sest-ž" path="/govorne-igre/sestavljanke/ž" element={<ProtectedRoute><SestavljankeŽ /></ProtectedRoute>} />,
    <Route key="sest-ž56" path="/govorne-igre/sestavljanke/ž56" element={<ProtectedRoute><SestavljankeŽ56 /></ProtectedRoute>} />,
    <Route key="sest-ž78" path="/govorne-igre/sestavljanke/ž78" element={<ProtectedRoute><SestavljankeŽ78 /></ProtectedRoute>} />,
    <Route key="sest-ž910" path="/govorne-igre/sestavljanke/ž910" element={<ProtectedRoute><SestavljankeŽ910 /></ProtectedRoute>} />,
  ];
}

// ============================================
// EXPLICIT ROUTES - ZAPOREDJA
// ============================================
function generateZaporedjaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route key="zaporedja-main" path="/govorne-igre/zaporedja" element={<ProtectedRoute><Zaporedja /></ProtectedRoute>} />,
    
    // C
    <Route key="zap-c" path="/govorne-igre/zaporedja/c" element={<ProtectedRoute><ZaporedjaC /></ProtectedRoute>} />,
    <Route key="zap-c56" path="/govorne-igre/zaporedja/c56" element={<ProtectedRoute><ZaporedjaC56 /></ProtectedRoute>} />,
    <Route key="zap-c78" path="/govorne-igre/zaporedja/c78" element={<ProtectedRoute><ZaporedjaC78 /></ProtectedRoute>} />,
    <Route key="zap-c910" path="/govorne-igre/zaporedja/c910" element={<ProtectedRoute><ZaporedjaC910 /></ProtectedRoute>} />,
    
    // Č
    <Route key="zap-č" path="/govorne-igre/zaporedja/č" element={<ProtectedRoute><ZaporedjaČ /></ProtectedRoute>} />,
    <Route key="zap-č56" path="/govorne-igre/zaporedja/č56" element={<ProtectedRoute><ZaporedjaČ56 /></ProtectedRoute>} />,
    <Route key="zap-č78" path="/govorne-igre/zaporedja/č78" element={<ProtectedRoute><ZaporedjaČ78 /></ProtectedRoute>} />,
    <Route key="zap-č910" path="/govorne-igre/zaporedja/č910" element={<ProtectedRoute><ZaporedjaČ910 /></ProtectedRoute>} />,
    
    // K
    <Route key="zap-k" path="/govorne-igre/zaporedja/k" element={<ProtectedRoute><ZaporedjaK /></ProtectedRoute>} />,
    <Route key="zap-k56" path="/govorne-igre/zaporedja/k56" element={<ProtectedRoute><ZaporedjaK56 /></ProtectedRoute>} />,
    <Route key="zap-k78" path="/govorne-igre/zaporedja/k78" element={<ProtectedRoute><ZaporedjaK78 /></ProtectedRoute>} />,
    <Route key="zap-k910" path="/govorne-igre/zaporedja/k910" element={<ProtectedRoute><ZaporedjaK910 /></ProtectedRoute>} />,
    
    // L
    <Route key="zap-l" path="/govorne-igre/zaporedja/l" element={<ProtectedRoute><ZaporedjaL /></ProtectedRoute>} />,
    <Route key="zap-l56" path="/govorne-igre/zaporedja/l56" element={<ProtectedRoute><ZaporedjaL56 /></ProtectedRoute>} />,
    <Route key="zap-l78" path="/govorne-igre/zaporedja/l78" element={<ProtectedRoute><ZaporedjaL78 /></ProtectedRoute>} />,
    <Route key="zap-l910" path="/govorne-igre/zaporedja/l910" element={<ProtectedRoute><ZaporedjaL910 /></ProtectedRoute>} />,
    
    // R
    <Route key="zap-r" path="/govorne-igre/zaporedja/r" element={<ProtectedRoute><ZaporedjaR /></ProtectedRoute>} />,
    <Route key="zap-r56" path="/govorne-igre/zaporedja/r56" element={<ProtectedRoute><ZaporedjaR56 /></ProtectedRoute>} />,
    <Route key="zap-r78" path="/govorne-igre/zaporedja/r78" element={<ProtectedRoute><ZaporedjaR78 /></ProtectedRoute>} />,
    <Route key="zap-r910" path="/govorne-igre/zaporedja/r910" element={<ProtectedRoute><ZaporedjaR910 /></ProtectedRoute>} />,
    
    // S
    <Route key="zap-s" path="/govorne-igre/zaporedja/s" element={<ProtectedRoute><ZaporedjaS /></ProtectedRoute>} />,
    <Route key="zap-s56" path="/govorne-igre/zaporedja/s56" element={<ProtectedRoute><ZaporedjaS56 /></ProtectedRoute>} />,
    <Route key="zap-s78" path="/govorne-igre/zaporedja/s78" element={<ProtectedRoute><ZaporedjaS78 /></ProtectedRoute>} />,
    <Route key="zap-s910" path="/govorne-igre/zaporedja/s910" element={<ProtectedRoute><ZaporedjaS910 /></ProtectedRoute>} />,
    
    // Š
    <Route key="zap-š" path="/govorne-igre/zaporedja/š" element={<ProtectedRoute><ZaporedjaŠ /></ProtectedRoute>} />,
    <Route key="zap-š56" path="/govorne-igre/zaporedja/š56" element={<ProtectedRoute><ZaporedjaŠ56 /></ProtectedRoute>} />,
    <Route key="zap-š78" path="/govorne-igre/zaporedja/š78" element={<ProtectedRoute><ZaporedjaŠ78 /></ProtectedRoute>} />,
    <Route key="zap-š910" path="/govorne-igre/zaporedja/š910" element={<ProtectedRoute><ZaporedjaŠ910 /></ProtectedRoute>} />,
    
    // Z
    <Route key="zap-z" path="/govorne-igre/zaporedja/z" element={<ProtectedRoute><ZaporedjaZ /></ProtectedRoute>} />,
    <Route key="zap-z56" path="/govorne-igre/zaporedja/z56" element={<ProtectedRoute><ZaporedjaZ56 /></ProtectedRoute>} />,
    <Route key="zap-z78" path="/govorne-igre/zaporedja/z78" element={<ProtectedRoute><ZaporedjaZ78 /></ProtectedRoute>} />,
    <Route key="zap-z910" path="/govorne-igre/zaporedja/z910" element={<ProtectedRoute><ZaporedjaZ910 /></ProtectedRoute>} />,
    
    // Ž
    <Route key="zap-ž" path="/govorne-igre/zaporedja/ž" element={<ProtectedRoute><ZaporedjaŽ /></ProtectedRoute>} />,
    <Route key="zap-ž56" path="/govorne-igre/zaporedja/ž56" element={<ProtectedRoute><ZaporedjaŽ56 /></ProtectedRoute>} />,
    <Route key="zap-ž78" path="/govorne-igre/zaporedja/ž78" element={<ProtectedRoute><ZaporedjaŽ78 /></ProtectedRoute>} />,
    <Route key="zap-ž910" path="/govorne-igre/zaporedja/ž910" element={<ProtectedRoute><ZaporedjaŽ910 /></ProtectedRoute>} />,
  ];
}

// ============================================
// EXPLICIT ROUTES - DRSNA SESTAVLJANKA
// ============================================
function generateDrsnaSestavljankaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route key="drsna-main" path="/govorne-igre/drsna-sestavljanka" element={<ProtectedRoute><DrsnaSestavljanka /></ProtectedRoute>} />,
    
    // C
    <Route key="drsna-c34" path="/govorne-igre/drsna-sestavljanka/c34" element={<ProtectedRoute><DrsnaSestavljankaC34 /></ProtectedRoute>} />,
    <Route key="drsna-c56" path="/govorne-igre/drsna-sestavljanka/c56" element={<ProtectedRoute><DrsnaSestavljankaC56 /></ProtectedRoute>} />,
    <Route key="drsna-c78" path="/govorne-igre/drsna-sestavljanka/c78" element={<ProtectedRoute><DrsnaSestavljankaC78 /></ProtectedRoute>} />,
    <Route key="drsna-c910" path="/govorne-igre/drsna-sestavljanka/c910" element={<ProtectedRoute><DrsnaSestavljankaC910 /></ProtectedRoute>} />,
    
    // Č
    <Route key="drsna-č34" path="/govorne-igre/drsna-sestavljanka/č34" element={<ProtectedRoute><DrsnaSestavljankaČ34 /></ProtectedRoute>} />,
    <Route key="drsna-č56" path="/govorne-igre/drsna-sestavljanka/č56" element={<ProtectedRoute><DrsnaSestavljankaČ56 /></ProtectedRoute>} />,
    <Route key="drsna-č78" path="/govorne-igre/drsna-sestavljanka/č78" element={<ProtectedRoute><DrsnaSestavljankaČ78 /></ProtectedRoute>} />,
    <Route key="drsna-č910" path="/govorne-igre/drsna-sestavljanka/č910" element={<ProtectedRoute><DrsnaSestavljankaČ910 /></ProtectedRoute>} />,
    
    // K
    <Route key="drsna-k34" path="/govorne-igre/drsna-sestavljanka/k34" element={<ProtectedRoute><DrsnaSestavljankaK34 /></ProtectedRoute>} />,
    <Route key="drsna-k56" path="/govorne-igre/drsna-sestavljanka/k56" element={<ProtectedRoute><DrsnaSestavljankaK56 /></ProtectedRoute>} />,
    <Route key="drsna-k78" path="/govorne-igre/drsna-sestavljanka/k78" element={<ProtectedRoute><DrsnaSestavljankaK78 /></ProtectedRoute>} />,
    <Route key="drsna-k910" path="/govorne-igre/drsna-sestavljanka/k910" element={<ProtectedRoute><DrsnaSestavljankaK910 /></ProtectedRoute>} />,
    
    // L
    <Route key="drsna-l34" path="/govorne-igre/drsna-sestavljanka/l34" element={<ProtectedRoute><DrsnaSestavljankaL34 /></ProtectedRoute>} />,
    <Route key="drsna-l56" path="/govorne-igre/drsna-sestavljanka/l56" element={<ProtectedRoute><DrsnaSestavljankaL56 /></ProtectedRoute>} />,
    <Route key="drsna-l78" path="/govorne-igre/drsna-sestavljanka/l78" element={<ProtectedRoute><DrsnaSestavljankaL78 /></ProtectedRoute>} />,
    <Route key="drsna-l910" path="/govorne-igre/drsna-sestavljanka/l910" element={<ProtectedRoute><DrsnaSestavljankaL910 /></ProtectedRoute>} />,
    
    // R
    <Route key="drsna-r34" path="/govorne-igre/drsna-sestavljanka/r34" element={<ProtectedRoute><DrsnaSestavljankaR34 /></ProtectedRoute>} />,
    <Route key="drsna-r56" path="/govorne-igre/drsna-sestavljanka/r56" element={<ProtectedRoute><DrsnaSestavljankaR56 /></ProtectedRoute>} />,
    <Route key="drsna-r78" path="/govorne-igre/drsna-sestavljanka/r78" element={<ProtectedRoute><DrsnaSestavljankaR78 /></ProtectedRoute>} />,
    <Route key="drsna-r910" path="/govorne-igre/drsna-sestavljanka/r910" element={<ProtectedRoute><DrsnaSestavljankaR910 /></ProtectedRoute>} />,
    
    // S
    <Route key="drsna-s34" path="/govorne-igre/drsna-sestavljanka/s34" element={<ProtectedRoute><DrsnaSestavljankaS34 /></ProtectedRoute>} />,
    <Route key="drsna-s56" path="/govorne-igre/drsna-sestavljanka/s56" element={<ProtectedRoute><DrsnaSestavljankaS56 /></ProtectedRoute>} />,
    <Route key="drsna-s78" path="/govorne-igre/drsna-sestavljanka/s78" element={<ProtectedRoute><DrsnaSestavljankaS78 /></ProtectedRoute>} />,
    <Route key="drsna-s910" path="/govorne-igre/drsna-sestavljanka/s910" element={<ProtectedRoute><DrsnaSestavljankaS910 /></ProtectedRoute>} />,
    
    // Š
    <Route key="drsna-š34" path="/govorne-igre/drsna-sestavljanka/š34" element={<ProtectedRoute><DrsnaSestavljankaŠ34 /></ProtectedRoute>} />,
    <Route key="drsna-š56" path="/govorne-igre/drsna-sestavljanka/š56" element={<ProtectedRoute><DrsnaSestavljankaŠ56 /></ProtectedRoute>} />,
    <Route key="drsna-š78" path="/govorne-igre/drsna-sestavljanka/š78" element={<ProtectedRoute><DrsnaSestavljankaŠ78 /></ProtectedRoute>} />,
    <Route key="drsna-š910" path="/govorne-igre/drsna-sestavljanka/š910" element={<ProtectedRoute><DrsnaSestavljankaŠ910 /></ProtectedRoute>} />,
    
    // Z
    <Route key="drsna-z34" path="/govorne-igre/drsna-sestavljanka/z34" element={<ProtectedRoute><DrsnaSestavljankaZ34 /></ProtectedRoute>} />,
    <Route key="drsna-z56" path="/govorne-igre/drsna-sestavljanka/z56" element={<ProtectedRoute><DrsnaSestavljankaZ56 /></ProtectedRoute>} />,
    <Route key="drsna-z78" path="/govorne-igre/drsna-sestavljanka/z78" element={<ProtectedRoute><DrsnaSestavljankaZ78 /></ProtectedRoute>} />,
    <Route key="drsna-z910" path="/govorne-igre/drsna-sestavljanka/z910" element={<ProtectedRoute><DrsnaSestavljankaZ910 /></ProtectedRoute>} />,
    
    // Ž
    <Route key="drsna-ž34" path="/govorne-igre/drsna-sestavljanka/ž34" element={<ProtectedRoute><DrsnaSestavljankaŽ34 /></ProtectedRoute>} />,
    <Route key="drsna-ž56" path="/govorne-igre/drsna-sestavljanka/ž56" element={<ProtectedRoute><DrsnaSestavljankaŽ56 /></ProtectedRoute>} />,
    <Route key="drsna-ž78" path="/govorne-igre/drsna-sestavljanka/ž78" element={<ProtectedRoute><DrsnaSestavljankaŽ78 /></ProtectedRoute>} />,
    <Route key="drsna-ž910" path="/govorne-igre/drsna-sestavljanka/ž910" element={<ProtectedRoute><DrsnaSestavljankaŽ910 /></ProtectedRoute>} />,
  ];
}

// ============================================
// EXPLICIT ROUTES - IGRA UJEMANJA
// ============================================
function generateIgraUjemanjaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route key="ujemanja-main" path="/govorne-igre/igra-ujemanja" element={<ProtectedRoute><IgraUjemanja /></ProtectedRoute>} />,
    
    // C
    <Route key="uje-c" path="/govorne-igre/igra-ujemanja/c" element={<ProtectedRoute><IgraUjemanjaC /></ProtectedRoute>} />,
    <Route key="uje-c56" path="/govorne-igre/igra-ujemanja/c56" element={<ProtectedRoute><IgraUjemanjaC56 /></ProtectedRoute>} />,
    <Route key="uje-c78" path="/govorne-igre/igra-ujemanja/c78" element={<ProtectedRoute><IgraUjemanjaC78 /></ProtectedRoute>} />,
    <Route key="uje-c910" path="/govorne-igre/igra-ujemanja/c910" element={<ProtectedRoute><IgraUjemanjaC910 /></ProtectedRoute>} />,
    
    // Č
    <Route key="uje-č" path="/govorne-igre/igra-ujemanja/č" element={<ProtectedRoute><IgraUjemanjaČ /></ProtectedRoute>} />,
    <Route key="uje-č56" path="/govorne-igre/igra-ujemanja/č56" element={<ProtectedRoute><IgraUjemanjaČ56 /></ProtectedRoute>} />,
    <Route key="uje-č78" path="/govorne-igre/igra-ujemanja/č78" element={<ProtectedRoute><IgraUjemanjaČ78 /></ProtectedRoute>} />,
    <Route key="uje-č910" path="/govorne-igre/igra-ujemanja/č910" element={<ProtectedRoute><IgraUjemanjaČ910 /></ProtectedRoute>} />,
    
    // K
    <Route key="uje-k" path="/govorne-igre/igra-ujemanja/k" element={<ProtectedRoute><IgraUjemanjaK /></ProtectedRoute>} />,
    <Route key="uje-k56" path="/govorne-igre/igra-ujemanja/k56" element={<ProtectedRoute><IgraUjemanjaK56 /></ProtectedRoute>} />,
    <Route key="uje-k78" path="/govorne-igre/igra-ujemanja/k78" element={<ProtectedRoute><IgraUjemanjaK78 /></ProtectedRoute>} />,
    <Route key="uje-k910" path="/govorne-igre/igra-ujemanja/k910" element={<ProtectedRoute><IgraUjemanjaK910 /></ProtectedRoute>} />,
    
    // L
    <Route key="uje-l" path="/govorne-igre/igra-ujemanja/l" element={<ProtectedRoute><IgraUjemanjaL /></ProtectedRoute>} />,
    <Route key="uje-l56" path="/govorne-igre/igra-ujemanja/l56" element={<ProtectedRoute><IgraUjemanjaL56 /></ProtectedRoute>} />,
    <Route key="uje-l78" path="/govorne-igre/igra-ujemanja/l78" element={<ProtectedRoute><IgraUjemanjaL78 /></ProtectedRoute>} />,
    <Route key="uje-l910" path="/govorne-igre/igra-ujemanja/l910" element={<ProtectedRoute><IgraUjemanjaL910 /></ProtectedRoute>} />,
    
    // R
    <Route key="uje-r" path="/govorne-igre/igra-ujemanja/r" element={<ProtectedRoute><IgraUjemanjaR /></ProtectedRoute>} />,
    <Route key="uje-r56" path="/govorne-igre/igra-ujemanja/r56" element={<ProtectedRoute><IgraUjemanjaR56 /></ProtectedRoute>} />,
    <Route key="uje-r78" path="/govorne-igre/igra-ujemanja/r78" element={<ProtectedRoute><IgraUjemanjaR78 /></ProtectedRoute>} />,
    <Route key="uje-r910" path="/govorne-igre/igra-ujemanja/r910" element={<ProtectedRoute><IgraUjemanjaR910 /></ProtectedRoute>} />,
    
    // S
    <Route key="uje-s" path="/govorne-igre/igra-ujemanja/s" element={<ProtectedRoute><IgraUjemanjaS /></ProtectedRoute>} />,
    <Route key="uje-s56" path="/govorne-igre/igra-ujemanja/s56" element={<ProtectedRoute><IgraUjemanjaS56 /></ProtectedRoute>} />,
    <Route key="uje-s78" path="/govorne-igre/igra-ujemanja/s78" element={<ProtectedRoute><IgraUjemanjaS78 /></ProtectedRoute>} />,
    <Route key="uje-s910" path="/govorne-igre/igra-ujemanja/s910" element={<ProtectedRoute><IgraUjemanjaS910 /></ProtectedRoute>} />,
    
    // Š
    <Route key="uje-š" path="/govorne-igre/igra-ujemanja/š" element={<ProtectedRoute><IgraUjemanjaŠ /></ProtectedRoute>} />,
    <Route key="uje-š56" path="/govorne-igre/igra-ujemanja/š56" element={<ProtectedRoute><IgraUjemanjaŠ56 /></ProtectedRoute>} />,
    <Route key="uje-š78" path="/govorne-igre/igra-ujemanja/š78" element={<ProtectedRoute><IgraUjemanjaŠ78 /></ProtectedRoute>} />,
    <Route key="uje-š910" path="/govorne-igre/igra-ujemanja/š910" element={<ProtectedRoute><IgraUjemanjaŠ910 /></ProtectedRoute>} />,
    
    // Z
    <Route key="uje-z" path="/govorne-igre/igra-ujemanja/z" element={<ProtectedRoute><IgraUjemanjaZ /></ProtectedRoute>} />,
    <Route key="uje-z56" path="/govorne-igre/igra-ujemanja/z56" element={<ProtectedRoute><IgraUjemanjaZ56 /></ProtectedRoute>} />,
    <Route key="uje-z78" path="/govorne-igre/igra-ujemanja/z78" element={<ProtectedRoute><IgraUjemanjaZ78 /></ProtectedRoute>} />,
    <Route key="uje-z910" path="/govorne-igre/igra-ujemanja/z910" element={<ProtectedRoute><IgraUjemanjaZ910 /></ProtectedRoute>} />,
    
    // Ž
    <Route key="uje-ž" path="/govorne-igre/igra-ujemanja/ž" element={<ProtectedRoute><IgraUjemanjaŽ /></ProtectedRoute>} />,
    <Route key="uje-ž56" path="/govorne-igre/igra-ujemanja/ž56" element={<ProtectedRoute><IgraUjemanjaŽ56 /></ProtectedRoute>} />,
    <Route key="uje-ž78" path="/govorne-igre/igra-ujemanja/ž78" element={<ProtectedRoute><IgraUjemanjaŽ78 /></ProtectedRoute>} />,
    <Route key="uje-ž910" path="/govorne-igre/igra-ujemanja/ž910" element={<ProtectedRoute><IgraUjemanjaŽ910 /></ProtectedRoute>} />,
  ];
}

// ============================================
// EXPLICIT ROUTES - LABIRINT
// ============================================
function generateLabirintRoutes(): JSX.Element[] {
  return [
    <Route key="labirint-main" path="/govorne-igre/labirint" element={<ProtectedRoute><Labirint /></ProtectedRoute>} />,
    <Route key="labirint-c" path="/govorne-igre/labirint/c" element={<ProtectedRoute><LabirintC /></ProtectedRoute>} />,
    // Dynamic route for other letters (they don't have diacritics issues)
    <Route key="labirint-letter" path="/govorne-igre/labirint/:letter" element={<ProtectedRoute><LabirintLetter /></ProtectedRoute>} />,
  ];
}

// ============================================
// URL-ENCODED ROUTES FOR DIACRITICS
// When browser encodes č → %C4%8D, š → %C5%A0, ž → %C5%BD
// ============================================
function generateUrlEncodedRoutes(): JSX.Element[] {
  return [
    // Spomin - URL encoded
    <Route key="spomin-č-enc" path="/govorne-igre/spomin/spomin-%C4%8D" element={<Navigate to="/govorne-igre/spomin/spomin-č" replace />} />,
    <Route key="spomin-š-enc" path="/govorne-igre/spomin/spomin-%C5%A0" element={<Navigate to="/govorne-igre/spomin/spomin-š" replace />} />,
    <Route key="spomin-ž-enc" path="/govorne-igre/spomin/spomin-%C5%BD" element={<Navigate to="/govorne-igre/spomin/spomin-ž" replace />} />,
    
    // Sestavljanke - URL encoded Č
    <Route key="sest-č-enc" path="/govorne-igre/sestavljanke/%C4%8D" element={<Navigate to="/govorne-igre/sestavljanke/č" replace />} />,
    <Route key="sest-č56-enc" path="/govorne-igre/sestavljanke/%C4%8D56" element={<Navigate to="/govorne-igre/sestavljanke/č56" replace />} />,
    <Route key="sest-č78-enc" path="/govorne-igre/sestavljanke/%C4%8D78" element={<Navigate to="/govorne-igre/sestavljanke/č78" replace />} />,
    <Route key="sest-č910-enc" path="/govorne-igre/sestavljanke/%C4%8D910" element={<Navigate to="/govorne-igre/sestavljanke/č910" replace />} />,
    // Sestavljanke - URL encoded Š
    <Route key="sest-š-enc" path="/govorne-igre/sestavljanke/%C5%A0" element={<Navigate to="/govorne-igre/sestavljanke/š" replace />} />,
    <Route key="sest-š56-enc" path="/govorne-igre/sestavljanke/%C5%A056" element={<Navigate to="/govorne-igre/sestavljanke/š56" replace />} />,
    <Route key="sest-š78-enc" path="/govorne-igre/sestavljanke/%C5%A078" element={<Navigate to="/govorne-igre/sestavljanke/š78" replace />} />,
    <Route key="sest-š910-enc" path="/govorne-igre/sestavljanke/%C5%A0910" element={<Navigate to="/govorne-igre/sestavljanke/š910" replace />} />,
    // Sestavljanke - URL encoded Ž
    <Route key="sest-ž-enc" path="/govorne-igre/sestavljanke/%C5%BD" element={<Navigate to="/govorne-igre/sestavljanke/ž" replace />} />,
    <Route key="sest-ž56-enc" path="/govorne-igre/sestavljanke/%C5%BD56" element={<Navigate to="/govorne-igre/sestavljanke/ž56" replace />} />,
    <Route key="sest-ž78-enc" path="/govorne-igre/sestavljanke/%C5%BD78" element={<Navigate to="/govorne-igre/sestavljanke/ž78" replace />} />,
    <Route key="sest-ž910-enc" path="/govorne-igre/sestavljanke/%C5%BD910" element={<Navigate to="/govorne-igre/sestavljanke/ž910" replace />} />,
    
    // Zaporedja - URL encoded Č
    <Route key="zap-č-enc" path="/govorne-igre/zaporedja/%C4%8D" element={<Navigate to="/govorne-igre/zaporedja/č" replace />} />,
    <Route key="zap-č56-enc" path="/govorne-igre/zaporedja/%C4%8D56" element={<Navigate to="/govorne-igre/zaporedja/č56" replace />} />,
    <Route key="zap-č78-enc" path="/govorne-igre/zaporedja/%C4%8D78" element={<Navigate to="/govorne-igre/zaporedja/č78" replace />} />,
    <Route key="zap-č910-enc" path="/govorne-igre/zaporedja/%C4%8D910" element={<Navigate to="/govorne-igre/zaporedja/č910" replace />} />,
    // Zaporedja - URL encoded Š
    <Route key="zap-š-enc" path="/govorne-igre/zaporedja/%C5%A0" element={<Navigate to="/govorne-igre/zaporedja/š" replace />} />,
    <Route key="zap-š56-enc" path="/govorne-igre/zaporedja/%C5%A056" element={<Navigate to="/govorne-igre/zaporedja/š56" replace />} />,
    <Route key="zap-š78-enc" path="/govorne-igre/zaporedja/%C5%A078" element={<Navigate to="/govorne-igre/zaporedja/š78" replace />} />,
    <Route key="zap-š910-enc" path="/govorne-igre/zaporedja/%C5%A0910" element={<Navigate to="/govorne-igre/zaporedja/š910" replace />} />,
    // Zaporedja - URL encoded Ž
    <Route key="zap-ž-enc" path="/govorne-igre/zaporedja/%C5%BD" element={<Navigate to="/govorne-igre/zaporedja/ž" replace />} />,
    <Route key="zap-ž56-enc" path="/govorne-igre/zaporedja/%C5%BD56" element={<Navigate to="/govorne-igre/zaporedja/ž56" replace />} />,
    <Route key="zap-ž78-enc" path="/govorne-igre/zaporedja/%C5%BD78" element={<Navigate to="/govorne-igre/zaporedja/ž78" replace />} />,
    <Route key="zap-ž910-enc" path="/govorne-igre/zaporedja/%C5%BD910" element={<Navigate to="/govorne-igre/zaporedja/ž910" replace />} />,
    
    // Drsna sestavljanka - URL encoded Č
    <Route key="drsna-č34-enc" path="/govorne-igre/drsna-sestavljanka/%C4%8D34" element={<Navigate to="/govorne-igre/drsna-sestavljanka/č34" replace />} />,
    <Route key="drsna-č56-enc" path="/govorne-igre/drsna-sestavljanka/%C4%8D56" element={<Navigate to="/govorne-igre/drsna-sestavljanka/č56" replace />} />,
    <Route key="drsna-č78-enc" path="/govorne-igre/drsna-sestavljanka/%C4%8D78" element={<Navigate to="/govorne-igre/drsna-sestavljanka/č78" replace />} />,
    <Route key="drsna-č910-enc" path="/govorne-igre/drsna-sestavljanka/%C4%8D910" element={<Navigate to="/govorne-igre/drsna-sestavljanka/č910" replace />} />,
    // Drsna sestavljanka - URL encoded Š
    <Route key="drsna-š34-enc" path="/govorne-igre/drsna-sestavljanka/%C5%A034" element={<Navigate to="/govorne-igre/drsna-sestavljanka/š34" replace />} />,
    <Route key="drsna-š56-enc" path="/govorne-igre/drsna-sestavljanka/%C5%A056" element={<Navigate to="/govorne-igre/drsna-sestavljanka/š56" replace />} />,
    <Route key="drsna-š78-enc" path="/govorne-igre/drsna-sestavljanka/%C5%A078" element={<Navigate to="/govorne-igre/drsna-sestavljanka/š78" replace />} />,
    <Route key="drsna-š910-enc" path="/govorne-igre/drsna-sestavljanka/%C5%A0910" element={<Navigate to="/govorne-igre/drsna-sestavljanka/š910" replace />} />,
    // Drsna sestavljanka - URL encoded Ž
    <Route key="drsna-ž34-enc" path="/govorne-igre/drsna-sestavljanka/%C5%BD34" element={<Navigate to="/govorne-igre/drsna-sestavljanka/ž34" replace />} />,
    <Route key="drsna-ž56-enc" path="/govorne-igre/drsna-sestavljanka/%C5%BD56" element={<Navigate to="/govorne-igre/drsna-sestavljanka/ž56" replace />} />,
    <Route key="drsna-ž78-enc" path="/govorne-igre/drsna-sestavljanka/%C5%BD78" element={<Navigate to="/govorne-igre/drsna-sestavljanka/ž78" replace />} />,
    <Route key="drsna-ž910-enc" path="/govorne-igre/drsna-sestavljanka/%C5%BD910" element={<Navigate to="/govorne-igre/drsna-sestavljanka/ž910" replace />} />,
    
    // Igra ujemanja - URL encoded Č
    <Route key="uje-č-enc" path="/govorne-igre/igra-ujemanja/%C4%8D" element={<Navigate to="/govorne-igre/igra-ujemanja/č" replace />} />,
    <Route key="uje-č56-enc" path="/govorne-igre/igra-ujemanja/%C4%8D56" element={<Navigate to="/govorne-igre/igra-ujemanja/č56" replace />} />,
    <Route key="uje-č78-enc" path="/govorne-igre/igra-ujemanja/%C4%8D78" element={<Navigate to="/govorne-igre/igra-ujemanja/č78" replace />} />,
    <Route key="uje-č910-enc" path="/govorne-igre/igra-ujemanja/%C4%8D910" element={<Navigate to="/govorne-igre/igra-ujemanja/č910" replace />} />,
    // Igra ujemanja - URL encoded Š
    <Route key="uje-š-enc" path="/govorne-igre/igra-ujemanja/%C5%A0" element={<Navigate to="/govorne-igre/igra-ujemanja/š" replace />} />,
    <Route key="uje-š56-enc" path="/govorne-igre/igra-ujemanja/%C5%A056" element={<Navigate to="/govorne-igre/igra-ujemanja/š56" replace />} />,
    <Route key="uje-š78-enc" path="/govorne-igre/igra-ujemanja/%C5%A078" element={<Navigate to="/govorne-igre/igra-ujemanja/š78" replace />} />,
    <Route key="uje-š910-enc" path="/govorne-igre/igra-ujemanja/%C5%A0910" element={<Navigate to="/govorne-igre/igra-ujemanja/š910" replace />} />,
    // Igra ujemanja - URL encoded Ž
    <Route key="uje-ž-enc" path="/govorne-igre/igra-ujemanja/%C5%BD" element={<Navigate to="/govorne-igre/igra-ujemanja/ž" replace />} />,
    <Route key="uje-ž56-enc" path="/govorne-igre/igra-ujemanja/%C5%BD56" element={<Navigate to="/govorne-igre/igra-ujemanja/ž56" replace />} />,
    <Route key="uje-ž78-enc" path="/govorne-igre/igra-ujemanja/%C5%BD78" element={<Navigate to="/govorne-igre/igra-ujemanja/ž78" replace />} />,
    <Route key="uje-ž910-enc" path="/govorne-igre/igra-ujemanja/%C5%BD910" element={<Navigate to="/govorne-igre/igra-ujemanja/ž910" replace />} />,
  ];
}

// ============================================
// LEGACY REDIRECTS
// ============================================
function generateLegacyRedirects(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  
  // Static legacy route redirects
  Object.entries(LEGACY_GAME_ROUTES).forEach(([from, to]) => {
    routes.push(
      <Route key={`redirect-${from}`} path={from} element={<Navigate to={to} replace />} />
    );
  });
  
  return routes;
}

// ============================================
// MAIN EXPORT
// ============================================
export function GameRoutes(): JSX.Element[] {
  return [
    <Route key="govorne-igre" path="/govorne-igre" element={<ProtectedRoute><GovorneIgre /></ProtectedRoute>} />,
    ...generateSpominRoutes(),
    ...generateSestavljankeRoutes(),
    ...generateZaporedjaRoutes(),
    ...generateDrsnaSestavljankaRoutes(),
    ...generateIgraUjemanjaRoutes(),
    ...generateLabirintRoutes(),
    ...generateUrlEncodedRoutes(),
    ...generateLegacyRedirects(),
  ];
}
