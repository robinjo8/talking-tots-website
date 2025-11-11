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
    }, 6000); // Extended to 6 seconds

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6500); // Extra time for fade out animation

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
                  scale: [0, 1.2, 1],
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

          {/* Sparkle Effects around Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.2, duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-[35%] left-[15%] text-yellow-400 text-3xl"
          >
            ✨
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-[35%] right-[15%] text-yellow-400 text-3xl"
          >
            ✨
          </motion.div>

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
                delay: 1.5,
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-dragon-green/20 rounded-full blur-3xl -z-10"
            />
          </motion.div>

          {/* Confetti around dragon */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos(i * 45 * Math.PI / 180) * 150,
                y: Math.sin(i * 45 * Math.PI / 180) * 150,
              }}
              transition={{
                delay: 2 + i * 0.1,
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute"
              style={{
                left: "50%",
                top: "60%",
              }}
            >
              <span className="text-2xl">
                {["🎉", "🎊", "⭐", "✨", "🌟", "💫", "🎈", "🎨"][i]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
