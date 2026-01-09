import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { GoogleOneTapButton } from "@/components/auth/GoogleOneTapButton";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    
    // Validacija
    if (!username.trim()) {
      setError("Vnesite vaše ime in priimek");
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
            username: username.trim(),
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
      
      // Če je uporabnik ustvarjen in potrjen (brez email potrditve)
      if (data.user && data.session) {
        toast.success("Registracija uspešna!", {
          description: "Dobrodošli v TomiTalk!",
        });
        navigate("/");
      } else if (data.user && !data.session) {
        // Potrebna je email potrditev
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
    <AuthLayout title="" subtitle="">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Ustvarite račun</h1>
          <p className="text-muted-foreground">
            Pridružite se TomiTalk in pomagajte vašemu otroku
          </p>
        </div>

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

        {/* Email/geslo obrazec */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Ime in priimek</Label>
            <Input
              id="username"
              type="text"
              placeholder="Vnesite vaše ime in priimek"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md text-base"
              required
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="password">Geslo</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ustvarite geslo (vsaj 6 znakov)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md text-base"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Ponovite geslo</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Potrdite geslo"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md text-base"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
            disabled={isLoading}
          >
            {isLoading ? "Registracija..." : "Ustvari račun"}
          </Button>
        </form>

        <div className="text-sm text-center">
          Že imate račun?{" "}
          <Link to="/login" className="text-dragon-green hover:underline font-medium">
            Prijavite se
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
