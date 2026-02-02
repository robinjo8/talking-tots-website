import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { GameModeProvider } from '@/contexts/GameModeContext';
import { useLogopedistChild } from '@/hooks/useLogopedistChildren';
import { Loader2 } from 'lucide-react';

interface AdminGameFullscreenWrapperProps {
  children: React.ReactNode;
}

export function AdminGameFullscreenWrapper({ children }: AdminGameFullscreenWrapperProps) {
  const { childId } = useParams<{ childId: string }>();
  const { user, isLogopedist, isLoading: authLoading } = useAdminAuth();
  const { data: child, isLoading: childLoading } = useLogopedistChild(childId);

  // Auth check
  if (authLoading || childLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-dragon-green" />
      </div>
    );
  }

  if (!user || !isLogopedist) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!child || !childId) {
    return <Navigate to="/admin/children" replace />;
  }

  // Fullscreen game - no layout, just auth + context
  return (
    <GameModeProvider 
      mode="logopedist" 
      logopedistChildId={childId}
      childName={child.name}
    >
      {children}
    </GameModeProvider>
  );
}
