import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdminChartData } from '@/hooks/useAdminChartData';

export function TestsLineChart() {
  const { testsData, isLoading } = useAdminChartData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Statistika testov izgovorjave
          </CardTitle>
          <CardDescription>Število testov po dnevih</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Statistika testov izgovorjave
        </CardTitle>
        <CardDescription>Število testov po dnevih (zadnjih 30 dni)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={testsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}.${date.getMonth() + 1}.`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('sl-SI');
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="new" 
                name="Novi testi"
                stroke="hsl(var(--app-blue))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--app-blue))' }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                name="Zaključeni"
                stroke="hsl(var(--dragon-green))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--dragon-green))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
