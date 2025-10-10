import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor, Share } from 'lucide-react';
import { usePWA, useIOSInstallInstructions } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPrompt() {
  const { canInstall, promptInstall, dismissInstallPrompt, isIOSDevice } = usePWA();
  const { showInstructions, dismissInstructions } = useIOSInstallInstructions();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show install prompt after a delay if conditions are met
    if (canInstall && !isIOSDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [canInstall, isIOSDevice]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissInstallPrompt();
  };

  if (!canInstall && !showInstructions) return null;

  return (
    <AnimatePresence>
      {(isVisible || showInstructions) && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-[calc(100vw-2rem)] md:left-auto md:right-4 md:max-w-sm"
        >
          <Card className="border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <img 
                      src="/icons/icon-72x72.png" 
                      alt="TomiTalk Dragon" 
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Namesti TomiTalk
                  </h3>
                  
                  {showInstructions ? (
                    <IOSInstallInstructions onDismiss={dismissInstructions} />
                  ) : (
                    <AndroidInstallPrompt 
                      onInstall={handleInstall}
                      onDismiss={handleDismiss}
                    />
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showInstructions ? dismissInstructions : handleDismiss}
                  className="flex-shrink-0 h-8 w-8 p-0"
                  aria-label="Zapri"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AndroidInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

function AndroidInstallPrompt({ onInstall, onDismiss }: AndroidInstallPromptProps) {
  return (
    <>
      <p className="text-xs text-muted-foreground mb-3">
        Dodaj aplikacijo na svoj telefon za hitrejši dostop in boljšo izkušnjo!
      </p>
      
      <div className="flex gap-2">
        <Button
          onClick={onInstall}
          size="sm"
          className="flex-1 h-8 text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Namesti
        </Button>
        
        <Button
          variant="outline"
          onClick={onDismiss}
          size="sm"
          className="h-8 text-xs"
        >
          Pozneje
        </Button>
      </div>
    </>
  );
}

interface IOSInstallInstructionsProps {
  onDismiss: () => void;
}

function IOSInstallInstructions({ onDismiss }: IOSInstallInstructionsProps) {
  const [step, setStep] = useState(1);
  
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Za namestitev aplikacije na iOS napravo:
      </p>
      
      <div className="space-y-2">
        <div className={`flex items-center gap-2 text-xs ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">1</span>
          </div>
          <span>Pritisni gumb</span>
          <Share className="h-3 w-3" />
          <span>spodaj</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">2</span>
          </div>
          <span>Izberi "Dodaj na začetni zaslon"</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">3</span>
          </div>
          <span>Pritisni "Dodaj"</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onDismiss}
          size="sm"
          className="flex-1 h-8 text-xs"
        >
          Razumem
        </Button>
      </div>
    </div>
  );
}

// Desktop install banner (shown on wider screens)
export function DesktopInstallBanner() {
  const { canInstall, promptInstall, dismissInstallPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (canInstall) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissInstallPrompt();
  };

  if (!canInstall || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card className="border-primary shadow-lg bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Namesti TomiTalk na namizje</h3>
                  <p className="text-xs text-muted-foreground">
                    Uživaj v hitrejšem dostopu in boljši izkušnji
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleInstall} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Namesti
                </Button>
                
                <Button variant="ghost" onClick={handleDismiss} size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}