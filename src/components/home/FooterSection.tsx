
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FooterSection() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-light-cloud">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and copyright section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
                alt="Tomi the Dragon" 
                className="h-8 w-8" 
              />
              <span className="text-xl font-extrabold text-dragon-green">Tomi</span>
              <span className="text-xl font-extrabold text-app-orange">Talk</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              © {currentYear} Tomi Talk.<br />
              Vse pravice pridržane.
            </p>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          
          {/* Links section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg mb-4">Pogoji uporabe</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Politika zasebnosti
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Pogoji uporabe
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dragon-green transition-colors">
                  Piškotki
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg mb-4">Kontaktirajte nas</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-dragon-green" />
                <span className="text-muted-foreground">info@tomitalk.si</span>
              </li>
              <li>
                <Link to="/contact" className="text-dragon-green hover:underline">
                  Kontaktni obrazec
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
