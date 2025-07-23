import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { InfoButton } from "./InfoButton";
interface TrophyDisplayProps {
  trophies: number;
  totalDragons: number;
  dragonsToNextTrophy: number;
}
export function TrophyDisplay({
  trophies,
  totalDragons,
  dragonsToNextTrophy
}: TrophyDisplayProps) {
  return <Card className="bg-gradient-to-br from-app-yellow/20 via-app-orange/10 to-app-yellow/20 border-app-yellow/40 shadow-lg relative">
      <InfoButton title="O pokalih" content="Pokal je največja nagrada in dokaz, da si res trdno in redno vadil. Pridobiš ga, ko zbereš 10 zmajčkov – to pomeni kar 100 zvezdic! Pokal pokaže, da si izjemno vztrajen, pogumen in pripravljen premagati vsako govorno nalogo." />
      <CardContent className="p-6 py-[24px]">
        <motion.div initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.6
      }} className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h3 className="text-2xl font-bold text-dragon-green text-amber-500">POKALI</h3>
          </div>
          
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center mb-4 max-w-lg mx-auto">
            {trophies > 0 ? Array.from({
            length: trophies
          }, (_, index) => <motion.div key={index} initial={{
            scale: 0,
            rotate: -180
          }} animate={{
            scale: 1,
            rotate: 0
          }} transition={{
            delay: index % 10 * 0.1,
            duration: 0.5
          }} className="inline-block">
                  <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal.png" alt="Trophy" className="w-8 h-8 md:w-10 md:h-10 object-contain" onError={e => {
              console.error("Trophy image failed to load:", e.currentTarget.src);
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/%3E%3Cpath d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18'/%3E%3Cpath d='M4 22h16'/%3E%3Cpath d='M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22'/%3E%3Cpath d='M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22'/%3E%3Cpath d='M18 2H6v7a6 6 0 0 0 12 0V2Z'/%3E%3C/svg%3E";
            }} />
                </motion.div>) : <div className="col-span-5 md:col-span-10 flex justify-center"><img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal_cb.png" alt="Empty trophy" className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-50" /></div>}
          </div>
          
          <div className="text-3xl font-bold text-amber-500 mb-2 bg-transparent py-0 my-0 mx-0 px-0">{trophies}</div>
          
          {totalDragons > 0 && <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-base text-stone-950">Do naslednjega pokala</span>
                <span className="font-bold text-dragon-green text-amber-500">
                  {dragonsToNextTrophy} zmajčkov
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-app-yellow to-app-orange h-2 rounded-full transition-all duration-500" style={{
              width: `${totalDragons % 10 / 10 * 100}%`
            }} />
              </div>
            </div>}
        </motion.div>
      </CardContent>
    </Card>;
}