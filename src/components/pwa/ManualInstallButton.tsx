import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share, X, Menu, Plus, Copy, ExternalLink, Check, Loader2 } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Browser detection for tailored install instructions
function detectBrowser(): { name: string; label: string; steps: { step1: string; step1Icon: string; step1Subtitle: string; step2: string; step2Subtitle: string } } {
  const ua = navigator.userAgent;
  
  if (/SamsungBrowser/i.test(ua)) return {
    name: 'samsung',
    label: 'Samsung Internet',
    steps: {
      step1: 'Pritisni meni',
      step1Icon: 'hamburger',
      step1Subtitle: 'Ikona ☰ spodaj desno',
      step2: 'Izberi "Dodaj stran na"',
      step2Subtitle: 'Nato izberi "Začetni zaslon"',
    },
  };
  if (/HuaweiBrowser/i.test(ua)) return {
    name: 'huawei',
    label: 'Huawei Browser',
    steps: {
      step1: 'Pritisni tri pike',
      step1Icon: 'dots',
      step1Subtitle: 'Ikona ⋮ spodaj na sredini',
      step2: 'Izberi "Dodaj na začetni zaslon"',
      step2Subtitle: '',
    },
  };
  if (/OPR|Opera/i.test(ua)) return {
    name: 'opera',
    label: 'Opera',
    steps: {
      step1: 'Pritisni tri pike',
      step1Icon: 'dots',
      step1Subtitle: 'Ikona ⋮ spodaj desno',
      step2: 'Izberi "Začetni zaslon"',
      step2Subtitle: 'Ali "Dodaj na začetni zaslon"',
    },
  };
  if (/Edg|Edge/i.test(ua)) return {
    name: 'edge',
    label: 'Microsoft Edge',
    steps: {
      step1: 'Pritisni tri pike',
      step1Icon: 'dots-horizontal',
      step1Subtitle: 'Ikona ··· spodaj na sredini',
      step2: 'Izberi "Dodaj na telefon"',
      step2Subtitle: 'Ali "Dodaj na začetni zaslon"',
    },
  };
  if (/FxiOS|Firefox/i.test(ua)) return {
    name: 'firefox',
    label: 'Firefox',
    steps: {
      step1: 'Pritisni tri pike',
      step1Icon: 'dots',
      step1Subtitle: 'Ikona ⋮ spodaj desno',
      step2: 'Izberi "Namesti"',
      step2Subtitle: 'Ali "Dodaj na začetni zaslon"',
    },
  };
  if (/Chrome/i.test(ua) && !/Edg|OPR|SamsungBrowser|HuaweiBrowser|UCBrowser/i.test(ua)) return {
    name: 'chrome',
    label: 'Chrome',
    steps: {
      step1: 'Pritisni tri pike',
      step1Icon: 'dots',
      step1Subtitle: 'Ikona ⋮ zgoraj desno',
      step2: 'Izberi "Namesti aplikacijo"',
      step2Subtitle: 'Ali "Dodaj na začetni zaslon"',
    },
  };
  // Fallback
  return {
    name: 'other',
    label: 'brskalnik',
    steps: {
      step1: 'Odpri meni brskalnika',
      step1Icon: 'menu',
      step1Subtitle: 'Poišči ikono menija (⋮ ali ☰ ali ···)',
      step2: 'Izberi "Dodaj na začetni zaslon"',
      step2Subtitle: 'Ali "Namesti aplikacijo"',
    },
  };
}

