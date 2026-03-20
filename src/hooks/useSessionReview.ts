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
    childId: string | null;
    parentId: string;
    status: string;
    submittedAt: string | null;
    completedAt: string | null;
    assignedTo: string | null;
    sourceType: 'parent' | 'logopedist';
    logopedistChildId: string | null;
    organizationId: string | null;
    additionalAssignmentId: string | null;
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

  // 2. Pridobi podatke o otroku - glede na source_type
  let childData: { name: string; age: number | null; gender: string | null } = { 
    name: 'Neznano', 
    age: null, 
    gender: null 
  };
  let logopedistId: string | null = null;

  if (session.source_type === 'logopedist' && session.logopedist_child_id) {
    // Organizacijski otrok - išči v logopedist_children
    const { data: logopedistChild, error: logopedistChildError } = await supabase
      .from('logopedist_children')
      .select('name, age, gender, logopedist_id')
      .eq('id', session.logopedist_child_id)
      .single();

    if (logopedistChildError) {
      console.error('Napaka pri pridobivanju organizacijskega otroka:', logopedistChildError);
    }

    if (logopedistChild) {
      childData = {
        name: logopedistChild.name,
        age: logopedistChild.age,
        gender: logopedistChild.gender,
      };
      logopedistId = logopedistChild.logopedist_id;
    }
  } else if (session.child_id) {
    // Parent otrok - išči v children
    const { data: parentChild, error: childError } = await supabase
      .from('children')
      .select('name, age, gender')
      .eq('id', session.child_id)
      .single();

    if (childError) {
      console.error('Napaka pri pridobivanju otroka:', childError);
    }

    if (parentChild) {
      childData = parentChild;
    }
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

  // 4. Pridobi posnetke - za dodatno preverjanje uporabi articulation_word_results
  let recordings: Recording[] = [];
  const isAdditionalTest = !!session.additional_assignment_id;

  if (isAdditionalTest) {
    // Za dodatno preverjanje: pridobi posnetke iz articulation_word_results s signed URLs
    const { data: wordResults, error: wordResultsError } = await supabase
      .from('articulation_word_results')
      .select('letter, target_word, audio_url, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (wordResultsError) {
      console.error('Napaka pri pridobivanju rezultatov besed:', wordResultsError);
    }

    if (wordResults && wordResults.length > 0) {
      // Dedupliciraj - ohrani zadnji posnetek za vsako besedo
      const dedupMap = new Map<string, typeof wordResults[0]>();
      wordResults.forEach(r => dedupMap.set(r.target_word, r));
      const uniqueResults = Array.from(dedupMap.values());

      // Pridobi signed URLs vzporedno
      const signedResults = await Promise.all(
        uniqueResults.map(async (r, idx) => {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('uporabniski-profili')
            .createSignedUrl(r.audio_url, 3600);
          if (signedUrlError) {
            console.error('Napaka pri signed URL:', signedUrlError);
            return null;
          }
          return {
            letter: r.letter,
            word: r.target_word,
            wordIndex: idx,
            filename: r.audio_url.split('/').pop() || '',
            url: signedUrlData.signedUrl,
          };
        })
      );
      recordings = signedResults.filter((r): r is Recording => r !== null);
    }
  } else {
    // Za redno preverjanje: pridobi posnetke iz Storage
    let storagePath: string;

    if (session.source_type === 'logopedist' && session.logopedist_child_id && logopedistId) {
      storagePath = `logopedist-children/${logopedistId}/${session.logopedist_child_id}/Preverjanje-izgovorjave`;
    } else {
      storagePath = `${session.parent_id}/${session.child_id}/Preverjanje-izgovorjave`;
    }
    
    const sessionNumber = (session as any).session_number || 1;
    const targetFolder = `${storagePath}/Seja-${sessionNumber}`;
    
    const totalWords = session.total_words;
    
    console.log('Nalagam posnetke iz mape:', targetFolder, 'session_number:', sessionNumber, 'source_type:', session.source_type, 'total_words:', totalWords);

    const { data: files, error: filesError } = await supabase.storage
      .from('uporabniski-profili')
      .list(targetFolder);

    if (filesError) {
      console.error('Napaka pri pridobivanju posnetkov:', filesError);
    }

    if (files) {
      const audioFiles = files.filter(file => 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mp3') || 
        file.name.endsWith('.wav') ||
        file.name.endsWith('.m4a')
      );

      // Varnostna mreža: če je dejansko število datotek ≤ 20 in total_words = 60, uporabi wordsPerLetter=1
      const wordsPerLetter = (totalWords === 20 || (totalWords === 60 && audioFiles.length <= 20)) ? 1 : 3;
      console.log('wordsPerLetter:', wordsPerLetter, 'audioFiles:', audioFiles.length);

      const signedUrlPromises = audioFiles.map(async file => {
        const parsed = parseRecordingFilename(file.name, wordsPerLetter);
        if (!parsed) return null;

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('uporabniski-profili')
          .createSignedUrl(`${targetFolder}/${file.name}`, 3600);

        if (signedUrlError) {
          console.error('Napaka pri ustvarjanju signed URL:', signedUrlError);
          return null;
        }

        return {
          letter: parsed.letter,
          word: parsed.word,
          wordIndex: parsed.wordIndex,
          filename: file.name,
          url: signedUrlData.signedUrl,
        };
      });

      const results = await Promise.all(signedUrlPromises);
      recordings = results.filter((r): r is Recording => r !== null);
    }
  }

  // 5. Dedupliciraj posnetke - ohrani samo ZADNJI posnetek za vsak wordIndex
  const deduplicatedRecordings = new Map<number, Recording>();
  const sortedByTimestamp = [...recordings].sort((a, b) => 
    a.filename.localeCompare(b.filename)
  );
  sortedByTimestamp.forEach(recording => {
    deduplicatedRecordings.set(recording.wordIndex, recording);
  });
  const uniqueRecordings = Array.from(deduplicatedRecordings.values());

  // 6. Grupiraj posnetke po črkah
  const recordingsByLetter = new Map<string, Recording[]>();

  if (isAdditionalTest) {
    // Za dodatno preverjanje: uporabi črke iz dejanskih posnetkov
    uniqueRecordings.forEach(recording => {
      const letterRecordings = recordingsByLetter.get(recording.letter) || [];
      letterRecordings.push(recording);
      recordingsByLetter.set(recording.letter, letterRecordings);
    });
  } else {
    // Za redno preverjanje: inicializiraj vse črke iz PHONETIC_ORDER
    PHONETIC_ORDER.forEach(letter => recordingsByLetter.set(letter, []));
    uniqueRecordings.forEach(recording => {
      const letterRecordings = recordingsByLetter.get(recording.letter) || [];
      letterRecordings.push(recording);
      recordingsByLetter.set(recording.letter, letterRecordings);
    });
  }

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
      sourceType: (session.source_type as 'parent' | 'logopedist') || 'parent',
      logopedistChildId: session.logopedist_child_id || null,
      organizationId: session.organization_id || null,
      additionalAssignmentId: session.additional_assignment_id || null,
    },
    child: {
      name: childData.name,
      age: childData.age,
      gender: childData.gender,
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
  rating?: number,
  evaluatedBy?: string
): Promise<{ success: boolean; error?: string }> {
  const payload: Record<string, unknown> = {
    session_id: sessionId,
    letter: letter,
    selected_options: selectedOptions,
    comment: comment,
    rating: rating ?? null,
  };
  if (evaluatedBy) {
    payload.evaluated_by = evaluatedBy;
  }
  console.log('Saving evaluation:', { sessionId, letter, evaluatedBy });

  const { error } = await supabase
    .from('articulation_evaluations')
    .upsert(payload as any, { onConflict: 'session_id,letter' });

  if (error) {
    console.error('Napaka pri shranjevanju ocene:', error, { sessionId, letter, evaluatedBy });
    return { success: false, error: error.message };
  }

  console.log('Evaluation saved successfully:', { sessionId, letter });
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
