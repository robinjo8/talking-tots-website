
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({
    enableRegistration: true,
    requireEmailVerification: true,
    enableNotifications: false,
    maintenanceMode: false,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
    toast({
      title: "Nastavitev posodobljena",
      description: `Nastavitev "${setting}" je bila uspešno spremenjena.`,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Nastavitve aplikacije</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nastavitve uporabnikov</CardTitle>
            <CardDescription>
              Nastavitve, povezane z registracijo in avtentikacijo uporabnikov
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableRegistration" className="text-base">Omogoči registracijo</Label>
                <p className="text-sm text-muted-foreground">
                  Če je onemogočeno, se novi uporabniki ne morejo registrirati
                </p>
              </div>
              <Switch 
                id="enableRegistration" 
                checked={settings.enableRegistration}
                onCheckedChange={() => handleToggle('enableRegistration')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification" className="text-base">Zahtevaj potrditev e-pošte</Label>
                <p className="text-sm text-muted-foreground">
                  Če je omogočeno, morajo uporabniki potrditi svoj e-poštni naslov
                </p>
              </div>
              <Switch 
                id="requireEmailVerification" 
                checked={settings.requireEmailVerification}
                onCheckedChange={() => handleToggle('requireEmailVerification')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Splošne nastavitve</CardTitle>
            <CardDescription>
              Nastavitve, ki vplivajo na delovanje aplikacije
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications" className="text-base">Omogoči obvestila</Label>
                <p className="text-sm text-muted-foreground">
                  Če je omogočeno, bodo uporabniki prejemali obvestila
                </p>
              </div>
              <Switch 
                id="enableNotifications" 
                checked={settings.enableNotifications}
                onCheckedChange={() => handleToggle('enableNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode" className="text-base">Način vzdrževanja</Label>
                <p className="text-sm text-muted-foreground">
                  Če je omogočeno, bo aplikacija v načinu vzdrževanja in nedostopna za uporabnike
                </p>
              </div>
              <Switch 
                id="maintenanceMode" 
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle('maintenanceMode')}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Shrani nastavitve</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
