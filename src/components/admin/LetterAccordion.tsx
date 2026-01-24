import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { RecordingPlayer } from './RecordingPlayer';
import { EvaluationCheckboxes } from './EvaluationCheckboxes';
import { Recording, LetterEvaluation } from '@/hooks/useSessionReview';
import { getEvaluationConfig, PhoneticLetter } from '@/data/evaluationOptions';
import { Volume2, VolumeX, Save, Loader2 } from 'lucide-react';

interface LetterAccordionProps {
  letter: PhoneticLetter;
  recordings: Recording[];
  evaluation: LetterEvaluation;
  onEvaluationChange: (letter: string, selectedOptions: string[], comment: string, rating?: number) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  isReadOnly?: boolean;
}

export function LetterAccordion({
  letter,
  recordings,
  evaluation,
  onEvaluationChange,
  onSave,
  isSaving = false,
  isReadOnly = false,
}: LetterAccordionProps) {
  const config = getEvaluationConfig(letter);
  const hasRecordings = recordings.length > 0;

  const handleOptionsChange = (options: string[]) => {
    if (isReadOnly) return;
    onEvaluationChange(letter, options, evaluation.comment, evaluation.rating);
  };

  const handleCommentChange = (comment: string) => {
    if (isReadOnly) return;
    onEvaluationChange(letter, evaluation.selectedOptions, comment, evaluation.rating);
  };

  const handleRatingChange = (rating: number | undefined) => {
    if (isReadOnly) return;
    onEvaluationChange(letter, evaluation.selectedOptions, evaluation.comment, rating);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={letter} className="border rounded-lg bg-card">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            {hasRecordings ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-semibold text-foreground">ČRKA {letter}</span>
            {!hasRecordings && (
              <span className="text-xs text-muted-foreground">(ni posnetkov)</span>
            )}
            {hasRecordings && (
              <span className="text-xs text-muted-foreground">
                ({recordings.length} {recordings.length === 1 ? 'posnetek' : recordings.length === 2 ? 'posnetka' : 'posnetki'})
              </span>
            )}
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-4 pb-4">
          {/* Posnetki */}
          {hasRecordings ? (
            <div className="space-y-1">
              {recordings.map((recording, index) => (
                <RecordingPlayer
                  key={`${recording.filename}-${index}`}
                  word={recording.word}
                  url={recording.url}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Za to črko ni bilo shranjenih posnetkov.
            </p>
          )}

          {/* Check boxi, lestvica in komentar */}
          {config && (
            <EvaluationCheckboxes
              options={config.options}
              selectedOptions={evaluation.selectedOptions}
              comment={evaluation.comment}
              rating={evaluation.rating}
              onOptionsChange={handleOptionsChange}
              onCommentChange={handleCommentChange}
              onRatingChange={handleRatingChange}
              disabled={isReadOnly}
            />
          )}

          {/* Gumb za shranjevanje */}
          {onSave && !isReadOnly && (
            <div className="pt-3 mt-3 border-t flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Shrani oceno
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
