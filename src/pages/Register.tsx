
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { User, Lock, EyeOff, Eye } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Gesli se ne ujemata",
        description: "Prosimo, preverite gesli in poskusite znova.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData?.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            email,
            created_at: new Date().toISOString(),
          });
        
        if (profileError) {
          throw profileError;
        }
        
        toast({
          title: "Registracija uspešna",
          description: "Poslan vam je potrditveni e-mail. Prosimo, potrdite svoj račun.",
        });
        
        // Redirect to login page
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Prišlo je do napake pri registraciji.";
      
      if (error.message) {
        if (error.message.includes("already registered")) {
          errorMessage = "Ta e-poštni naslov je že registriran.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Napaka pri registraciji",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
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
                  <span className="text-dragon-green">Ustvari</span> 
                  <span className="text-app-orange"> račun</span>
                </h1>
                <p className="text-lg text-muted-foreground">Ustvarite nov uporabniški račun</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-medium">Uporabniško ime</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="username"
                      placeholder="uporabniško ime"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10 rounded-xl h-12 border-2 border-gray-200 focus:border-dragon-green"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">E-pošta</Label>
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
                  <Label htmlFor="password" className="text-base font-medium">Geslo</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-base font-medium">Potrdite geslo</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                      className="pl-10 pr-12 rounded-xl h-12 border-2 border-gray-200 focus:border-dragon-green"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showConfirmPassword ? (
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
                  className="w-full h-12 mt-2 text-base font-medium rounded-xl bg-gradient-to-r from-dragon-green to-app-blue hover:opacity-90 transition-all"
                >
                  {isLoading ? "Registracija..." : "Registracija"}
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-base text-muted-foreground">
                    Že imate račun?{" "}
                    <Link to="/login" className="text-app-orange font-medium hover:underline">
                      Prijava
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
