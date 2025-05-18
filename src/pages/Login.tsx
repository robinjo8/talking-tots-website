
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to: /");
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Napaka pri prijavi",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Uspešna prijava",
        description: "Dobrodošli nazaj!",
      });
      
      // Redirect to homepage after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Napaka pri prijavi",
        description: "Preverite podatke in poskusite znova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img 
                    src="/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png" 
                    alt="Tomi the Dragon" 
                    className="h-16 w-16 animate-bounce-gentle" 
                  />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="text-dragon-green">Dobrodošel</span> 
                  <span className="text-app-orange"> nazaj!</span>
                </h1>
                <p className="text-lg text-muted-foreground">Vnesite svoje podatke za prijavo</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoading}
                      required
                      className="pl-10 rounded-xl h-12 border-2 border-gray-200 focus:border-dragon-green"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base font-medium">Geslo</Label>
                    <Link
                      to="/reset-password"
                      className="text-sm text-app-blue hover:text-app-blue/80 hover:underline font-medium"
                    >
                      Ste pozabili geslo?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                      className="pl-10 pr-12 rounded-xl h-12 border-2 border-gray-200 focus:border-dragon-green"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button 
                  disabled={isLoading} 
                  type="submit"
                  className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-dragon-green to-app-blue hover:opacity-90 transition-all"
                >
                  {isLoading ? "Prijavljanje..." : "Prijava"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-base text-muted-foreground">
                  Nimate računa?{" "}
                  <Link to="/register" className="text-app-orange font-medium hover:underline">
                    Registracija
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
