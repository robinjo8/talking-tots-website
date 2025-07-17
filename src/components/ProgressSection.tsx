import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Gamepad2, BookOpen, Puzzle, TrendingUp } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

export function ProgressSection() {
  const { progressSummary, isLoading, selectedChild } = useUserProgress();

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

  if (!progressSummary) {
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

  // Calculate total activities completed
  const totalExercises = progressSummary.exercises.reduce((sum, exercise) => sum + exercise.completion_count, 0);
  const totalMemoryGames = progressSummary.memoryGames.reduce((sum, game) => sum + game.completion_count, 0);
  const totalPuzzles = progressSummary.puzzles.reduce((sum, puzzle) => sum + puzzle.completion_count, 0);
  const totalActivities = totalExercises + totalMemoryGames + totalPuzzles;

  // Calculate progress towards next dragon (every 10 stars = 1 dragon)
  const starsToNextDragon = 10 - (progressSummary.totalStars % 10);
  const progressToNextDragon = ((progressSummary.totalStars % 10) / 10) * 100;

  const getAchievementMessage = () => {
    const totalStars = progressSummary.totalStars;
    if (totalStars >= 100) return "Izjemno! Ti si pravi logoped! 🏆";
    if (totalStars >= 50) return "Fantastična! Res si se potrudil/a! 🌟";
    if (totalStars >= 30) return "Odlično napredovanje! Nadaljuj tako! 💪";
    if (totalStars >= 15) return "Super začetek! Vsakodnevno vadi! 🎯";
    if (totalStars >= 5) return "Lepo! Prvi koraki so narejeni! 🚀";
    return "Začni z vajami in zberi prve zvezde! ⭐";
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-dragon-green/5 via-white to-app-blue/5 border-2 border-dragon-green/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-dragon-green">
          <Trophy className="h-7 w-7" />
          Napredek - {selectedChild.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-app-yellow/20 to-app-yellow/10 rounded-xl border border-app-yellow/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-6 w-6 text-app-yellow fill-current drop-shadow-sm" />
              <span className="text-3xl font-bold text-dragon-green">{progressSummary.totalStars}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Zvezd</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-dragon-green/20 to-dragon-green/10 rounded-xl border border-dragon-green/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl drop-shadow-sm">🐉</span>
              <span className="text-3xl font-bold text-dragon-green">{progressSummary.totalDragons}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Zmajčkov</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-app-blue/20 to-app-blue/10 rounded-xl border border-app-blue/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-app-blue" />
              <span className="text-3xl font-bold text-dragon-green">{totalActivities}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Aktivnosti</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-app-purple/20 to-app-purple/10 rounded-xl border border-app-purple/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl font-bold text-dragon-green">{starsToNextDragon}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">do naslednjega zmajčka</p>
          </div>
        </div>

        {/* Progress to Next Dragon */}
        {progressSummary.totalStars > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Napredek do naslednjega zmajčka</span>
              <span className="text-sm font-bold text-dragon-green">{progressSummary.totalStars % 10}/10 ⭐</span>
            </div>
            <Progress value={progressToNextDragon} className="h-3" />
          </div>
        )}

        {/* Achievement Message */}
        <div className="text-center p-4 bg-gradient-to-r from-dragon-green/15 via-app-blue/10 to-dragon-green/15 rounded-xl border-2 border-dragon-green/25">
          <p className="text-dragon-green font-semibold text-lg">{getAchievementMessage()}</p>
        </div>

        {/* Activity Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dragon-green mb-3">Pregled po aktivnostih</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-app-blue/5 rounded-lg border border-app-blue/20">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-app-blue" />
                <span className="font-medium">Vaje Motorike Govoril</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-app-blue/15 text-app-blue font-semibold">
                  {totalExercises} {totalExercises === 1 ? 'opravljeno' : 'opravljenih'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {progressSummary.exercises.reduce((sum, ex) => sum + ex.total_stars, 0)} ⭐
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-app-orange/5 rounded-lg border border-app-orange/20">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-5 w-5 text-app-orange" />
                <span className="font-medium">Spomin Igre</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-app-orange/15 text-app-orange font-semibold">
                  {totalMemoryGames} {totalMemoryGames === 1 ? 'opravljeno' : 'opravljenih'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {progressSummary.memoryGames.reduce((sum, game) => sum + game.total_stars, 0)} ⭐
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-app-purple/5 rounded-lg border border-app-purple/20">
              <div className="flex items-center gap-3">
                <Puzzle className="h-5 w-5 text-app-purple" />
                <span className="font-medium">Sestavljanke</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-app-purple/15 text-app-purple font-semibold">
                  {totalPuzzles} {totalPuzzles === 1 ? 'opravljeno' : 'opravljenih'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {progressSummary.puzzles.reduce((sum, puzzle) => sum + puzzle.total_stars, 0)} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}