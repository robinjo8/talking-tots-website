
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistemske nastavitve</CardTitle>
        <CardDescription>
          Upravljanje sistemskih nastavitev aplikacije Tomi Talk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Splošno</TabsTrigger>
            <TabsTrigger value="notifications">Obvestila</TabsTrigger>
            <TabsTrigger value="security">Varnost</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Splošne nastavitve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="block font-medium">Vzdrževalni način</Label>
                    <p className="text-sm text-muted-foreground">
                      Omogoči vzdrževalni način za vse uporabnike
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration-open" className="block font-medium">Registracije</Label>
                    <p className="text-sm text-muted-foreground">
                      Dovoli nove registracije uporabnikov
                    </p>
                  </div>
                  <Switch id="registration-open" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Prekliči</Button>
                <Button>Shrani nastavitve</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Nastavitve obvestil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="block font-medium">Email obvestila</Label>
                    <p className="text-sm text-muted-foreground">
                      Pošiljanje sistemskih email obvestil uporabnikom
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Prekliči</Button>
                <Button>Shrani nastavitve</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Varnostne nastavitve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enforce-2fa" className="block font-medium">Dvostopenjska avtentikacija</Label>
                    <p className="text-sm text-muted-foreground">
                      Zahtevaj dvostopenjsko avtentikacijo za administratorje
                    </p>
                  </div>
                  <Switch id="enforce-2fa" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Prekliči</Button>
                <Button>Shrani nastavitve</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
