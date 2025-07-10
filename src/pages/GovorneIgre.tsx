import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";

export default function GovorneIgre() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        <GamesList />
      </div>
    </div>
  );
}