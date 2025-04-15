
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { Shield, User } from "lucide-react";

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(profile?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load existing profile data
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setUsername(data.username || "");
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju profila:", error);
        toast.error("Napaka pri nalaganju podatkov profila");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Profil uspešno posodobljen");
    } catch (error) {
      console.error("Napaka pri posodabljanju profila:", error);
      toast.error("Napaka pri posodabljanju profila");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Novi gesli se ne ujemata");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Geslo mora vsebovati vsaj 6 znakov");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      toast.success("Geslo uspešno posodobljeno");
    } catch (error) {
      console.error("Napaka pri posodabljanju gesla:", error);
      setPasswordError("Napaka pri posodabljanju gesla");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto pt-28 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <User className="h-6 w-6 text-dragon-green" />
          Moj profil
        </h1>
        
        <div className="grid gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Osebni podatki</CardTitle>
              <CardDescription>Posodobi svoje podatke</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-pošta</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">E-pošte ni mogoče spremeniti</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Uporabniško ime</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Vnesi uporabniško ime"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ime</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Vnesi ime"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Priimek</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Vnesi priimek"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-dragon-green hover:bg-dragon-green/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Posodabljanje..." : "Posodobi profil"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-app-orange" />
                Spremeni geslo
              </CardTitle>
              <CardDescription>Posodobi svoje geslo za varnost računa</CardDescription>
            </CardHeader>
            
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Novo geslo</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Vnesi novo geslo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Potrdi novo geslo</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ponovi novo geslo"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Posodabljanje..." : "Spremeni geslo"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
