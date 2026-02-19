import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { lazy, Suspense } from 'react';
import { AdminGameFullscreenWrapper } from '@/components/admin/games/AdminGameFullscreenWrapper';

// Lazy load admin pages for better performance
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminRegister = lazy(() => import('@/pages/admin/AdminRegister'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/pages/admin/AdminUserDetail'));
const AdminMemberships = lazy(() => import('@/pages/admin/AdminMemberships'));
const AdminAllTests = lazy(() => import('@/pages/admin/AdminTests'));
const AdminPending = lazy(() => import('@/pages/admin/AdminPending'));
const AdminMyReviews = lazy(() => import('@/pages/admin/AdminMyReviews'));
const AdminSessionReview = lazy(() => import('@/pages/admin/AdminSessionReview'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminChildren = lazy(() => import('@/pages/admin/AdminChildren'));
const AdminChildWorkspace = lazy(() => import('@/pages/admin/AdminChildWorkspace'));
const AdminChildProgress = lazy(() => import('@/pages/admin/AdminChildProgress'));
const AdminLogopedistChildDetail = lazy(() => import('@/pages/admin/AdminLogopedistChildDetail'));

// Admin exercise pages
const AdminGovorneVaje = lazy(() => import('@/pages/admin/AdminGovorneVaje'));
const AdminVajeMotorikeGovoril = lazy(() => import('@/pages/admin/exercises/AdminVajeMotorikeGovoril'));
const AdminArtikulacijaVaje = lazy(() => import('@/pages/admin/exercises/AdminArtikulacijaVaje'));
const AdminVideoNavodila = lazy(() => import('@/pages/admin/AdminVideoNavodila'));
const AdminArtikulacijskiTest = lazy(() => import('@/pages/admin/AdminArtikulacijskiTest'));
const AdminOsebniNacrt = lazy(() => import('@/pages/admin/AdminOsebniNacrt'));

// Admin game pages
const AdminGovorneIgre = lazy(() => import('@/pages/admin/AdminGovorneIgre'));
const AdminSpominGames = lazy(() => import('@/pages/admin/games/AdminSpominGames'));
const AdminBingoGames = lazy(() => import('@/pages/admin/games/AdminBingoGames'));
const AdminKoloSreceGames = lazy(() => import('@/pages/admin/games/AdminKoloSreceGames'));
const AdminLabirintGames = lazy(() => import('@/pages/admin/games/AdminLabirintGames'));
const AdminZaporedjaGames = lazy(() => import('@/pages/admin/games/AdminZaporedjaGames'));
const AdminSestavljankeGames = lazy(() => import('@/pages/admin/games/AdminSestavljankeGames'));
const AdminDrsnaSestavljankaGames = lazy(() => import('@/pages/admin/games/AdminDrsnaSestavljankaGames'));
const AdminIgraUjemanjaGames = lazy(() => import('@/pages/admin/games/AdminIgraUjemanjaGames'));
const AdminMetKockeGames = lazy(() => import('@/pages/admin/games/AdminMetKockeGames'));
const AdminPonoviPovedGames = lazy(() => import('@/pages/admin/games/AdminPonoviPovedGames'));
const AdminKaceLestveGames = lazy(() => import('@/pages/admin/games/AdminKaceLestveGames'));

// Admin game routers
const AdminSpominRouter = lazy(() => import('@/components/routing/admin/AdminSpominRouter'));
const AdminKoloSreceRouter = lazy(() => import('@/components/routing/admin/AdminKoloSreceRouter'));
const AdminBingoRouter = lazy(() => import('@/components/routing/admin/AdminBingoRouter'));
const AdminLabirintRouter = lazy(() => import('@/components/routing/admin/AdminLabirintRouter'));
const AdminZaporedjaRouter = lazy(() => import('@/components/routing/admin/AdminZaporedjaRouter'));
const AdminSestavljankeRouter = lazy(() => import('@/components/routing/admin/AdminSestavljankeRouter'));
const AdminDrsnaSestavljankaRouter = lazy(() => import('@/components/routing/admin/AdminDrsnaSestavljankaRouter'));
const AdminIgraUjemanjaRouter = lazy(() => import('@/components/routing/admin/AdminIgraUjemanjaRouter'));
const AdminMetKockeRouter = lazy(() => import('@/components/routing/admin/AdminMetKockeRouter'));
const AdminPonoviPovedRouter = lazy(() => import('@/components/routing/admin/AdminPonoviPovedRouter'));
const AdminKaceLestveRouter = lazy(() => import('@/components/routing/admin/AdminKaceLestveRouter'));
const AdminVideoNavodilaRouter = lazy(() => import('@/components/routing/admin/AdminVideoNavodilaRouter'));
const AdminArtikulacijaVajeRouter = lazy(() => import('@/components/routing/admin/AdminArtikulacijaVajeRouter'));

// Loading fallback for admin pages
function AdminLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
    </div>
  );
}

// Layout wrapper for authenticated admin pages
function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoadingFallback />}>
        {children}
      </Suspense>
    </AdminLayout>
  );
}

// Fullscreen wrapper for games (no admin layout - games need full screen)
function AdminGameFullscreenRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminGameFullscreenWrapper>
        {children}
      </AdminGameFullscreenWrapper>
    </Suspense>
  );
}

