import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export default function GovorneIgre() {
  const {
    profile,
    selectedChildIndex
  } = useAuth();
  const selectedChild = profile?.children?.[selectedChildIndex ?? 0];
  const childName = selectedChild?.name;
  return <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        <GamesList />
      </div>
    </div>;
}