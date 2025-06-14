
export const FooterSection = () => {
  return (
    <footer className="py-8 md:py-10 px-4 md:px-10 bg-light-cloud w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange">Talk</span>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center">
          <a href="#" className="hover:text-dragon-green transition-colors">Politika zasebnosti</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Pogoji uporabe</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Kontaktirajte nas</a>
        </div>
        
        <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
          © 2025 Tomi Talk. Vse pravice pridržane.
        </div>
      </div>
    </footer>
  );
};
