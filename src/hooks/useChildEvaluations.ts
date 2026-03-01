import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationData {
  letter: string;
  selectedOptions: string[];
  comment: string;
  rating?: number;
}

export interface SessionEvaluationData {
  sessionId: string;
  status: string;
  completedAt: string | null;
  submittedAt: string | null;
  evaluations: Map<string, EvaluationData>;
}

async function fetchChildEvaluations(childId: string): Promise<SessionEvaluationData[]> {
  // 1. Pridobi vse seje za tega otroka
  const { data: sessions, error: sessionsError } = await supabase
    .from('articulation_test_sessions')
    .select('id, status, completed_at, submitted_at')
    .eq('child_id', childId)
    .order('submitted_at', { ascending: false });

  if (sessionsError) {
    console.error('Napaka pri pridobivanju sej:', sessionsError);
    return [];
  }

  if (!sessions || sessions.length === 0) {
    return [];
  }

  // 2. Pridobi vse ocene za te seje
  const sessionIds = sessions.map(s => s.id);
  const { data: evaluations, error: evalError } = await supabase
    .from('articulation_evaluations')
    .select('*')
    .in('session_id', sessionIds);

  if (evalError) {
    console.error('Napaka pri pridobivanju ocen:', evalError);
  }

  // 3. Grupiraj ocene po sejah
  const evaluationsBySession = new Map<string, Map<string, EvaluationData>>();
  
  if (evaluations) {
    evaluations.forEach(eval_ => {
      if (!evaluationsBySession.has(eval_.session_id)) {
        evaluationsBySession.set(eval_.session_id, new Map());
      }
      evaluationsBySession.get(eval_.session_id)!.set(eval_.letter, {
        letter: eval_.letter,
        selectedOptions: eval_.selected_options || [],
        comment: eval_.comment || '',
        rating: eval_.rating ?? undefined,
      });
    });
  }

  // 4. Sestavi rezultat
  return sessions.map(session => ({
    sessionId: session.id,
    status: session.status,
    completedAt: session.completed_at,
    submittedAt: session.submitted_at,
    evaluations: evaluationsBySession.get(session.id) || new Map(),
  }));
}

export function useChildEvaluations(childId: string | undefined) {
  return useQuery({
    queryKey: ['child-evaluations', childId],
    queryFn: () => fetchChildEvaluations(childId!),
    enabled: !!childId,
    refetchOnMount: 'always',
  });
}

// Helper: generate ugotovitve text from evaluations for a given session
export function generateAutoUgotovitve(
  childEvaluations: SessionEvaluationData[] | undefined,
  sessionId: string,
): string {
  if (!childEvaluations) return '';
  const sessionEval = childEvaluations.find(se => se.sessionId === sessionId);
  if (!sessionEval) return '';

  const optionLabels: Record<string, string> = {
    'not_automated': 'ni avtomatiziran',
    'not_acquired': 'ni usvojen',
    'distorted': 'je neustrezno usvojen (popačen)',
    'omitted': 'je izpuščen',
    'substituted': 'je zamenjan z drugim glasom',
  };
  const lines: string[] = [];
  sessionEval.evaluations.forEach((evalData, letter) => {
    evalData.selectedOptions.forEach(opt => {
      if (opt !== 'acquired' && optionLabels[opt]) {
        lines.push(`Glas ${letter} ${optionLabels[opt]}.`);
      }
    });
  });
  return lines.join('\n');
}

// Variant for logopedist children (uses logopedist_child_id instead of child_id)
async function fetchLogopedistChildEvaluations(logopedistChildId: string): Promise<SessionEvaluationData[]> {
  const { data: sessions, error: sessionsError } = await supabase
    .from('articulation_test_sessions')
    .select('id, status, completed_at, submitted_at')
    .eq('logopedist_child_id', logopedistChildId)
    .order('submitted_at', { ascending: false });

  if (sessionsError || !sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map(s => s.id);
  const { data: evaluations } = await supabase
    .from('articulation_evaluations')
    .select('*')
    .in('session_id', sessionIds);

  const evaluationsBySession = new Map<string, Map<string, EvaluationData>>();
  if (evaluations) {
    evaluations.forEach(eval_ => {
      if (!evaluationsBySession.has(eval_.session_id)) {
        evaluationsBySession.set(eval_.session_id, new Map());
      }
      evaluationsBySession.get(eval_.session_id)!.set(eval_.letter, {
        letter: eval_.letter,
        selectedOptions: eval_.selected_options || [],
        comment: eval_.comment || '',
        rating: eval_.rating ?? undefined,
      });
    });
  }

  return sessions.map(session => ({
    sessionId: session.id,
    status: session.status,
    completedAt: session.completed_at,
    submittedAt: session.submitted_at,
    evaluations: evaluationsBySession.get(session.id) || new Map(),
  }));
}

export function useLogopedistChildEvaluations(logopedistChildId: string | undefined) {
  return useQuery({
    queryKey: ['logopedist-child-evaluations', logopedistChildId],
    queryFn: () => fetchLogopedistChildEvaluations(logopedistChildId!),
    enabled: !!logopedistChildId,
    refetchOnMount: 'always',
  });
}
