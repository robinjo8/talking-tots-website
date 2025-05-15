
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, BookOpen, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    childrenCount: 0,
    exercisesCount: 0,
    progressCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Get children count
        const { count: childrenCount } = await supabase
          .from('children')
          .select('*', { count: 'exact', head: true });
        
        // Get exercises count
        const { count: exercisesCount } = await supabase
          .from('exercises')
          .select('*', { count: 'exact', head: true });
        
        // Get progress entries count
        const { count: progressCount } = await supabase
          .from('progress')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          usersCount: usersCount || 0,
          childrenCount: childrenCount || 0,
          exercisesCount: exercisesCount || 0,
          progressCount: progressCount || 0,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pregled</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Uporabniki</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usersCount}</div>
              <p className="text-xs text-muted-foreground">Skupno število uporabnikov</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Otroci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.childrenCount}</div>
              <p className="text-xs text-muted-foreground">Skupno število otrok</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vaje</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.exercisesCount}</div>
              <p className="text-xs text-muted-foreground">Skupno število vaj</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aktivnosti</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.progressCount}</div>
              <p className="text-xs text-muted-foreground">Skupno število opravljenih vaj</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Dobrodošli v Administratorskem portalu</h3>
        <p className="text-muted-foreground">
          Ta portal vam omogoča upravljanje z uporabniškimi računi, vsebino in nastavitvami aplikacije TomiTalk.
          Za navigacijo uporabite zavihke zgoraj.
        </p>
      </div>
    </div>
  );
}
