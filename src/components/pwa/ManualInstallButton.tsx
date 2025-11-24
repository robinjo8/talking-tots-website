import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share, X, Menu } from 'lucide-react';
import { usePWA, useIOSInstallInstructions } from '@/hooks/usePWA';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function ManualInstallButton() {
  const { promptInstall, isInstalled, isIOSDevice, isAndroidDevice, isInstallable } = usePWA();
  const { isInSafari, canShowInstructions } = useIOSInstallInstructions();
  const [showInstructions, setShowInstructions] = useState(false);

  // Don't show if already installed or not on homepage
  const isHomepage = window.location.pathname === '/';
  if (isInstalled || !isHomepage) return null;

  const handleInstallClick = async () => {
    if (isIOSDevice) {
      setShowInstructions(true);
    } else if (isInstallable) {
      await promptInstall();
    } else {
      // Show Android instructions dialog if on Android, otherwise generic message
      setShowInstructions(true);
    }
  };

  return (
    <>
      {/* Floating Install Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 right-4 z-40"
      >
        <Button
          onClick={handleInstallClick}
          size="lg"
          className="rounded-full shadow-lg bg-dragon-green hover:bg-dragon-green/90 text-white h-14 px-6"
        >
          <Download className="h-5 w-5 mr-2" />
          <span className="font-semibold">Prenesi aplikacijo</span>
        </Button>
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
                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Pritisni gumb za deljenje</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Share className="h-4 w-4" />
                              <span className="text-xs">(spodaj na sredini)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Izberi "Dodaj na začetni zaslon"</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Pritisni "Dodaj"</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Odpri meni brskalnika</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Menu className="h-4 w-4" />
                              <span className="text-xs">(zgoraj desno, tri pike)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Izberi "Dodaj na začetni zaslon" ali "Namesti aplikacijo"</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-medium">3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Potrdi namestitev</p>
                          </div>
                        </div>
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
