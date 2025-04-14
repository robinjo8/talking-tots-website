
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-dragon-green">Talking</span>
          <span className="text-2xl font-extrabold text-app-orange">Tots</span>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="font-medium hover:text-dragon-green transition-colors">Features</a>
            <a href="#cta" className="font-medium hover:text-dragon-green transition-colors">Get Started</a>
          </nav>
          
          <ThemeToggle />
          
          <Button className="bg-dragon-green hover:bg-dragon-green/90 text-white">
            Download App
          </Button>
        </div>
      </div>
    </header>
  );
}
