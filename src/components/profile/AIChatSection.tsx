import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { SPEECH_DEVELOPMENT_QUESTIONS, SPEECH_DEVELOPMENT_TEXT_QUESTIONS } from "@/models/SpeechDevelopment";
import type { ChildContext } from "@/hooks/useChatAssistant";

function calculateAge(birthDate: Date | null | undefined): number | null {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function translateGender(gender: string): string {
  switch (gender) {
    case 'M': return 'Deček';
    case 'F': return 'Deklica';
    default: return gender;
  }
}

function translateDifficulties(ids: string[] | undefined): string {
  if (!ids || ids.length === 0) return 'Ni podatka';
  return ids
    .map(id => SPEECH_DIFFICULTIES.find(d => d.id === id)?.title || id)
    .join(', ');
}

function formatSpeechDevelopment(data: Record<string, string> | undefined): string {
  if (!data || Object.keys(data).length === 0) return 'Ni podatka';

  const lines: string[] = [];

  for (const [questionId, answer] of Object.entries(data)) {
    const question = SPEECH_DEVELOPMENT_QUESTIONS.find(q => q.id === questionId);
    if (question) {
      const option = question.options.find(opt => opt.value === answer);
      lines.push(`* ${question.question} ${option?.label || answer}`);
      continue;
    }

    const textQuestion = SPEECH_DEVELOPMENT_TEXT_QUESTIONS.find(q => q.id === questionId);
    if (textQuestion && answer) {
      lines.push(`* ${textQuestion.question} ${answer}`);
    }
  }

  return lines.length > 0 ? lines.join('\n  ') : 'Ni podatka';
}

export function AIChatSection() {
  const { selectedChild } = useAuth();

  const childContext = useMemo<ChildContext | undefined>(() => {
    if (!selectedChild) return undefined;

    return {
      name: selectedChild.name,
      gender: translateGender(selectedChild.gender),
      age: calculateAge(selectedChild.birthDate),
      speechDifficulties: translateDifficulties(selectedChild.speechDifficulties),
      speechDifficultiesDescription: selectedChild.speechDifficultiesDescription || '',
      speechDevelopmentSummary: formatSpeechDevelopment(selectedChild.speechDevelopment),
    };
  }, [selectedChild]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-lg font-semibold">AI Klepet - Tomi</h2>
        <p className="text-sm text-white/80">Vaš digitalni logopedski pomočnik</p>
      </div>
      <div className="h-[600px]">
        <ChatInterface childContext={childContext} />
      </div>
    </div>
  );
}
