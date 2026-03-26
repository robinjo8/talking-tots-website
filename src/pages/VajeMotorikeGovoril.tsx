import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SequentialExerciseGrid } from "@/components/exercises/SequentialExerciseGrid";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { useIsMobile } from "@/hooks/use-mobile";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const exerciseProgressHook = useExerciseProgress();
  const { resetProgress } = exerciseProgressHook;
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleReset = () => {
    resetProgress();
    toast({
      title: "Vaje so bile ponovno nastavljene!"
    });
  };

  const handleConfirmExit = () => {
    navigate("/govorno-jezikovne-vaje");
  };

  const gridClassName = isMobile ? "grid-cols-3" : "grid-cols-9";

  return (
    <div className={cn(
      "bg-dragon-green",
      isMobile ? "fixed inset-0 overflow-auto flex flex-col" : "min-h-screen"
    )}>
      <Header />

      <SubscriptionGate>
        <div className={cn(
          "container max-w-6xl mx-auto px-4",
          isMobile ? "flex-1 flex flex-col pt-20 pb-24" : "pt-28 md:pt-32 pb-20"
        )}>
          {/* Title Section */}
          <div className={cn("text-center", isMobile ? "mb-3" : "mb-6")}>
            <h1 className={cn(
              "font-bold text-white mb-2",
              isMobile ? "text-2xl" : "text-4xl md:text-5xl"
            )}>
              Vaje motorike govoril
            </h1>
            {!isMobile && (
              <p className="text-white/80 text-lg mt-2">
                Vaje za krepitev mišic jezika, ustnic in čeljusti
              </p>
            )}
          </div>

          <SequentialExerciseGrid exerciseProgressHook={exerciseProgressHook} gridClassName={gridClassName} isMobile={isMobile} />
        </div>
      </SubscriptionGate>

      {/* Floating menu button */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
          <button onClick={() => {
            setMenuOpen(false);
            setShowExitDialog(true);
          }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100">
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button onClick={() => {
            setMenuOpen(false);
            handleReset();
          }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100">
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button onClick={() => {
            setMenuOpen(false);
            setShowInfo(true);
          }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium">
            <span className="text-2xl">📖</span>
            <span>Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Navodila za vaje motorike govoril" content="Vaje motorike govoril so namenjene krepitvi mišic jezika, ustnic in čeljusti.

Klikni na kartico in poglej sliko vaje.

Poslušaj navodilo in poskušaj ponoviti vajo.

Vsaka vaja pomaga pri boljši artikulaciji in izgovorjavi!" />

      <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={handleConfirmExit}>
        <div />
      </MemoryExitConfirmationDialog>
    </div>
  );
};
export default VajeMoториkeGovoril;
