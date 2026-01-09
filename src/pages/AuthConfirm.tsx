import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthConfirm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Preverjam račun...");

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      // Wait a moment for Supabase to process the confirmation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const isLogopedist = session.user.user_metadata?.is_logopedist === true;
        
        setStatus(isLogopedist ? "Preusmerjam na admin portal..." : "Preusmerjam...");
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (isLogopedist) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        // No session - redirect to login
        setStatus("Seja ni najdena. Preusmerjam na prijavo...");
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/login', { replace: true });
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
