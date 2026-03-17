import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

const letterMap: Record<string, string> = {
  c: "C",
  ch: "Č",
  k: "K",
  l: "L",
  r: "R",
  s: "S",
  sh: "Š",
  z: "Z",
  zh: "Ž",
};

export default function ArtikulacijaVajeRouter() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!gameId || !letterMap[gameId]) {
    return <Navigate to="/govorno-jezikovne-vaje/artikulacija" replace />;
  }

  const displayLetter = letterMap[gameId];

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20">
          <button
            onClick={() => navigate("/govorno-jezikovne-vaje/artikulacija")}
            className="absolute top-20 left-4 z-10 flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazaj
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-4">Glas {displayLetter}</h1>
          <p className="text-muted-foreground text-center">Stran je v pripravi 🚧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold text-foreground mb-4">Glas {displayLetter}</h1>
        <p className="text-muted-foreground">Stran je v pripravi 🚧</p>
        <button
          onClick={() => navigate("/govorno-jezikovne-vaje/artikulacija")}
          className="mt-6 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazaj na artikulacijo
        </button>
      </div>
    </div>
  );
}
