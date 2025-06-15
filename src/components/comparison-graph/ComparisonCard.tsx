
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComparisonCardProps {
  title: string;
  value: string;
  description: React.ReactNode;
  titleBgClass: string;
  titleBorderClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  valueTextClass: string;
}

export function ComparisonCard({
  title,
  value,
  description,
  titleBgClass,
  titleBorderClass,
  cardBgClass,
  cardBorderClass,
  valueTextClass,
}: ComparisonCardProps) {
  return (
    <div className="flex-1 w-full">
      <Card className={cn("text-center shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl h-full flex flex-col", cardBgClass, cardBorderClass)}>
        <div className="flex justify-center -mt-6">
          <div className={cn("px-4 py-1.5 rounded-full border-2 shadow-md", titleBgClass, titleBorderClass)}>
            <h3 className="text-sm sm:text-base font-extrabold text-gray-800 uppercase tracking-wider whitespace-nowrap">
              {title}
            </h3>
          </div>
        </div>
        <CardContent className="flex flex-col justify-center items-center flex-grow p-6 pt-4">
          <div className={cn("text-3xl sm:text-4xl font-extrabold leading-none", valueTextClass)}>
            {value}
          </div>
          <p className="text-sm text-gray-600 font-normal leading-snug mt-2 text-balance">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
