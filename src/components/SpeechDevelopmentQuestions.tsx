
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Nazaj
        </Button>
        <h3 className="text-lg font-medium">Govorni razvoj za {childName}</h3>
      </div>

      <div className="space-y-6">
        {SPEECH_DEVELOPMENT_QUESTIONS.map((question) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
            <Label className="text-base font-medium mb-3 block">
              {question.question}
            </Label>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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
