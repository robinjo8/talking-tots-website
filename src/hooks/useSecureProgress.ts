
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProgressEntry {
  id: string;
  child_id: string;
  exercise_id: string;
  score: number;
  completed_at: string;
  duration: number;
  correct_answers: number;
  total_questions: number;
}

export const useSecureProgress = (childId?: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch progress for a specific child
  const fetchProgress = async (targetChildId?: string) => {
    if (!user || !targetChildId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('child_id', targetChildId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      setProgress(data || []);
    } catch (err: any) {
      console.error("Error fetching progress:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save new progress entry
  const saveProgress = async (progressData: Omit<ProgressEntry, 'id' | 'completed_at'>) => {
    if (!user) {
      toast.error("Morate biti prijavljeni");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('progress')
        .insert({
          ...progressData,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Napredek je bil uspešno shranjen");
      
      // Refresh progress list if we're tracking the same child
      if (childId === progressData.child_id) {
        await fetchProgress(childId);
      }

      return data;
    } catch (err: any) {
      console.error("Error saving progress:", err);
      toast.error("Napaka pri shranjevanju napredka: " + err.message);
      return null;
    }
  };

  // Delete progress entry
  const deleteProgress = async (progressId: string) => {
    if (!user) {
      toast.error("Morate biti prijavljeni");
      return false;
    }

    try {
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('id', progressId);

      if (error) throw error;

      toast.success("Napredek je bil uspešno izbrisan");
      
      // Refresh progress list
      if (childId) {
        await fetchProgress(childId);
      }

      return true;
    } catch (err: any) {
      console.error("Error deleting progress:", err);
      toast.error("Napaka pri brisanju napredka: " + err.message);
      return false;
    }
  };

  // Auto-fetch progress when childId changes
  useEffect(() => {
    if (childId) {
      fetchProgress(childId);
    }
  }, [childId, user]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    saveProgress,
    deleteProgress,
    refreshProgress: () => fetchProgress(childId)
  };
};
