
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function ProgressSection() {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6 text-app-orange" />
          Moj napredek
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-lg">
          Preglej, kaj je že opravljeno, koliko zvezdic je zbranih in kaj še čaka.
        </p>
      </CardContent>
    </Card>
  );
}
