import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "850007835498-7cjj5ckk33h6c0llpc3jf3otp2osr6vq.apps.googleusercontent.com";

interface GoogleOneTapButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function GoogleOneTapButton({ onSuccess, onError, disabled }: GoogleOneTapButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const initializeGoogle = () => {
      if (!window.google) {
        setTimeout(initializeGoogle, 100);
        return;
      }

      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: buttonRef.current.offsetWidth || 320,
          text: "continue_with",
          shape: "rectangular",
          locale: "sl",
        });
      }
    };

    initializeGoogle();
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      onError(err.message || "Napaka pri prijavi z Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={buttonRef} 
      className={`w-full min-h-[44px] flex items-center justify-center ${disabled || isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    />
  );
}
