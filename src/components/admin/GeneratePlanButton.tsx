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

export function GeneratePlanButton({ reportId: propReportId, reportFileName, childId }: GeneratePlanButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [resolvedReportId, setResolvedReportId] = useState<string | null>(propReportId || null);

  useEffect(() => {
    async function checkPlan() {
      let rId = propReportId || null;

      if (!rId) {
        // Fallback: find report by exact pdf_url match
        const { data: reports } = await supabase
          .from('logopedist_reports')
          .select('id')
          .eq('pdf_url', reportFileName)
          .order('created_at', { ascending: false })
          .limit(1);

        rId = reports?.[0]?.id || null;
      }

      if (!rId) {
        setHasPlan(true); // No report record = hide button
        return;
      }

      setResolvedReportId(rId);

      // Check if this report already has an active plan
      const { data: plans } = await supabase
        .from('child_monthly_plans')
        .select('id')
        .eq('report_id', rId)
        .in('status', ['active', 'generating'])
        .limit(1);

      setHasPlan(plans && plans.length > 0);
    }

    checkPlan();
  }, [propReportId, reportFileName, childId]);

  if (hasPlan === null || hasPlan === true) return null;

  const handleGenerate = async () => {
    if (!resolvedReportId) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-monthly-plan', {
        body: { reportId: resolvedReportId, mode: 'report_update' },
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
