
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { AddChildForm } from "@/components/AddChildForm";

type ChildrenProfilesSectionProps = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setEditingChildIndex: (index: number | null) => void;
  setDeletingChildIndex: (index: number | null) => void;
  setEditingDifficultiesIndex: (index: number | null) => void;
};

export function ChildrenProfilesSection({
  isExpanded,
  setIsExpanded,
  setEditingChildIndex,
  setDeletingChildIndex,
  setEditingDifficultiesIndex
}: ChildrenProfilesSectionProps) {
  const { profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  const handleSelectChild = (index: number) => {
    setSelectedChildIndex(index);
    localStorage.setItem('selectedChildIndex', index.toString());
  };

  const handleEditChild = (index: number) => {
    setEditingChildIndex(index);
  };

  const handleEditDifficulties = (index: number) => {
    setEditingDifficultiesIndex(index);
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className="w-full"
    >
      <Card>
        <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-purple/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-app-blue" />
            <CardTitle>Otroški profili</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-app-blue hover:bg-app-blue/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="hidden md:inline">Skrij podrobnosti</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="hidden md:inline">Prikaži podrobnosti</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <p className="text-lg mb-6">
              Upravljaj profile svojih otrok. Dodaj novega otroka ali uredi obstoječe profile.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {profile?.children && profile.children.length > 0 ? (
                profile.children.map((child, index) => (
                  <div key={index} className="w-full">
                    <ChildProfileCard 
                      child={child} 
                      isSelected={selectedChildIndex === index}
                      onSelect={() => handleSelectChild(index)}
                      onEdit={() => handleEditChild(index)}
                      onDelete={() => setDeletingChildIndex(index)}
                      onEditDifficulties={() => handleEditDifficulties(index)}
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-muted-foreground italic">
                  Trenutno nimate dodanih otrok. Dodajte prvega otroka spodaj.
                </p>
              )}
            </div>
            
            <Collapsible
              open={isAddChildOpen}
              onOpenChange={setIsAddChildOpen}
              className="w-full border rounded-lg overflow-hidden mt-4"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 py-2 border-dragon-green text-dragon-green hover:bg-dragon-green/10"
                >
                  <Users className="h-4 w-4" />
                  Dodaj otroka
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 bg-sky-50/50">
                  <AddChildForm onSuccess={() => setIsAddChildOpen(false)} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
