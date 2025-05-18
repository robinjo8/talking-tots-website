
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NoChildSelected() {
  const { profile, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectChild = (childIndex: string) => {
    const index = parseInt(childIndex);
    setSelectedChildIndex(index);
    localStorage.setItem('selectedChildIndex', index.toString());
    toast.success(`Izbrali ste: ${profile?.children?.[index].name}`);
  };

  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-medium mb-2">Ni izbranega otroka</h3>
      <p className="text-muted-foreground mb-6">
        Prosimo, izberite otroka spodaj ali dodajte novega za prikaz personaliziranih vsebin.
      </p>
      
      {profile?.children && profile.children.length > 0 ? (
        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
          <Select onValueChange={handleSelectChild}>
            <SelectTrigger className="w-full border-dragon-green text-dragon-green">
              <SelectValue placeholder="Izberite otroka" />
            </SelectTrigger>
            <SelectContent>
              {profile.children.map((child, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="w-full border-dragon-green text-dragon-green hover:bg-dragon-green/10"
            onClick={() => navigate("/profile")}
          >
            <Users className="h-4 w-4 mr-2" />
            Upravljaj profile
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="border-dragon-green text-dragon-green hover:bg-dragon-green/10"
          onClick={() => navigate("/profile")}
        >
          <Users className="h-4 w-4 mr-2" />
          Dodaj novega otroka
        </Button>
      )}
    </div>
  );
}
