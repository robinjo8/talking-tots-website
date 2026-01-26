import { useAuth } from "@/contexts/AuthContext";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { WavyDivider } from "@/components/home/WavyDivider";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/hooks/useUserProgress";

export const MojeAplikacijeHero = () => {
  const { selectedChild } = useAuth();
  const { progressSummary, isLoading } = useUserProgress();
  
  const totalStars = progressSummary?.totalStars || 0;
  const targetStars = 100;
  const percentage = Math.min((totalStars / targetStars) * 100, 100);

  return (
    <section className="relative bg-dragon-green py-16 md:py-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>
        
        {/* Naslov & Podnaslov */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Izberi aktivnost
          </h1>
          <p className="text-xl text-white/90">
            Kaj bi rad danes vadil?
          </p>
        </div>
        
        {/* Mini Progress Bar */}
        {selectedChild && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-sm font-medium">Tvoj napredek</span>
                <span className="text-white font-bold text-sm">{totalStars}/{targetStars} ⭐</span>
              </div>
              <Progress 
                value={percentage} 
                className="h-3 bg-white/20"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* WavyDivider */}
      <WavyDivider color="white" position="bottom" />
    </section>
  );
};
