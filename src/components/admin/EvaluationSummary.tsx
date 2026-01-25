import { SessionEvaluationData, EvaluationData } from '@/hooks/useChildEvaluations';
import { PHONETIC_ORDER } from '@/data/evaluationOptions';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';

interface EvaluationSummaryProps {
  sessionData: SessionEvaluationData;
}

export function EvaluationSummary({ sessionData }: EvaluationSummaryProps) {
  const { evaluations } = sessionData;
  
  if (evaluations.size === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-2">
        Še ni ocen za to sejo.
      </div>
    );
  }

  // Filtriraj samo črke, ki imajo ocene
  const evaluatedLetters = PHONETIC_ORDER.filter(letter => {
    const eval_ = evaluations.get(letter);
    return eval_ && (eval_.rating || eval_.selectedOptions.length > 0 || eval_.comment);
  });

  if (evaluatedLetters.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-2">
        Še ni ocen za to sejo.
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Povzetek ocen ({evaluatedLetters.length} črk ocenjenih)
      </div>
      
      <div className="grid gap-2">
        {evaluatedLetters.map(letter => {
          const eval_ = evaluations.get(letter)!;
          return (
            <EvaluationLetterRow key={letter} letter={letter} evaluation={eval_} />
          );
        })}
      </div>
    </div>
  );
}

interface EvaluationLetterRowProps {
  letter: string;
  evaluation: EvaluationData;
}

function EvaluationLetterRow({ letter, evaluation }: EvaluationLetterRowProps) {
  const { rating, selectedOptions, comment } = evaluation;
  
  return (
    <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{letter}</span>
        {rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
          </div>
        )}
      </div>
      
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option, idx) => (
            <span
              key={idx}
              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
            >
              {option}
            </span>
          ))}
        </div>
      )}
      
      {comment && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="italic">"{comment}"</span>
        </div>
      )}
    </div>
  );
}
