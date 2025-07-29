
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function NoChildSelected() {
  const { profile, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleConfirmSelection = () => {
    if (selectedIndex !== null) {
      setSelectedChildIndex(selectedIndex);
      localStorage.setItem('selectedChildIndex', selectedIndex.toString());
    }
  };

  if (!profile?.children?.length) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Nimate še nobenega otroškega profila</h2>
        <p className="text-muted-foreground mb-8">Za začetek dodajte profil otroka v nastavitvah.</p>
        <Button 
          onClick={() => navigate("/profile")}
          className="bg-dragon-green hover:bg-dragon-green/90"
        >
          Dodaj profil otroka
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-dragon-green/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Izberi profil otroka</h2>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 gap-4 px-1">
            {profile.children.map((child, index) => (
              <div 
                key={index} 
                className="w-full cursor-pointer"
                onClick={() => setSelectedIndex(index)}
              >
                <ChildProfileCard
                  child={child}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                  hideActions={true}
                  minimal={true}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-center mt-6 pt-4 border-t">
          <Button
            onClick={handleConfirmSelection}
            disabled={selectedIndex === null}
            className="bg-dragon-green hover:bg-dragon-green/90 w-full max-w-sm"
          >
            Potrdi izbiro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
