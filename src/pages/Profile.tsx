import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useBannerVisible } from "@/components/MissingChildBanner";
import { DeleteChildDialog } from "@/components/DeleteChildDialog";
import { EditChildModal } from "@/components/EditChildModal";
import { SpeechDifficultyEditor } from "@/components/SpeechDifficultyEditor";
import { SpeechDevelopmentEditor } from "@/components/children/SpeechDevelopmentEditor";
import { UserProfileSection } from "@/components/profile/UserProfileSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { ChildrenProfilesSection } from "@/components/profile/ChildrenProfilesSection";
import { SubscriptionSection } from "@/components/profile/SubscriptionSection";
import { PaymentMethodsSection } from "@/components/profile/PaymentMethodsSection";
import { MyDocumentsSection } from "@/components/profile/MyDocumentsSection";
import { ArticulationTestProfileSection } from "@/components/profile/ArticulationTestProfileSection";
import { AIChatSection } from "@/components/profile/AIChatSection";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileMobileTabs } from "@/components/profile/ProfileMobileTabs";

export default function Profile() {
  const bannerVisible = useBannerVisible();
  const { user, profile, refreshProfile } = useAuth();
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
    // Shrani lokalne reference takoj na začetku
    const childIndex = deletingChildIndex;
    const children = profile?.children;
    
    if (childIndex === null || !user || !children) {
      console.log("handleDeleteChild - early return:", { childIndex, user: !!user, children: !!children });
      return;
    }
    
    const childToDelete = children[childIndex];
    if (!childToDelete?.id) {
      console.error("handleDeleteChild - child has no ID:", childToDelete);
      toast.error("Napaka: ni mogoče identificirati otroka za brisanje.");
      return;
    }
    
    const childId = childToDelete.id;
    const childName = childToDelete.name;
    
    console.log("handleDeleteChild - starting deletion for:", { childId, childName });
    
    try {
      setIsDeleting(true);
      
      // 1. Najprej pobriši vse datoteke iz storage za tega otroka
      const folderPath = `${user.id}/${childId}`;
      
      // Pridobi seznam vseh datotek v mapi otroka (rekurzivno)
      const { data: rootFiles } = await supabase.storage
        .from('uporabniski-profili')
        .list(folderPath);
      
      if (rootFiles && rootFiles.length > 0) {
        // Za vsako mapo pridobi datoteke
        const allFilePaths: string[] = [];
        
        for (const item of rootFiles) {
          if (item.id === null) {
            // To je mapa - pridobi datoteke v njej
            const { data: subFiles } = await supabase.storage
              .from('uporabniski-profili')
              .list(`${folderPath}/${item.name}`);
            
            if (subFiles) {
              for (const subFile of subFiles) {
                if (subFile.id !== null) {
                  allFilePaths.push(`${folderPath}/${item.name}/${subFile.name}`);
                }
              }
            }
          } else {
            // To je datoteka
            allFilePaths.push(`${folderPath}/${item.name}`);
          }
        }
        
        if (allFilePaths.length > 0) {
          console.log("handleDeleteChild - deleting storage files:", allFilePaths);
          const { error: storageError } = await supabase.storage
            .from('uporabniski-profili')
            .remove(allFilePaths);
          
          if (storageError) {
            console.warn("handleDeleteChild - storage deletion warning:", storageError);
            // Nadaljuj z brisanjem iz baze kljub napaki pri storage
          }
        }
      }
      
      // 2. Briši otroka iz baze - CASCADE pobriše povezane zapise
      console.log("handleDeleteChild - deleting from database:", childId);
      const { error: deleteError, data: deletedData } = await supabase
        .from('children')
        .delete()
        .eq('id', childId)
        .select();
      
      console.log("handleDeleteChild - delete result:", { error: deleteError, data: deletedData });
        
      if (deleteError) throw deleteError;
      
      if (!deletedData || deletedData.length === 0) {
        console.warn("handleDeleteChild - no rows deleted, might be RLS issue");
      }
      
      // 3. Posodobi user metadata - odstrani otroka iz metadata.children
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.user_metadata?.children) {
        const currentMetadataChildren = userData.user.user_metadata.children as any[];
        const updatedMetadataChildren = currentMetadataChildren.filter(
          (c: any) => c.name !== childName
        );
        
        await supabase.auth.updateUser({
          data: { children: updatedMetadataChildren }
        });
        console.log("handleDeleteChild - updated metadata, removed child:", childName);
      }
      
      toast.success(`Otrok "${childName}" je bil uspešno izbrisan.`);
      
      // Zapri dialog in osveži profil
      setDeletingChildIndex(null);
      await refreshProfile();
      
    } catch (error: any) {
      console.error("handleDeleteChild - error:", error);
      toast.error("Napaka pri brisanju otroka: " + (error.message || "Poskusite znova."));
    } finally {
      setIsDeleting(false);
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
      
      <div className={`container max-w-6xl mx-auto pb-20 px-4 ${
        bannerVisible 
          ? 'pt-36 md:pt-44' 
          : 'pt-24 md:pt-32'
      }`}>
        
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
            
            {activeSection === 'myDocuments' && <MyDocumentsSection />}
            
            {activeSection === 'children' && (
              <ChildrenProfilesSection 
                setEditingChildIndex={setEditingChildIndex}
                setDeletingChildIndex={setDeletingChildIndex}
                setEditingDifficultiesIndex={setEditingDifficultiesIndex}
                setEditingDevelopmentIndex={setEditingDevelopmentIndex}
              />
            )}
            
            {activeSection === 'articulationTest' && <ArticulationTestProfileSection />}
            
            {activeSection === 'aiChat' && <AIChatSection />}
            
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
