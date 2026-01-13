import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';

interface SubscriptionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

/**
 * Wrapper component that checks if user has ANY active subscription.
 * Use this to protect pages/sections that require a paid plan.
 */
export function SubscriptionGate({ 
  children, 
  fallback,
  showUpgradePrompt = true 
}: SubscriptionGateProps) {
  const navigate = useNavigate();
  const { isSubscribed, isLoading } = useSubscriptionContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isSubscribed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-app-orange/20 to-dragon-green/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-app-orange" />
          </div>
          <h3 className="text-xl font-bold mb-2">Vsebina je zaščitena</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Ta vsebina je na voljo samo v naročniških paketih. 
            Izberite paket, ki ustreza vašim potrebam.
          </p>
          <Button 
            onClick={() => navigate('/cenik')}
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Oglejte si pakete
          </Button>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
