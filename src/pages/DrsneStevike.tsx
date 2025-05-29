
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import SlidePuzzle from "@/components/games/SlidePuzzle";

export default function DrsneStevilke() {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitConfirm(true);
      setPendingNavigation("/govorne-igre");
      // Push the current state back to prevent navigation
      window.history.pushState(null, '', window.location.pathname);
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to handle back button
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleBackClick = () => {
    setShowExitConfirm(true);
    setPendingNavigation("/govorne-igre");
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    setPendingNavigation(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <Header />
      
      {/* Header bar with back button and title */}
      <div className="flex-shrink-0 flex items-center gap-3 px-3 sm:px-4 py-2 bg-background border-b">
        <Button variant="ghost" size="sm" onClick={handleBackClick} className="text-xs sm:text-sm">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> 
          <span className="hidden xs:inline ml-1">Nazaj</span>
        </Button>
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
          Drsne številke
        </h1>
      </div>
      
      {/* Game container - fills remaining screen space with responsive padding */}
      <div className="flex-1 w-full overflow-hidden p-1 sm:p-2 md:p-4">
        <SlidePuzzle className="w-full h-full" />
      </div>

      {/* Exit confirmation dialog */}
      <ConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        title="Zapusti igro"
        description="Ali res želite zapustiti igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
}
