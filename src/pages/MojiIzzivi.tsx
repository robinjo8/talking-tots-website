
import Header from "@/components/Header";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MojiIzzivi() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-16 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Tukaj boš našel svoje govorne izzive, ki jih lahko opraviš za dodatne točke!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card 
            className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
          >
            <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
              <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                  <Zap className="h-6 w-6 text-app-orange" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-4 flex-grow text-center">
              <h3 className="text-lg font-semibold mb-2 text-app-orange">Moji izzivi</h3>
              <p className="text-sm text-gray-600">
                Tukaj boš našel svoje govorne izzive, ki jih lahko opraviš za dodatne točke!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
