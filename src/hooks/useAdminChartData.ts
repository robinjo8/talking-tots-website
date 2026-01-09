import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TestsDataPoint {
  date: string;
  new: number;
  completed: number;
}

interface DifficultiesDataPoint {
  name: string;
  value: number;
}

export function useAdminChartData() {
  const [testsData, setTestsData] = useState<TestsDataPoint[]>([]);
  const [difficultiesData, setDifficultiesData] = useState<DifficultiesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Generate last 30 days of mock data for now
        // In production, this would query actual data
        const last30Days: TestsDataPoint[] = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          last30Days.push({
            date: date.toISOString().split('T')[0],
            new: Math.floor(Math.random() * 10) + 1,
            completed: Math.floor(Math.random() * 8),
          });
        }
        
        setTestsData(last30Days);

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

  return { testsData, difficultiesData, isLoading };
}
