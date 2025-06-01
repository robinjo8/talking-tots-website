
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
        "group transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 h-full flex flex-col",
        "hover:scale-105 animate-fade-in bg-white dark:bg-dark-cloud/60",
        className
      )}
      style={{ animationDelay }}
    >
      <div className="p-6 bg-gradient-to-r from-app-blue/10 to-app-teal/10 rounded-t-2xl pb-4">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
            {icon}
          </div>
        </div>
      </div>
      <div className="p-6 pt-6 flex-grow text-center">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
