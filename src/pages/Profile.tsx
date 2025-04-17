
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import { User } from "lucide-react";
import { DeleteChildDialog } from "@/components/DeleteChildDialog";
import { EditChildModal } from "@/components/EditChildModal";
import { SpeechDifficultyEditor } from "@/components/SpeechDifficultyEditor";
import { UserProfileSection } from "@/components/profile/UserProfileSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { ChildrenProfilesSection } from "@/components/profile/ChildrenProfilesSection";

export default function Profile() {
  const { user, profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  // Section UI state
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(true);
  const [isChildrenSectionExpanded, setIsChildrenSectionExpanded] = useState(false);
  
  // Child profile management state
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [editingDifficultiesIndex, setEditingDifficultiesIndex] = useState<number | null>(null);
  const [deletingChildIndex, setDeletingChildIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile?.children && profile.children.length > 0 && selectedChildIndex === null) {
      setSelectedChildIndex(0);
    }
  }, [profile?.children, selectedChildIndex, setSelectedChildIndex]);

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
          {/* User Profile Section (now combined with Personal Data) */}
          <UserProfileSection 
            isExpanded={isUserProfileExpanded}
            setIsExpanded={setIsUserProfileExpanded}
          />
          
          {/* Password Change Section */}
          <PasswordChangeSection />
          
          {/* Children Profiles Section */}
          <ChildrenProfilesSection 
            isExpanded={isChildrenSectionExpanded}
            setIsExpanded={setIsChildrenSectionExpanded}
            setEditingChildIndex={setEditingChildIndex}
            setDeletingChildIndex={setDeletingChildIndex}
            setEditingDifficultiesIndex={setEditingDifficultiesIndex}
          />
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