export function ManualInstallButton() {
  const {
    promptInstall, isInstalled, isStandalone, isIOSDevice, isAndroidDevice,
    isInstallable, isIOSSafari, isIOSNonSafari, canInstall, dismissInstallPrompt,
    isInstalling
  } = usePWA();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSafariModal, setShowSafariModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isGamePage = window.location.pathname.includes('/govorne-igre/');
  const isModernIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isModernIPad;

  const browser = detectBrowser();

  if (isInstalled || isStandalone || isGamePage || !isMobile || !canInstall) return null;

  const handleInstallClick = async () => {
    // Android with native prompt
    if (isAndroidDevice && isInstallable) {
      const success = await promptInstall();
      if (success) {
        toast.success('TomiTalk se namešča...', {
          description: 'Ikona bo kmalu vidna na začetnem zaslonu.',
          duration: 5000,
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
        });
      } else {
        toast('Namestitev preklicana.', {
          description: 'Lahko namestiš kadarkoli.',
          duration: 3000,
        });
        dismissInstallPrompt();
      }
      return;
    }

    // Android without native prompt — show manual instructions
    if (isAndroidDevice && !isInstallable) {
      setShowInstructions(true);
      return;
    }

    // iOS but NOT Safari
    if (isIOSNonSafari) {
      setShowSafariModal(true);
      return;
    }

    // iOS Safari or Android without native prompt
    setShowInstructions(true);
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setLinkCopied(true);
      toast.success('Povezava kopirana!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error('Kopiranje ni uspelo. Kopiraj ročno: ' + window.location.origin);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    if (isIOSDevice) {
      toast.info('Ko dokončaš korake, bo TomiTalk ikona vidna na tvojem začetnem zaslonu.', {
        duration: 5000,
      });
    }
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
          disabled={isInstalling}
          size="lg"
          className="rounded-full shadow-lg bg-dragon-green hover:bg-dragon-green/90 text-white h-14 px-6"
        >
          {isInstalling ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span className="font-semibold">Nameščanje...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              <span className="font-semibold">Prenesi aplikacijo</span>
            </>
          )}
        </Button>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow"
          aria-label="Zapri"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      {/* iOS Safari / Android Manual Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseInstructions}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md w-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Namesti TomiTalk</h3>
                        <p className="text-sm text-muted-foreground">
                          {isIOSDevice ? 'Navodila za iPhone / iPad' : `Navodila za ${browser.label}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseInstructions}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {isIOSDevice ? (
                      <>
                        <InstructionStep
                          step={1}
                          title="Pritisni gumb za deljenje"
                          icon={
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Share className="h-5 w-5 text-primary" />
                            </div>
                          }
                          subtitle="Gumb je na dnu zaslona (kvadrat s puščico navzgor)"
                        />
                        <InstructionStep
                          step={2}
                          title='Izberi "Dodaj na začetni zaslon"'
                          icon={
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                              <Plus className="h-5 w-5 text-accent-foreground" />
                            </div>
                          }
                          subtitle="Pomakni se navzdol v meniju, da najdeš to možnost"
                        />
                        <InstructionStep
                          step={3}
                          title='Pritisni "Dodaj"'
                          subtitle="Potrdi ime aplikacije in klikni Dodaj"
                        />
                      </>
                    ) : (
                      <>
                        <InstructionStep
                          step={1}
                          title={browser.steps.step1}
                          icon={
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <Menu className="h-5 w-5 text-foreground" />
                            </div>
                          }
                          subtitle={browser.steps.step1Subtitle}
                        />
                        <InstructionStep
                          step={2}
                          title={browser.steps.step2}
                          icon={
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                              <Download className="h-5 w-5 text-accent-foreground" />
                            </div>
                          }
                          subtitle={browser.steps.step2Subtitle}
                        />
                        <InstructionStep step={3} title="Potrdi namestitev" />
                      </>
                    )}
                   </div>

                  {!isIOSDevice && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Če te možnosti ne najdeš, poišči v meniju brskalnika možnost "Dodaj na začetni zaslon" ali "Namesti aplikacijo".
                    </p>
                  )}

                  {/* App icon preview */}
                  <div className="mt-5 p-3 bg-muted/50 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-lg">T</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">TomiTalk ikona se bo pojavila na tvojem začetnem zaslonu</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCloseInstructions}
                    className="w-full mt-5"
                  >
                    Razumem
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Non-Safari Modal */}
      <AnimatePresence>
        {showSafariModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSafariModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md w-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Odpri v Safari</h3>
                        <p className="text-sm text-muted-foreground">
                          Namestitev je mogoča samo v Safari
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSafariModal(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Za namestitev TomiTalk na začetni zaslon moraš odpreti to stran v brskalniku <strong>Safari</strong>. 
                    Kopiraj povezavo in jo prilepi v Safari.
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="w-full"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Povezava kopirana!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Kopiraj povezavo
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Odpri Safari → Prilepi povezavo → Sledi navodilom za namestitev
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowSafariModal(false)}
                    className="w-full mt-4"
                    variant="secondary"
                  >
                    Zapri
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
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step * 0.15 }}
      className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg"
    >
      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm font-bold">{step}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{title}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          {subtitle && <span className="text-xs">{subtitle}</span>}
        </div>
      </div>
    </motion.div>
  );
}
