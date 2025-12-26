import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface GameStartModalProps {
  isOpen: boolean;
  onStart: () => void;
  onShowInstructions: () => void;
}

export const GameStartModal: React.FC<GameStartModalProps> = ({
  isOpen,
  onStart,
  onShowInstructions,
}) => {
  const dragonImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_7.png";

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md border-4 border-orange-300 bg-gradient-to-b from-amber-50 to-orange-50 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6 py-4"
        >
          {/* Dragon Image */}
          <motion.img
            src={dragonImageUrl}
            alt="Zmajček"
            className="w-40 h-40 object-contain drop-shadow-lg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          />

          {/* Play Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStart}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 shadow-xl border-4 border-white/50"
              size="icon"
            >
              <Play className="w-16 h-16 text-white fill-white ml-2" />
            </Button>
          </motion.div>

          {/* Instructions Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onShowInstructions}
              variant="outline"
              className="w-14 h-14 rounded-full bg-white/80 hover:bg-white border-2 border-orange-300 shadow-md"
              size="icon"
            >
              <HelpCircle className="w-8 h-8 text-orange-500" />
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
