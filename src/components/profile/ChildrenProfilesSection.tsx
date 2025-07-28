
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChildDatabaseManager } from "@/components/children/ChildDatabaseManager";
import { ChildProfileDisplay } from "@/components/profile/ChildProfileDisplay";
import { toast } from "sonner";

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
  const { profile, selectedChildIndex, setSelectedChildIndex, manualSyncChildren } = useAuth();
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const success = await manualSyncChildren();
      if (success) {
        toast.success("Otroci uspešno sinhronizirani iz registracije!");
      } else {
        toast.error("Ni podatkov za sinhronizacijo ali sinhronizacija ni uspela.");
      }
    } catch (error) {
      toast.error("Napaka pri sinhronizaciji otrok.");
    } finally {
      setIsSyncing(false);
    }
  };

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
            <div className="space-y-6">
              {/* Show sync button if children need syncing */}
              {profile?.needsSync && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">
                        Obstajajo podatki o otroku iz registracije
                      </h4>
                      <p className="text-sm text-amber-700">
                        Zaznali smo podatke o otroku iz registracije, ki se niso shranili. Kliknite za sinhronizacijo.
                      </p>
                    </div>
                    <Button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sinhroniziram...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sinhroniziraj
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Database manager - only show if no children exist */}
              {(!profile?.children || profile.children.length === 0) && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Dodajte profil otroka, da začnete uporabljati aplikacijo
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDatabaseManager(!showDatabaseManager)}
                      className="border-dragon-green text-dragon-green hover:bg-dragon-green/10"
                    >
                      {showDatabaseManager ? "Skrij dodajanje" : "Dodaj otroka"}
                    </Button>
                  </div>

                  {showDatabaseManager && (
                    <ChildDatabaseManager />
                  )}
                </>
              )}

              {/* Child profile display - single child layout */}
              {profile?.children && profile.children.length > 0 ? (
                <ChildProfileDisplay
                  child={profile.children[0]}
                  onEdit={() => setEditingChildIndex(0)}
                  onDelete={() => setDeletingChildIndex(0)}
                  onRefresh={() => window.location.reload()}
                />
              ) : !showDatabaseManager && (
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
