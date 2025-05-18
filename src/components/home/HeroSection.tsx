
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type HeroSectionProps = {
  isVisible: boolean;
  onStartNow: () => void;
  onScrollToFeatures: () => void;
};

export function HeroSection({ isVisible, onStartNow, onScrollToFeatures }: HeroSectionProps) {
  return (
    <section className="pt-16 pb-16 relative w-full overflow-hidden">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-app-yellow/20 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-app-blue/20 rounded-full blur-3xl"></div>
      
      <div className="mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className={`${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} transition-all duration-700 ease-out max-w-2xl mx-auto md:mx-0 text-center md:text-left`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Naredimo govor <span className="text-gradient-rainbow">zabaven</span> – za male junake!
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl mx-auto md:mx-0">
            Tomi Talk otrokom pomaga pri učenju govora skozi igro z našim prijaznim zmajčkom Tomijem. Govorjenje še nikoli ni bilo tako zabavno!
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
            <Button 
              size="lg" 
              className="bg-dragon-green hover:bg-dragon-green/90 text-white rounded-full px-8"
              onClick={onStartNow}
            >
              Začni zdaj
            </Button>
            <Button 
              size="lg" 
              className="bg-app-blue hover:bg-app-blue/90 text-white rounded-full px-8"
            >
              <Play className="mr-2 h-4 w-4" /> Poglej demo
            </Button>
            <Button 
              size="lg" 
              className="bg-app-orange hover:bg-app-orange/90 text-white rounded-full px-8"
              onClick={onScrollToFeatures}
            >
              Raziskuj
            </Button>
          </div>
        </div>
        
        <div className={`relative ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} transition-all duration-700 ease-out delay-300`}>
          <div className="absolute w-full h-full bg-gradient-rainbow rounded-full blur-3xl opacity-20 scale-75"></div>
          <div className="animate-float relative">
            <img 
              alt="Tomi Talk Dragon Mascot" 
              className="w-4/5 md:w-full max-w-md mx-auto drop-shadow-xl" 
              src="/lovable-uploads/b4fcf93f-c3f9-45bc-8e24-9bc2f838587a.png" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
