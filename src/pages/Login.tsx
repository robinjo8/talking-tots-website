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
import { Separator } from "@/components/ui/separator";
import { GoogleOneTapButton } from "@/components/auth/GoogleOneTapButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const { checkRateLimit, recordFailedAttempt, recordSuccessfulLogin } = useAuthRateLimit();

  const handleGoogleSuccess = async () => {
    // Check if user is a logopedist - block access via regular login
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
          // Logopedist trying to use regular login - sign out and show error with link
          await supabase.auth.signOut();
          setError(
            <span className="flex flex-col items-center gap-2 text-center">
              <span>Za prijavo v portal uporabite spodnji gumb</span>
              <Link to="/admin/login" className="inline-block px-4 py-2 bg-app-blue text-white font-bold uppercase rounded-md hover:bg-app-blue/90 transition-colors">
                Za organizacije
              </Link>
            </span>
          );
          return;
        }
      }
    } catch (error) {
      console.error("Error checking logopedist status:", error);
    }
    
    toast.success("Prijava uspešna!");
    navigate("/");
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

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
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        recordFailedAttempt();
        throw error;
      }
      
      // Check if user is a logopedist - block access via regular login
      if (data.user) {
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
          // Logopedist trying to use regular login - sign out and show error with link
          await supabase.auth.signOut();
          setError(
            <span className="flex flex-col items-center gap-2 text-center">
              <span>Za prijavo v portal uporabite spodnji gumb</span>
              <Link to="/admin/login" className="inline-block px-4 py-2 bg-app-blue text-white font-bold uppercase rounded-md hover:bg-app-blue/90 transition-colors">
                Za organizacije
              </Link>
            </span>
          );
          setIsLoading(false);
          return;
        }
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
      <div className="mt-6 space-y-6">
        {/* Google One Tap prijava */}
        <GoogleOneTapButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              ali z e-pošto
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
            disabled={isLoading}
          >
            {isLoading ? "Prijavljanje..." : "Prijava"}
          </Button>
        </form>
        
        <div className="text-sm text-center">
          Nimate računa?{" "}
          <Link to="/register" className="text-dragon-green hover:underline font-medium">
            Ustvarite ga zdaj
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
