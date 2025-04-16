
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { Shield, User, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { AddChildForm } from "@/components/AddChildForm";
import { DeleteChildDialog } from "@/components/DeleteChildDialog";
import { EditChildModal } from "@/components/EditChildModal";
import { SpeechDifficultyEditor } from "@/components/SpeechDifficultyEditor";

export default function Profile() {
  const { user, profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(profile?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Child profile management state
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(false);
  const [isChildrenSectionExpanded, setIsChildrenSectionExpanded] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [editingDifficultiesIndex, setEditingDifficultiesIndex] = useState<number | null>(null);
  const [deletingChildIndex, setDeletingChildIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load existing profile data
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setUsername(data.username || "");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju profila:", error);
        toast.error("Napaka pri nalaganju podatkov profila");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (profile?.children && profile.children.length > 0 && selectedChildIndex === null) {
      setSelectedChildIndex(0);
    }
  }, [profile?.children, selectedChildIndex, setSelectedChildIndex]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Profil uspešno posodobljen");
    } catch (error) {
      console.error("Napaka pri posodabljanju profila:", error);
      toast.error("Napaka pri posodabljanju profila");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Novi gesli se ne ujemata");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Geslo mora vsebovati vsaj 6 znakov");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      toast.success("Geslo uspešno posodobljeno");
    } catch (error) {
      console.error("Napaka pri posodabljanju gesla:", error);
      setPasswordError("Napaka pri posodabljanju gesla");
    } finally {
      setPasswordLoading(false);
    }
  };

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

  const handleDeleteChild = async () => {
    if (deletingChildIndex === null || !user) return;
    
    try {
      setIsDeleting(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = [...(currentMetadata.children || [])];
      
      if (deletingChildIndex >= 0 && deletingChildIndex < currentChildren.length) {
        const removedChild = currentChildren.splice(deletingChildIndex, 1);
        
        const { error: updateError } = await supabase.auth.updateUser({
          data: { children: currentChildren }
        });
        
        if (updateError) throw updateError;
        
        toast.success(`Otrok "${removedChild[0]?.name}" je bil uspešno izbrisan.`);
        
        if (selectedChildIndex === deletingChildIndex) {
          setSelectedChildIndex(currentChildren.length > 0 ? 0 : null);
        } 
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

  const childBeingDeleted = deletingChildIndex !== null && profile?.children 
    ? profile.children[deletingChildIndex] 
    : undefined;

  const childBeingEdited = editingChildIndex !== null && profile?.children 
    ? profile.children[editingChildIndex] 
    : undefined;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto pt-28 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <User className="h-6 w-6 text-dragon-green" />
          Moj profil
        </h1>
        
        <div className="grid gap-8">
          {/* User Profile Section */}
          <Collapsible 
            open={isUserProfileExpanded} 
            onOpenChange={setIsUserProfileExpanded}
            className="w-full"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-blue/10 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6 text-dragon-green" />
                  <CardTitle>Osebni podatki</CardTitle>
                </div>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-dragon-green hover:bg-dragon-green/10"
                  >
                    {isUserProfileExpanded ? (
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
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-pošta</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">E-pošte ni mogoče spremeniti</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Uporabniško ime</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Vnesi uporabniško ime"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ime</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Vnesi ime"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Priimek</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Vnesi priimek"
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="bg-dragon-green hover:bg-dragon-green/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Posodabljanje..." : "Posodobi profil"}
                    </Button>
                  </CardFooter>
                </form>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Password Change Section */}
          <Collapsible open={false} className="w-full">
            <Card>
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-purple/10 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-app-orange" />
                  <CardTitle>Spremeni geslo</CardTitle>
                </div>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-app-orange hover:bg-app-orange/10"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span className="hidden md:inline">Prikaži podrobnosti</span>
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>
              
              <CollapsibleContent>
                <form onSubmit={handlePasswordChange}>
                  <CardContent className="space-y-4 pt-4">
                    {passwordError && (
                      <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                        {passwordError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Novo geslo</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Vnesi novo geslo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Potrdi novo geslo</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Ponovi novo geslo"
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      variant="outline"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? "Posodabljanje..." : "Spremeni geslo"}
                    </Button>
                  </CardFooter>
                </form>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Children Profiles Section */}
          <Collapsible 
            open={isChildrenSectionExpanded} 
            onOpenChange={setIsChildrenSectionExpanded}
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
                    {isChildrenSectionExpanded ? (
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
        </div>
        
        {/* Dialogs and Modals */}
        <DeleteChildDialog
          open={deletingChildIndex !== null}
          onOpenChange={(open) => !open && setDeletingChildIndex(null)}
          childName={childBeingDeleted?.name}
          isDeleting={isDeleting}
          onConfirm={handleDeleteChild}
        />
        
        {childBeingEdited && (
          <EditChildModal
            open={editingChildIndex !== null}
            onOpenChange={(open) => !open && setEditingChildIndex(null)}
            childName={childBeingEdited.name}
            childIndex={editingChildIndex}
            initialData={childBeingEdited}
            onSuccess={() => setEditingChildIndex(null)}
          />
        )}
        
        {editingDifficultiesIndex !== null && profile?.children && (
          <SpeechDifficultyEditor
            open={editingDifficultiesIndex !== null}
            onClose={() => setEditingDifficultiesIndex(null)}
            childName={profile.children[editingDifficultiesIndex].name}
            childIndex={editingDifficultiesIndex}
            initialDifficulties={profile.children[editingDifficultiesIndex].speechDifficulties || []}
          />
        )}
      </div>
    </div>
  );
}
