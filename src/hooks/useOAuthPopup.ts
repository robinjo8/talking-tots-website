import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useOAuthPopup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === "AUTH_SUCCESS") {
        setIsLoading(false);
        // Session will be picked up by auth state listener
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get OAuth URL without automatic redirect
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) throw oauthError;
      if (!data.url) throw new Error("Ni URL-ja za prijavo");

      // Open popup window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        "google-oauth",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );

      if (!popup) {
        throw new Error("Popup okno je blokirano. Prosimo, dovolite popup okna.");
      }

      // Wait for popup to close
      return new Promise((resolve) => {
        const checkClosed = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkClosed);
            
            // Check if user is now logged in
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoading(false);
            resolve(!!session);
          }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          if (!popup.closed) {
            popup.close();
          }
          setIsLoading(false);
          resolve(false);
        }, 300000);
      });
    } catch (err: any) {
      setError(err.message || "Napaka pri prijavi z Google");
      setIsLoading(false);
      return false;
    }
  }, []);

  return { signInWithGoogle, isLoading, error };
}
