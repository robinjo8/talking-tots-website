import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Users, Star, CreditCard } from "lucide-react";
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
  const { isSubscribed, planId, isLoading } = useSubscription();
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);

  const hasNoChildren = !profile?.children || profile.children.length === 0;
  const isPro = planId === 'pro';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Otroci ({profile?.children?.length || 0})
          {hasNoChildren && isSubscribed && (
            <Star className="h-5 w-5 text-yellow-300 fill-yellow-300 animate-pulse" />
          )}
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Not subscribed - show message to subscribe first */}
          {!isLoading && !isSubscribed && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Naročnina ni aktivna</h3>
              <p className="text-muted-foreground mb-4">
                Za dodajanje otroka najprej izberite naročniški paket.
              </p>
              <Link to="/cenik">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-dragon-green hover:bg-dragon-green/90"
                >
                  Izberi paket
                </Button>
              </Link>
            </div>
          )}

          {/* Subscribed but no children - show add child button */}
          {isSubscribed && hasNoChildren && !showDatabaseManager && (
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

          {isSubscribed && hasNoChildren && showDatabaseManager && (
            <SimpleChildForm 
              onSuccess={() => {
                setShowDatabaseManager(false);
                window.location.reload();
              }}
              onCancel={() => setShowDatabaseManager(false)}
            />
          )}

          {/* Child profiles display */}
          {profile?.children && profile.children.length > 0 && (
            <div className="space-y-6">
              {profile.children.map((child, index) => (
                <ChildProfileDisplay
                  key={child.id}
                  child={child}
                  isPro={isPro}
                  onEdit={() => setEditingChildIndex(index)}
                  onDelete={() => setDeletingChildIndex(index)}
                  onRefresh={() => window.location.reload()}
                  onEditDifficulties={isPro ? () => setEditingDifficultiesIndex(index) : undefined}
                  onEditDevelopment={isPro ? () => setEditingDevelopmentIndex(index) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
