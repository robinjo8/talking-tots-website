/**
 * Dinamično generirane game route
 * 
 * REŠITEV PROBLEMA ŠUMNIKOV (č, š, ž):
 * Namesto generiranja eksplicitnih poti za vsako črko,
 * uporabljamo dinamične parametre z Unicode normalizacijo.
 * 
 * DynamicGameRouter.tsx vsebuje komponente, ki:
 * 1. Dekodirajo URL parameter
 * 2. Normalizirajo Unicode (NFD -> NFC)
 * 3. Poiščejo ustrezno komponento
 */
import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  SUPPORTED_LETTERS, 
  LEGACY_GAME_ROUTES,
} from './routeConfig';

// Import dynamic routers with Unicode normalization
import { 
  SpominRouter,
  SestavljankeRouter, 
  ZaporedjaRouter,
  DrsnaSestavljankaRouter,
  IgraUjemanjaRouter,
} from '@/components/routing/DynamicGameRouter';

// Main game pages (these don't need dynamic routing)
const SpominGames = lazy(() => import('@/pages/SpominGames'));
const SestavljankeGames = lazy(() => import('@/pages/SestavljankeGames'));
const Zaporedja = lazy(() => import('@/pages/Zaporedja'));
const DrsnaSestavljanka = lazy(() => import('@/pages/DrsnaSestavljanka'));
const IgraUjemanja = lazy(() => import('@/pages/IgraUjemanja'));
const Labirint = lazy(() => import('@/pages/Labirint'));
const LabirintLetter = lazy(() => import('@/pages/LabirintLetter'));
const GovorneIgre = lazy(() => import('@/pages/GovorneIgre'));

// ============================================
// POENOSTAVLJENI GENERATORJI ROUTOV
// ============================================

function generateSpominRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route 
      key="spomin-main" 
      path="/govorne-igre/spomin" 
      element={<ProtectedRoute><SpominGames /></ProtectedRoute>} 
    />,
    // Dynamic route for all letters - SpominRouter handles Unicode normalization
    <Route 
      key="spomin-dynamic" 
      path="/govorne-igre/spomin/:letter" 
      element={<SpominRouter />} 
    />,
  ];
}

function generateSestavljankeRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route 
      key="sestavljanke-main" 
      path="/govorne-igre/sestavljanke" 
      element={<ProtectedRoute><SestavljankeGames /></ProtectedRoute>} 
    />,
    // Dynamic route for all letters and age groups - SestavljankeRouter handles Unicode normalization
    <Route 
      key="sestavljanke-dynamic" 
      path="/govorne-igre/sestavljanke/:letterAndAge" 
      element={<SestavljankeRouter />} 
    />,
  ];
}

function generateZaporedjaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route 
      key="zaporedja-main" 
      path="/govorne-igre/zaporedja" 
      element={<ProtectedRoute><Zaporedja /></ProtectedRoute>} 
    />,
    // Dynamic route - ZaporedjaRouter handles Unicode normalization
    <Route 
      key="zaporedja-dynamic" 
      path="/govorne-igre/zaporedja/:letterAndAge" 
      element={<ZaporedjaRouter />} 
    />,
  ];
}

function generateDrsnaSestavljankaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route 
      key="drsna-main" 
      path="/govorne-igre/drsna-sestavljanka" 
      element={<ProtectedRoute><DrsnaSestavljanka /></ProtectedRoute>} 
    />,
    // Dynamic route - DrsnaSestavljankaRouter handles Unicode normalization
    <Route 
      key="drsna-dynamic" 
      path="/govorne-igre/drsna-sestavljanka/:letterAndAge" 
      element={<DrsnaSestavljankaRouter />} 
    />,
  ];
}

function generateIgraUjemanjaRoutes(): JSX.Element[] {
  return [
    // Main selection page
    <Route 
      key="ujemanja-main" 
      path="/govorne-igre/igra-ujemanja" 
      element={<ProtectedRoute><IgraUjemanja /></ProtectedRoute>} 
    />,
    // Dynamic route - IgraUjemanjaRouter handles Unicode normalization
    <Route 
      key="ujemanja-dynamic" 
      path="/govorne-igre/igra-ujemanja/:letterAndAge" 
      element={<IgraUjemanjaRouter />} 
    />,
  ];
}

function generateLabirintRoutes(): JSX.Element[] {
  return [
    <Route 
      key="labirint-main" 
      path="/govorne-igre/labirint" 
      element={<ProtectedRoute><Labirint /></ProtectedRoute>} 
    />,
    <Route 
      key="labirint-letter" 
      path="/govorne-igre/labirint/:letter" 
      element={<ProtectedRoute><LabirintLetter /></ProtectedRoute>} 
    />,
  ];
}

function generateLegacyRedirects(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  
  // Static legacy route redirects
  Object.entries(LEGACY_GAME_ROUTES).forEach(([from, to]) => {
    routes.push(
      <Route key={`redirect-${from}`} path={from} element={<Navigate to={to} replace />} />
    );
  });
  
  // Legacy flat path redirects for each letter
  SUPPORTED_LETTERS.forEach(letter => {
    // Spomin
    routes.push(
      <Route key={`legacy-spomin-${letter}`} path={`/spomin-${letter}`} element={<Navigate to={`/govorne-igre/spomin/spomin-${letter}`} replace />} />
    );
    
    // Sestavljanke
    routes.push(
      <Route key={`legacy-sest-${letter}`} path={`/sestavljanke-${letter}`} element={<Navigate to={`/govorne-igre/sestavljanke/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-sest-${letter}-${ageGroup}`} path={`/sestavljanke-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/sestavljanke/${letter}${ageGroup}`} replace />} />
      );
    });
    
    // Zaporedja
    routes.push(
      <Route key={`legacy-zap-${letter}`} path={`/zaporedja-${letter}`} element={<Navigate to={`/govorne-igre/zaporedja/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-zap-${letter}-${ageGroup}`} path={`/zaporedja-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/zaporedja/${letter}${ageGroup}`} replace />} />
      );
    });
    
    // Drsna sestavljanka
    ['34', '56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-drsna-${letter}-${ageGroup}`} path={`/drsna-sestavljanka-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/drsna-sestavljanka/${letter}${ageGroup}`} replace />} />
      );
    });
    
    // Igra ujemanja
    routes.push(
      <Route key={`legacy-uje-${letter}`} path={`/igra-ujemanja-${letter}`} element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-uje-${letter}-${ageGroup}`} path={`/igra-ujemanja-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}${ageGroup}`} replace />} />
      );
    });
  });
  
  return routes;
}

// ============================================
// GLAVNI EXPORT
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
    ...generateLegacyRedirects(),
  ];
}
