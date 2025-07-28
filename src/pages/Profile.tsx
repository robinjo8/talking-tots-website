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
import { SpeechDevelopmentEditor } from "@/components/children/SpeechDevelopmentEditor";
import { UserProfileSection } from "@/components/profile/UserProfileSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { ChildrenProfilesSection } from "@/components/profile/ChildrenProfilesSection";
import { SubscriptionSection } from "@/components/profile/SubscriptionSection";
import { PaymentMethodsSection } from "@/components/profile/PaymentMethodsSection";

export default function Profile() {
  const { user, profile, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  // Section UI state - check localStorage for expandSection
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(false);
  const [isChildrenSectionExpanded, setIsChildrenSectionExpanded] = useState(false);
  
  // Child profile management state
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [editingDifficultiesIndex, setEditingDifficultiesIndex] = useState<number | null>(null);
  const [editingDevelopmentIndex, setEditingDevelopmentIndex] = useState<number | null>(null);
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

  useEffect(() => {
    const sectionToExpand = localStorage.getItem('expandSection');
    if (sectionToExpand === 'subscription') {
      const subscriptionSection = document.querySelector('[data-section="subscription"]');
      if (subscriptionSection) {
        subscriptionSection.scrollIntoView({ behavior: 'smooth' });
        localStorage.removeItem('expandSection');
      }
    }
  }, []);

  const handleDeleteChild = async () => {
    if (deletingChildIndex === null || !user || !profile?.children) return;
    
    try {
      setIsDeleting(true);
      
      const childToDelete = profile.children[deletingChildIndex];
      if (!childToDelete || !childToDelete.id) {
        toast.error("Napaka: ni mogoče identificirati otroka za brisanje.");
        return;
      }
      
      // Delete child from database
      const { error: deleteError } = await supabase
        .from('children')
        .delete()
        .eq('id', childToDelete.id);
        
      if (deleteError) throw deleteError;
      
      toast.success(`Otrok "${childToDelete.name}" je bil uspešno izbrisan.`);
      
      // Update selected child index
      if (selectedChildIndex === deletingChildIndex) {
        const remainingChildrenCount = profile.children.length - 1;
        setSelectedChildIndex(remainingChildrenCount > 0 ? 0 : null);
      } else if (selectedChildIndex !== null && selectedChildIndex > deletingChildIndex) {
        setSelectedChildIndex(selectedChildIndex - 1);
      }
      
      // Refresh profile to get updated children list
      if (window.location.pathname === '/profile') {
        window.location.reload();
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
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <User className="h-6 w-6 text-dragon-green" />
          Nastavitve
        </h1>
        
        <div className="grid gap-8">
          {/* User Profile Section (collapsed by default) */}
          <UserProfileSection 
            isExpanded={isUserProfileExpanded}
            setIsExpanded={setIsUserProfileExpanded}
          />
          
          {/* Children Profiles Section */}
          <ChildrenProfilesSection 
            isExpanded={isChildrenSectionExpanded}
            setIsExpanded={setIsChildrenSectionExpanded}
            setEditingChildIndex={setEditingChildIndex}
            setDeletingChildIndex={setDeletingChildIndex}
            setEditingDifficultiesIndex={setEditingDifficultiesIndex}
            setEditingDevelopmentIndex={setEditingDevelopmentIndex}
          />
          
          {/* Subscription Section */}
          <div data-section="subscription">
            <SubscriptionSection />
          </div>
          
          {/* Payment Methods Section (new) */}
          <PaymentMethodsSection />
          
          {/* Password Change Section */}
          <PasswordChangeSection />
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
            childId={profile.children[editingDifficultiesIndex].id}
            initialDifficulties={profile.children[editingDifficultiesIndex].speechDifficulties || []}
            initialDescription={profile.children[editingDifficultiesIndex].speechDifficultiesDescription || ""}
          />
        )}
        
        {editingDevelopmentIndex !== null && profile?.children && (
          <SpeechDevelopmentEditor
            open={editingDevelopmentIndex !== null}
            onClose={() => setEditingDevelopmentIndex(null)}
            childName={profile.children[editingDevelopmentIndex].name}
            childId={profile.children[editingDevelopmentIndex].id}
            initialAnswers={profile.children[editingDevelopmentIndex].speechDevelopment || {}}
          />
        )}
      </div>
    </div>
  );
}
