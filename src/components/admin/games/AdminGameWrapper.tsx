import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { useLogopedistChild, useLogopedistChildren } from '@/hooks/useLogopedistChildren';
import { GameModeProvider } from '@/contexts/GameModeContext';
import { cn } from '@/lib/utils';
import { ChildSwitcher } from '@/components/admin/children/ChildSwitcher';
import { useState } from 'react';

interface AdminGameWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backPath?: string;
  title?: string;
}

export function AdminGameWrapper({ 
  children, 
  showBackButton = true,
  backPath,
  title
}: AdminGameWrapperProps) {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: child, isLoading } = useLogopedistChild(childId);
  const { children: allChildren } = useLogopedistChildren();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const handleSwitchChild = (newChildId: string) => {
    // Navigate to the same page but with different child
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/children/${childId}/`, `/children/${newChildId}/`);
    navigate(newPath);
    setShowSwitcher(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  if (!child || !childId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Otrok ni bil najden.</p>
        <Button variant="link" onClick={() => navigate('/admin/children')}>
          Nazaj na seznam
        </Button>
      </div>
    );
  }

  return (
    <GameModeProvider 
      mode="logopedist" 
      logopedistChildId={childId}
      childName={child.name}
    >
      <div className="space-y-4">
        {/* Header with navigation and child info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Nazaj
              </Button>
            )}
            
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}
          </div>

          {/* Child info and switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-dragon-green/10 rounded-full">
              <span className="text-lg">
                {child.gender === 'male' ? '🧒' : '👧'}
              </span>
              <span className="font-medium text-sm">{child.name}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSwitcher(true)}
            >
              <Users className="h-4 w-4 mr-1" />
              Zamenjaj
            </Button>
          </div>
        </div>

        {/* Game content */}
        {children}

        {/* Child switcher modal */}
        <ChildSwitcher
          open={showSwitcher}
          onOpenChange={setShowSwitcher}
          children={allChildren}
          currentChildId={child.id}
          onSelect={handleSwitchChild}
        />
      </div>
    </GameModeProvider>
  );
}
