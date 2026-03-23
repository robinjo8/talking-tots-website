import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

interface SetUnboxAnimationProps {
  setNumber: number;
  onComplete: () => void;
  isProcessing: boolean;
}

const confettiColors = [
  "hsl(var(--primary))",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#A78BFA",
  "#FB923C",
];

function ConfettiParticle({ index }: { index: number }) {
  const angle = (index / 20) * 360;
  const distance = 80 + Math.random() * 120;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const color = confettiColors[index % confettiColors.length];
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 720;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
      animate={{
        x,
        y: y + 40,
        scale: [0, 1.2, 0.8],
        opacity: [1, 1, 0],
        rotate: rotation,
      }}
      transition={{ duration: 1.2, ease: "easeOut", delay: Math.random() * 0.2 }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: "50%",
        left: "50%",
      }}
    />
  );
}

export const SetUnboxAnimation: React.FC<SetUnboxAnimationProps> = ({
  setNumber,
  onComplete,
  isProcessing,
}) => {
  const [phase, setPhase] = useState<"idle" | "opening" | "confetti">("idle");

  const handleClick = async () => {
    if (phase !== "idle" || isProcessing) return;
    setPhase("opening");

    setTimeout(() => {
      setPhase("confetti");
    }, 600);

    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <p className="text-muted-foreground text-sm mb-6">
        Sklop {setNumber} je pripravljen! Odpri ga in začni z vajami.
      </p>

      <div className="relative">
        {/* Confetti */}
        <AnimatePresence>
          {phase === "confetti" && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Gift box */}
        <motion.button
          onClick={handleClick}
          disabled={isProcessing || phase !== "idle"}
          className="relative flex flex-col items-center justify-center w-40 h-40 rounded-3xl bg-gradient-to-br from-primary/80 via-primary to-primary/90 text-primary-foreground shadow-xl cursor-pointer disabled:cursor-wait focus:outline-none focus:ring-4 focus:ring-primary/30"
          whileHover={phase === "idle" ? { scale: 1.08, rotate: [0, -3, 3, 0] } : {}}
          whileTap={phase === "idle" ? { scale: 0.95 } : {}}
          animate={
            phase === "opening"
              ? {
                  scale: [1, 1.2, 0.9, 1.15],
                  rotate: [0, -8, 8, -4, 0],
                }
              : phase === "confetti"
              ? { scale: [1.15, 1.3, 0], opacity: [1, 1, 0] }
              : {}
          }
          transition={
            phase === "opening"
              ? { duration: 0.6, ease: "easeInOut" }
              : phase === "confetti"
              ? { duration: 0.5, ease: "easeIn" }
              : {}
          }
        >
          {/* Sparkle decorations */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2"
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-yellow-200" />
          </motion.div>

          {/* Ribbon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full bg-yellow-400/40 rounded-full" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-6 w-full bg-yellow-400/40 rounded-full" />

          <Gift className="h-14 w-14 mb-2 drop-shadow-md" />
          <span className="text-lg font-bold drop-shadow-sm">Sklop {setNumber}</span>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground mt-6"
      >
        Ko začneš, imaš 24 ur časa da ga dokončaš
      </motion.p>
    </motion.div>
  );
};
