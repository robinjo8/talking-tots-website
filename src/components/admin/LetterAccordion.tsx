import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RecordingPlayer } from './RecordingPlayer';
import { EvaluationCheckboxes } from './EvaluationCheckboxes';
import { Recording, LetterEvaluation } from '@/hooks/useSessionReview';
import { getEvaluationConfig, PhoneticLetter } from '@/data/evaluationOptions';
import { Volume2, VolumeX } from 'lucide-react';

interface LetterAccordionProps {
  letter: PhoneticLetter;
  recordings: Recording[];
  evaluation: LetterEvaluation;
  onEvaluationChange: (letter: string, selectedOptions: string[], comment: string) => void;
}

export function LetterAccordion({
  letter,
  recordings,
  evaluation,
  onEvaluationChange,
}: LetterAccordionProps) {
  const config = getEvaluationConfig(letter);
  const hasRecordings = recordings.length > 0;

  const handleOptionsChange = (options: string[]) => {
    onEvaluationChange(letter, options, evaluation.comment);
  };

  const handleCommentChange = (comment: string) => {
    onEvaluationChange(letter, evaluation.selectedOptions, comment);
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

          {/* Check boxi in komentar */}
          {config && (
            <EvaluationCheckboxes
              options={config.options}
              selectedOptions={evaluation.selectedOptions}
              comment={evaluation.comment}
              onOptionsChange={handleOptionsChange}
              onCommentChange={handleCommentChange}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
