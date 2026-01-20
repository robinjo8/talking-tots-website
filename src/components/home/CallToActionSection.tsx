
import { Button } from "@/components/ui/button";

export const CallToActionSection = () => {
  return (
    <section id="cta" className="py-8 md:py-14 px-4 md:px-10 bg-white relative overflow-hidden w-full">
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-app-teal/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-orange/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center text-center lg:text-left gap-8 lg:gap-16">
          {/* Dragon Image - shown first on mobile, right on desktop */}
          <div className="lg:order-last flex-shrink-0">
            <div className="relative w-44 h-44 md:w-52 md:h-52">
              <div className="relative w-full h-full">
                <img
                  alt="Tomi Talk Dragon Mascot"
                  className="w-full h-full object-contain"
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_naslovna_1.webp"
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">STE PRIPRAVLJENI NA GOVORNO AVANTURO?</h2>
            <p className="text-xl text-muted-foreground mb-4 md:mb-8 max-w-2xl mx-auto">
              Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full w-full sm:w-auto px-8"
                onClick={() => {
                  const gamesSection = document.getElementById('govorne-igre');
                  if (gamesSection) {
                    gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.href = '/govorne-igre';
                  }
                }}
              >
                Pojdi na igre
              </Button>
              <Button 
                size="lg" 
                className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full w-full sm:w-auto px-8"
                onClick={() => {
                  const exercisesSection = document.getElementById('govorno-jezikovne-vaje');
                  if (exercisesSection) {
                    exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.href = '/govorno-jezikovne-vaje';
                  }
                }}
              >
                Pojdi na vaje
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
