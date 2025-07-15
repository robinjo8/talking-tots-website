import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SequentialCardProps {
  number: number;
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const SequentialCard = ({ 
  number, 
  isLocked, 
  isCompleted, 
  isActive, 
  onClick 
}: SequentialCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "relative aspect-square w-full rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-lg font-bold",
        "hover:scale-105 active:scale-95",
        {
          // Locked state
          "bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed hover:scale-100": isLocked,
          // Completed state
          "bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200": isCompleted,
          // Active/available state
          "bg-primary/10 border-primary text-primary hover:bg-primary/20": isActive && !isCompleted && !isLocked,
          // Default available state
          "bg-secondary border-border text-foreground hover:bg-secondary/80": !isActive && !isCompleted && !isLocked,
        }
      )}
    >
      {isLocked && (
        <Lock className="h-5 w-5 text-muted-foreground" />
      )}
      {isCompleted && (
        <img 
          src="/lovable-uploads/bfe0cdb1-b9d1-427e-93fa-2711a0d6bfbb.png" 
          alt="Completed" 
          className="h-16 w-16 object-contain"
        />
      )}
      {!isLocked && !isCompleted && (
        <span>{number}</span>
      )}
      
      {/* Glow effect for active card */}
      {isActive && !isCompleted && !isLocked && (
        <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />
      )}
    </button>
  );
};