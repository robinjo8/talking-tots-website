import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";
import AnimatedBackground from "@/components/AnimatedBackground";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

export default function GovorneIgre() {
  return <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
    <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Breadcrumb - Desktop only */}
        <div className="hidden lg:block mb-6">
          <BreadcrumbNavigation />
        </div>
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Govorne igre
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        <GamesList />
      </div>
    </div>;
}