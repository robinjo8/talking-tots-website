
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the intended destination from state, or default to home page
  const from = (location.state as any)?.from || "/moja-stran";
  
  // If already authenticated, redirect to destination
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Prosimo, vnesite e-pošto in geslo.");
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Prijava uspešna!");
      console.log("Login successful, redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Napaka pri prijavi:", error);
      setError(error.message === "Invalid login credentials" 
        ? "Napačna e-pošta ali geslo." 
        : "Prišlo je do napake pri prijavi. Poskusite znova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Prijava" 
      subtitle="Dobrodošli nazaj! Vpišite se z vašim računom."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-pošta</Label>
            <Input
              id="email"
              type="email"
              placeholder="vnesite@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Geslo</Label>
              <Link 
                to="/reset-password" 
                className="text-xs text-dragon-green hover:underline"
              >
                Ste pozabili geslo?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Vnesite geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md text-base"
              required
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
          disabled={isLoading}
        >
          {isLoading ? "Prijavljanje..." : "Prijava"}
        </Button>
        
        <div className="text-sm text-center">
          Nimate računa?{" "}
          <Link to="/register" className="text-dragon-green hover:underline font-medium">
            Ustvarite ga zdaj
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
