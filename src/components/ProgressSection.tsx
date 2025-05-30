
import { Star } from "lucide-react";

export function ProgressSection() {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-app-yellow/10 to-app-orange/10 border border-app-orange/20 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-5 w-5 text-app-orange" />
        <h3 className="text-lg font-semibold text-gray-800">
          Moj napredek
        </h3>
      </div>
      <p className="text-base text-gray-700">
        Preglej, kaj je že opravljeno, koliko zvezdic je zbranih in kaj še čaka.
      </p>
    </div>
  );
}
