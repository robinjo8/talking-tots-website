import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthConfirm() {
  const [status, setStatus] = useState("Preverjam račun...");

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      // Longer delay to allow Supabase SDK to process #access_token from URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Retry logic - try up to 5 times to get session
      let session = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          session = data.session;
          console.log(`AuthConfirm: Session found on attempt ${attempt + 1}`);
          break;
        }
        console.log(`AuthConfirm: No session on attempt ${attempt + 1}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (session?.user) {
        const isLogopedist = session.user.user_metadata?.is_logopedist === true;
        console.log(`AuthConfirm: User found, is_logopedist=${isLogopedist}`);
        
        setStatus(isLogopedist ? "Preusmerjam na admin portal..." : "Preusmerjam...");
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use window.location.href for full page refresh to ensure clean state
        if (isLogopedist) {
          console.log("AuthConfirm: Redirecting logopedist to /admin");
          window.location.href = '/admin';
        } else {
          console.log("AuthConfirm: Redirecting regular user to /");
          window.location.href = '/';
        }
      } else {
        // No session after retries - redirect to login
        console.log("AuthConfirm: No session found after retries, redirecting to /login");
        setStatus("Seja ni najdena. Preusmerjam na prijavo...");
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/login';
      }
    };

    checkUserAndRedirect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
