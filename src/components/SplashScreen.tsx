import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500); // Extra time for fade out animation

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          {/* TomiTalk Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center mb-8"
          >
            <span className="text-5xl md:text-6xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-5xl md:text-6xl font-extrabold text-app-orange uppercase">Talk</span>
          </motion.div>

          {/* Dragon Image */}
          <motion.img
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
            alt="TomiTalk zmajček"
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/app-icon-any.png";
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
