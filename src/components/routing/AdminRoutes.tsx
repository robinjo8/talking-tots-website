import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { lazy, Suspense } from 'react';

// Lazy load admin pages for better performance
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminRegister = lazy(() => import('@/pages/admin/AdminRegister'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/pages/admin/AdminUserDetail'));
const AdminMemberships = lazy(() => import('@/pages/admin/AdminMemberships'));

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
        
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default AdminRoutes;
