import { useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Users, AlertTriangle, Loader2, Mail, Search, Filter } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface LogopedistWithOrg {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  created_at: string;
  email?: string;
  last_sign_in_at?: string | null;
  organizations: {
    name: string;
    type: string;
  } | null;
}

// --- Pending Section Component ---
function PendingSection({ 
  pending, 
  isLoading, 
  approveMutation, 
  rejectMutation 
}: { 
  pending: LogopedistWithOrg[]; 
  isLoading: boolean;
  approveMutation: any;
  rejectMutation: any;
}) {
  return (
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
                    {logopedist.email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {logopedist.email}
                      </p>
                    )}
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
                      onClick={() => approveMutation.mutate({ profileId: logopedist.id, userId: logopedist.user_id })}
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
                        if (confirm('Ali ste prepričani, da želite zavrniti to članstvo? Uporabnik in profil bosta izbrisana.')) {
                          rejectMutation.mutate(logopedist.user_id);
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
  );
}

// --- Active Members Section Component ---
function ActiveMembersSection({ 
  active, 
  isLoading,
  organizations 
}: { 
  active: LogopedistWithOrg[]; 
  isLoading: boolean;
  organizations: string[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return active.filter(l => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = 
          `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
          (l.email?.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Org filter
      if (orgFilter !== 'all' && l.organizations?.name !== orgFilter) return false;
      // Type filter
      if (typeFilter === 'internal' && l.organizations?.type !== 'internal') return false;
      if (typeFilter === 'external' && l.organizations?.type === 'internal') return false;
      return true;
    });
  }, [active, searchQuery, orgFilter, typeFilter]);

  return (
    <section>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Aktivni člani
            <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
              {filtered.length}{filtered.length !== active.length ? ` / ${active.length}` : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Iskanje po imenu ali emailu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Organizacija" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vse organizacije</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Tip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vsi tipi</SelectItem>
                <SelectItem value="internal">Interni</SelectItem>
                <SelectItem value="external">Zunanji</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {active.length === 0 ? 'Ni aktivnih članov.' : 'Ni rezultatov za izbrane filtre.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((logopedist) => (
                <div 
                  key={logopedist.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {logopedist.first_name} {logopedist.last_name}
                    </p>
                    {logopedist.email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {logopedist.email}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {logopedist.organizations?.name || 'Ni organizacije'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registriran: {new Date(logopedist.created_at).toLocaleDateString('sl-SI', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Zadnja prijava: {logopedist.last_sign_in_at 
                          ? new Date(logopedist.last_sign_in_at).toLocaleDateString('sl-SI', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {logopedist.organizations?.type === 'internal' && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        Interni
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aktiven
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// --- Main Component ---
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

  // Fetch email-ov za uporabnike
  const { data: userEmails } = useQuery({
    queryKey: ['admin-logopedist-emails', logopedists?.map(l => l.user_id)],
    queryFn: async () => {
      if (!logopedists || logopedists.length === 0) return {};
      
      const userIds = logopedists.map(l => l.user_id);
      const { data, error } = await supabase
        .rpc('get_parent_emails', { parent_ids: userIds });
      
      if (error) {
        console.error('Error fetching emails:', error);
        return {};
      }
      
      const emailMap: Record<string, string> = {};
      data?.forEach((row: { user_id: string; email: string }) => {
        emailMap[row.user_id] = row.email;
      });
      return emailMap;
    },
    enabled: !!logopedists && logopedists.length > 0,
  });

  // Fetch zadnja prijava
  const { data: lastSignIns } = useQuery({
    queryKey: ['admin-logopedist-last-sign-in', logopedists?.map(l => l.user_id)],
    queryFn: async () => {
      if (!logopedists || logopedists.length === 0) return {};
      const userIds = logopedists.map(l => l.user_id);
      const { data, error } = await supabase
        .rpc('get_users_last_sign_in', { user_ids: userIds });
      if (error) {
        console.error('Error fetching last sign in:', error);
        return {};
      }
      const map: Record<string, string | null> = {};
      data?.forEach((row: { user_id: string; last_sign_in_at: string | null }) => {
        map[row.user_id] = row.last_sign_in_at;
      });
      return map;
    },
    enabled: !!logopedists && logopedists.length > 0,
  });

  const logopedistsWithData = useMemo(() => {
    if (!logopedists) return [];
    return logopedists.map(l => ({
      ...l,
      email: userEmails?.[l.user_id] || undefined,
      last_sign_in_at: lastSignIns?.[l.user_id] ?? null,
    }));
  }, [logopedists, userEmails, lastSignIns]);

  // Unique organization names for filter
  const organizations = useMemo(() => {
    const names = new Set<string>();
    logopedistsWithData.forEach(l => {
      if (l.organizations?.name) names.add(l.organizations.name);
    });
    return Array.from(names).sort();
  }, [logopedistsWithData]);

  const approveMutation = useMutation({
    mutationFn: async ({ profileId, userId }: { profileId: string; userId: string }) => {
      const confirmResponse = await supabase.functions.invoke('confirm-logopedist-email', {
        body: { user_id: userId },
      });
      if (confirmResponse.error) {
        console.error('Error confirming email:', confirmResponse.error);
      }
      const { error } = await supabase
        .from('logopedist_profiles')
        .update({ is_verified: true })
        .eq('id', profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-logopedists'] });
      toast.success('Članstvo je bilo odobreno! Email je potrjen in logoped se lahko zdaj prijavi.');
    },
    onError: (error) => {
      console.error('Error approving membership:', error);
      toast.error('Napaka pri odobritvi članstva');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Niste prijavljeni');
      }
      const response = await supabase.functions.invoke('delete-logopedist', {
        body: { user_id: userId },
      });
      if (response.error) {
        throw new Error(response.error.message || 'Napaka pri brisanju');
      }
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Napaka pri brisanju uporabnika');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-logopedists'] });
      toast.success('Zahtevek za članstvo je bil zavrnjen in uporabnik izbrisan.');
    },
    onError: (error) => {
      console.error('Error rejecting membership:', error);
      toast.error('Napaka pri zavrnitvi članstva: ' + error.message);
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-app-blue" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const pending = logopedistsWithData.filter(l => !l.is_verified);
  const active = logopedistsWithData.filter(l => l.is_verified);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upravljanje članstev</h1>
        <p className="text-muted-foreground mt-1">
          Preglejte in odobrite zahtevke za članstvo logopedov
        </p>
      </div>
      
      <PendingSection 
        pending={pending} 
        isLoading={isLoading} 
        approveMutation={approveMutation} 
        rejectMutation={rejectMutation} 
      />
      
      <ActiveMembersSection 
        active={active} 
        isLoading={isLoading} 
        organizations={organizations}
      />
    </div>
  );
}
