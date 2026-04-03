import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LipsIcon } from '@/components/icons/LipsIcon';

const SUPABASE_SLIKE_URL = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo';

interface LipsImageButtonProps {
  lipsImage: string; // filename in 'slike' bucket
}

export function LipsImageButton({ lipsImage }: LipsImageButtonProps) {
  const [showLipsImage, setShowLipsImage] = useState(false);

  // Auto-close after 3 seconds
  useEffect(() => {
    if (showLipsImage) {
      const timer = setTimeout(() => setShowLipsImage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLipsImage]);

  return (
    <>
      <button
        onClick={() => setShowLipsImage(true)}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
      >
        <LipsIcon size={32} color="white" />
      </button>

      <Dialog open={showLipsImage} onOpenChange={setShowLipsImage}>
        <DialogContent className="sm:max-w-md p-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src={`${SUPABASE_SLIKE_URL}/${lipsImage}`}
              alt="Položaj ust"
              className="w-full rounded-lg"
            />
            <Button variant="outline" onClick={() => setShowLipsImage(false)} className="w-full">
              ZAPRI
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
