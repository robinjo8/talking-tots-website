
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Prosimo, vnesite vaš e-poštni naslov.");
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("E-pošta za ponastavitev gesla je bila poslana!");
    } catch (error: any) {
      console.error("Napaka pri ponastavitvi gesla:", error);
      setError("Prišlo je do napake. Prosimo, poskusite znova.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="E-pošta poslana">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Poslali smo vam e-pošto z navodili za ponastavitev gesla. 
            Prosimo, preverite vaš e-poštni predal.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-4">
              Nazaj na prijavo
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Ponastavite geslo" 
      subtitle="Vnesite vaš e-poštni naslov in poslali vam bomo navodila za ponastavitev gesla."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">E-pošta</Label>
          <Input
            id="email"
            type="email"
            placeholder="vnesite@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md text-base"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
          disabled={isLoading}
        >
          {isLoading ? "Pošiljanje..." : "Pošlji navodila za ponastavitev"}
        </Button>
        
        <div className="text-sm text-center">
          <Link to="/login" className="text-dragon-green hover:underline font-medium">
            Nazaj na prijavo
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
