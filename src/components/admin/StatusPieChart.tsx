import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdminStats } from '@/hooks/useAdminStats';

export function StatusPieChart() {
  const { stats, isLoading } = useAdminStats();
  
  // Build personal stats distribution for pie chart
  const statusDistribution = [
    { name: 'V obdelavi', value: stats.myInReviewCount, color: 'hsl(207, 90%, 54%)' },    // Modra
    { name: 'Pregledano', value: stats.myReviewedCount, color: 'hsl(280, 70%, 50%)' },    // Vijolična
    { name: 'Zaključeno', value: stats.myCompletedCount, color: 'hsl(122, 39%, 49%)' },   // Zelena
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Razdelitev statusov
          </CardTitle>
          <CardDescription>Trenutno stanje vseh preverjanj</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
        </CardContent>
      </Card>
    );
  }

  // Filter out zero values for better visualization
  const filteredData = statusDistribution.filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Moji pregledi
        </CardTitle>
        <CardDescription>Razdelitev mojih prevzetih primerov</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={true}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