export function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public admin routes (login/register) */}
        <Route 
          path="login" 
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLogin />
            </Suspense>
          } 
        />
        <Route 
          path="register" 
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminRegister />
            </Suspense>
          } 
        />
        
        {/* Protected admin routes with layout */}
        <Route 
          path="dashboard" 
          element={
            <AdminLayoutWrapper>
              <AdminDashboard />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="users" 
          element={
            <AdminLayoutWrapper>
              <AdminUsers />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="users/:parentId/:childId" 
          element={
            <AdminLayoutWrapper>
              <AdminUserDetail />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="memberships" 
          element={
            <AdminLayoutWrapper>
              <AdminMemberships />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="all-tests" 
          element={
            <AdminLayoutWrapper>
              <AdminAllTests />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="pending" 
          element={
            <AdminLayoutWrapper>
              <AdminPending />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="my-reviews" 
          element={
            <AdminLayoutWrapper>
              <AdminMyReviews />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="tests/:sessionId" 
          element={
            <AdminLayoutWrapper>
              <AdminSessionReview />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="reports" 
          element={
            <AdminLayoutWrapper>
              <AdminReports />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children" 
          element={
            <AdminLayoutWrapper>
              <AdminChildren />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/workspace" 
          element={
            <AdminLayoutWrapper>
              <AdminChildWorkspace />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/progress" 
          element={
            <AdminLayoutWrapper>
              <AdminChildProgress />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/details" 
          element={
            <AdminLayoutWrapper>
              <AdminLogopedistChildDetail />
            </AdminLayoutWrapper>
          } 
        />
        
        {/* Admin game routes */}
        <Route 
          path="children/:childId/games" 
          element={
            <AdminLayoutWrapper>
              <AdminGovorneIgre />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/spomin" 
          element={
            <AdminLayoutWrapper>
              <AdminSpominGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/spomin/:gameId" 
          element={
            <AdminGameFullscreenRoute>
              <AdminSpominRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/bingo" 
          element={
            <AdminLayoutWrapper>
              <AdminBingoGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/bingo/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminBingoRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/kolo-srece" 
          element={
            <AdminLayoutWrapper>
              <AdminKoloSreceGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/kolo-srece/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminKoloSreceRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/labirint" 
          element={
            <AdminLayoutWrapper>
              <AdminLabirintGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/labirint/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminLabirintRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/zaporedja" 
          element={
            <AdminLayoutWrapper>
              <AdminZaporedjaGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/zaporedja/:letterAndAge" 
          element={
            <AdminGameFullscreenRoute>
              <AdminZaporedjaRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/sestavljanke" 
          element={
            <AdminLayoutWrapper>
              <AdminSestavljankeGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/sestavljanke/:letterAndAge" 
          element={
            <AdminGameFullscreenRoute>
              <AdminSestavljankeRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/drsna-sestavljanka" 
          element={
            <AdminLayoutWrapper>
              <AdminDrsnaSestavljankaGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/drsna-sestavljanka/:letterAndAge" 
          element={
            <AdminGameFullscreenRoute>
              <AdminDrsnaSestavljankaRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/igra-ujemanja" 
          element={
            <AdminLayoutWrapper>
              <AdminIgraUjemanjaGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/igra-ujemanja/:letterAndAge" 
          element={
            <AdminGameFullscreenRoute>
              <AdminIgraUjemanjaRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/met-kocke" 
          element={
            <AdminLayoutWrapper>
              <AdminMetKockeGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/met-kocke/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminMetKockeRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/ponovi-poved" 
          element={
            <AdminLayoutWrapper>
              <AdminPonoviPovedGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/ponovi-poved/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminPonoviPovedRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/games/kace" 
          element={
            <AdminLayoutWrapper>
              <AdminKaceLestveGames />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/games/kace/:letter" 
          element={
            <AdminGameFullscreenRoute>
              <AdminKaceLestveRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        
        {/* Admin exercise routes */}
        <Route 
          path="children/:childId/exercises" 
          element={
            <AdminLayoutWrapper>
              <AdminGovorneVaje />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/exercises/vaje-motorike-govoril" 
          element={
            <AdminGameFullscreenRoute>
              <AdminVajeMotorikeGovoril />
            </AdminGameFullscreenRoute>
          } 
        />
        <Route 
          path="children/:childId/exercises/artikulacija" 
          element={
            <AdminLayoutWrapper>
              <AdminArtikulacijaVaje />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/exercises/artikulacija/:gameId" 
          element={
            <AdminGameFullscreenRoute>
              <AdminArtikulacijaVajeRouter />
            </AdminGameFullscreenRoute>
          } 
        />
        
        {/* Admin video navodila routes */}
        <Route 
          path="children/:childId/video-navodila" 
          element={
            <AdminLayoutWrapper>
              <AdminVideoNavodila />
            </AdminLayoutWrapper>
          } 
        />
        <Route 
          path="children/:childId/video-navodila/:letter" 
          element={
            <AdminLayoutWrapper>
              <AdminVideoNavodilaRouter />
            </AdminLayoutWrapper>
          } 
        />
        
        {/* Admin test route */}
        <Route 
          path="children/:childId/test" 
          element={
            <AdminGameFullscreenRoute>
              <AdminArtikulacijskiTest />
            </AdminGameFullscreenRoute>
          } 
        />
        
        {/* Admin osebni nacrt route */}
        <Route 
          path="children/:childId/osebni-nacrt" 
          element={
            <AdminLayoutWrapper>
              <AdminOsebniNacrt />
            </AdminLayoutWrapper>
          } 
        />
        
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default AdminRoutes;
