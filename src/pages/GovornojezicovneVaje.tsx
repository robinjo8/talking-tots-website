import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Speech, 
  Clock, 
  BookText, 
  Blocks, 
  Gauge, 
  RotateCcw, 
  MessageSquare, 
  Ear,
  Target
} from "lucide-react";
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";

const GovornojezicovneVaje = () => {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Map of difficulty IDs to their corresponding Lucide icons
  const difficultyIcons = {
    articulation: <Speech className="h-6 w-6 text-app-blue" />,
    stuttering: <Clock className="h-6 w-6 text-app-purple" />,
    vocabulary: <BookText className="h-6 w-6 text-app-orange" />,
    structure: <Blocks className="h-6 w-6 text-app-teal" />,
    grammar: <Gauge className="h-6 w-6 text-app-purple" />,
    endings: <RotateCcw className="h-6 w-6 text-app-yellow" />,
    word_usage: <MessageSquare className="h-6 w-6 text-app-orange" />,
    phonological: <Ear className="h-6 w-6 text-dragon-green" />,
    tongue_exercises: <Target className="h-6 w-6 text-app-teal" />
  };

  const handleDifficultySelect = (difficultyId: string) => {
    // For now, only articulation has exercises implemented
    if (difficultyId === 'articulation') {
      navigate('/artikulacija');
    } else if (difficultyId === 'tongue_exercises') {
      navigate('/govorno-jezikovne-vaje/vaje-za-jezik');
    } else {
      // For other difficulties, we could show a "coming soon" message
      alert('Vaje za to težavo bodo na voljo kmalu!');
    }
  };

  // Add the new tongue exercises section
  const tongueExercisesSection = {
    id: 'tongue_exercises',
    title: 'Vaje za jezik',
    description: 'Gibalne vaje za jezik, ki pomagajo pri izboljšanju artikulacije in motorike govornih organov.',
    example: 'Primeri: gibanje jezika gor-dol, stiskanje in raztegovanje'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/moja-stran")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold">
            Govorno-jezikovne vaje
            {selectedChild && (
              <span className="text-dragon-green ml-2">za {selectedChild.name}</span>
            )}
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Izberi težavo, s katero se spopada tvoj otrok, in začni z vajami.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Add the new tongue exercises section first */}
          <Card 
            className="transition-all duration-300 hover:shadow-md cursor-pointer"
            onClick={() => handleDifficultySelect('tongue_exercises')}
          >
            <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10">
              <CardTitle className="text-xl flex items-start gap-3">
                <span className="flex items-center justify-center" aria-label={tongueExercisesSection.title}>
                  {difficultyIcons.tongue_exercises}
                </span>
                <div>
                  {tongueExercisesSection.title}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                {tongueExercisesSection.description}
              </p>
              <div className="bg-muted/50 p-3 rounded-md text-sm mt-2">
                <p className="font-medium text-muted-foreground mb-1">Primer:</p>
                <p>{tongueExercisesSection.example}</p>
              </div>
            </CardContent>
          </Card>

          {/* Existing difficulties */}
          {SPEECH_DIFFICULTIES.map((difficulty) => (
            <Card 
              key={difficulty.id} 
              className="transition-all duration-300 hover:shadow-md cursor-pointer"
              onClick={() => handleDifficultySelect(difficulty.id)}
            >
              <CardHeader className={`
                ${difficulty.id === 'articulation' && 'bg-gradient-to-r from-app-blue/10 to-app-teal/10'}
                ${difficulty.id === 'stuttering' && 'bg-gradient-to-r from-app-purple/10 to-app-blue/10'}
                ${difficulty.id === 'vocabulary' && 'bg-gradient-to-r from-app-orange/10 to-app-yellow/10'}
                ${difficulty.id === 'structure' && 'bg-gradient-to-r from-app-teal/10 to-dragon-green/10'}
                ${difficulty.id === 'grammar' && 'bg-gradient-to-r from-app-purple/10 to-app-blue/10'}
                ${difficulty.id === 'endings' && 'bg-gradient-to-r from-app-yellow/10 to-dragon-green/10'}
                ${difficulty.id === 'word_usage' && 'bg-gradient-to-r from-app-orange/10 to-app-purple/10'}
                ${difficulty.id === 'phonological' && 'bg-gradient-to-r from-dragon-green/10 to-app-teal/10'}
              `}>
                <CardTitle className="text-xl flex items-start gap-3">
                  <span className="flex items-center justify-center" aria-label={difficulty.title}>
                    {difficultyIcons[difficulty.id as keyof typeof difficultyIcons]}
                  </span>
                  <div>
                    {difficulty.title.split('–')[0].trim()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  {difficulty.description}
                </p>
                {difficulty.example && (
                  <div className="bg-muted/50 p-3 rounded-md text-sm mt-2">
                    <p className="font-medium text-muted-foreground mb-1">Primer:</p>
                    <p>{difficulty.example}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovornojezicovneVaje;
