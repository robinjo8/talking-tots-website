
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeechHeader } from "./SpeechHeader";
import { DevelopmentQuestionItem } from "./DevelopmentQuestionItem";
import { SPEECH_DEVELOPMENT_QUESTIONS } from "@/models/SpeechDevelopment";

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
      <SpeechHeader 
        onBack={onBack} 
        childName={childName}
        title="Govorni razvoj za"
      />

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
        Zaključi registracijo
      </Button>
    </div>
  );
}
