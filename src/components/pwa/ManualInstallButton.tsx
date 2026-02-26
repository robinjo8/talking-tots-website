import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share, X, Menu } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function ManualInstallButton() {
  const {
    promptInstall, isInstalled, isStandalone, isIOSDevice, isAndroidDevice,
    isInstallable, isIOSSafari, isIOSNonSafari, canInstall, dismissInstallPrompt
  } = usePWA();
  const [showInstructions, setShowInstructions] = useState(false);

  const isGamePage = window.location.pathname.includes('/govorne-igre/');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Hide if: installed, in game, desktop, or can't install
  if (isInstalled || isStandalone || isGamePage || !isMobile || !canInstall) return null;

  const handleInstallClick = async () => {
    // Android with native prompt available
    if (isAndroidDevice && isInstallable) {
      const success = await promptInstall();
      if (!success) {
        // User dismissed native prompt - don't show again for 7 days
        dismissInstallPrompt();
      }
      return;
    }

    // iOS but NOT Safari - must open in Safari
    if (isIOSNonSafari) {
      toast.info('Za namestitev aplikacije odpri stran v brskalniku Safari.', {
        duration: 5000,
      });
      return;
    }

    // iOS Safari or Android without native prompt - show instructions
    setShowInstructions(true);
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
  };

  return (
    <>
      {/* Floating Install Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2"
      >
        <Button
          onClick={handleInstallClick}
          size="lg"
          className="rounded-full shadow-lg bg-dragon-green hover:bg-dragon-green/90 text-white h-14 px-6"
        >
          <Download className="h-5 w-5 mr-2" />
          <span className="font-semibold">Prenesi aplikacijo</span>
        </Button>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow"
          aria-label="Zapri"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Install Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Namesti TomiTalk</h3>
                        <p className="text-sm text-muted-foreground">
                          {isIOSDevice ? 'iOS navodila' : 'Android navodila'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInstructions(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {isIOSDevice ? (
                      <>
                        <InstructionStep step={1} title="Pritisni gumb za deljenje" icon={<Share className="h-4 w-4" />} subtitle="(spodaj na sredini)" />
                        <InstructionStep step={2} title='Izberi "Dodaj na začetni zaslon"' />
                        <InstructionStep step={3} title='Pritisni "Dodaj"' />
                      </>
                    ) : (
                      <>
                        <InstructionStep step={1} title="Odpri meni brskalnika" icon={<Menu className="h-4 w-4" />} subtitle="(zgoraj desno, tri pike)" />
                        <InstructionStep step={2} title='Izberi "Namesti aplikacijo" ali "Dodaj na začetni zaslon"' />
                        <InstructionStep step={3} title="Potrdi namestitev" />
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowInstructions(false)}
                    className="w-full mt-6"
                  >
                    Razumem
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function InstructionStep({ step, title, icon, subtitle }: { step: number; title: string; icon?: React.ReactNode; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm font-medium">{step}</span>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">{title}</p>
        {(icon || subtitle) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            {subtitle && <span className="text-xs">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
