
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeechHeader } from "./SpeechHeader";
import { DevelopmentQuestionItem } from "./DevelopmentQuestionItem";

interface SpeechDevelopmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

const SPEECH_DEVELOPMENT_QUESTIONS: SpeechDevelopmentQuestion[] = [
  {
    id: "vocabulary_size",
    question: "Moj otrok lahko reče:",
    options: [
      { value: "0", label: "0 besed" },
      { value: "1-10", label: "1–10 besed" },
      { value: "10+", label: "10+ besed" }
    ]
  },
  {
    id: "recognizes_shapes_colors",
    question: "Ali vaš otrok prepozna barve in like:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "animal_words",
    question: "Koliko besed pogostih živali pozna vaš otrok:",
    options: [
      { value: "0", label: "0" },
      { value: "1-10", label: "1–10" },
      { value: "10+", label: "10+" }
    ]
  },
  {
    id: "speech_clarity",
    question: "Ali druge osebe izven vaše družine razumejo kaj vaš otrok govori?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "word_pronunciation",
    question: "Ali vaš otrok jasno in razumljivo izgovarja besede:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" },
      { value: "some", label: "Samo nekatere besede" }
    ]
  },
  {
    id: "sentence_formation",
    question: "Ali vaš otrok zna tvoriti stavke?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" },
      { value: "short", label: "Samo kratke stavke" }
    ]
  },
  {
    id: "sees_speech_therapist",
    question: "Ali vaš otrok obiskuje logopeda:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  }
];

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
