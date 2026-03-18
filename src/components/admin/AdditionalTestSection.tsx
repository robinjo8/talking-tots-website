import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Play, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';

interface AdditionalAssignment {
  id: string;
  status: string;
  created_at: string | null;
  completed_at: string | null;
  session_id: string | null;
  words: { id: string; word: string; image: string; letter: string | null; sort_order: number | null }[];
}

interface Props {
  childId: string;
}

export function AdditionalTestSection({ childId }: Props) {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['additional-assignments-detail', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('additional_test_assignments')
        .select('id, status, created_at, completed_at, session_id')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      // Fetch words for each assignment
      const ids = data.map(a => a.id);
      const { data: allWords } = await supabase
        .from('additional_test_words')
        .select('id, word, image, letter, sort_order, assignment_id')
        .in('assignment_id', ids)
        .order('sort_order', { ascending: true });

      return data.map(a => ({
        ...a,
        words: (allWords || []).filter(w => w.assignment_id === a.id),
      })) as AdditionalAssignment[];
    },
    enabled: !!childId,
  });

  // Fetch recordings for completed assignments
  const sessionIds = (assignments || []).filter(a => a.session_id).map(a => a.session_id!);
  const { data: sessionRecordings } = useQuery({
    queryKey: ['additional-session-recordings', sessionIds],
    queryFn: async () => {
      if (sessionIds.length === 0) return {};
      const { data } = await supabase
        .from('articulation_word_results')
        .select('session_id, target_word, audio_url, letter, logopedist_rating')
        .in('session_id', sessionIds);
      
      const grouped: Record<string, typeof data> = {};
      for (const r of data || []) {
        if (!grouped[r.session_id]) grouped[r.session_id] = [];
        grouped[r.session_id].push(r);
      }
      return grouped;
    },
    enabled: sessionIds.length > 0,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!assignments || assignments.length === 0) return null;

  const statusLabel = (s: string) => {
    switch (s) {
      case 'assigned': return { label: 'Dodeljeno', variant: 'secondary' as const };
      case 'in_progress': return { label: 'V teku', variant: 'default' as const };
      case 'completed': return { label: 'Zaključeno', variant: 'outline' as const };
      default: return { label: s, variant: 'secondary' as const };
    }
  };

  const getAudioUrl = (audioPath: string) => {
    const { data } = supabase.storage.from('posnetki').getPublicUrl(audioPath);
    return data?.publicUrl || '';
  };

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage.from('slike').getPublicUrl(imagePath);
    return data?.publicUrl || '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <CardTitle>Dodatno preverjanje</CardTitle>
        </div>
        <CardDescription>
          Dodeljene besede za dodatno preverjanje izgovorjave
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {assignments.map((assignment, index) => {
            const st = statusLabel(assignment.status);
            const date = assignment.created_at
              ? format(new Date(assignment.created_at), 'd. M. yyyy', { locale: sl })
              : '—';
            const recordings = assignment.session_id ? (sessionRecordings?.[assignment.session_id] || []) : [];
            const letters = [...new Set(assignment.words.map(w => w.letter).filter(Boolean))];

            return (
              <AccordionItem key={assignment.id} value={assignment.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>Dodatno preverjanje #{assignments.length - index}</span>
                    <span className="text-sm text-muted-foreground">— {date}</span>
                    <span className="text-sm text-muted-foreground">
                      ({assignment.words.length} besed)
                    </span>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {/* Letters */}
                    {letters.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-muted-foreground mr-1">Črke:</span>
                        {letters.map(l => (
                          <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Words grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {assignment.words.map(word => (
                        <div key={word.id} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                          <img
                            src={getImageUrl(word.image)}
                            alt={word.word}
                            className="w-8 h-8 object-cover rounded"
                            loading="lazy"
                          />
                          <span className="text-sm font-medium truncate">{word.word}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recordings if completed */}
                    {recordings.length > 0 && (
                      <div className="space-y-2 border-t pt-3">
                        <p className="text-sm font-medium text-muted-foreground">Posnetki:</p>
                        {recordings.map((rec, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg border">
                            <span className="text-sm font-medium min-w-[80px]">{rec.target_word}</span>
                            <audio
                              controls
                              preload="none"
                              className="h-8 flex-1"
                              src={getAudioUrl(rec.audio_url)}
                            />
                            {rec.logopedist_rating && rec.logopedist_rating !== 'unrated' && (
                              <Badge variant={rec.logopedist_rating === 'correct' ? 'default' : 'destructive'} className="text-xs">
                                {rec.logopedist_rating === 'correct' ? 'Pravilno' : rec.logopedist_rating === 'incorrect' ? 'Nepravilno' : rec.logopedist_rating}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {assignment.status === 'assigned' && (
                      <p className="text-sm text-muted-foreground italic">
                        Čaka na izvedbo s strani uporabnika.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}