import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionReview, saveEvaluation, completeReview, LetterEvaluation } from '@/hooks/useSessionReview';
import { SessionReviewHeader } from '@/components/admin/SessionReviewHeader';
import { SessionAccordion } from '@/components/admin/SessionAccordion';
import { UnsavedChangesDialog } from '@/components/admin/UnsavedChangesDialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSessionReview() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSessionReview(sessionId);
  const isEditMode = searchParams.get('edit') === 'true';
  
  // Lokalno stanje za ocene (za optimistične posodobitve)
  const [localEvaluations, setLocalEvaluations] = useState<Map<string, LetterEvaluation>>(new Map());
  const [savedEvaluations, setSavedEvaluations] = useState<Map<string, LetterEvaluation>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [savingLetter, setSavingLetter] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Inicializiraj lokalne ocene iz podatkov
  useEffect(() => {
    if (data?.evaluations) {
      setLocalEvaluations(new Map(data.evaluations));
      setSavedEvaluations(new Map(data.evaluations));
    }
  }, [data?.evaluations]);

  // Preveri spremembe
  const checkForChanges = useCallback(() => {
    for (const [letter, evaluation] of localEvaluations.entries()) {
      const saved = savedEvaluations.get(letter);
      if (!saved) {
        if (evaluation.selectedOptions.length > 0 || evaluation.comment.trim()) {
          return true;
        }
      } else {
        if (JSON.stringify(evaluation) !== JSON.stringify(saved)) {
          return true;
        }
      }
    }
    return false;
  }, [localEvaluations, savedEvaluations]);

  useEffect(() => {
    setHasUnsavedChanges(checkForChanges());
  }, [checkForChanges]);

  // Browser beforeunload opozorilo
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleEvaluationChange = (letter: string, selectedOptions: string[], comment: string) => {
    setLocalEvaluations(prev => {
      const newMap = new Map(prev);
      newMap.set(letter, { selectedOptions, comment });
      return newMap;
    });
  };

  // Shrani posamezno črko
  const handleSaveLetter = async (letter: string) => {
    if (!sessionId) return;
    
    setSavingLetter(letter);
    const evaluation = localEvaluations.get(letter) || { selectedOptions: [], comment: '' };
    
    const result = await saveEvaluation(
      sessionId,
      letter,
      evaluation.selectedOptions,
      evaluation.comment
    );

    setSavingLetter(null);

    if (result.success) {
      setSavedEvaluations(prev => {
        const newMap = new Map(prev);
        newMap.set(letter, evaluation);
        return newMap;
      });
      toast.success(`Ocena za črko ${letter} shranjena`);
    } else {
      toast.error(`Napaka pri shranjevanju ocene za črko ${letter}`);
    }
  };

  // Shrani vse ocene za sejo
  const handleSaveAll = async () => {
    if (!sessionId) return;
    
    setIsSaving(true);
    let hasError = false;
    let savedCount = 0;

    for (const [letter, evaluation] of localEvaluations.entries()) {
      const saved = savedEvaluations.get(letter);
      const hasChanged = !saved || JSON.stringify(evaluation) !== JSON.stringify(saved);
      
      if (hasChanged && (evaluation.selectedOptions.length > 0 || evaluation.comment.trim())) {
        const result = await saveEvaluation(
          sessionId,
          letter,
          evaluation.selectedOptions,
          evaluation.comment
        );
        if (!result.success) {
          hasError = true;
          toast.error(`Napaka pri shranjevanju ocene za črko ${letter}`);
        } else {
          savedCount++;
          setSavedEvaluations(prev => {
            const newMap = new Map(prev);
            newMap.set(letter, evaluation);
            return newMap;
          });
        }
      }
    }

    setIsSaving(false);
    
    if (!hasError && savedCount > 0) {
      toast.success(`${savedCount} ocen uspešno shranjenih`);
    } else if (savedCount === 0 && !hasError) {
      toast.info('Ni novih sprememb za shranjevanje');
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

  const handleDialogConfirm = () => {
    setShowUnsavedDialog(false);
  };

  const handleDialogCancel = () => {
    setShowUnsavedDialog(false);
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

  // Ali je to zaključen pregled, ki ni v načinu urejanja?
  const isReadOnly = data.session.status === 'completed' && !isEditMode;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SessionReviewHeader
        childName={data.child.name}
        childAge={data.child.age}
        childGender={data.child.gender}
      />

      {/* Info za read-only način */}
      {isReadOnly && (
        <div className="bg-muted/50 border rounded-lg p-4 text-sm text-muted-foreground">
          Ta pregled je zaključen. Za urejanje uporabite gumb "Popravi".
        </div>
      )}

      {/* Sejin - trenutno samo Seja-1 z dejanskimi podatki */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(sessionNum => {
          const hasSessionData = sessionNum === 1; // Trenutno samo Seja-1 ima podatke
          
          return (
            <SessionAccordion
              key={sessionNum}
              sessionNumber={sessionNum}
              baseDate={data.session.submittedAt}
              hasData={hasSessionData}
              recordingsByLetter={hasSessionData ? data.recordingsByLetter : new Map()}
              evaluations={hasSessionData ? localEvaluations : new Map()}
              onEvaluationChange={isReadOnly ? () => {} : handleEvaluationChange}
              onSaveLetter={isReadOnly ? async () => {} : handleSaveLetter}
              onSaveAll={isReadOnly ? async () => {} : handleSaveAll}
              onCompleteReview={hasSessionData ? handleCompleteReview : undefined}
              isSaving={isSaving}
              savingLetter={savingLetter}
              isCompleting={isCompleting}
              hasUnsavedChanges={hasSessionData ? hasUnsavedChanges : false}
              isReadOnly={isReadOnly}
            />
          );
        })}
      </div>


      {/* Dialog za neshranjene spremembe */}
      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
}
