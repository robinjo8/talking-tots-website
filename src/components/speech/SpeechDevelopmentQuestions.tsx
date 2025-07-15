
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeechHeader } from "./SpeechHeader";
import { DevelopmentQuestionItem } from "./DevelopmentQuestionItem";
import { SPEECH_DEVELOPMENT_QUESTIONS } from "@/models/SpeechDevelopment";
import { ArrowLeft } from "lucide-react";

interface SpeechDevelopmentQuestionsProps {
  onBack: () => void;
  onSubmit: (answers: Record<string, string>) => void;
  childName: string;
  initialAnswers?: Record<string, string>;
}

export function SpeechDevelopmentQuestions({
  onBack,
  onSubmit,
  childName,
  initialAnswers = {}
}: SpeechDevelopmentQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">
          Osnovni vprašalnik
        </h2>
        <p className="text-center text-muted-foreground">
          Vaši odgovori nam bodo pomagali bolje razumeti otroka in prilagoditi vaje njegovim potrebam.
        </p>
      </div>

      <div className="space-y-6">
        {SPEECH_DEVELOPMENT_QUESTIONS.map((question) => (
          <DevelopmentQuestionItem
            key={question.id}
            id={question.id}
            question={question.question}
            options={question.options}
            selectedValue={answers[question.id] || ""}
            onValueChange={handleAnswer}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
      >
        Naprej
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="w-full flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => onSubmit({})}
        className="w-full text-muted-foreground"
      >
        Ne želim odgovoriti
      </Button>
    </div>
  );
}
