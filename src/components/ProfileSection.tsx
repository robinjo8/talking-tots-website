
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type ProfileSectionProps = {
  isProfileExpanded: boolean;
  setIsProfileExpanded: (expanded: boolean) => void;
  profile: any;
  selectedChild: any;
};

export function ProfileSection({
  isProfileExpanded,
  setIsProfileExpanded,
  profile,
  selectedChild,
}: ProfileSectionProps) {
  return (
    <Collapsible 
      open={isProfileExpanded} 
      onOpenChange={setIsProfileExpanded}
      className="mb-8"
    >
      <Card>
        <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-blue/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <UserRound className="h-6 w-6 text-dragon-green" />
            <CardTitle>Tvoj profil</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            {selectedChild && (
              <div className="text-sm md:text-base font-medium text-dragon-green">
                Izbran otrok: <span className="font-bold">{selectedChild.name}</span>
              </div>
            )}
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-dragon-green hover:bg-dragon-green/10"
              >
                {isProfileExpanded ? (
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
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <p className="text-lg mb-4">
              Spremljaj napredek svojega govornega razvoja. Prilagodi vaje glede na starost, težave in cilje.
            </p>
            
            {selectedChild ? (
              <div className="mt-4 p-4 bg-sky-50/50 rounded-lg border border-sky-100">
                <h3 className="text-lg font-medium text-dragon-green mb-2">Aktivni profil: {selectedChild.name}</h3>
                <p className="mb-4">
                  Izbrani otroški profil, za katerega trenutno upravljate govorne vaje in napredek.
                </p>
                <Button 
                  variant="outline" 
                  className="border-dragon-green text-dragon-green hover:bg-dragon-green/10"
                  onClick={() => window.location.href = "/profile"}
                >
                  Upravljaj profile
                </Button>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                <h3 className="text-lg font-medium text-amber-600 mb-2">Ni izbranega otroka</h3>
                <p className="mb-4">
                  Za nadaljevanje morate izbrati otroški profil v zgornjem desnem kotu aplikacije.
                </p>
                <Button 
                  variant="outline" 
                  className="border-amber-500 text-amber-600 hover:bg-amber-500/10"
                  onClick={() => window.location.href = "/profile"}
                >
                  Upravljaj profile
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
