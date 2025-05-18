
import { Button } from "@/components/ui/button";

export function CallToActionSection() {
  return (
    <section id="cta" className="py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden mb-16">
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-app-teal/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-app-orange/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-12 text-center relative z-10 border border-gray-100">
        <div className="absolute -top-10 right-10 hidden md:block">
          <img 
            src="/lovable-uploads/3fd65e0b-3bbc-4a9e-a4e4-77fb47e6a0a5.png" 
            alt="Tomi Dragon" 
            className="h-24 w-24 object-contain animate-bounce-gentle"
          />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ste pripravljeni na govorno avanturo?</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Prenesite Tomi Talk danes in opazujte, kako komunikacijske veščine vašega otroka cvetijo!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full px-8">
            Prenos za iOS
          </Button>
          <Button size="lg" className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full px-8">
            Prenos za Android
          </Button>
        </div>
      </div>
    </section>
  );
}
