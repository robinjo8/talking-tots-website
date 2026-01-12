
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DevelopmentQuestionItem } from "./DevelopmentQuestionItem";
import { TextQuestionItem } from "./TextQuestionItem";
import { 
  SPEECH_DEVELOPMENT_QUESTIONS, 
  SPEECH_DEVELOPMENT_TEXT_QUESTIONS 
} from "@/models/SpeechDevelopment";

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

  // Validation: all radio questions + required text questions must be answered
  const isFormValid = useMemo(() => {
    // Check all radio questions are answered
    const allRadioAnswered = SPEECH_DEVELOPMENT_QUESTIONS.every(
      (q) => answers[q.id] && answers[q.id].trim() !== ""
    );

    // Check all required text questions are answered
    const allRequiredTextAnswered = SPEECH_DEVELOPMENT_TEXT_QUESTIONS
      .filter((q) => q.required)
      .every((q) => answers[q.id] && answers[q.id].trim() !== "");

    return allRadioAnswered && allRequiredTextAnswered;
  }, [answers]);

  const handleSubmit = () => {
    onSubmit(answers);
  };

  // Get text questions by id for proper ordering
  const pronunciationQuestion = SPEECH_DEVELOPMENT_TEXT_QUESTIONS.find(q => q.id === "pronunciation_difficulties");
  const additionalObservationsQuestion = SPEECH_DEVELOPMENT_TEXT_QUESTIONS.find(q => q.id === "additional_observations");

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
        {/* Question 1: Speech clarity */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[0].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[0].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[0].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[0].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[0].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 2: Vocabulary size */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[1].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[1].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[1].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[1].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[1].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 3: Pronunciation difficulties (TEXT - required) */}
        {pronunciationQuestion && (
          <TextQuestionItem
            key={pronunciationQuestion.id}
            id={pronunciationQuestion.id}
            question={pronunciationQuestion.question}
            placeholder={pronunciationQuestion.placeholder}
            required={pronunciationQuestion.required}
            value={answers[pronunciationQuestion.id] || ""}
            onValueChange={handleAnswer}
          />
        )}

        {/* Question 4: Sentence formation */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[2].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[2].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[2].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[2].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[2].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 5: Word pronunciation */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[3].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[3].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[3].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[3].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[3].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 6: Ear infections */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[4].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[4].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[4].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[4].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[4].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 7: Chewing/blowing */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[5].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[5].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[5].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[5].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[5].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 8: Sees speech therapist */}
        <DevelopmentQuestionItem
          key={SPEECH_DEVELOPMENT_QUESTIONS[6].id}
          id={SPEECH_DEVELOPMENT_QUESTIONS[6].id}
          question={SPEECH_DEVELOPMENT_QUESTIONS[6].question}
          options={SPEECH_DEVELOPMENT_QUESTIONS[6].options}
          selectedValue={answers[SPEECH_DEVELOPMENT_QUESTIONS[6].id] || ""}
          onValueChange={handleAnswer}
        />

        {/* Question 9: Additional observations (TEXT - optional) */}
        {additionalObservationsQuestion && (
          <TextQuestionItem
            key={additionalObservationsQuestion.id}
            id={additionalObservationsQuestion.id}
            question={additionalObservationsQuestion.question}
            placeholder={additionalObservationsQuestion.placeholder}
            required={additionalObservationsQuestion.required}
            value={answers[additionalObservationsQuestion.id] || ""}
            onValueChange={handleAnswer}
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
        >
          Nazaj
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="bg-dragon-green hover:bg-dragon-green/90 disabled:opacity-50"
        >
          Naprej
        </Button>
      </div>

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
