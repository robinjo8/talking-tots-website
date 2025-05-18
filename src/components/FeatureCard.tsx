
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  className,
  delay = 0
}: FeatureCardProps) {
  const animationDelay = `${delay * 100}ms`;

  return (
    <div 
      className={cn(
        "group p-6 rounded-2xl flex flex-col items-center text-center transform transition-all duration-300",
        "hover:scale-105 animate-fade-in bg-white dark:bg-dark-cloud/60",
        "shadow-md hover:shadow-xl h-full",
        className
      )}
      style={{ animationDelay }}
    >
      <div className="mb-4 bg-light-cloud dark:bg-dark-cloud/80 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
