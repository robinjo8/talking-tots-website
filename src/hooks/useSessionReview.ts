import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PHONETIC_ORDER, parseRecordingFilename } from '@/data/evaluationOptions';

export interface Recording {
  letter: string;
  word: string;
  wordIndex: number;
  filename: string;
  url: string;
}

export interface LetterEvaluation {
  selectedOptions: string[];
  comment: string;
  rating?: number;
}

export interface SessionReviewData {
  session: {
    id: string;
    childId: string;
    parentId: string;
    status: string;
    submittedAt: string | null;
    completedAt: string | null;
    assignedTo: string | null;
  };
  child: {
    name: string;
    age: number | null;
    gender: string | null;
  };
  parent: {
    firstName: string | null;
    lastName: string | null;
  };
  assignedLogopedist: {
    id: string;
    firstName: string;
    lastName: string;
    organizationName: string;
  } | null;
  recordingsByLetter: Map<string, Recording[]>;
  evaluations: Map<string, LetterEvaluation>;
}

async function fetchSessionReviewData(sessionId: string): Promise<SessionReviewData> {
  // 1. Pridobi podatke o seji
  const { data: session, error: sessionError } = await supabase
    .from('articulation_test_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error('Seja ni bila najdena');
  }

  // 2. Pridobi podatke o otroku
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('*')
    .eq('id', session.child_id)
    .single();

  if (childError) {
    console.error('Napaka pri pridobivanju otroka:', childError);
  }

  // 3. Pridobi podatke o staršu
  const { data: parent, error: parentError } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', session.parent_id)
    .single();

  if (parentError) {
    console.error('Napaka pri pridobivanju starša:', parentError);
  }

  // 4. Pridobi podatke o dodeljenem logopedu
  let assignedLogopedist: SessionReviewData['assignedLogopedist'] = null;
  if (session.assigned_to) {
    const { data: logopedist, error: logopedistError } = await supabase
      .from('logopedist_profiles')
      .select('id, first_name, last_name, organization_id')
      .eq('id', session.assigned_to)
      .single();

    if (logopedistError) {
      console.error('Napaka pri pridobivanju logopeda:', logopedistError);
    }

    if (logopedist) {
      // Pridobi ime organizacije
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', logopedist.organization_id)
        .single();

      if (orgError) {
        console.error('Napaka pri pridobivanju organizacije:', orgError);
      }

      assignedLogopedist = {
        id: logopedist.id,
        firstName: logopedist.first_name,
        lastName: logopedist.last_name,
        organizationName: organization?.name || 'Neznana organizacija',
      };
    }
  }

  // 4. Pridobi posnetke iz Storage
  const storagePath = `${session.parent_id}/${session.child_id}/Preverjanje-izgovorjave`;
  
  // Uporabi session_number za določitev pravilne mape posnetkov
  const sessionNumber = (session as any).session_number || 1;
  const targetFolder = `${storagePath}/Seja-${sessionNumber}`;
  
  console.log('Nalagam posnetke iz mape:', targetFolder, 'session_number:', sessionNumber);

  // Pridobi posnetke iz mape
  let recordings: Recording[] = [];
  const { data: files, error: filesError } = await supabase.storage
    .from('uporabniski-profili')
    .list(targetFolder);

  if (filesError) {
    console.error('Napaka pri pridobivanju posnetkov:', filesError);
  }

  if (files) {
    // Pridobi signed URLs za vse datoteke vzporedno
    const audioFiles = files.filter(file => 
      file.name.endsWith('.webm') || 
      file.name.endsWith('.mp3') || 
      file.name.endsWith('.wav')
    );

    const signedUrlPromises = audioFiles.map(async file => {
      const parsed = parseRecordingFilename(file.name);
      if (!parsed) return null;

      // Uporabi signed URL za zasebni bucket
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('uporabniski-profili')
        .createSignedUrl(`${targetFolder}/${file.name}`, 3600); // 1 ura veljavnosti

      if (signedUrlError) {
        console.error('Napaka pri ustvarjanju signed URL:', signedUrlError);
        return null;
      }

      return {
        letter: parsed.letter,
        word: parsed.word, // Zdaj je že pravilna beseda s šumniki
        wordIndex: parsed.wordIndex,
        filename: file.name,
        url: signedUrlData.signedUrl,
      };
    });

    const results = await Promise.all(signedUrlPromises);
    recordings = results.filter((r): r is Recording => r !== null);
  }

  // 5. Grupiraj posnetke po črkah
  const recordingsByLetter = new Map<string, Recording[]>();
  PHONETIC_ORDER.forEach(letter => recordingsByLetter.set(letter, []));

  recordings.forEach(recording => {
    const letterRecordings = recordingsByLetter.get(recording.letter) || [];
    letterRecordings.push(recording);
    recordingsByLetter.set(recording.letter, letterRecordings);
  });

  // Sortiraj posnetke znotraj vsake črke po wordIndex
  recordingsByLetter.forEach((recs, letter) => {
    recs.sort((a, b) => a.wordIndex - b.wordIndex);
    recordingsByLetter.set(letter, recs);
  });

  // 6. Pridobi obstoječe ocene
  const { data: evaluationsData, error: evalError } = await supabase
    .from('articulation_evaluations')
    .select('*')
    .eq('session_id', sessionId);

  if (evalError) {
    console.error('Napaka pri pridobivanju ocen:', evalError);
  }

  const evaluations = new Map<string, LetterEvaluation>();
  if (evaluationsData) {
    evaluationsData.forEach(eval_ => {
      evaluations.set(eval_.letter, {
        selectedOptions: eval_.selected_options || [],
        comment: eval_.comment || '',
        rating: eval_.rating ?? undefined,
      });
    });
  }

  return {
    session: {
      id: session.id,
      childId: session.child_id,
      parentId: session.parent_id,
      status: session.status,
      submittedAt: session.submitted_at,
      completedAt: session.completed_at || null,
      assignedTo: session.assigned_to || null,
    },
    child: {
      name: child?.name || 'Neznano',
      age: child?.age || null,
      gender: child?.gender || null,
    },
    parent: {
      firstName: parent?.first_name || null,
      lastName: parent?.last_name || null,
    },
    assignedLogopedist,
    recordingsByLetter,
    evaluations,
  };
}

export function useSessionReview(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['session-review', sessionId],
    queryFn: () => fetchSessionReviewData(sessionId!),
    enabled: !!sessionId,
  });
}

// Shranjevanje ocen
export async function saveEvaluation(
  sessionId: string,
  letter: string,
  selectedOptions: string[],
  comment: string,
  rating?: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('articulation_evaluations')
    .upsert(
      {
        session_id: sessionId,
        letter: letter,
        selected_options: selectedOptions,
        comment: comment,
        rating: rating ?? null,
      },
      { onConflict: 'session_id,letter' }
    );

  if (error) {
    console.error('Napaka pri shranjevanju ocene:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Zaključitev pregleda
export async function completeReview(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('articulation_test_sessions')
    .update({ 
      status: 'completed',
      reviewed_at: new Date().toISOString() 
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Napaka pri zaključevanju pregleda:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
