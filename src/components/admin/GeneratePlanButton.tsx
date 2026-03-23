import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GeneratePlanButtonProps {
  reportId?: string;
  reportFileName: string;
  childId?: string;
}

export function GeneratePlanButton({ reportFileName, childId }: GeneratePlanButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    async function checkPlan() {
      // Find report by pdf_url matching the file name
      const { data: reports } = await supabase
        .from('logopedist_reports')
        .select('id')
        .ilike('pdf_url', `%${reportFileName}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      const report = reports?.[0];
      if (!report) {
        setHasPlan(true); // No report record = hide button
        return;
      }

      setReportId(report.id);

      // Check if this report already has an active plan
      const { data: plans } = await supabase
        .from('child_monthly_plans')
        .select('id')
        .eq('report_id', report.id)
        .in('status', ['active', 'generating'])
        .limit(1);

      setHasPlan(plans && plans.length > 0);
    }

    checkPlan();
  }, [reportFileName, childId]);

  if (hasPlan === null || hasPlan === true) return null;

  const handleGenerate = async () => {
    if (!reportId) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-monthly-plan', {
        body: { reportId },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Osebni načrt uspešno generiran');
      setHasPlan(true);
    } catch (err) {
      console.error('Plan generation failed:', err);
      toast.error('Napaka pri generiranju načrta');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
      title="Generiraj osebni načrt"
      className="text-primary border-primary/30 hover:bg-primary/10"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Calendar className="h-4 w-4" />
      )}
    </Button>
  );
}
