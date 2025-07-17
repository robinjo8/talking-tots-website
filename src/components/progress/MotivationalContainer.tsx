import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MotivationalContainerProps {
  childName: string;
}

export function MotivationalContainer({ childName }: MotivationalContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
            <MessageSquare className="h-5 w-5 text-dragon-green" />
            Hej, {childName}!
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <img 
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png" 
              alt="Zmajček Tomi" 
              className="w-full h-full object-contain animate-bounce-gentle"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-medium italic leading-relaxed">
              Tukaj lahko spremljaš svoj napredek. Za vsako opravljeno igro ali vajo dobiš 
              <span className="font-bold"> zvezdo</span>. Ko zbereš 10 zvezd, dobiš 
              <span className="font-bold"> zmajčka</span>. Ko zbereš 10 zmajčkov, pa si zasluži 
              <span className="font-bold"> pokal</span>! 
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Zmajček Tomi ti navija ves čas – zato vztrajno, korak za korakom, proti cilju!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}