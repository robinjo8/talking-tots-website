
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function CreateInitialAdmin() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Prosimo, vnesite e-pošto administratorja.");
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      // First, find the user by email
      const { data: getUserData, error: getUserError } = await supabase.auth.admin.listUsers();
      
      if (getUserError) throw getUserError;
      
      const userToPromote = getUserData.users.find(u => u.email === email);
      
      if (!userToPromote) {
        setError("Uporabnik s to e-pošto ne obstaja.");
        return;
      }
      
      // Check if the user is already an admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userToPromote.id)
        .eq('role', 'admin')
        .single();
      
      if (existingRole) {
        setError("Ta uporabnik je že administrator.");
        return;
      }
      
      // Promote the user to admin
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userToPromote.id, role: 'admin' });
      
      if (insertError) throw insertError;
      
      setSuccess(`Uporabnik ${email} je bil uspešno povišan v administratorja.`);
      toast.success("Administrator uspešno dodan!");
    } catch (error: any) {
      console.error("Napaka pri nastavljanju administratorja:", error);
      setError("Napaka pri nastavljanju administratorja. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nastavi začetnega administratorja</CardTitle>
        <CardDescription>
          Ta obrazec je viden samo prvemu uporabniku. Uporabite ga za določitev administratorja sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handlePromoteToAdmin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">E-pošta uporabnika</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
        
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Nastavljanje..." : "Nastavi kot administratorja"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Administrator bo imel dostop do celotne administratorske plošče.
      </CardFooter>
    </Card>
  );
}
