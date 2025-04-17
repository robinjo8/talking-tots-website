
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useState } from "react";

export function SubscriptionSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
      <Card>
        <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-app-yellow" />
            <CardTitle>Naročnina</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-app-yellow hover:bg-app-yellow/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="hidden md:inline">Skrij podrobnosti</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="hidden md:inline">Prikaži podrobnosti</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="p-4">
            <p className="text-lg mb-6">
              Izberite paket, ki najbolj ustreza vašim potrebam. Primerjajte funkcije in cene naših paketov.
            </p>
            
            <div className="overflow-x-auto">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Lastnost</TableHead>
                    <TableHead className="w-1/4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-dragon-green font-bold">
                          <span className="inline-block w-4 h-4 bg-dragon-green rounded-full mr-1"></span>
                          Tomi MINI
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="w-1/4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-app-yellow font-bold">
                          <span className="inline-block w-4 h-4 bg-app-yellow rounded-full mr-1"></span>
                          Tomi MAXI
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="w-1/4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-app-blue font-bold">
                          <span className="inline-block w-4 h-4 bg-app-blue rounded-full mr-1"></span>
                          Tomi ULTRA
                        </span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Cena (mesečno)</TableCell>
                    <TableCell className="text-center font-semibold text-dragon-green">14,90 €</TableCell>
                    <TableCell className="text-center font-semibold text-app-yellow">19,90 €</TableCell>
                    <TableCell className="text-center font-semibold text-app-blue">29,90 €</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Cena (letno -30%)</TableCell>
                    <TableCell className="text-center font-semibold text-dragon-green">125 €</TableCell>
                    <TableCell className="text-center font-semibold text-app-yellow">167 €</TableCell>
                    <TableCell className="text-center font-semibold text-app-blue">251 €</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Število otrok</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center">2</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Vključuje</TableCell>
                    <TableCell className="text-sm p-4">
                      Osnovne govorne vaje, video navodila, napredek, 1–2 profila
                    </TableCell>
                    <TableCell className="text-sm p-4">
                      Vse iz MINI + personalizirani program, PDF poročila
                    </TableCell>
                    <TableCell className="text-sm p-4">
                      Vse iz MAXI + napredna analiza, AI mentor, igre, prioriteta
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Dodatni otrok</TableCell>
                    <TableCell className="text-center">+3,90 €/mesec</TableCell>
                    <TableCell className="text-center">+3,90 €/mesec</TableCell>
                    <TableCell className="text-center">+3,90 €/mesec</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Button 
                className="bg-dragon-green hover:bg-dragon-green/90 text-white"
                variant="default"
              >
                Izberi MINI
              </Button>
              <Button 
                className="bg-app-yellow hover:bg-app-yellow/90 text-white"
                variant="default"
              >
                Izberi MAXI
              </Button>
              <Button 
                className="bg-app-blue hover:bg-app-blue/90 text-white"
                variant="default"
              >
                Izberi ULTRA
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
