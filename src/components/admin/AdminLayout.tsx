import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLogopedist, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Čakaj da se loading konča
    if (isLoading) return;
    
    // Če ni uporabnika, preusmeri na login
    if (!user) {
      navigate('/admin/login');
      return;
    }
    
    // isLogopedist že vključuje metadata check v AdminAuthContext
    if (!isLogopedist) {
      navigate('/admin/login');
    }
  }, [user, isLogopedist, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  if (!user || !isLogopedist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="lg:pl-64 pt-16">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
