
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Gamepad, Zap, Video, Star, LogOut, MessageSquare, Plus, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { AddChildForm } from "@/components/AddChildForm";
import { EditChildForm } from "@/components/EditChildForm";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

const MojaStran = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(null);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [deletingChildIndex, setDeletingChildIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Select the first child by default if there are any children
  useEffect(() => {
    if (profile?.children && profile.children.length > 0 && selectedChildIndex === null) {
      setSelectedChildIndex(0);
    }
  }, [profile?.children, selectedChildIndex]);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const handleEditChild = (index: number) => {
    setEditingChildIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingChildIndex(null);
  };

  const handleDeleteChild = async () => {
    if (deletingChildIndex === null || !user) return;
    
    try {
      setIsDeleting(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = [...(currentMetadata.children || [])];
      
      // Remove the child at the specified index
      if (deletingChildIndex >= 0 && deletingChildIndex < currentChildren.length) {
        const removedChild = currentChildren.splice(deletingChildIndex, 1);
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { children: currentChildren }
        });
        
        if (updateError) throw updateError;
        
        toast.success(`Otrok "${removedChild[0]?.name}" je bil uspešno izbrisan.`);
        
        // If we deleted the selected child, reset selection
        if (selectedChildIndex === deletingChildIndex) {
          setSelectedChildIndex(currentChildren.length > 0 ? 0 : null);
        } 
        // If we deleted a child before the selected child, adjust the index
        else if (selectedChildIndex !== null && selectedChildIndex > deletingChildIndex) {
          setSelectedChildIndex(selectedChildIndex - 1);
        }
      }
      
    } catch (error: any) {
      console.error("Napaka pri brisanju otroka:", error);
      toast.error("Napaka pri brisanju otroka. Poskusite znova.");
    } finally {
      setIsDeleting(false);
      setDeletingChildIndex(null);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pozdravljen, <span className="text-dragon-green">{profile?.username || user.email}</span>!
          </h1>
        </div>
        
        {/* Profile Overview */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-blue/10">
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-6 w-6 text-dragon-green" />
              Tvoj profil
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-lg mb-6">
              Spremljaj napredek svojega govornega razvoja. Prilagodi vaje glede na starost, težave in cilje.
            </p>
            
            {/* Children Profiles Section */}
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Otroci</h3>
              
              {/* Display children profiles */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {profile?.children && profile.children.length > 0 ? (
                  profile.children.map((child, index) => (
                    <div key={index} className="w-full">
                      <ChildProfileCard 
                        child={child} 
                        isSelected={selectedChildIndex === index}
                        onSelect={() => setSelectedChildIndex(index)}
                        onEdit={() => handleEditChild(index)}
                        onDelete={() => setDeletingChildIndex(index)}
                      />
                      
                      {editingChildIndex === index && (
                        <Card className="mt-2 border-dashed border-app-blue/30 bg-app-blue/5">
                          <CardContent className="p-4">
                            <EditChildForm 
                              childIndex={index}
                              initialData={child}
                              onSuccess={() => {
                                setEditingChildIndex(null);
                              }}
                              onCancel={handleCancelEdit}
                            />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-muted-foreground italic">
                    Trenutno nimate dodanih otrok. Dodajte prvega otroka spodaj.
                  </p>
                )}
              </div>
              
              {/* Add Child Collapsible Section */}
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
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingChildIndex !== null} onOpenChange={(open) => !open && setDeletingChildIndex(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Potrdite brisanje otroka</AlertDialogTitle>
              <AlertDialogDescription>
                Ali ste prepričani, da želite izbrisati profil otroka
                {deletingChildIndex !== null && profile?.children && profile.children[deletingChildIndex] 
                  ? ` "${profile.children[deletingChildIndex].name}"` 
                  : ""}? 
                Tega dejanja ni mogoče razveljaviti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Prekliči</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteChild}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Brisanje..." : "Izbriši"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Content for the selected child */}
        {selectedChild ? (
          <>
            {/* My Progress */}
            <Card className="mb-8">
              <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-app-orange" />
                  Moj napredek za {selectedChild.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-lg">
                  Preglej, kaj je {selectedChild.name} že opravil, koliko zvezdic je zbral in kaj ga še čaka.
                </p>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold mb-6 mt-12">Izberi možnost za {selectedChild.name}:</h2>
            
            {/* Activity Cards - Now arranged in two rows with proper alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* First Row */}
              {/* Speech Exercises Card */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookText className="h-5 w-5 text-app-blue" />
                    Vaje za govor
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Izberi črko, ki jo želi {selectedChild.name} vaditi (C, Č, K, L, R, S, Š, Z, Ž,...).
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-app-blue hover:bg-app-blue/90">
                    Pojdi na vaje
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Speech Games Card */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Gamepad className="h-5 w-5 text-app-purple" />
                    Govorne igre
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Zabavne igre za izboljšanje izgovorjave za {selectedChild.name}.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-app-purple hover:bg-app-purple/90">
                    Začni igro
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Second Row */}
              {/* Challenges Card */}
              <Card className="transition-all duration-300 hover:shadow-md h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="h-5 w-5 text-app-orange" />
                    Moji izzivi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <p>
                    Izberi, s katero izgovorjavo ima {selectedChild.name} težave in prejmi prilagojene vaje.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-app-orange hover:bg-app-orange/90">
                    Izberi težavo
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Video Instructions Card */}
              <Card className="transition-all duration-300 hover:shadow-md h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Video className="h-5 w-5 text-app-teal" />
                    Video navodila
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <p>
                    Pokaži {selectedChild.name}, kako logoped pravilno izgovori posamezne črke.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-app-teal hover:bg-app-teal/90">
                    Poglej video
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Dragon Tip */}
            <Card className="mb-8 border-dragon-green/30 bg-gradient-to-r from-dragon-green/5 to-app-blue/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-dragon-green" />
                  Nasvet zmajčka Tomija za {selectedChild.name}:
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex items-center gap-6">
                <div className="hidden md:block w-24 h-24">
                  <img 
                    src="/lovable-uploads/f775878a-4811-4b45-86d5-d27531771d0d.png" 
                    alt="Tomi the Dragon" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-lg mb-2">"Danes poskusi ponoviti črko R vsaj 3-krat! Zmoreš!"</p>
                  <p className="text-sm text-muted-foreground">Vsaka vaja ti prinese točke in zvezdice.</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-2">Ni izbranega otroka</h3>
            <p className="text-muted-foreground">
              Prosimo, izberite otroka zgoraj ali dodajte novega za prikaz personaliziranih vsebin.
            </p>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="mt-12 flex flex-col items-center">
          <Button 
            variant="outline" 
            className="border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Odjava
          </Button>
        </div>
        
        {/* Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-1">Opomba:</p>
          <p>Vse vsebine so prilagojene starosti in težavam otroka.</p>
          <p>Za najboljše rezultate vadite redno!</p>
        </div>
      </div>
    </div>
  );
};

export default MojaStran;
