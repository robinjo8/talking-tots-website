import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      // Supabase will automatically handle the token from URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && !error) {
        // Notify parent window that auth was successful
        if (window.opener) {
          window.opener.postMessage({ type: "AUTH_SUCCESS" }, window.location.origin);
        }
      }
      
      // Close popup window
      window.close();
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dragon-green mx-auto mb-4"></div>
        <p className="text-muted-foreground">Preverjanje prijave...</p>
      </div>
    </div>
  );
}
