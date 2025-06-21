
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export const FeatureItem = ({ icon, title, description, color }: FeatureItemProps) => {
  return (
    <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 md:p-10 h-full flex flex-col justify-between min-h-[320px] relative overflow-hidden border-0">
      {/* Icon Section */}
      <div className="flex items-center justify-center mb-6">
        <div className={cn("w-18 h-18 rounded-2xl flex items-center justify-center shadow-md", color)}>
          {icon}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="text-center flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-foreground line-clamp-2 py-[5px]">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
