import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { SpeechDifficultyBadge } from '@/components/speech';
import { SPEECH_DEVELOPMENT_QUESTIONS, SPEECH_DEVELOPMENT_TEXT_QUESTIONS } from '@/models/SpeechDevelopment';
import { avatarOptions } from '@/components/AvatarSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChildData {
  name: string;
  birthDate: Date | null;
  gender: 'male' | 'female' | null;
  notes: string;
  externalId: string;
  avatarId: number;
  speechDifficulties: string[];
  speechDifficultiesDescription: string;
  speechDevelopment: Record<string, string>;
}

interface AdminChildCompletedViewProps {
  child: ChildData;
  onAddAnother: () => void;
  onClose: () => void;
}

export function AdminChildCompletedView({
  child,
  onAddAnother,
  onClose,
}: AdminChildCompletedViewProps) {
  const calculateAge = (date: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const getAnswerLabels = (answers: Record<string, string> = {}) => {
    const labelMap: Record<string, string> = {
      yes: 'Da',
      no: 'Ne',
      sometimes: 'Včasih',
      often: 'Pogosto',
      rarely: 'Redko',
    };

    return Object.entries(answers).map(([key, value]) => {
      const radioQ = SPEECH_DEVELOPMENT_QUESTIONS.find(q => q.id === key);
      const textQ = SPEECH_DEVELOPMENT_TEXT_QUESTIONS.find(q => q.id === key);
      const questionText = radioQ?.question || textQ?.question || `Vprašanje: ${key}`;
      const option = radioQ?.options.find(o => o.value === value);
      return {
        id: key,
        questionText,
        answer: option?.label || labelMap[value] || value,
      };
    });
  };

  const answerItems = child.speechDevelopment ? getAnswerLabels(child.speechDevelopment) : [];
  const avatar = avatarOptions.find(a => a.id === child.avatarId);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-1.5">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profil uspešno ustvarjen</h3>
            <p className="text-sm text-gray-600">
              Profil otroka je zdaj pripravljen za uporabo.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold text-lg mb-4">Osnovni podatki</h3>
        <div className="bg-white rounded-lg border p-4 space-y-3">
          {avatar && avatar.id > 0 && (
            <div className="flex justify-center pb-2">
              <Avatar className="h-20 w-20 ring-2 ring-dragon-green/20">
                <AvatarImage src={avatar.src} alt={avatar.alt} className="object-contain" />
                <AvatarFallback className="text-2xl bg-dragon-green/10">🐲</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Ime</span>
            <span className="font-medium">{child.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Spol</span>
            <span className="font-medium">{child.gender === 'male' ? 'Deček' : 'Deklica'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Datum rojstva</span>
            <span className="font-medium">
              {child.birthDate
                ? format(child.birthDate, 'd. MMMM yyyy', { locale: sl })
                : 'Ni podan'}
            </span>
          </div>
          {child.birthDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Starost</span>
              <span className="font-medium">
                {calculateAge(child.birthDate)} {calculateAge(child.birthDate) === 1 ? 'leto' : calculateAge(child.birthDate) < 5 ? 'leta' : 'let'}
              </span>
            </div>
          )}
          {child.externalId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Zunanji ID</span>
              <span className="font-medium">{child.externalId}</span>
            </div>
          )}
        </div>
      </div>

      {child.speechDifficulties && child.speechDifficulties.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Govorne težave</h3>
          <div className="flex flex-wrap gap-2">
            {child.speechDifficulties.map(diffId => (
              <SpeechDifficultyBadge key={diffId} difficultyId={diffId} />
            ))}
          </div>
          {child.speechDifficultiesDescription && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {child.speechDifficultiesDescription}
            </p>
          )}
        </div>
      )}

      {answerItems.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Odgovori na vprašalnik</h3>
          <div className="bg-white rounded-lg border divide-y">
            {answerItems.map((item) => (
              <div key={item.id} className="p-3 flex flex-col gap-1">
                <span className="text-gray-700 text-sm">{item.questionText}</span>
                <div className="flex justify-end">
                  <Badge
                    variant={
                      item.answer === 'Da'
                        ? 'default'
                        : item.answer === 'Ne'
                        ? 'outline'
                        : 'secondary'
                    }
                  >
                    {item.answer}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {child.notes && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Zapiski</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{child.notes}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onAddAnother}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj drugega otroka
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 bg-dragon-green hover:bg-dragon-green/90"
        >
          Zaključi
        </Button>
      </div>
    </div>
  );
}
