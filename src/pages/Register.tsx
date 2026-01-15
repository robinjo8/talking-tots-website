import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { GoogleOneTapButton } from "@/components/auth/GoogleOneTapButton";
import { Eye, EyeOff, UserPlus, Home } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = () => {
    toast.success("Registracija uspešna!", {
      description: "Dobrodošli v TomiTalk!",
    });
    navigate("/");
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!firstName.trim()) {
      setError("Vnesite vaše ime");
      return;
    }
    
    if (!lastName.trim()) {
      setError("Vnesite vaš priimek");
      return;
    }
    
    if (!email.trim()) {
      setError("Vnesite e-poštni naslov");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Neveljaven format e-pošte");
      return;
    }
    
    if (password.length < 6) {
      setError("Geslo mora imeti vsaj 6 znakov");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Gesli se ne ujemata");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });
      
      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Ta e-poštni naslov je že registriran. Poskusite se prijaviti.");
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }
      
      if (data.user && data.session) {
        toast.success("Registracija uspešna!", {
          description: "Dobrodošli v TomiTalk!",
        });
        navigate("/");
      } else if (data.user && !data.session) {
        toast.success("Registracija uspešna!", {
          description: "Preverite svoj e-poštni nabiralnik za potrditev.",
        });
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Napaka pri registraciji");
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
            <CardTitle className="text-2xl">Ustvarite račun</CardTitle>
            <CardDescription>
              Pridružite se TomiTalk in pomagajte vašemu otroku
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

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ime</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Janez"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Priimek</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Novak"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Geslo</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Ponovite geslo</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ustvari račun
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
              Že imate račun?{' '}
              <Link to="/login" className="text-dragon-green hover:underline font-medium">
                Prijavite se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
