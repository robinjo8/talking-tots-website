import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { differenceInDays, parseISO } from 'date-fns';
import { Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function TrialBanner() {
  const navigate = useNavigate();
  const { isTrialing, trialEnd, isSubscribed } = useSubscriptionContext();

  if (!isSubscribed || !isTrialing || !trialEnd) {
    return null;
  }

  const daysRemaining = differenceInDays(parseISO(trialEnd), new Date());
  
  if (daysRemaining < 0) {
    return null;
  }

  const isUrgent = daysRemaining <= 2;

  return (
    <div className={`px-4 py-2 text-center text-sm font-medium ${
      isUrgent 
        ? 'bg-app-orange/10 text-app-orange border-b border-app-orange/20' 
        : 'bg-dragon-green/10 text-dragon-green border-b border-dragon-green/20'
    }`}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Clock className="w-4 h-4" />
        <span>
          {daysRemaining === 0 
            ? 'Danes se konča vaše brezplačno obdobje!' 
            : daysRemaining === 1
            ? 'Še 1 dan brezplačne uporabe'
            : `Še ${daysRemaining} dni brezplačne uporabe`
          }
        </span>
        {isUrgent && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/profile?section=subscription')}
            className="ml-2 h-7 text-xs border-app-orange text-app-orange hover:bg-app-orange/10"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Upravljaj naročnino
          </Button>
        )}
      </div>
    </div>
  );
}
