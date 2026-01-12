import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
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
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileMobileTabs } from "@/components/profile/ProfileMobileTabs";

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Active section state
  const [activeSection, setActiveSection] = useState<string>("userProfile");
  
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
    // Check URL parameter for section to expand
    const sectionParam = searchParams.get('expandSection');
    if (sectionParam) {
      setActiveSection(sectionParam);
      return;
    }
    
    // Fallback to localStorage for subscription
    const sectionToExpand = localStorage.getItem('expandSection');
    if (sectionToExpand === 'subscription') {
      setActiveSection('subscription');
      localStorage.removeItem('expandSection');
    }
  }, [searchParams]);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BreadcrumbNavigation />
        </div>
        
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <User className="h-6 w-6 text-dragon-green" />
          Nastavitve
        </h1>
        
        {/* Mobile tabs */}
        <div className="md:hidden mb-6">
          <ProfileMobileTabs 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            childrenCount={profile?.children?.length || 0}
          />
        </div>
        
        {/* Main layout */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-60 shrink-0">
            <ProfileSidebar 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              childrenCount={profile?.children?.length || 0}
            />
          </div>
          
          {/* Content area */}
          <div className="flex-1 min-w-0">
            {activeSection === 'userProfile' && <UserProfileSection />}
            
            {activeSection === 'children' && (
              <ChildrenProfilesSection 
                setEditingChildIndex={setEditingChildIndex}
                setDeletingChildIndex={setDeletingChildIndex}
                setEditingDifficultiesIndex={setEditingDifficultiesIndex}
                setEditingDevelopmentIndex={setEditingDevelopmentIndex}
              />
            )}
            
            {activeSection === 'subscription' && (
              <div data-section="subscription">
                <SubscriptionSection />
              </div>
            )}
            
            {activeSection === 'paymentMethods' && <PaymentMethodsSection />}
            
            {activeSection === 'passwordChange' && <PasswordChangeSection />}
          </div>
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
