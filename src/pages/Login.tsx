import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthRateLimit } from "@/hooks/useAuthRateLimit";
import { Separator } from "@/components/ui/separator";
import { GoogleOneTapButton } from "@/components/auth/GoogleOneTapButton";
import { Eye, EyeOff, LogIn, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const { checkRateLimit, recordFailedAttempt, recordSuccessfulLogin } = useAuthRateLimit();

  const handleGoogleSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
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
      
      if (data.user) {
        const { data: logopedistProfile } = await supabase
          .from('logopedist_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        if (logopedistProfile) {
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
      if (error.message === "Invalid login credentials") {
        setError("Napačna e-pošta ali geslo.");
      } else if (error.message?.includes("Email not confirmed")) {
        setError("Prosimo, najprej potrdite vaš e-poštni naslov. Preverite svoj e-poštni nabiralnik.");
      } else {
        setError("Prišlo je do napake pri prijavi. Poskusite znova.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dragon-green/10 via-background to-dragon-green/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-3xl font-extrabold text-app-orange uppercase">Talk</span>
          </div>
          <p className="text-lg text-dragon-green font-semibold">Portal za starše</p>
        </div>

        <Card className="border-dragon-green/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Prijava</CardTitle>
            <CardDescription>
              Dobrodošli nazaj! Vpišite se z vašim računom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google One Tap prijava */}
            <div className="mb-4">
              <GoogleOneTapButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
              />
            </div>

            <div className="relative mb-4">
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
              <div className="space-y-2">
                <Label htmlFor="email">E-pošta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas.email@primer.si"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-dragon-green hover:bg-dragon-green/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Prijava
                  </>
                )}
              </Button>

              <Link 
                to="/" 
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-white text-black rounded-md border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                Nazaj na začetno stran
              </Link>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Nimate računa?{' '}
              <Link to="/register" className="text-dragon-green hover:underline font-medium">
                Ustvarite ga zdaj
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
