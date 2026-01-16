import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface LogopedistWithOrg {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  created_at: string;
  organizations: {
    name: string;
    type: string;
  } | null;
}

export default function AdminMemberships() {
  const { isSuperAdmin, isLoading: authLoading } = useAdminAuth();
  const queryClient = useQueryClient();

  // Fetch vseh logopedov
  const { data: logopedists, isLoading } = useQuery({
    queryKey: ['admin-logopedists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logopedist_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          is_verified,
          created_at,
          organizations(name, type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LogopedistWithOrg[];
    },
    enabled: isSuperAdmin,
  });

  // Odobri članstvo
  const approveMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('logopedist_profiles')
        .update({ is_verified: true })
        .eq('id', profileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-logopedists'] });
      toast.success('Članstvo je bilo odobreno! Logoped se lahko zdaj prijavi.');
    },
    onError: (error) => {
      console.error('Error approving membership:', error);
      toast.error('Napaka pri odobritvi članstva');
    },
  });

  // Zavrni članstvo (izbriši profil)
  const rejectMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('logopedist_profiles')
        .delete()
        .eq('id', profileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-logopedists'] });
      toast.success('Zahtevek za članstvo je bil zavrnjen.');
    },
    onError: (error) => {
      console.error('Error rejecting membership:', error);
      toast.error('Napaka pri zavrnitvi članstva');
    },
  });

  // Počakaj na auth loading
  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-app-blue" />
        </div>
      </AdminLayout>
    );
  }

  // Preusmeri če ni super admin
  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Razdeli na čakajoče in aktivne
  const pending = logopedists?.filter(l => !l.is_verified) || [];
  const active = logopedists?.filter(l => l.is_verified) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upravljanje članstev</h1>
          <p className="text-muted-foreground mt-1">
            Preglejte in odobrite zahtevke za članstvo logopedov
          </p>
        </div>
        
        {/* Zahtevki za nova članstva */}
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Zahtevki za nova članstva
                {pending.length > 0 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 ml-2">
                    {pending.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                  <p className="text-muted-foreground">Ni čakajočih zahtevkov za članstvo.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((logopedist) => (
                    <div 
                      key={logopedist.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-amber-50/50 border-amber-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {logopedist.first_name} {logopedist.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {logopedist.organizations?.name || 'Ni organizacije'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registriran: {new Date(logopedist.created_at).toLocaleDateString('sl-SI', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(logopedist.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {approveMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Odobri
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Ali ste prepričani, da želite zavrniti to članstvo? Profil bo izbrisan.')) {
                              rejectMutation.mutate(logopedist.id);
                            }
                          }}
                          disabled={rejectMutation.isPending}
                        >
                          {rejectMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Zavrni
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Aktivni člani */}
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Aktivni člani
                <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                  {active.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : active.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Ni aktivnih članov.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {active.map((logopedist) => (
                    <div 
                      key={logopedist.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {logopedist.first_name} {logopedist.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {logopedist.organizations?.name || 'Ni organizacije'}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aktiven
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
