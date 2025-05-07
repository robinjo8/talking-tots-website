
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Search, RefreshCw } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface User {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
  username?: string | null;
}

export default function AdminUsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirmPromote, setShowConfirmPromote] = useState(false);
  const [showConfirmDemote, setShowConfirmDemote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch all users from auth.users - this requires admin privileges
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Fetch profiles to get usernames
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');
      
      if (profilesError) throw profilesError;
      
      // Get admin roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (rolesError) throw rolesError;
      
      // Create admin user id set for faster lookup
      const adminUserIds = new Set(roles ? roles.map(r => r.user_id) : []);
      
      // Map profiles by id for faster lookup
      const profilesMap = new Map();
      profiles?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // Combine data
      const combinedUsers = authUsers.users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        isAdmin: adminUserIds.has(user.id),
        username: profilesMap.get(user.id)?.username || null
      }));
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Napaka pri pridobivanju uporabnikov:", error);
      toast.error("Napaka pri pridobivanju seznama uporabnikov");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromoteToAdmin = async () => {
    if (!selectedUserId) return;
    setActionLoading(true);
    
    try {
      // Check if the role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', selectedUserId)
        .eq('role', 'admin')
        .single();
      
      if (!existingRole) {
        // Insert the admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUserId, role: 'admin' });
        
        if (error) throw error;
      }
      
      toast.success("Uporabnik je uspešno povišan v administratorja");
      setShowConfirmPromote(false);
      loadUsers();
    } catch (error) {
      console.error("Napaka pri povišanju uporabnika:", error);
      toast.error("Napaka pri povišanju uporabnika v administratorja");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemoteFromAdmin = async () => {
    if (!selectedUserId) return;
    setActionLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUserId)
        .eq('role', 'admin');
      
      if (error) throw error;
      
      toast.success("Administratorske pravice so bile uspešno odvzete");
      setShowConfirmDemote(false);
      loadUsers();
    } catch (error) {
      console.error("Napaka pri odvzemu pravic:", error);
      toast.error("Napaka pri odvzemu administratorskih pravic");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upravljanje uporabnikov</CardTitle>
          <CardDescription>
            Pregled in upravljanje uporabnikov sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Iskanje uporabnikov..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={loadUsers} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Osveži
            </Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Uporabnik</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Datum registracije</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nalaganje uporabnikov...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Ni najdenih uporabnikov
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username || "Ni uporabniškega imena"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("sl-SI")}
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <span className="inline-flex items-center bg-dragon-green/10 text-dragon-green px-2 py-1 rounded-full text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Administrator
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Standardni uporabnik
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowConfirmDemote(true);
                            }}
                          >
                            Odstrani pravice
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowConfirmPromote(true);
                            }}
                          >
                            Dodeli pravice
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirmPromote}
        onOpenChange={setShowConfirmPromote}
        title="Povišaj v administratorja"
        description="Ali ste prepričani, da želite dodeliti administratorske pravice temu uporabniku? Administrator bo imel dostop do celotne administratorske plošče in vseh podatkov."
        confirmText="Povišaj"
        cancelText="Prekliči"
        isLoading={actionLoading}
        onConfirm={handlePromoteToAdmin}
      />

      <ConfirmDialog
        open={showConfirmDemote}
        onOpenChange={setShowConfirmDemote}
        title="Odstrani administratorske pravice"
        description="Ali ste prepričani, da želite odstraniti administratorske pravice temu uporabniku? Uporabnik ne bo več mogel dostopati do administratorske plošče."
        confirmText="Odstrani"
        cancelText="Prekliči"
        confirmVariant="destructive"
        isLoading={actionLoading}
        onConfirm={handleDemoteFromAdmin}
      />
    </>
  );
}
