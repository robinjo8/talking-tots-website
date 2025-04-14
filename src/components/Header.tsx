
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="py-4 px-6 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
          <span className="text-2xl font-extrabold text-app-orange">Talk</span>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="font-medium hover:text-dragon-green transition-colors">Funkcije</a>
            <a href="#cta" className="font-medium hover:text-dragon-green transition-colors">Začni</a>
          </nav>
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm hidden md:inline-block">{user.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-sm"
              >
                Odjava
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-sm">
                  Prijava
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-dragon-green hover:bg-dragon-green/90 text-white text-sm">
                  Registracija
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
