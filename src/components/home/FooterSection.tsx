
export function FooterSection() {
  return (
    <footer className="py-8 md:py-12 px-4 sm:px-6 md:px-10 bg-light-cloud border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <img 
            src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
            alt="Tomi the Dragon" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange">Talk</span>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center mb-6 md:mb-0">
          <a href="#" className="hover:text-dragon-green transition-colors">Politika zasebnosti</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Pogoji uporabe</a>
          <a href="#" className="hover:text-dragon-green transition-colors">Kontaktirajte nas</a>
        </div>
        
        <div className="text-sm text-muted-foreground">
          © 2025 Tomi Talk. Vse pravice pridržane.
        </div>
      </div>
    </footer>
  );
}
