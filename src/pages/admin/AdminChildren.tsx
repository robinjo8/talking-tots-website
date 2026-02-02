import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BarChart3, 
  Play, 
  Pencil, 
  Trash2, 
  AlertCircle,
  Crown,
  User
} from 'lucide-react';
import { useLogopedistChildren, LogopedistChild } from '@/hooks/useLogopedistChildren';
import { useLogopedistLicense } from '@/hooks/useLogopedistLicense';
import { AddChildModal } from '@/components/admin/children/AddChildModal';
import { EditChildModal } from '@/components/admin/children/EditChildModal';
import { DeleteChildDialog } from '@/components/admin/children/DeleteChildDialog';
import { cn } from '@/lib/utils';

export default function AdminChildren() {
  const navigate = useNavigate();
  const { children, isLoading: childrenLoading } = useLogopedistChildren();
  const { license, hasLicense, isNearLimit, isAtLimit, isLoading: licenseLoading } = useLogopedistLicense();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChild, setEditingChild] = useState<LogopedistChild | null>(null);
  const [deletingChild, setDeletingChild] = useState<LogopedistChild | null>(null);

  const isLoading = childrenLoading || licenseLoading;

  const handleStartWork = (childId: string) => {
    navigate(`/admin/children/${childId}/workspace`);
  };

  const handleViewProgress = (childId: string) => {
    navigate(`/admin/children/${childId}/progress`);
  };

  // Prikaz za logopede brez licence
  if (!isLoading && !hasLicense) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Moji otroci</h1>
        
        <Card className="border-app-orange/30 bg-app-orange/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Crown className="h-16 w-16 text-app-orange mb-4" />
            <h2 className="text-xl font-semibold mb-2">Potrebujete licenco</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Za upravljanje in delo z otroki potrebujete aktivno licenco. 
              Izberite paket, ki ustreza vašim potrebam.
            </p>
            <Button 
              onClick={() => navigate('/admin/license')}
              className="bg-app-orange hover:bg-app-orange/90"
            >
              <Crown className="h-4 w-4 mr-2" />
              Oglej si pakete
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Moji otroci</h1>
          {license && (
            <p className="text-muted-foreground mt-1">
              Aktivna licenca: <span className="font-medium text-foreground">{license.licenseName}</span>
              {' '}({license.usedSlots}/{license.maxChildren} otrok)
            </p>
          )}
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          disabled={isAtLimit}
          className="bg-dragon-green hover:bg-dragon-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj otroka
        </Button>
      </div>

      {/* Opozorila */}
      {isNearLimit && !isAtLimit && (
        <Card className="border-app-orange/30 bg-app-orange/5">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle className="h-5 w-5 text-app-orange flex-shrink-0" />
            <p className="text-sm">
              Skoraj ste dosegli omejitev mest ({license?.usedSlots}/{license?.maxChildren}). 
              <Button variant="link" className="px-1 text-app-orange" onClick={() => navigate('/admin/license')}>
                Nadgradite licenco
              </Button>
              za več mest.
            </p>
          </CardContent>
        </Card>
      )}

      {isAtLimit && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm">
              Dosegli ste omejitev mest ({license?.maxChildren}/{license?.maxChildren}). 
              <Button variant="link" className="px-1 text-destructive" onClick={() => navigate('/admin/license')}>
                Nadgradite licenco
              </Button>
              za dodajanje novih otrok.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Seznam otrok */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
        </div>
      ) : children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Še nimate dodanih otrok</h3>
            <p className="text-muted-foreground mb-4">
              Dodajte svojega prvega otroka za začetek dela.
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-dragon-green hover:bg-dragon-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj otroka
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => (
            <Card key={child.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar in osnovni podatki */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                      child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
                    )}>
                      <span className="text-xl">
                        {child.gender === 'male' ? '🧒' : '👧'}
                      </span>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{child.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>Starost: {child.age} {child.age === 1 ? 'leto' : child.age < 5 ? 'leta' : 'let'}</span>
                        {child.speech_difficulties && child.speech_difficulties.length > 0 && (
                          <>
                            <span>•</span>
                            <span>Težave: {child.speech_difficulties.join(', ')}</span>
                          </>
                        )}
                      </div>
                      {child.external_id && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ID: {child.external_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Akcije */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProgress(child.id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Napredek</span>
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleStartWork(child.id)}
                      className="bg-dragon-green hover:bg-dragon-green/90"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Začni delo</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingChild(child)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingChild(child)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Zapiski */}
                {child.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      📝 {child.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modali */}
      <AddChildModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
      
      {editingChild && (
        <EditChildModal
          child={editingChild}
          open={!!editingChild}
          onOpenChange={(open) => !open && setEditingChild(null)}
        />
      )}
      
      {deletingChild && (
        <DeleteChildDialog
          child={deletingChild}
          open={!!deletingChild}
          onOpenChange={(open) => !open && setDeletingChild(null)}
        />
      )}
    </div>
  );
}
