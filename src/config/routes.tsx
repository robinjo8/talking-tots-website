/**
 * Main Routes Configuration
 * 
 * Modulariziran routing sistem - 2238 vrstic → ~80 vrstic
 * 
 * Struktura:
 * - routes/routeConfig.ts - centralna konfiguracija
 * - routes/gameRoutes.tsx - dinamično generirane game route (~200+ routov)
 * - routes/authRoutes.tsx - auth route
 * - routes/adminRoutes.tsx - admin route
 * - routes/staticRoutes.tsx - statične strani
 * - routes/protectedRoutes.tsx - zaščitene uporabniške strani
 */
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Eagerly load Index (homepage) for best LCP
import Index from '@/pages/Index';

// Lazy load NotFound
import { lazy } from 'react';
const NotFound = lazy(() => import('@/pages/NotFound'));

// Import modularnih routov
import { AuthRoutes } from './routes/authRoutes';
import { AdminRoutes } from './routes/adminRoutes';
import { StaticRoutes } from './routes/staticRoutes';
import { ProtectedUserRoutes } from './routes/protectedRoutes';
import { GameRoutes } from './routes/gameRoutes';

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Homepage - eagerly loaded */}
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes */}
        {AuthRoutes()}
        
        {/* Protected User Routes */}
        {ProtectedUserRoutes()}
        
        {/* Game Routes - dynamically generated */}
        {GameRoutes()}
        
        {/* Static Pages */}
        {StaticRoutes()}
        
        {/* Admin Routes */}
        {AdminRoutes()}
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
