import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Star } from "lucide-react";
import { SimpleChildForm } from "@/components/profile/SimpleChildForm";
import { ChildProfileDisplay } from "@/components/profile/ChildProfileDisplay";

type ChildrenProfilesSectionProps = {
  setEditingChildIndex: (index: number | null) => void;
  setDeletingChildIndex: (index: number | null) => void;
  setEditingDifficultiesIndex: (index: number | null) => void;
  setEditingDevelopmentIndex: (index: number | null) => void;
};

export function ChildrenProfilesSection({
  setEditingChildIndex,
  setDeletingChildIndex,
  setEditingDifficultiesIndex,
  setEditingDevelopmentIndex
}: ChildrenProfilesSectionProps) {
  const { profile } = useAuth();
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);

  const hasNoChildren = !profile?.children || profile.children.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Otroci ({profile?.children?.length || 0})
          {hasNoChildren && (
            <Star className="h-5 w-5 text-yellow-300 fill-yellow-300 animate-pulse" />
          )}
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Database manager - show only if no children exist */}
          {hasNoChildren && !showDatabaseManager && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ni dodanih otrok</h3>
              <p className="text-muted-foreground mb-4">
                Dodajte profil otroka, da začnete uporabljati aplikacijo.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDatabaseManager(true)}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Dodaj otroka
              </Button>
            </div>
          )}

          {hasNoChildren && showDatabaseManager && (
            <SimpleChildForm onSuccess={() => {
              setShowDatabaseManager(false);
              window.location.reload();
            }} />
          )}

          {/* Child profiles display */}
          {profile?.children && profile.children.length > 0 && (
            <div className="space-y-6">
              {profile.children.map((child, index) => (
                <ChildProfileDisplay
                  key={child.id}
                  child={child}
                  onEdit={() => setEditingChildIndex(index)}
                  onDelete={() => setDeletingChildIndex(index)}
                  onRefresh={() => window.location.reload()}
                  onEditDifficulties={() => setEditingDifficultiesIndex(index)}
                  onEditDevelopment={() => setEditingDevelopmentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
