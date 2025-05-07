
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analitika</CardTitle>
        <CardDescription>
          Pregled analitičnih podatkov o uporabi aplikacije Tomi Talk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Uporabniki</TabsTrigger>
            <TabsTrigger value="activity">Aktivnosti</TabsTrigger>
            <TabsTrigger value="progress">Napredek</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Statistika uporabnikov</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    V prihodnjih posodobitvah bo tukaj prikazan graf z analitiko uporabnikov.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Aktivnosti uporabnikov</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    V prihodnjih posodobitvah bo tukaj prikazan pregled aktivnosti uporabnikov.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Napredek otrok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    V prihodnjih posodobitvah bo tukaj prikazan pregled napredka otrok.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
