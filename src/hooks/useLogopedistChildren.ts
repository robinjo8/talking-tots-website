import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from 'sonner';

export interface LogopedistChild {
  id: string;
  logopedist_id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | null;
  avatar_url: string | null;
  birth_date: string | null;
  speech_difficulties: string[] | null;
  speech_difficulties_description: string | null;
  speech_development: Record<string, unknown> | null;
  notes: string | null;
  external_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateChildInput {
  name: string;
  age: number;
  gender?: 'male' | 'female';
  birth_date?: string;
  avatar_url?: string;
  speech_difficulties?: string[];
  speech_difficulties_description?: string;
  speech_development?: Record<string, string>;
  notes?: string;
  external_id?: string;
}

export interface UpdateChildInput extends Partial<CreateChildInput> {
  id: string;
}

export function useLogopedistChildren() {
  const { profile } = useAdminAuth();
  const queryClient = useQueryClient();

  const logopedistId = profile?.id;

  // Pridobi vse otroke logopeda
  const { data: children = [], isLoading, error, refetch } = useQuery({
    queryKey: ['logopedist-children', logopedistId],
    queryFn: async (): Promise<LogopedistChild[]> => {
      if (!logopedistId) return [];

      const { data, error } = await supabase
        .from('logopedist_children')
        .select('*')
        .eq('logopedist_id', logopedistId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }

      return (data || []) as LogopedistChild[];
    },
    enabled: !!logopedistId,
    staleTime: 30000,
  });

  // Dodaj otroka
  const createChild = useMutation({
    mutationFn: async (input: CreateChildInput) => {
      if (!logopedistId) throw new Error('Ni logopedist profila');

      const { data, error } = await supabase
        .from('logopedist_children')
        .insert({
          logopedist_id: logopedistId,
          name: input.name,
          age: input.age,
          gender: input.gender || null,
          birth_date: input.birth_date || null,
          avatar_url: input.avatar_url || null,
          speech_difficulties: input.speech_difficulties || null,
          speech_difficulties_description: input.speech_difficulties_description || null,
          speech_development: input.speech_development || null,
          notes: input.notes || null,
          external_id: input.external_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating child:', error);
        throw error;
      }

      return data as LogopedistChild;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logopedist-children'] });
      queryClient.invalidateQueries({ queryKey: ['logopedist-license'] });
      toast.success('Otrok uspešno dodan');
    },
    onError: (error: Error) => {
      if (error.message.includes('omejitev')) {
        toast.error('Dosežena omejitev otrok. Nadgradite licenco.');
      } else if (error.message.includes('licence')) {
        toast.error('Ni aktivne licence. Prosimo, aktivirajte licenco.');
      } else {
        toast.error('Napaka pri dodajanju otroka');
      }
    },
  });

  // Uredi otroka
  const updateChild = useMutation({
    mutationFn: async (input: UpdateChildInput) => {
      const { id, ...updates } = input;

      const { data, error } = await supabase
        .from('logopedist_children')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating child:', error);
        throw error;
      }

      return data as LogopedistChild;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logopedist-children'] });
      toast.success('Podatki otroka posodobljeni');
    },
    onError: () => {
      toast.error('Napaka pri posodabljanju');
    },
  });

  // Izbriši otroka (soft delete)
  const deleteChild = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase
        .from('logopedist_children')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', childId);

      if (error) {
        console.error('Error deleting child:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logopedist-children'] });
      queryClient.invalidateQueries({ queryKey: ['logopedist-license'] });
      toast.success('Otrok odstranjen');
    },
    onError: () => {
      toast.error('Napaka pri odstranjevanju');
    },
  });

  return {
    children,
    isLoading,
    error,
    refetch,
    createChild,
    updateChild,
    deleteChild,
  };
}

// Hook za posameznega otroka
export function useLogopedistChild(childId: string | undefined) {
  const { profile } = useAdminAuth();

  return useQuery({
    queryKey: ['logopedist-child', childId],
    queryFn: async (): Promise<LogopedistChild | null> => {
      if (!childId || !profile?.id) return null;

      const { data, error } = await supabase
        .from('logopedist_children')
        .select('*')
        .eq('id', childId)
        .eq('logopedist_id', profile.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching child:', error);
        return null;
      }

      return data as LogopedistChild;
    },
    enabled: !!childId && !!profile?.id,
  });
}
