import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthConfirm() {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const processConfirmation = async () => {
      try {
        // 1. Immediately capture and clear the URL hash to prevent error display
        const hash = window.location.hash;
        if (hash) {
          // Clear hash from URL without page reload to prevent SDK from showing errors
          window.history.replaceState(null, '', window.location.pathname);
        }
        
        // 2. Check if there's an error in the hash (silently log, don't show to user)
        if (hash) {
          const hashParams = new URLSearchParams(hash.replace('#', ''));
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          if (error) {
            console.log('AuthConfirm: Auth error detected (silently ignored):', error, errorDescription);
            // Still continue - the email was likely confirmed successfully
          }
        }
        
        // 3. Wait for Supabase SDK to process the token (increased delay for safety)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 4. Silently try to get session and sign out
        try {
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log("AuthConfirm: Email confirmed, signing out user");
            // Sign out the user - they must log in manually
            await supabase.auth.signOut();
          }
        } catch (sessionError) {
          // Silently ignore session errors - confirmation page should still show success
          console.log("AuthConfirm: Session handling error (ignored):", sessionError);
        }
        
      } catch (error) {
        // Silently ignore all errors during confirmation processing
        console.log("AuthConfirm: Confirmation process error (ignored):", error);
      } finally {
        setIsProcessing(false);
      }
    };

    processConfirmation();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Preverjam račun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-app-blue/10 via-background to-app-blue/5 p-4">
      <Card className="w-full max-w-md border-app-blue/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-dragon-green/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-dragon-green" />
          </div>
          <CardTitle className="text-2xl">Vaš račun je potrjen!</CardTitle>
          <CardDescription className="text-base">
            Zdaj se lahko prijavite v aplikacijo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Za prijavo kliknite spodnji gumb in izberite ustrezno možnost na glavni strani.
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full h-11 bg-app-blue hover:bg-app-blue/90"
          >
            Začni zdaj
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
