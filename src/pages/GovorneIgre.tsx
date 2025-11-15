import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";

export default function GovorneIgre() {
  return <div className="min-h-screen relative bg-dragon-green">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Govorne igre
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        <GamesList />
      </div>
    </div>;
}