
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export const FeatureItem = ({ icon, title, description, color }: FeatureItemProps) => {
  return (
    <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between min-h-[280px] relative overflow-hidden border-0">
      {/* Icon Section */}
      <div className="flex items-center justify-center mb-5">
        <div className={cn("w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-md", color)}>
          <div className="text-white [&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-10 md:[&>svg]:h-10">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="text-center flex-grow flex flex-col justify-center">
        <div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 leading-tight text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg lg:text-xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
