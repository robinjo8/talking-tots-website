import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ThreeColumnGame } from "@/components/matching/ThreeColumnGame";
import { getRandomThreeColumnItems } from "@/data/threeColumnMatchingData";
import { toast } from "sonner";

export default function IgraUjemanjaK56() {
  const { selectedChild } = useAuth();
  const [gameItems] = useState(() => getRandomThreeColumnItems(4, 'K'));
  
  const handleGameComplete = (score: number) => {
    toast.success(`Bravo ${selectedChild?.name || 'Tian'}! Uspešno ste končali igro s ${score}% točnostjo!`);
  };

  const startNewGame = () => {
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-6 px-4">
        <ThreeColumnGame 
          items={gameItems}
          onGameComplete={handleGameComplete}
        />
      </div>
    </AppLayout>
  );
}