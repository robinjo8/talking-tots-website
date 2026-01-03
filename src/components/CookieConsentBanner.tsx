import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Icon and text */}
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-app-orange/10 rounded-full shrink-0">
                  <Cookie className="h-5 w-5 text-app-orange" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">
                    Ta spletna stran uporablja piškotke
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    Uporabljamo piškotke za izboljšanje vaše izkušnje, analizo prometa in prikazovanje prilagojenih vsebin. 
                    Več o tem si preberite v naši{' '}
                    <a 
                      href="/politika-zasebnosti" 
                      className="text-dragon-green hover:underline font-medium"
                    >
                      politiki zasebnosti
                    </a>.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-2 w-full md:w-auto shrink-0">
                <Button
                  variant="outline"
                  onClick={rejectAll}
                  className="flex-1 md:flex-none text-sm"
                >
                  Zavrni
                </Button>
                <Button
                  onClick={acceptAll}
                  className="flex-1 md:flex-none bg-dragon-green hover:bg-dragon-green/90 text-white text-sm"
                >
                  Sprejmi vse
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
