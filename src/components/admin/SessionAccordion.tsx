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
  subscriptionEnd?: string | null; // current_period_end from user_subscriptions
  actualSessionDates?: Map<number, string>; // actual submitted_at per session number
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
  letterOrder?: string[];
}

export function SessionAccordion({
  sessionNumber,
  baseDate,
  subscriptionEnd,
  actualSessionDates,
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
  letterOrder,
}: SessionAccordionProps) {
  

  // Calculate session date: use actual date if available, otherwise smart prediction
  const getSessionDate = (): { label: string; date: string } => {
    // If this session has actual data, show actual date
    const actualDate = actualSessionDates?.get(sessionNumber);
    if (actualDate) {
      return {
        label: sessionNumber === 1 ? 'Oddano' : 'Opravljeno',
        date: format(new Date(actualDate), 'd. M. yyyy', { locale: sl }),
      };
    }

    if (!baseDate) {
      return { label: 'Datum ni znan', date: '' };
    }

    if (sessionNumber === 1) {
      return {
        label: 'Oddano',
        date: format(new Date(baseDate), 'd. M. yyyy', { locale: sl }),
      };
    }

    // Find the most recent actual session before this one
    let lastKnownDate: Date | null = null;
    if (actualSessionDates) {
      for (let i = sessionNumber - 1; i >= 1; i--) {
        const d = actualSessionDates.get(i);
        if (d) {
          lastKnownDate = new Date(d);
          break;
        }
      }
    }

    const referenceDate = lastKnownDate || new Date(baseDate);

    // Smart cooldown: check if normal 90-day interval overshoots subscriptionEnd - 7 days
    const normalTarget = addMonths(referenceDate, 3);
    
    if (subscriptionEnd) {
      const subEnd = new Date(subscriptionEnd);
      const lastTestTarget = addWeeks(subEnd, -1); // 7 days before expiry
      
      if (normalTarget > lastTestTarget) {
        // Shortened cooldown — but minimum 30 days
        const minTarget = new Date(referenceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const targetDate = lastTestTarget > minTarget ? lastTestTarget : minTarget;
        return {
          label: 'Predvideno',
          date: format(targetDate, 'd. M. yyyy', { locale: sl }),
        };
      }
    }

    return {
      label: 'Predvideno',
      date: format(normalTarget, 'd. M. yyyy', { locale: sl }),
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
                {(letterOrder || PHONETIC_ORDER).map(letter => {
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
