
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChildDatabaseManager } from "@/components/children/ChildDatabaseManager";
import { ChildProfileCard } from "@/components/ChildProfileCard";

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
  setEditingDifficultiesIndex,
}: ChildrenProfilesSectionProps) {
  const { profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
      <Card>
        <CardHeader className="bg-gradient-to-r from-app-blue/10 to-dragon-green/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-app-blue" />
            <CardTitle>Otroci ({profile?.children?.length || 0})</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-app-blue hover:bg-app-blue/10">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="hidden md:inline">Skrij otroke</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="hidden md:inline">Prikaži otroke</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Toggle for database manager */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Upravljajte profile svojih otrok
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatabaseManager(!showDatabaseManager)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showDatabaseManager ? "Skrij upravljanje" : "Upravljaj otroke"}
                </Button>
              </div>

              {/* Database manager (new secure way) */}
              {showDatabaseManager && (
                <ChildDatabaseManager />
              )}

              {/* Children list */}
              {profile?.children && profile.children.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.children.map((child, index) => (
                    <ChildProfileCard
                      key={child.id || index}
                      child={child}
                      isSelected={selectedChildIndex === index}
                      onSelect={() => {
                        setSelectedChildIndex(index);
                        localStorage.setItem('selectedChildIndex', index.toString());
                      }}
                      onEdit={() => setEditingChildIndex(index)}
                      onDelete={() => setDeletingChildIndex(index)}
                      onEditDifficulties={() => setEditingDifficultiesIndex(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ni dodanih otrok</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodajte profil otroka, da začnete uporabljati aplikacijo.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
