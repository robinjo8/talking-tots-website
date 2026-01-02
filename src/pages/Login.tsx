
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthRateLimit } from "@/hooks/useAuthRateLimit";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { checkRateLimit, recordFailedAttempt, recordSuccessfulLogin } = useAuthRateLimit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check rate limiting first
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setError(rateLimitCheck.message || "Preveč poskusov.");
      return;
    }
    
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
      
      if (error) {
        recordFailedAttempt();
        throw error;
      }
      
      recordSuccessfulLogin();
      toast.success("Prijava uspešna!");
      navigate("/");
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
