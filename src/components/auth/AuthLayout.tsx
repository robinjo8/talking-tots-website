
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-white">
      <header className="py-4 px-6 md:px-10 w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-8 md:h-10"
            />
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
              <span className="text-2xl font-extrabold text-app-orange">Talk</span>
            </div>
          </Link>
        </div>
      </header>
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-lg mt-16 border border-gray-100">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img 
              src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
              alt="Tomi the Dragon" 
              className="h-14 w-14 animate-bounce-gentle"
            />
          </div>
          <h1 className="text-3xl font-bold text-gradient-rainbow">{title}</h1>
          {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
