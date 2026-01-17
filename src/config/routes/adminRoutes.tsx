/**
 * Admin route definitions
 */
import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminRegister = lazy(() => import('@/pages/admin/AdminRegister'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/pages/admin/AdminUserDetail'));
const AdminMemberships = lazy(() => import('@/pages/admin/AdminMemberships'));
const AdminRemoveBackground = lazy(() => import('@/pages/AdminRemoveBackground'));

export function AdminRoutes(): JSX.Element[] {
  return [
    <Route key="admin-redirect" path="/admin" element={<Navigate to="/admin/dashboard" replace />} />,
    <Route key="admin-login" path="/admin/login" element={
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    } />,
    <Route key="admin-register" path="/admin/register" element={
      <AdminAuthProvider>
        <AdminRegister />
      </AdminAuthProvider>
    } />,
    <Route key="admin-dashboard" path="/admin/dashboard" element={
      <AdminAuthProvider>
        <AdminDashboard />
      </AdminAuthProvider>
    } />,
    <Route key="admin-users" path="/admin/users" element={
      <AdminAuthProvider>
        <AdminUsers />
      </AdminAuthProvider>
    } />,
    <Route key="admin-user-detail" path="/admin/users/:userId" element={
      <AdminAuthProvider>
        <AdminUserDetail />
      </AdminAuthProvider>
    } />,
    <Route key="admin-memberships" path="/admin/memberships" element={
      <AdminAuthProvider>
        <AdminMemberships />
      </AdminAuthProvider>
    } />,
    <Route key="admin-remove-bg" path="/admin/remove-background" element={
      <ProtectedRoute>
        <AdminRemoveBackground />
      </ProtectedRoute>
    } />,
  ];
}
