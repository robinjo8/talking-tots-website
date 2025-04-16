
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { SpeechDifficultyEditor } from "@/components/SpeechDifficultyEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSection } from "@/components/ProfileSection";
import { ProgressSection } from "@/components/ProgressSection";
import { ActivityOptions } from "@/components/ActivityOptions";
import { TipSection } from "@/components/TipSection";
import { NoChildSelected } from "@/components/NoChildSelected";
import { FooterSection } from "@/components/FooterSection";
import { DeleteChildDialog } from "@/components/DeleteChildDialog";

const MojaStran = () => {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [editingDifficultiesIndex, setEditingDifficultiesIndex] = useState<number | null>(null);
  const [deletingChildIndex, setDeletingChildIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  
  useEffect(() => {
    if (profile?.children && profile.children.length > 0 && selectedChildIndex === null) {
      setSelectedChildIndex(0);
    }
  }, [profile?.children, selectedChildIndex, setSelectedChildIndex]);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const handleEditChild = (index: number) => {
    setEditingChildIndex(index);
    setIsProfileExpanded(true);
  };

  const handleEditDifficulties = (index: number) => {
    setEditingDifficultiesIndex(index);
    setIsProfileExpanded(true);
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
  
  const handleSelectChild = (index: number) => {
    setSelectedChildIndex(index);
    localStorage.setItem('selectedChildIndex', index.toString());
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const childBeingDeleted = deletingChildIndex !== null && profile?.children 
    ? profile.children[deletingChildIndex] 
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pozdravljen, <span className="text-dragon-green">{profile?.username || user.email}</span>!
          </h1>
        </div>
        
        <ProfileSection 
          isProfileExpanded={isProfileExpanded}
          setIsProfileExpanded={setIsProfileExpanded}
          profile={profile}
          selectedChildIndex={selectedChildIndex}
          handleSelectChild={handleSelectChild}
          handleEditChild={handleEditChild}
          handleEditDifficulties={handleEditDifficulties}
          setDeletingChildIndex={setDeletingChildIndex}
          editingChildIndex={editingChildIndex}
          handleCancelEdit={handleCancelEdit}
          isAddChildOpen={isAddChildOpen}
          setIsAddChildOpen={setIsAddChildOpen}
          selectedChild={selectedChild}
        />
        
        <DeleteChildDialog
          open={deletingChildIndex !== null}
          onOpenChange={(open) => !open && setDeletingChildIndex(null)}
          childName={childBeingDeleted?.name}
          isDeleting={isDeleting}
          onConfirm={handleDeleteChild}
        />
        
        {/* Speech Difficulties Editor Dialog */}
        {editingDifficultiesIndex !== null && profile?.children && (
          <SpeechDifficultyEditor
            open={editingDifficultiesIndex !== null}
            onClose={() => setEditingDifficultiesIndex(null)}
            childName={profile.children[editingDifficultiesIndex].name}
            childIndex={editingDifficultiesIndex}
            initialDifficulties={profile.children[editingDifficultiesIndex].speechDifficulties || []}
          />
        )}
        
        {selectedChild ? (
          <>
            <ProgressSection />
            
            <ActivityOptions />
            
            <TipSection childName={selectedChild.name} />
          </>
        ) : (
          <NoChildSelected />
        )}
        
        <FooterSection handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MojaStran;
