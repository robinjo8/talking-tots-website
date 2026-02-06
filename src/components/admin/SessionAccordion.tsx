import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LetterAccordion } from './LetterAccordion';
import { Recording, LetterEvaluation } from '@/hooks/useSessionReview';
import { PHONETIC_ORDER, PhoneticLetter } from '@/data/evaluationOptions';
import { Calendar, Save, Loader2, Volume2, CheckCircle } from 'lucide-react';
import { format, addMonths, addWeeks } from 'date-fns';
import { sl } from 'date-fns/locale';

interface SessionAccordionProps {
  sessionNumber: number;
  baseDate: string | null; // submitted_at of Seja-1
  hasData: boolean;
  recordingsByLetter: Map<string, Recording[]>;
  evaluations: Map<string, LetterEvaluation>;
  onEvaluationChange: (letter: string, selectedOptions: string[], comment: string, rating?: number) => void;
  onSaveLetter: (letter: string) => Promise<void>;
  onSaveAll: () => Promise<void>;
  onCompleteReview?: () => Promise<void>;
  isSaving: boolean;
  savingLetter: string | null;
  isCompleting?: boolean;
  hasUnsavedChanges: boolean;
  isReadOnly?: boolean;
}

export function SessionAccordion({
  sessionNumber,
  baseDate,
  hasData,
  recordingsByLetter,
  evaluations,
  onEvaluationChange,
  onSaveLetter,
  onSaveAll,
  onCompleteReview,
  isSaving,
  savingLetter,
  isCompleting,
  hasUnsavedChanges,
  isReadOnly,
}: SessionAccordionProps) {
  

  // Calculate session date based on session number
  const getSessionDate = (): { label: string; date: string } => {
    if (!baseDate) {
      return { label: 'Datum ni znan', date: '' };
    }

    const baseDateObj = new Date(baseDate);

    if (sessionNumber === 1) {
      return {
        label: 'Oddano',
        date: format(baseDateObj, 'd. M. yyyy', { locale: sl }),
      };
    }

    // Future sessions: calculated dates
    let targetDate: Date;
    switch (sessionNumber) {
      case 2:
        targetDate = addMonths(baseDateObj, 3);
        break;
      case 3:
        targetDate = addMonths(baseDateObj, 6);
        break;
      case 4:
        targetDate = addMonths(baseDateObj, 9);
        break;
      case 5:
        // 1 week before 1 year = 11 months + 3 weeks
        targetDate = addWeeks(addMonths(baseDateObj, 12), -1);
        break;
      default:
        targetDate = baseDateObj;
    }

    return {
      label: 'Predvideno',
      date: format(targetDate, 'd. M. yyyy', { locale: sl }),
    };
  };

  const sessionDate = getSessionDate();

  // Count recordings
  const totalRecordings = Array.from(recordingsByLetter.values()).reduce(
    (sum, recs) => sum + recs.length,
    0
  );


  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`seja-${sessionNumber}`} className="border rounded-lg bg-card">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-foreground">Seja-{sessionNumber}</span>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {sessionDate.label}: <span className="text-foreground">{sessionDate.date}</span>
              </span>
            </div>
            {hasData && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="h-4 w-4 text-primary" />
                <span>{totalRecordings} posnetkov</span>
              </div>
            )}
            {!hasData && sessionNumber > 1 && (
              <span className="text-xs text-muted-foreground italic">(še ni podatkov)</span>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4">
          {hasData ? (
            <div className="space-y-3">
              {/* Letter accordions - only one open at a time */}
              <Accordion type="single" collapsible className="w-full space-y-3">
                {PHONETIC_ORDER.map(letter => {
                  const recordings = recordingsByLetter.get(letter) || [];
                  const evaluation = evaluations.get(letter) || { selectedOptions: [], comment: '', rating: undefined };

                  return (
                    <LetterAccordion
                      key={letter}
                      letter={letter as PhoneticLetter}
                      recordings={recordings}
                      evaluation={evaluation}
                      onEvaluationChange={onEvaluationChange}
                      onSave={() => onSaveLetter(letter)}
                      isSaving={savingLetter === letter}
                      isReadOnly={isReadOnly}
                    />
                  );
                })}
              </Accordion>

              {/* Action buttons for this session */}
              <div className="pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onSaveAll}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Shrani vse ocene
                </Button>
                
                {onCompleteReview && !isReadOnly && (
                  <Button
                    onClick={onCompleteReview}
                    disabled={isSaving || isCompleting}
                    className="gap-2"
                  >
                    {isCompleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Zaključi pregled Seja-{sessionNumber}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>Za to sejo še ni bilo oddanih posnetkov.</p>
              {sessionNumber > 1 && (
                <p className="text-sm mt-2">
                  Predvideno ob {sessionDate.date}.
                </p>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
