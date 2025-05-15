
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

export default function ContentAdmin() {
  const [activeTab, setActiveTab] = useState("exercises");
  const [exercises, setExercises] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  async function fetchContent() {
    setLoading(true);
    try {
      if (activeTab === "exercises") {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setExercises(data || []);
      } else if (activeTab === "words") {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setWords(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upravljanje vsebine</h2>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="exercises">Vaje</TabsTrigger>
          <TabsTrigger value="words">Besede</TabsTrigger>
          <TabsTrigger value="memory">Spomin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Vaje</span>
                <Button size="sm" variant="outline">Dodaj novo vajo</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Naslov</TableHead>
                      <TableHead>Kategorija</TableHead>
                      <TableHead>Težavnost</TableHead>
                      <TableHead>Starost</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercises.length > 0 ? exercises.map(exercise => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-mono text-xs">{exercise.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{exercise.title}</TableCell>
                        <TableCell>{exercise.category}</TableCell>
                        <TableCell>{exercise.difficulty_level}</TableCell>
                        <TableCell>{exercise.age_range_min}-{exercise.age_range_max} let</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Uredi</Button>
                          <Button variant="destructive" size="sm">Izbriši</Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Ni najdenih vaj
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="words">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Besede</span>
                <Button size="sm" variant="outline">Dodaj novo besedo</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dragon-green"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Beseda</TableHead>
                      <TableHead>Kategorija</TableHead>
                      <TableHead>Težavnost</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {words.length > 0 ? words.map(word => (
                      <TableRow key={word.id}>
                        <TableCell className="font-mono text-xs">{word.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{word.word}</TableCell>
                        <TableCell>{word.category || 'Ni kategorije'}</TableCell>
                        <TableCell>{word.difficulty_level}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Uredi</Button>
                          <Button variant="destructive" size="sm">Izbriši</Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Ni najdenih besed
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Spomin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Upravljanje kartic za igro spomin</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg font-semibold">Spomin R</span>
                  <span className="text-sm text-muted-foreground">Uredi kartice</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg font-semibold">Spomin K</span>
                  <span className="text-sm text-muted-foreground">Uredi kartice</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg font-semibold">Spomin S</span>
                  <span className="text-sm text-muted-foreground">Uredi kartice</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
