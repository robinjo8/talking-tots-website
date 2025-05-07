
import { Link } from "react-router-dom";
import { UserProfile } from "@/components/auth/UserProfile";
import { Button } from "@/components/ui/button";
import { Settings, Users, FileText, BarChart3, Home } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="py-4 px-4 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" alt="Tomi the Dragon" className="h-8" />
            <span className="text-xl font-bold text-dragon-green">Admin Panel</span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Uporabniki
              </Button>
            </Link>
            <Link to="/admin?tab=content">
              <Button variant="ghost" size="sm" className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Vsebine
              </Button>
            </Link>
            <Link to="/admin?tab=analytics">
              <Button variant="ghost" size="sm" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analitika
              </Button>
            </Link>
            <Link to="/admin?tab=settings">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Nastavitve
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Aplikacija
            </Button>
          </Link>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
