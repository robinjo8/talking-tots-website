import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

const OdjavaObvestil = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "confirm" | "success" | "resubscribed" | "error">("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Manjka žeton za odjavo. Povezava ni veljavna.");
      return;
    }

    try {
      // Decode JWT token (base64url)
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid token format");

      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        setStatus("error");
        setErrorMessage("Povezava za odjavo je potekla. Prosimo, uporabite novejšo povezavo iz zadnjega e-poštnega sporočila.");
        return;
      }

      if (!payload.sub) throw new Error("Missing user_id");

      setUserId(payload.sub);
      setStatus("confirm");
    } catch {
      setStatus("error");
      setErrorMessage("Neveljavna povezava za odjavo.");
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!userId) return;
    setStatus("loading");

    try {
      // Upsert email preference
      const { error } = await supabase
        .from("email_preferences" as any)
        .upsert(
          { user_id: userId, notifications_enabled: false, updated_at: new Date().toISOString() } as any,
          { onConflict: "user_id" }
        );

      if (error) throw error;
      setStatus("success");
    } catch (err: any) {
      console.error("Unsubscribe error:", err);
      setStatus("error");
      setErrorMessage("Prišlo je do napake. Prosimo, poskusite znova ali nas kontaktirajte.");
    }
  };

  const handleResubscribe = async () => {
    if (!userId) return;
    setStatus("loading");

    try {
      const { error } = await supabase
        .from("email_preferences" as any)
        .upsert(
          { user_id: userId, notifications_enabled: true, updated_at: new Date().toISOString() } as any,
          { onConflict: "user_id" }
        );

      if (error) throw error;
      setStatus("resubscribed");
    } catch (err: any) {
      console.error("Resubscribe error:", err);
      setStatus("error");
      setErrorMessage("Prišlo je do napake. Prosimo, poskusite znova.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-8 pt-24">
        <div className="text-center space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-dragon-green" />
              <p className="text-muted-foreground">Obdelava...</p>
            </div>
          )}

          {status === "confirm" && (
            <div className="space-y-6">
              <Mail className="h-16 w-16 text-dragon-green mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Odjava od e-poštnih obvestil</h1>
              <p className="text-muted-foreground leading-relaxed">
                Ali se želite odjaviti od prejemanja e-poštnih obvestil TomiTalk?
                To vključuje opomnike za preverjanje izgovorjave in obvestila o osebnih načrtih.
              </p>
              <p className="text-sm text-muted-foreground">
                Sistemska sporočila (potrditev registracije, sprememba gesla) boste še naprej prejemali.
              </p>
              <Button
                onClick={handleUnsubscribe}
                variant="destructive"
                size="lg"
                className="w-full sm:w-auto"
              >
                Potrdi odjavo
              </Button>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 text-dragon-green mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Uspešno odjavljeni</h1>
              <p className="text-muted-foreground leading-relaxed">
                Uspešno ste se odjavili od e-poštnih obvestil. Ne boste več prejemali opomnikov
                za preverjanje izgovorjave ali obvestil o osebnih načrtih.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Obvestila v aplikaciji bodo še vedno prikazana.
              </p>
              <Button
                onClick={handleResubscribe}
                variant="outline"
                size="lg"
              >
                Premislil sem si — želim prejemati obvestila
              </Button>
            </div>
          )}

          {status === "resubscribed" && (
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 text-dragon-green mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Ponovno prijavljeni</h1>
              <p className="text-muted-foreground leading-relaxed">
                Ponovno boste prejemali e-poštna obvestila TomiTalk.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Napaka</h1>
              <p className="text-muted-foreground leading-relaxed">{errorMessage}</p>
              <p className="text-sm text-muted-foreground">
                Za pomoč nas kontaktirajte na{" "}
                <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">
                  info@tomitalk.si
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OdjavaObvestil;
