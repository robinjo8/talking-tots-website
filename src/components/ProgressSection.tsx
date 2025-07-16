import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Gamepad2, Puzzle, Dumbbell } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Badge } from "@/components/ui/badge";

export function ProgressSection() {
  const { progressSummary, isLoading, selectedChild } = useUserProgress();

  if (isLoading) {
    return (
      <Card className="mb-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6 pb-4 text-center">
          <p className="text-gray-500">Nalagam napredek...</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedChild) {
    return null;
  }

  const totalExerciseCompletions = progressSummary?.exercises.reduce((sum, ex) => sum + ex.completion_count, 0) || 0;
  const totalMemoryGameCompletions = progressSummary?.memoryGames.reduce((sum, mg) => sum + mg.completion_count, 0) || 0;
  const totalPuzzleCompletions = progressSummary?.puzzles.reduce((sum, p) => sum + p.completion_count, 0) || 0;

  return (
    <Card className="mb-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10 rounded-t-2xl pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
            <Star className="h-6 w-6 text-app-orange" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <h3 className="text-lg font-semibold mb-4 text-app-orange text-center">Moj napredek</h3>
        
        {/* Overall Progress */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-app-yellow/20 to-app-orange/20 rounded-xl">
            <Star className="h-8 w-8 text-app-orange mx-auto mb-2" />
            <div className="text-2xl font-bold text-app-orange">{progressSummary?.totalStars || 0}</div>
            <div className="text-sm text-gray-600">Zbrane zvezdice</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-dragon-green/20 to-dragon-green/30 rounded-xl">
            <Trophy className="h-8 w-8 text-dragon-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-dragon-green">{progressSummary?.totalDragons || 0}</div>
            <div className="text-sm text-gray-600">Zmajčki</div>
          </div>
        </div>

        {/* Activity Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-app-blue/20 rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-app-blue" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Vaje motorike govoril</div>
                <div className="text-sm text-gray-500">Opravljenih ciklov</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-app-blue/10 text-app-blue border-app-blue/30">
              {totalExerciseCompletions}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-app-purple/20 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-app-purple" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Igre spomina</div>
                <div className="text-sm text-gray-500">Dokončanih iger</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-app-purple/10 text-app-purple border-app-purple/30">
              {totalMemoryGameCompletions}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-app-teal/20 rounded-lg flex items-center justify-center">
                <Puzzle className="h-5 w-5 text-app-teal" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Sestavljanke</div>
                <div className="text-sm text-gray-500">Rešenih sestavljank</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-app-teal/10 text-app-teal border-app-teal/30">
              {totalPuzzleCompletions}
            </Badge>
          </div>
        </div>

        {/* Achievement Message */}
        {(progressSummary?.totalStars || 0) === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            Začni z aktivnostmi in zberi svoje prve zvezdice!
          </div>
        ) : (
          <div className="mt-4 text-center text-sm text-dragon-green">
            Odlično! Do naslednjega zmajčka ti manjka {10 - ((progressSummary?.totalStars || 0) % 10)} zvezdic.
          </div>
        )}
      </CardContent>
    </Card>
  );
}