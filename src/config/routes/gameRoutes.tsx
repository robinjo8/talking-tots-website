/**
 * Simplified Game Routes with Dynamic Routing
 * 
 * Uses runtime dynamic imports instead of 160+ lazy imports to fix build timeout.
 * The GameRouter component handles URL decoding and Unicode normalization.
 */
import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  SestavljankeRouter, 
  ZaporedjaRouter, 
  DrsnaSestavljankaRouter, 
  IgraUjemanjaRouter,
  SpominRouter 
} from '@/components/routing/GameRouter';

// ============================================
// LAZY IMPORTS - MAIN PAGES ONLY (reduced from 160+ to ~10)
// ============================================
const SpominGames = lazy(() => import('@/pages/SpominGames'));
const SestavljankeGames = lazy(() => import('@/pages/SestavljankeGames'));
const Zaporedja = lazy(() => import('@/pages/Zaporedja'));
const DrsnaSestavljanka = lazy(() => import('@/pages/DrsnaSestavljanka'));
const IgraUjemanja = lazy(() => import('@/pages/IgraUjemanja'));
const Labirint = lazy(() => import('@/pages/Labirint'));
const LabirintLetter = lazy(() => import('@/pages/LabirintLetter'));
const LabirintC = lazy(() => import('@/pages/LabirintC'));
const GovorneIgre = lazy(() => import('@/pages/GovorneIgre'));

// Loading fallback
function GameLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4">Nalagam...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

/**
 * Main Game Routes Component
 * Uses dynamic routing with parameter-based component loading
 */
export function GameRoutes() {
  return (
    <>
      {/* Main game selection page */}
      <Route path="/govorne-igre" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <GovorneIgre />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* ==================== SPOMIN ==================== */}
      <Route path="/govorne-igre/spomin" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <SpominGames />
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Dynamic route for all Spomin games */}
      <Route path="/govorne-igre/spomin/:letterAndAge" element={
        <Suspense fallback={<GameLoading />}>
          <SpominRouter />
        </Suspense>
      } />
      
      {/* ==================== SESTAVLJANKE ==================== */}
      <Route path="/govorne-igre/sestavljanke" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <SestavljankeGames />
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Dynamic route for all Sestavljanke games */}
      <Route path="/govorne-igre/sestavljanke/:letterAndAge" element={
        <Suspense fallback={<GameLoading />}>
          <SestavljankeRouter />
        </Suspense>
      } />
      
      {/* ==================== ZAPOREDJA ==================== */}
      <Route path="/govorne-igre/zaporedja" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <Zaporedja />
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Dynamic route for all Zaporedja games */}
      <Route path="/govorne-igre/zaporedja/:letterAndAge" element={
        <Suspense fallback={<GameLoading />}>
          <ZaporedjaRouter />
        </Suspense>
      } />
      
      {/* ==================== DRSNA SESTAVLJANKA ==================== */}
      <Route path="/govorne-igre/drsna-sestavljanka" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <DrsnaSestavljanka />
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Dynamic route for all Drsna Sestavljanka games */}
      <Route path="/govorne-igre/drsna-sestavljanka/:letterAndAge" element={
        <Suspense fallback={<GameLoading />}>
          <DrsnaSestavljankaRouter />
        </Suspense>
      } />
      
      {/* ==================== IGRA UJEMANJA ==================== */}
      <Route path="/govorne-igre/igra-ujemanja" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <IgraUjemanja />
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Dynamic route for all Igra Ujemanja games */}
      <Route path="/govorne-igre/igra-ujemanja/:letterAndAge" element={
        <Suspense fallback={<GameLoading />}>
          <IgraUjemanjaRouter />
        </Suspense>
      } />
      
      {/* ==================== LABIRINT ==================== */}
      <Route path="/govorne-igre/labirint" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <Labirint />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/govorne-igre/labirint/:letter" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <LabirintLetter />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/govorne-igre/labirint/c" element={
        <ProtectedRoute>
          <Suspense fallback={<GameLoading />}>
            <LabirintC />
          </Suspense>
        </ProtectedRoute>
      } />
    </>
  );
}
