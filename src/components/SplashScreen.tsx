import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      onComplete();
      return;
    }
    
    sessionStorage.setItem('splashShown', 'true');
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800); // Reduced from 1000ms

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1100); // Reduced from 1500ms

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const letters = "TOMITALK".split("");
  
  // Generate random decorative elements
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Floating Stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                y: [0, star.y],
                x: [0, star.x],
              }}
              transition={{
                type: "tween",
                delay: star.delay,
                duration: star.duration,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute text-2xl"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            >
              ⭐
            </motion.div>
          ))}

          {/* TomiTalk Logo with Letter Animation */}
          <div className="flex items-center mb-8 relative z-10">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: -50, opacity: 0, scale: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.6,
                }}
                className={`text-5xl md:text-6xl font-extrabold uppercase ${
                  index < 4 ? "text-dragon-green" : "text-app-orange"
                }`}
              >
                {letter}
              </motion.span>
            ))}
          </div>


          {/* Dragon Image with Multiple Animations */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
            }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8, 
              type: "spring",
              bounce: 0.4,
            }}
            className="relative"
          >
            <motion.img
              animate={{
                y: [0, -15, 0],
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{
                y: {
                  delay: 1.5,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  delay: 2,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                },
              }}
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
              alt="TomiTalk zmajček"
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/app-icon-any.png";
              }}
            />
            
            {/* Glow effect around dragon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                type: "tween",
                delay: 1.5,
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-dragon-green/20 rounded-full blur-3xl -z-10"
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
