
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

type UserWithRole = {
  id: string;
  email: string;
  username: string | null;
  created_at: string;
  isAdmin: boolean;
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Fetch user roles to determine which users are admins
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (rolesError) throw rolesError;
      
      // Map admin role user_ids to a Set for faster lookups
      const adminUserIds = new Set(adminRoles?.map(role => role.user_id) || []);
      
      // Transform the data to include admin status
      const usersWithRoles = profiles?.map(profile => ({
        id: profile.id,
        email: profile.id, // Using id as email for now as we don't fetch auth.users table
        username: profile.username,
        created_at: profile.created_at,
        isAdmin: adminUserIds.has(profile.id),
      })) || [];
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Napaka pri nalaganju uporabnikov",
        description: "Prišlo je do napake pri pridobivanju seznama uporabnikov.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdminRole(userId: string, currentIsAdmin: boolean) {
    try {
      if (currentIsAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (error) throw error;
        
        toast({
          title: "Vloga odstranjena",
          description: "Uporabnik nima več administratorskih pravic.",
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
        
        toast({
          title: "Vloga dodana",
          description: "Uporabniku so bile dodeljene administratorske pravice.",
        });
      }
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error toggling admin role:", error);
      toast({
        title: "Napaka pri spreminjanju vloge",
        description: "Prišlo je do napake pri spreminjanju uporabniške vloge.",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upravljanje uporabnikov</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uporabniško ime</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Datum registracije</TableHead>
                <TableHead>Vloga</TableHead>
                <TableHead>Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username || 'Brez imena'}</TableCell>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge variant="default" className="bg-dragon-green">Admin</Badge>
                      ) : (
                        <Badge variant="outline">Uporabnik</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={user.isAdmin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleAdminRole(user.id, user.isAdmin)}
                      >
                        {user.isAdmin ? "Odstrani admin" : "Dodaj admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Ni najdenih uporabnikov
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
