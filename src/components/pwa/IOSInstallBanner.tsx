import { useState, useEffect } from 'react';
import { X, Share, Plus } from 'lucide-react';

const DISMISS_KEY = 'ios-install-banner-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function IOSInstallBanner() {
  const [visible, setVisible] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(navigator.userAgent);
  const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (!isIOS || !isSafari || isStandalone) return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [isIOS, isSafari, isStandalone]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-4 relative">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Zapri"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-sm font-semibold text-foreground mb-2">
          Namesti TomiTalk za boljšo izkušnjo 🚀
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Brez naslovne vrstice, hitrejše nalaganje in deluje kot prava aplikacija.
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-secondary">
              <Share className="w-3.5 h-3.5" />
            </span>
            <span>Pritisni <strong>Share</strong></span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-secondary">
              <Plus className="w-3.5 h-3.5" />
            </span>
            <span><strong>Add to Home Screen</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
