import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionReview, saveEvaluation, completeReview, LetterEvaluation } from '@/hooks/useSessionReview';
import { PHONETIC_ORDER, PhoneticLetter } from '@/data/evaluationOptions';
import { SessionReviewHeader } from '@/components/admin/SessionReviewHeader';
import { LetterAccordion } from '@/components/admin/LetterAccordion';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSessionReview() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSessionReview(sessionId);
  
  // Lokalno stanje za ocene (za optimistične posodobitve)
  const [localEvaluations, setLocalEvaluations] = useState<Map<string, LetterEvaluation>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Inicializiraj lokalne ocene iz podatkov
  useEffect(() => {
    if (data?.evaluations) {
      setLocalEvaluations(new Map(data.evaluations));
    }
  }, [data?.evaluations]);

  const handleEvaluationChange = (letter: string, selectedOptions: string[], comment: string) => {
    setLocalEvaluations(prev => {
      const newMap = new Map(prev);
      newMap.set(letter, { selectedOptions, comment });
      return newMap;
    });
  };

  const handleSaveAll = async () => {
    if (!sessionId) return;
    
    setIsSaving(true);
    let hasError = false;

    // Shrani vse ocene ki imajo vsaj eno izbrano možnost ali komentar
    for (const [letter, evaluation] of localEvaluations.entries()) {
      if (evaluation.selectedOptions.length > 0 || evaluation.comment.trim()) {
        const result = await saveEvaluation(
          sessionId,
          letter,
          evaluation.selectedOptions,
          evaluation.comment
        );
        if (!result.success) {
          hasError = true;
          toast.error(`Napaka pri shranjevanju ocene za črko ${letter}`);
        }
      }
    }

    setIsSaving(false);
    
    if (!hasError) {
      toast.success('Ocene uspešno shranjene');
    }
  };

  const handleCompleteReview = async () => {
    if (!sessionId) return;
    
    setIsCompleting(true);
    
    // Najprej shrani vse ocene
    await handleSaveAll();
    
    // Nato zaključi pregled
    const result = await completeReview(sessionId);
    
    setIsCompleting(false);
    
    if (result.success) {
      toast.success('Pregled uspešno zaključen');
      navigate('/admin/my-reviews');
    } else {
      toast.error('Napaka pri zaključevanju pregleda');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Nalagam podatke seje...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Napaka pri nalaganju seje</p>
          <p className="text-muted-foreground text-sm">{error?.message || 'Seja ni bila najdena'}</p>
          <Button variant="outline" onClick={() => navigate('/admin/my-reviews')}>
            Nazaj na moje preglede
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SessionReviewHeader
        childName={data.child.name}
        childAge={data.child.age}
        childGender={data.child.gender}
        submittedAt={data.session.submittedAt}
      />

      {/* Accordion za vsako črko */}
      <div className="space-y-3">
        {PHONETIC_ORDER.map(letter => {
          const recordings = data.recordingsByLetter.get(letter) || [];
          const evaluation = localEvaluations.get(letter) || { selectedOptions: [], comment: '' };

          return (
            <LetterAccordion
              key={letter}
              letter={letter as PhoneticLetter}
              recordings={recordings}
              evaluation={evaluation}
              onEvaluationChange={handleEvaluationChange}
            />
          );
        })}
      </div>

      {/* Akcijski gumbi */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleSaveAll}
          disabled={isSaving || isCompleting}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Shrani ocene
        </Button>

        <Button
          onClick={handleCompleteReview}
          disabled={isSaving || isCompleting}
          className="gap-2"
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Zaključi pregled
        </Button>
      </div>
    </div>
  );
}
