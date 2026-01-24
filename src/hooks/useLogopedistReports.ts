import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface LogopedistReport {
  id: string;
  logopedist_id: string;
  session_id: string | null;
  summary: string;
  findings: unknown;
  recommendations: string;
  next_steps: string;
  pdf_url: string;
  version: number;
  status: 'draft' | 'revised' | 'submitted';
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  child_name?: string;
  parent_name?: string;
}

export function useLogopedistReports() {
  const { profile } = useAdminAuth();

  return useQuery({
    queryKey: ['logopedist-reports', profile?.id],
    queryFn: async (): Promise<LogopedistReport[]> => {
      if (!profile?.id) return [];

      // First get the reports
      const { data: reports, error } = await supabase
        .from('logopedist_reports')
        .select('*')
        .eq('logopedist_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching logopedist reports:', error);
        throw error;
      }

      if (!reports || reports.length === 0) return [];

      // Get unique session IDs to fetch child/parent info
      const sessionIds = [...new Set(reports.map(r => r.session_id).filter(Boolean))] as string[];

      // If no sessions, return reports without child/parent info
      if (sessionIds.length === 0) {
        return reports.map(report => ({
          ...report,
          child_name: 'Neznano',
          parent_name: 'Neznano',
        }));
      }

      // Fetch sessions to get child_id and parent_id
      const { data: sessions } = await supabase
        .from('articulation_test_sessions')
        .select('id, child_id, parent_id')
        .in('id', sessionIds);

      if (!sessions || sessions.length === 0) {
        return reports.map(report => ({
          ...report,
          child_name: 'Neznano',
          parent_name: 'Neznano',
        }));
      }

      // Get unique child and parent IDs
      const childIds = [...new Set(sessions.map(s => s.child_id))];
      const parentIds = [...new Set(sessions.map(s => s.parent_id))];

      // Fetch children names
      const { data: children } = await supabase
        .from('children')
        .select('id, name')
        .in('id', childIds);

      // Fetch parent names
      const { data: parents } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', parentIds);

      // Create maps
      const sessionMap = new Map(sessions.map(s => [s.id, { child_id: s.child_id, parent_id: s.parent_id }]));
      const childMap = new Map(children?.map(c => [c.id, c.name]) || []);
      const parentMap = new Map(
        parents?.map(p => [p.id, [p.first_name, p.last_name].filter(Boolean).join(' ')]) || []
      );

      return reports.map(report => {
        const session = sessionMap.get(report.session_id || '');
        return {
          ...report,
          child_name: session ? childMap.get(session.child_id) || 'Neznano' : 'Neznano',
          parent_name: session ? parentMap.get(session.parent_id) || 'Neznano' : 'Neznano',
        };
      });
    },
    enabled: !!profile?.id,
  });
}

export function useCreateLogopedistReport() {
  const queryClient = useQueryClient();
  const { profile } = useAdminAuth();

  return useMutation({
    mutationFn: async (params: {
      session_id: string;
      summary?: string;
      findings?: Json;
      recommendations?: string;
      next_steps?: string;
      pdf_url?: string;
    }) => {
      if (!profile?.id) throw new Error('Logopedist profile not found');

      const { data, error } = await supabase
        .from('logopedist_reports')
        .insert([{
          logopedist_id: profile.id,
          session_id: params.session_id || '',
          summary: params.summary || '',
          findings: params.findings || {},
          recommendations: params.recommendations || '',
          next_steps: params.next_steps || '',
          pdf_url: params.pdf_url || '',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logopedist-reports'] });
    },
  });
}

export function useDeleteLogopedistReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('logopedist_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logopedist-reports'] });
    },
  });
}

export async function getReportFileUrl(pdfUrl: string): Promise<string | null> {
  if (!pdfUrl) return null;
  
  // If it's already a full URL, return it
  if (pdfUrl.startsWith('http')) return pdfUrl;
  
  // Otherwise, create a signed URL from storage
  const { data } = await supabase.storage
    .from('uporabniski-profili')
    .createSignedUrl(pdfUrl, 3600); // 1 hour

  return data?.signedUrl || null;
}