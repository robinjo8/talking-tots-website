
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function ChildDatabaseManager() {
  const { user, profile, refreshProfile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");

  const handleCreateChild = async () => {
    if (!user || !newChildName.trim() || !newChildAge) {
      toast.error("Prosimo vnesite ime in starost otroka");
      return;
    }

    try {
      setIsCreating(true);
      
      const { error } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: newChildName.trim(),
          age: parseInt(newChildAge),
          avatar_url: "1" // Default avatar
        });

      if (error) throw error;

      toast.success(`Otrok "${newChildName}" je bil uspešno dodan`);
      setNewChildName("");
      setNewChildAge("");
      await refreshProfile();
    } catch (error: any) {
      console.error("Error creating child:", error);
      toast.error("Napaka pri dodajanju otroka: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (!confirm(`Ali ste prepričani, da želite izbrisati profil otroka "${childName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      toast.success(`Otrok "${childName}" je bil uspešno izbrisan`);
      await refreshProfile();
    } catch (error: any) {
      console.error("Error deleting child:", error);
      toast.error("Napaka pri brisanju otroka: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upravljanje otroških profilov</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create new child form */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium">Dodaj novega otroka</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="childName">Ime otroka</Label>
              <Input
                id="childName"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Vnesite ime"
              />
            </div>
            <div>
              <Label htmlFor="childAge">Starost</Label>
              <Input
                id="childAge"
                type="number"
                value={newChildAge}
                onChange={(e) => setNewChildAge(e.target.value)}
                placeholder="Vnesite starost"
                min="1"
                max="18"
              />
            </div>
          </div>
        </div>

        {/* List existing children */}
        <div className="space-y-2">
          <h3 className="font-medium">Obstoječi otroci</h3>
          {profile?.children && profile.children.length > 0 ? (
            <div className="space-y-2">
              {profile.children.map((child, index) => (
                <div key={child.id || index} className="flex items-center justify-between p-3 bg-background rounded border">
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Starost: {child.age || 'ni določena'}
                    </p>
                  </div>
                  {child.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteChild(child.id!, child.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Ni dodanih otrok</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
