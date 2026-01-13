import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureAccess, FEATURE_NAMES, ProOnlyFeature } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';

interface FeatureGateProps {
  featureId: string;
  children: ReactNode;
  /** If true, shows a locked overlay instead of hiding content */
  showLockedState?: boolean;
  /** Custom message for locked state */
  customMessage?: string;
}

/**
 * Wrapper component for Pro-only features.
 * Shows "Na voljo v TomiTalk Pro" overlay for Start/Plus users.
 */
export function FeatureGate({ 
  featureId, 
  children,
  showLockedState = true,
  customMessage
}: FeatureGateProps) {
  const navigate = useNavigate();
  const { canAccess, requiredPlan, message } = useFeatureAccess(featureId);

  if (canAccess) {
    return <>{children}</>;
  }

  if (!showLockedState) {
    return null;
  }

  const displayMessage = customMessage || message;
  const featureName = FEATURE_NAMES[featureId as ProOnlyFeature] || featureId;

  return (
    <div className="relative">
      {/* Blurred/dimmed content */}
      <div className="opacity-40 pointer-events-none blur-[2px]">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-gradient-to-br from-dragon-green/20 to-dragon-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
            {requiredPlan === 'pro' ? (
              <Crown className="w-7 h-7 text-dragon-green" />
            ) : (
              <Lock className="w-7 h-7 text-app-orange" />
            )}
          </div>
          
          <p className="font-bold text-lg mb-1">{displayMessage}</p>
          
          {requiredPlan === 'pro' && (
            <p className="text-sm text-muted-foreground mb-4">
              "{featureName}" zahteva TomiTalk Pro paket
            </p>
          )}
          
          <Button 
            onClick={() => navigate('/cenik')}
            size="sm"
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            <Crown className="w-4 h-4 mr-2" />
            {requiredPlan === 'pro' ? 'Nadgradi na Pro' : 'Izberi paket'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple badge to show that a feature requires Pro
 */
export function ProBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-dragon-green/10 text-dragon-green text-xs font-medium rounded-full ${className}`}>
      <Crown className="w-3 h-3" />
      Pro
    </span>
  );
}
