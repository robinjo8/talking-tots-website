import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'orange' | 'green' | 'purple';
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-app-blue/10',
    text: 'text-app-blue',
    border: 'border-app-blue/20',
  },
  orange: {
    bg: 'bg-app-orange/10',
    text: 'text-app-orange',
    border: 'border-app-orange/20',
  },
  green: {
    bg: 'bg-dragon-green/10',
    text: 'text-dragon-green',
    border: 'border-dragon-green/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
};

export function StatCard({ title, value, description, icon: Icon, color, onClick }: StatCardProps) {
  const classes = colorClasses[color];

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md border-l-4',
        classes.border,
        onClick && 'hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          <div className={cn('hidden md:flex h-12 w-12 rounded-full items-center justify-center', classes.bg)}>
            <Icon className={cn('h-6 w-6', classes.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
