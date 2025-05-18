
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

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
        {user ? (
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Vrnitev na domačo stran
          </Link>
        ) : (
          <div className="space-y-2">
            <Link to="/" className="text-blue-500 hover:text-blue-700 underline block">
              Vrnitev na domačo stran
            </Link>
            <Link to="/login" className="text-blue-500 hover:text-blue-700 underline block">
              Prijava
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
