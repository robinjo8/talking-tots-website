
export const FooterSectionComponent = () => {
  return (
    <footer className="py-8 px-4 md:py-10 md:px-6 lg:px-8 bg-light-cloud w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange">Talk</span>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-sm md:text-base">
          <a href="#" className="hover:text-dragon-green transition-colors">Politika zasebnosti</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Pogoji uporabe</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Kontaktirajte nas</a>
        </div>
        
        <div className="mt-4 md:mt-0 text-xs md:text-sm text-muted-foreground text-center">
          © 2025 Tomi Talk. Vse pravice pridržane.
        </div>
      </div>
    </footer>
  );
};
