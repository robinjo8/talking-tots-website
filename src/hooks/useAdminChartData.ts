import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TestsDataPoint {
  date: string;
  new: number;
  pending: number;
  reviewed: number;
  completed: number;
}

interface DifficultiesDataPoint {
  name: string;
  value: number;
}

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export function useAdminChartData() {
  const [testsData, setTestsData] = useState<TestsDataPoint[]>([]);
  const [difficultiesData, setDifficultiesData] = useState<DifficultiesDataPoint[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all sessions for chart data
        const { data: sessions } = await supabase
          .from('articulation_test_sessions')
          .select('id, status, submitted_at, reviewed_at, completed_at, created_at')
          .order('created_at', { ascending: true });

        const allSessions = sessions || [];

        // Generate last 30 days data
        const last30Days: TestsDataPoint[] = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          // Count sessions for this specific date
          const newCount = allSessions.filter(s => {
            const created = s.submitted_at || s.created_at;
            return created && created.startsWith(dateStr);
          }).length;
          
          const pendingCount = allSessions.filter(s => {
            const created = s.submitted_at || s.created_at;
            return created && created.startsWith(dateStr) && s.status === 'pending';
          }).length;
          
          const reviewedCount = allSessions.filter(s => {
            return s.reviewed_at && s.reviewed_at.startsWith(dateStr);
          }).length;
          
          const completedCount = allSessions.filter(s => {
            return s.completed_at && s.completed_at.startsWith(dateStr);
          }).length;
          
          last30Days.push({
            date: dateStr,
            new: newCount,
            pending: pendingCount,
            reviewed: reviewedCount,
            completed: completedCount,
          });
        }
        
        setTestsData(last30Days);

        // Calculate status distribution for pie chart
        const pendingTotal = allSessions.filter(s => s.status === 'pending').length;
        const inReviewTotal = allSessions.filter(s => 
          (s.status === 'assigned' || s.status === 'in_review') && !s.reviewed_at && !s.completed_at
        ).length;
        const reviewedTotal = allSessions.filter(s => 
          (s.reviewed_at || s.status === 'completed') && !s.completed_at
        ).length;
        const completedTotal = allSessions.filter(s => !!s.completed_at).length;

        setStatusDistribution([
          { name: 'V čakanju', value: pendingTotal, color: 'hsl(var(--app-orange))' },
          { name: 'V pregledu', value: inReviewTotal, color: 'hsl(var(--app-blue))' },
          { name: 'Pregledano', value: reviewedTotal, color: 'hsl(280, 70%, 50%)' },
          { name: 'Zaključeno', value: completedTotal, color: 'hsl(var(--dragon-green))' },
        ]);

        // Fetch difficulties data from word results
        const { data: wordResults } = await supabase
          .from('articulation_word_results')
          .select('letter, logopedist_rating')
          .eq('logopedist_rating', 'incorrect');

        if (wordResults && wordResults.length > 0) {
          // Count by letter
          const letterCounts: Record<string, number> = {};
          wordResults.forEach((result) => {
            letterCounts[result.letter] = (letterCounts[result.letter] || 0) + 1;
          });

          // Convert to array and sort
          const sorted = Object.entries(letterCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          // Add "Ostalo" for remaining
          const topSum = sorted.reduce((acc, item) => acc + item.value, 0);
          const total = wordResults.length;
          if (total > topSum) {
            sorted.push({ name: 'Ostalo', value: total - topSum });
          }

          setDifficultiesData(sorted);
        } else {
          // Default mock data if no results
          setDifficultiesData([
            { name: 'R', value: 35 },
            { name: 'S/Š', value: 25 },
            { name: 'L', value: 15 },
            { name: 'Č/Ž', value: 10 },
            { name: 'Ostalo', value: 15 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Set default data on error
        setDifficultiesData([
          { name: 'R', value: 35 },
          { name: 'S/Š', value: 25 },
          { name: 'L', value: 15 },
          { name: 'Č/Ž', value: 10 },
          { name: 'Ostalo', value: 15 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { testsData, difficultiesData, statusDistribution, isLoading };
}
