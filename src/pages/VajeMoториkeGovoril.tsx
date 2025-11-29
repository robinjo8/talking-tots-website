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
const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";
const VajeMoториkeGovoril = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const exerciseProgressHook = useExerciseProgress();
  const {
    resetProgress
  } = exerciseProgressHook;
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile devices always get fullscreen, desktop never gets fullscreen
  const effectiveFullscreen = isMobile;
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

  // Enable fullscreen on mobile devices only
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };
      requestFullscreen();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [effectiveFullscreen]);
  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/oranzno_ozadje.png`;
  const gridClassName = isMobile ? "grid-cols-5" : "grid-cols-9";
  return <div className={`${effectiveFullscreen ? 'fixed inset-0 overflow-hidden' : 'min-h-screen'} relative`}>
      {/* Background image layer */}
      <div className={`${effectiveFullscreen ? 'fixed' : 'absolute'} inset-0 w-full h-full bg-cover bg-center bg-no-repeat`} style={{
      backgroundImage: `url('${backgroundImageUrl}')`,
      opacity: 0.8
    }} />
      
      <div className={`relative z-10 ${effectiveFullscreen ? 'h-full overflow-hidden pt-2' : 'container max-w-6xl mx-auto pt-20 pb-20 px-4'}`}>
        <SequentialExerciseGrid exerciseProgressHook={exerciseProgressHook} gridClassName={gridClassName} isMobile={isMobile} />
      </div>

      {/* Floating menu button */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <Home className="h-7 w-7 text-white" />
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
    </div>;
};
export default VajeMoториkeGovoril;