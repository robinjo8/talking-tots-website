import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Google Client ID - pridobljen iz Google Cloud Console
const GOOGLE_CLIENT_ID = "573498067498-6li1k5cqfqk1tn1a68sj1lkg1g1h6l9d.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
  text?: string;
}

export function GoogleOneTapButton({ onError, disabled, text = "Nadaljuj z Google" }: GoogleOneTapButtonProps) {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const nonceRef = useRef<string>("");

  // Generate nonce for security
  const generateNonce = async (): Promise<{ nonce: string; hashedNonce: string }> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { nonce, hashedNonce };
  };

  useEffect(() => {
    // Check if Google SDK is already loaded
    if (window.google?.accounts?.id) {
      setSdkLoaded(true);
      return;
    }

    // Load Google Identity Services SDK
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google Identity Services SDK");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !window.google?.accounts?.id || !buttonRef.current) return;

    const initializeGoogle = async () => {
      try {
        const { nonce, hashedNonce } = await generateNonce();
        nonceRef.current = nonce;

        window.google!.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        });

        // Render custom button
        window.google!.accounts.id.renderButton(buttonRef.current!, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: buttonRef.current!.offsetWidth,
        });
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    };

    initializeGoogle();
  }, [sdkLoaded]);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
        nonce: nonceRef.current,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("Prijava uspešna!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      const errorMessage = error.message || "Napaka pri prijavi z Google";
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to OAuth if SDK doesn't load
  const handleFallbackSignIn = async () => {
    setIsLoading(true);
    onError?.("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      onError?.(err.message || "Napaka pri prijavi z Google");
      setIsLoading(false);
    }
  };

  // Show Google's rendered button when SDK is loaded
  if (sdkLoaded && window.google?.accounts?.id) {
    return (
      <div className="w-full">
        <div 
          ref={buttonRef} 
          className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full"
          style={{ minHeight: "44px" }}
        />
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            Prijavljanje...
          </div>
        )}
      </div>
    );
  }

  // Fallback button while SDK loads or if it fails
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full py-6 text-base font-medium"
      onClick={handleFallbackSignIn}
      disabled={disabled || isLoading}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "Prijavljanje..." : text}
    </Button>
  );
}
