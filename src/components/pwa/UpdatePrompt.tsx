import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export function UpdatePrompt() {
  const { hasUpdate, installUpdate } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (hasUpdate) {
      // Show update prompt immediately when update is available
      setIsVisible(true);
      
      // Also show a toast notification
      toast({
        title: "Posodobitev na voljo",
        description: "Nova različica TomiTalk aplikacije je pripravljena za namestitev.",
        duration: 5000,
      });
    }
  }, [hasUpdate]);

  const handleUpdate = async () => {
    setIsInstalling(true);
    
    try {
      await installUpdate();
      
      toast({
        title: "Posodobitev nameščena",
        description: "Aplikacija bo samodejno ponovno naložena.",
      });
      
      // The installUpdate function will reload the page
    } catch (error) {
      console.error('Update installation failed:', error);
      
      toast({
        title: "Napaka pri posodobitvi",
        description: "Poskusite ponovno naložiti stran.",
        variant: "destructive",
      });
      
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    
    toast({
      title: "Posodobitev odložena",
      description: "Posodobitev bo na voljo do ponovne naložitve aplikacije.",
    });
  };

  if (!hasUpdate || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
      >
        <Card className="border-primary shadow-xl bg-background">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* Update Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <motion.div
                  animate={isInstalling ? { rotate: 360 } : {}}
                  transition={isInstalling ? { 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  } : {}}
                >
                  <RefreshCw className={`h-8 w-8 text-primary ${isInstalling ? 'animate-spin' : ''}`} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Nova posodobitev je na voljo!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Namestite najnovejšo različico TomiTalk aplikacije za dostop do novih funkcij in izboljšav.
                </p>
              </div>

              {/* Features preview (optional) */}
              <div className="bg-muted/50 rounded-lg p-3 text-left">
                <h4 className="text-xs font-medium text-foreground mb-2">
                  Novosti v tej posodobitvi:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Izboljšane govorne igre</li>
                  <li>• Hitrejše nalaganje</li>
                  <li>• Popravki napak</li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isInstalling}
                  className="flex-1"
                  size="sm"
                >
                  {isInstalling ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Nameščam...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Namesti posodobitev
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  disabled={isInstalling}
                  size="sm"
                >
                  Pozneje
                </Button>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                disabled={isInstalling}
                className="absolute top-2 right-2 h-8 w-8 p-0"
                aria-label="Zapri"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact update notification for mobile
export function UpdateNotification() {
  const { hasUpdate, installUpdate } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (hasUpdate) {
      setIsDismissed(false);
    }
  }, [hasUpdate]);

  const handleQuickUpdate = async () => {
    await installUpdate();
  };

  if (!hasUpdate || isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground p-2 z-40"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm font-medium">
            Nova posodobitev je na voljo
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickUpdate}
            className="h-7 text-xs"
          >
            Posodobi
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-7 w-7 p-0 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}