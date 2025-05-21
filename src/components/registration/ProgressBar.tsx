
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          Korak {currentStep} od {totalSteps}
        </h3>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
