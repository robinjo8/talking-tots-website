import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const VIDEO_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video/Intro_video.mp4";

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleVideoEnd = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        >
          <video
            autoPlay
            muted
            playsInline
            // @ts-ignore
            webkit-playsinline=""
            onEnded={handleVideoEnd}
            className="w-full h-full object-contain"
            src={VIDEO_URL}
          />

          <button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 px-4 py-2 bg-black/40 text-white rounded-full text-sm font-medium hover:bg-black/60 transition-colors z-10"
          >
            Preskoči
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
