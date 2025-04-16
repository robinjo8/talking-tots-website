
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { AddChildForm } from "@/components/AddChildForm";

type ProfileSectionProps = {
  isProfileExpanded: boolean;
  setIsProfileExpanded: (expanded: boolean) => void;
  profile: any;
  selectedChildIndex: number | null;
  handleSelectChild: (index: number) => void;
  handleEditChild: (index: number) => void;
  handleEditDifficulties: (index: number) => void;
  setDeletingChildIndex: (index: number | null) => void;
  isAddChildOpen: boolean;
  setIsAddChildOpen: (open: boolean) => void;
  selectedChild: any;
};

export function ProfileSection({
  isProfileExpanded,
  setIsProfileExpanded,
  profile,
  selectedChildIndex,
  handleSelectChild,
  handleEditChild,
  handleEditDifficulties,
  setDeletingChildIndex,
  isAddChildOpen,
  setIsAddChildOpen,
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
            <p className="text-lg mb-6">
              Spremljaj napredek svojega govornega razvoja. Prilagodi vaje glede na starost, težave in cilje.
            </p>
            
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Otroci</h3>
              
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
                    <Plus className="h-4 w-4" />
                    Dodaj otroka
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-sky-50/50">
                    <AddChildForm onSuccess={() => setIsAddChildOpen(false)} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
