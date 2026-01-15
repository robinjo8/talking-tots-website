import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  
  // Preveri ali je uporabnik na admin poti
  const isAdminRoute = location.pathname.startsWith('/admin');
  const homeUrl = isAdminRoute ? '/admin' : '/';
  const homeLabel = isAdminRoute ? 'Vrnitev na admin portal' : 'Vrnitev na domačo stran';

  useEffect(() => {
    console.error(
      "404 Napaka: Uporabnik je poskušal dostopati do neobstoječe poti:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Ups! Stran ni bila najdena</p>
        <Link 
          to={homeUrl} 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 underline"
        >
          <Home className="h-4 w-4" />
          {homeLabel}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
