
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const CTASectionComponent = () => {
  const isMobile = useIsMobile();

  return (
    <section id="cta" className="py-12 px-4 md:py-20 md:px-6 lg:px-8 relative overflow-hidden w-full">
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-app-teal/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-orange/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Mobile Layout with Dragon - Better spacing */}
        {isMobile && (
          <div className="bg-white shadow-xl rounded-3xl p-6 text-center relative overflow-hidden mx-2">
            <h2 className="text-xl font-bold mb-3 px-2">Ste pripravljeni na govorno avanturo?</h2>
            <p className="text-sm text-muted-foreground mb-6 px-2">
              Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
            </p>
            
            {/* Dragon for mobile - Better sizing */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
              <div className="animate-float relative">
                <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain" src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png" />
              </div>
            </div>
            
            {/* Mobile buttons - Better spacing */}
            <div className="flex flex-col gap-3 px-2">
              <Button size="lg" className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full">
                Prenos za iOS
              </Button>
              <Button size="lg" className="w-full bg-app-blue hover:bg-app-blue/90 text-white rounded-full">
                Prenos za Android
              </Button>
            </div>
          </div>
        )}
        
        {/* Desktop Layout with Dragon */}
        {!isMobile && (
          <div className="bg-white shadow-xl rounded-3xl p-12 relative overflow-hidden">
            <div className="flex items-center justify-between gap-12">
              {/* Left side - Text content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ste pripravljeni na govorno avanturo?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full">
                    Prenos za iOS
                  </Button>
                  <Button size="lg" className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full">
                    Prenos za Android
                  </Button>
                </div>
              </div>
              
              {/* Right side - Dragon */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                  <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
                  <div className="animate-float relative">
                    <img alt="Tomi Talk Dragon Mascot" className="w-full h-full object-contain" src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
