
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { GamesList } from "@/components/games/GamesList";

export default function GovorneIgre() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Govorne igre" backPath="/moja-stran" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed govornih iger in začni vaditi izgovorjavo na zabaven način.
        </p>

        <GamesList />
      </div>
    </div>
  );
}
