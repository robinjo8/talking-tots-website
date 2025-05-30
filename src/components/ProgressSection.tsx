
import { Star } from "lucide-react";

export function ProgressSection() {
  return (
    <div className="mb-6 p-4 bg-gray-50/80 border border-gray-200/60 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 bg-app-orange/15 rounded-lg flex items-center justify-center">
          <Star className="h-4 w-4 text-app-orange" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">
          Moj napredek
        </h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        Preglej, kaj je že opravljeno, koliko zvezdic je zbranih in kaj še čaka.
      </p>
    </div>
  );
}
