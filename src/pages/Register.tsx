import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserX } from "lucide-react";

const avatarOptions = [
  { id: 0, src: "", alt: "Brez avatarja" },
  { id: 1, src: "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", alt: "Zmajček s srčastimi očali" },
  { id: 2, src: "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", alt: "Zmajček s knjigo" },
  { id: 3, src: "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", alt: "Zmajček s slušalkami" },
  { id: 4, src: "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", alt: "Zmajček z rumeno kapo" },
  { id: 5, src: "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", alt: "Zmajček z rumeno knjigo" },
  { id: 6, src: "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", alt: "Zmajček s pentljo" },
  { id: 7, src: "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", alt: "Zmajček z oranžnimi očali" },
  { id: 8, src: "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", alt: "Zmajček z rumenimi slušalkami" },
  { id: 9, src: "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", alt: "Zmajček s paleto in čopičem" },
  { id: 10, src: "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", alt: "Zmajček s srčastimi očali" },
  { id: 11, src: "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", alt: "Zmajček z rdečo knjigo" },
  { id: 12, src: "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", alt: "Zmajček z mikrofonom" },
  { id: 13, src: "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", alt: "Zmajček z očali" },
  { id: 14, src: "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", alt: "Zmajček z rdečo kapo" },
  { id: 15, src: "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png", alt: "Zmajček z žogo" },
];

interface ChildProfile {
  id: string;
  name: string;
  gender: string;
  avatarId: number;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: crypto.randomUUID(), name: "", gender: "M", avatarId: 1 }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !email || !password || !confirmPassword) {
      setError("Prosimo, izpolnite vsa obvezna polja.");
      return;
    }
    
    if (username.length < 3) {
      setError("Uporabniško ime mora vsebovati vsaj 3 znake.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Gesli se ne ujemata.");
      return;
    }
    
    if (password.length < 6) {
      setError("Geslo mora vsebovati vsaj 6 znakov.");
      return;
    }
    
    const validChildren = children.filter(child => child.name.trim() !== "");
    if (validChildren.length === 0) {
      setError("Dodajte vsaj enega otroka s podatki.");
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            children: validChildren.map(child => ({
              name: child.name,
              gender: child.gender,
              avatarId: child.avatarId
            }))
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registracija uspešna! Preverite vašo e-pošto za potrditev računa.");
      navigate("/login");
    } catch (error: any) {
      console.error("Napaka pri registraciji:", error);
      if (error.message.includes("email")) {
        setError("E-poštni naslov je že v uporabi ali ni veljaven.");
      } else {
        setError("Prišlo je do napake pri registraciji. Poskusite znova.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addChild = () => {
    setChildren([
      ...children,
      { id: crypto.randomUUID(), name: "", gender: "M", avatarId: 1 }
    ]);
  };

  const removeChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    } else {
      toast.error("Potreben je vsaj en otrok.");
    }
  };

  const updateChildField = (id: string, field: keyof ChildProfile, value: any) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  return (
    <AuthLayout 
      title="Ustvarite račun" 
      subtitle="Registrirajte se in začnite uporabljati aplikacijo."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Uporabniško ime</Label>
            <Input
              id="username"
              type="text"
              placeholder="Izberite uporabniško ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md text-base"
              required
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Geslo</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ustvarite geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md text-base"
              required
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
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Podatki o otrocih</h3>
          
          <div className="space-y-6">
            {children.map((child, index) => (
              <div key={child.id} className="p-4 border rounded-lg bg-sky-50/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Otrok {index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeChild(child.id)}
                    className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`child-name-${child.id}`}>Ime otroka</Label>
                    <Input
                      id={`child-name-${child.id}`}
                      value={child.name}
                      onChange={(e) => updateChildField(child.id, "name", e.target.value)}
                      placeholder="Vnesite ime otroka"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Spol</Label>
                    <RadioGroup 
                      value={child.gender} 
                      onValueChange={(value) => updateChildField(child.id, "gender", value)}
                      className="flex space-x-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id={`gender-m-${child.id}`} />
                        <Label htmlFor={`gender-m-${child.id}`} className="cursor-pointer">M</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ž" id={`gender-f-${child.id}`} />
                        <Label htmlFor={`gender-f-${child.id}`} className="cursor-pointer">Ž</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id={`gender-n-${child.id}`} />
                        <Label htmlFor={`gender-n-${child.id}`} className="cursor-pointer">Ne želim izbrati</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label>Izberi avatarja</Label>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      {avatarOptions.map(avatar => (
                        <div 
                          key={avatar.id}
                          onClick={() => updateChildField(child.id, "avatarId", avatar.id)}
                          className={`cursor-pointer rounded-lg p-2 transition-all flex items-center justify-center ${
                            child.avatarId === avatar.id 
                              ? 'bg-dragon-green/20 ring-2 ring-dragon-green' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {avatar.id === 0 ? (
                            <div className="h-[120px] w-[120px] rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                              <UserX className="h-10 w-10 text-gray-400" />
                              <span className="sr-only">{avatar.alt}</span>
                            </div>
                          ) : (
                            <Avatar className="h-[120px] w-[120px]">
                              <AvatarImage src={avatar.src} alt={avatar.alt} className="object-contain" />
                              <AvatarFallback className="text-xs text-center p-1">
                                {avatar.alt.substring(0, 10)}...
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={addChild}
            className="mt-4 border-dragon-green text-dragon-green hover:bg-dragon-green/10 w-full"
          >
            Dodaj otroka
          </Button>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
          disabled={isLoading}
        >
          {isLoading ? "Ustvarjanje računa..." : "Registracija"}
        </Button>
        
        <div className="text-sm text-center">
          Že imate račun?{" "}
          <Link to="/login" className="text-dragon-green hover:underline font-medium">
            Prijavite se
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
