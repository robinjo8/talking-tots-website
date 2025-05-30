
import { Star } from "lucide-react";

export function ProgressSection() {
  return (
    <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-app-orange/20 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-app-orange/10 rounded-full flex items-center justify-center">
          <Star className="h-4 w-4 text-app-orange" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          Moj napredek
        </h3>
      </div>
      <p className="text-sm text-gray-700">
        Preglej, kaj je že opravljeno, koliko zvezdic je zbranih in kaj še čaka.
      </p>
    </div>
  );
}
