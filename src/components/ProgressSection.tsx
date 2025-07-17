import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Trophy, Gamepad2, BookOpen, TrendingUp } from "lucide-react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { CategoryProgressCard } from "./progress/CategoryProgressCard";
import { TrophyDisplay } from "./progress/TrophyDisplay";
import { motion } from "framer-motion";

export function ProgressSection() {
  const { progressData, isLoading, selectedChild } = useEnhancedProgress();
  
  // Supabase storage URLs for assets
  const starImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/zvezdica.png";
  const trophyImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/pokal.png";
  const dragonImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/zmaj.png";

  if (isLoading) {
    return (
      <Card className="mb-8 animate-pulse">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Nalagam napredek...</div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedChild) {
    return (
      <Card className="mb-8 border-2 border-dashed border-muted">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Izberi otroka za ogled napredka</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Začni z vajami za ogled napredka!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress metrics
  const gamesProgressToNextDragon = progressData.games.stars > 0 ? (progressData.games.stars / 10) * 100 : 0;
  const exercisesProgressToNextDragon = progressData.exercises.stars > 0 ? (progressData.exercises.stars / 10) * 100 : 0;
  const dragonsToNextTrophy = 10 - (progressData.totalDragons % 10);

  const getAchievementMessage = () => {
    const totalTrophies = progressData.totalTrophies;
    const totalDragons = progressData.totalDragons;
    
    if (totalTrophies >= 5) return "Neverjeten! Ti si pravi logoped! 🏆✨";
    if (totalTrophies >= 3) return "Izjemno! Zmanjšavaš število pokalov! 🏆";
    if (totalTrophies >= 1) return "Fantastično! Prvi pokal je tvoj! 🏆";
    if (totalDragons >= 5) return "Odlično! Zbiraš zmajčke kot pravi profesionalec! 🐉";
    if (totalDragons >= 3) return "Super! Zmajčki se kopičijo! 🐉";
    if (totalDragons >= 1) return "Bravo! Prvi zmajček je tvoj! 🐉";
    if (progressData.games.stars + progressData.exercises.stars >= 5) return "Lepo! Zvezde se svetlijo! ⭐";
    return "Začni z vajami in zberi prve zvezde! ⭐";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 space-y-6"
    >
      {/* Header */}
      <Card className="bg-gradient-to-br from-dragon-green/5 via-white to-app-blue/5 border-2 border-dragon-green/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-dragon-green">
            <Trophy className="h-7 w-7" />
            Napredek - {selectedChild.name}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Trophy Display */}
      <TrophyDisplay 
        trophies={progressData.totalTrophies}
        totalDragons={progressData.totalDragons}
        dragonsToNextTrophy={dragonsToNextTrophy}
      />

      {/* Category Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryProgressCard
          title="Igre"
          icon={Gamepad2}
          iconColor="text-app-orange"
          bgColor="bg-gradient-to-br from-app-orange/10 to-app-orange/5 border-app-orange/30"
          stars={progressData.games.stars}
          dragons={progressData.games.dragons}
          totalCompletions={progressData.games.totalCompletions}
          progressToNextDragon={gamesProgressToNextDragon}
          dragonImageUrl={dragonImageUrl}
        />

        <CategoryProgressCard
          title="Vaje"
          icon={BookOpen}
          iconColor="text-app-blue"
          bgColor="bg-gradient-to-br from-app-blue/10 to-app-blue/5 border-app-blue/30"
          stars={progressData.exercises.stars}
          dragons={progressData.exercises.dragons}
          totalCompletions={progressData.exercises.totalCompletions}
          progressToNextDragon={exercisesProgressToNextDragon}
          dragonImageUrl={dragonImageUrl}
        />
      </div>

      {/* Achievement Message */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-center p-6 bg-gradient-to-r from-dragon-green/15 via-app-blue/10 to-dragon-green/15 rounded-2xl border-2 border-dragon-green/25 shadow-lg"
      >
        <p className="text-dragon-green font-semibold text-xl">{getAchievementMessage()}</p>
      </motion.div>
    </motion.div>
  );
}