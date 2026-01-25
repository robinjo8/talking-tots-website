import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdminChartData } from '@/hooks/useAdminChartData';

interface LineConfig {
  key: string;
  name: string;
  color: string;
  enabled: boolean;
}

export function TestsLineChart() {
  const { testsData, isLoading } = useAdminChartData();
  
  const [lines, setLines] = useState<LineConfig[]>([
    { key: 'new', name: 'Nova preverjanja', color: 'hsl(var(--app-blue))', enabled: true },
    { key: 'pending', name: 'V čakanju', color: 'hsl(var(--app-orange))', enabled: true },
    { key: 'reviewed', name: 'Pregledano', color: 'hsl(280, 70%, 50%)', enabled: false },
    { key: 'completed', name: 'Zaključeno', color: 'hsl(var(--dragon-green))', enabled: false },
  ]);

  const toggleLine = (key: string) => {
    setLines(prev => prev.map(line => 
      line.key === key ? { ...line, enabled: !line.enabled } : line
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Statistika preverjanj izgovorjave
          </CardTitle>
          <CardDescription>Število preverjanj po dnevih</CardDescription>
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
          📊 Statistika preverjanj izgovorjave
        </CardTitle>
        <CardDescription>Število preverjanj po dnevih (zadnjih 30 dni)</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Line toggles */}
        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
          {lines.map((line) => (
            <div key={line.key} className="flex items-center space-x-2">
              <Checkbox
                id={`line-${line.key}`}
                checked={line.enabled}
                onCheckedChange={() => toggleLine(line.key)}
              />
              <Label 
                htmlFor={`line-${line.key}`}
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: line.color }}
                />
                {line.name}
              </Label>
            </div>
          ))}
        </div>

        <div className="h-[250px]">
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
              {lines.filter(l => l.enabled).map((line) => (
                <Line 
                  key={line.key}
                  type="monotone" 
                  dataKey={line.key} 
                  name={line.name}
                  stroke={line.color} 
                  strokeWidth={2}
                  dot={{ fill: line.color }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
