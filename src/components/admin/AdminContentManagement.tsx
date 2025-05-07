
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminContentManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upravljanje vsebin</CardTitle>
        <CardDescription>
          Upravljanje vseh vsebin na aplikaciji Tomi Talk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="memory-games">
          <TabsList>
            <TabsTrigger value="memory-games">Igre spomina</TabsTrigger>
            <TabsTrigger value="speech-exercises">Govorne vaje</TabsTrigger>
            <TabsTrigger value="videos">Video navodila</TabsTrigger>
            <TabsTrigger value="challenges">Izzivi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="memory-games" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Igre spomina</CardTitle>
                <CardDescription>
                  Upravljanje iger spomina za različne črke
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  V prihodnjih posodobitvah boste tukaj lahko upravljali vse igre spomina, 
                  dodajali nove kartice, urejali obstoječe ali spreminjali zvočne posnetke.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="speech-exercises" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Govorne vaje</CardTitle>
                <CardDescription>
                  Upravljanje govornih vaj za različne črke in zvoke
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  V prihodnjih posodobitvah boste tukaj lahko upravljali vse govorne vaje,
                  dodajali nove besede za vajo, urejali obstoječe ali spreminjali zvočne posnetke.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Video navodila</CardTitle>
                <CardDescription>
                  Upravljanje video navodil za starše in otroke
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  V prihodnjih posodobitvah boste tukaj lahko nalagali nova video navodila,
                  urejali obstoječa ali jih odstranjevali.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Izzivi</CardTitle>
                <CardDescription>
                  Upravljanje izzivov za otroke
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  V prihodnjih posodobitvah boste tukaj lahko upravljali vse izzive,
                  ustvarjali nove, urejali obstoječe ali jih odstranjevali.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
