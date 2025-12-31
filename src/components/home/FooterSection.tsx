import { Link } from "react-router-dom";

export const FooterSection = () => {
  return (
    <footer className="py-10 px-4 md:px-10 bg-light-cloud w-full">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange">Talk</span>
        </div>
        
        {/* Footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* MOJE APLIKACIJE */}
          <div>
            <h4 className="font-bold text-foreground mb-4">MOJE APLIKACIJE</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/moji-izzivi" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Moji izzivi
                </Link>
              </li>
              <li>
                <Link to="/govorne-igre" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Govorne igre
                </Link>
              </li>
              <li>
                <Link to="/govorno-jezikovne-vaje" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Govorne vaje
                </Link>
              </li>
              <li>
                <Link to="/artikulacijski-test" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Test izgovorjave
                </Link>
              </li>
            </ul>
          </div>
          
          {/* SLEDI NAM */}
          <div>
            <h4 className="font-bold text-foreground mb-4">SLEDI NAM</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-dragon-green transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-dragon-green transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-dragon-green transition-colors"
                >
                  Tiktok
                </a>
              </li>
            </ul>
          </div>
          
          {/* VEČ */}
          <div>
            <h4 className="font-bold text-foreground mb-4">VEČ</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://tomitalk.si" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-dragon-green transition-colors"
                >
                  Tomitalk.si
                </a>
              </li>
              <li>
                <Link to="/za-posameznike" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Za posameznike
                </Link>
              </li>
              <li>
                <Link to="/za-podjetja" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Za podjetja
                </Link>
              </li>
              <li>
                <Link to="/video-navodila" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Video navodila
                </Link>
              </li>
              <li>
                <Link to="/logopedski-koticek" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Logopedski nasveti
                </Link>
              </li>
              <li>
                <Link to="/pomoc-in-podpora" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Pomoč in podpora
                </Link>
              </li>
            </ul>
          </div>
          
          {/* POGOJI IN ZASEBNOST */}
          <div>
            <h4 className="font-bold text-foreground mb-4">POGOJI IN ZASEBNOST</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/splosni-pogoji" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Splošni pogoji
                </Link>
              </li>
              <li>
                <Link to="/politika-zasebnosti" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Politika zasebnosti
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 Tomi Talk. Vse pravice pridržane.
        </div>
      </div>
    </footer>
  );
};
