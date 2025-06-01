
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function ProgressSection() {
  return (
    <Card className="mb-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-app-yellow/10 to-app-orange/10 rounded-t-2xl pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
            <Star className="h-6 w-6 text-app-orange" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4 text-center">
        <h3 className="text-lg font-semibold mb-2 text-app-orange">Moj napredek</h3>
        <p className="text-sm text-gray-600">
          Preglej, kaj je že opravljeno, koliko zvezdic je zbranih in kaj še čaka.
        </p>
      </CardContent>
    </Card>
  );
}
