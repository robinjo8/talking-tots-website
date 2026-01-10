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
      // Wait for Supabase SDK to process #access_token from URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get session to confirm the token was processed
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("AuthConfirm: Email confirmed, signing out user");
        // Sign out the user - they must log in manually
        await supabase.auth.signOut();
      }
      
      setIsProcessing(false);
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
            Pojdi na glavno stran
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
