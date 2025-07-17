import { motion } from "framer-motion";

interface MotivationalContainerProps {
  childName: string;
}

export function MotivationalContainer({ childName }: MotivationalContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-6 bg-gradient-to-br from-dragon-green/90 to-dragon-green/80 rounded-2xl border-2 border-dragon-green shadow-xl text-white"
    >
      <div className="flex items-center gap-4">
        <img
          src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
          alt="Dragon Tomi"
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Živjo, {childName}!
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            Tukaj lahko spremljaš svoj napredek. Za vsako opravljeno igro ali vajo dobiš 
            <span className="font-bold"> zvezdo</span>. Ko zbereš 10 zvezd, dobiš 
            <span className="font-bold"> zmajčka</span>. Ko zbereš 10 zmajčkov, pa si zasluži 
            <span className="font-bold"> pokal</span>! Zmajček Tomi ti navija ves čas – zato 
            vztrajno, korak za korakom, proti cilju!
          </p>
        </div>
      </div>
    </motion.div>
  );
}