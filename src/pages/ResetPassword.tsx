
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast({
          title: "Napaka",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Email poslan",
        description: "Preverite svojo e-pošto za navodila za ponastavitev gesla.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake. Poskusite znova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <AuthLayout
            title="Ponastavitev gesla"
            subTitle="Vnesite svoj e-poštni naslov za ponastavitev gesla"
          >
            {!isSubmitted ? (
              <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-pošta</Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button disabled={isLoading}>
                      {isLoading ? "Pošiljanje..." : "Ponastavi geslo"}
                    </Button>
                  </div>
                </form>
                <div className="mt-4 text-center text-sm">
                  <Link to="/login" className="underline">
                    Nazaj na prijavo
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  Na vaš e-poštni naslov smo poslali navodila za ponastavitev gesla.
                </p>
                <Link to="/login">
                  <Button>Nazaj na prijavo</Button>
                </Link>
              </div>
            )}
          </AuthLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
