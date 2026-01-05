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
import { useOAuthPopup } from "@/hooks/useOAuthPopup";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, isLoading: isGoogleLoading, error: googleError } = useOAuthPopup();

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle();
    if (success) {
      toast.success("Registracija uspešna!", {
        description: "Dobrodošli v TomiTalk!",
      });
      navigate("/");
    }
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
          emailRedirectTo: `${window.location.origin}/`,
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

        {/* Google prijava */}
        <Button
          type="button"
          variant="outline"
          className="w-full py-6 text-base font-medium"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Nadaljuj z Google
        </Button>

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

          {(error || googleError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || googleError}</AlertDescription>
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
