import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Play } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameZ } from "@/hooks/useMemoryGameZ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

export default function SpominZ() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;
  
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'z').toUpperCase();
  const { cards, isLoading, error, flipCard, resetGame, gameCompleted, matchedPairs, totalPairs, isCheckingMatch, showPairDialog, currentMatchedPair, handlePairDialogContinue, handlePairUnmatch } = useMemoryGameZ();
  const gameStartTimeRef = useRef<number | null>(null);
  const [gameTime, setGameTime] = useState<number | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const smallerDimension = Math.min(window.screen.width, window.screen.height);
      const isSmallScreen = smallerDimension <= 900;
      setIsTouchDevice(hasTouch && isSmallScreen);
    };
    checkDevice();
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    checkOrientation();
    const handleOrientationChange = () => { setTimeout(checkOrientation, 100); };
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) { window.screen.orientation.addEventListener('change', checkOrientation); }
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) { window.screen.orientation.removeEventListener('change', checkOrientation); }
    };
  }, []);

  const handleStartGame = async () => {
    try { if (document.documentElement.requestFullscreen) { await document.documentElement.requestFullscreen(); } } catch (error) { console.log('Fullscreen not supported:', error); }
    try {
      if (screen.orientation && 'lock' in screen.orientation) {
        try { await (screen.orientation as any).lock('landscape-primary'); } catch { try { await (screen.orientation as any).lock('landscape'); } catch (e) { console.log('Landscape lock not supported'); } }
      }
    } catch (error) { console.log('Orientation lock not supported:', error); }
    setGameStarted(true);
  };

  useEffect(() => {
    if (effectiveFullscreen && gameStarted) {
      return () => {
        if (document.fullscreenElement) { document.exitFullscreen?.(); }
        try { if (screen.orientation && 'unlock' in screen.orientation) { (screen.orientation as any).unlock(); } } catch (error) { console.log('Portrait unlock not supported:', error); }
      };
    }
  }, [effectiveFullscreen, gameStarted]);

  const handleCardClick = (index: number) => { if (!gameStartTimeRef.current && cards.length > 0) { gameStartTimeRef.current = Date.now(); } flipCard(index); };
  const handleReset = () => { resetGame(); gameStartTimeRef.current = null; setGameTime(null); toast({ title: "Igra je bila ponovno nastavljena!" }); };

  useEffect(() => {
    if (gameCompleted && gameStartTimeRef.current && gameTime === null) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - gameStartTimeRef.current) / 1000);
      setGameTime(timeTaken);
      setTimeout(() => { toast({ title: "Čestitamo!", description: `Igra je končana v ${timeTaken} sekundah!` }); }, 500);
    }
  }, [gameCompleted, gameStartTimeRef, gameTime, toast]);

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.png`;

  if (effectiveFullscreen) {
    if (!gameStarted) {
      return (
        <div className="fixed inset-0 overflow-hidden select-none">
          <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
          <div className="relative z-10 flex items-center justify-center h-full w-full">
            <button onClick={handleStartGame} className="flex flex-col items-center gap-4 px-12 py-8 bg-white/95 rounded-3xl shadow-2xl border-4 border-orange-300 transform transition-transform active:scale-95">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg"><Play className="h-10 w-10 text-white ml-1" /></div>
              <span className="text-2xl font-bold text-gray-800">Začni igro</span>
              <span className="text-sm text-gray-500">Obrni telefon v ležeči položaj</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
        <div className="relative z-10 flex-1 flex items-stretch justify-center overflow-hidden h-full w-full">
          {!isPortrait ? (
            isLoading ? (<div className="flex items-center justify-center h-full"><div className="text-lg text-muted-foreground">Nalaganje igre...</div></div>) :
            error ? (<div className="flex items-center justify-center h-full"><div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center"><h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3><p className="text-sm text-red-500">Poskusite znova kasneje.</p><Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Poskusi znova</Button></div></div>) :
            cards.length > 0 ? (<MemoryGrid cards={cards} onCardClick={handleCardClick} isCheckingMatch={isCheckingMatch} isLandscape={!isPortrait} />) :
            (<div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Ni kartic za prikaz.</p></div>)
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center"><p className="text-base font-semibold text-foreground">Za igranje igre Spomin prosim obrni telefon v ležeči položaj.</p></div>
          )}
        </div>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild><Button className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm" size="icon"><Home className="h-7 w-7 text-white" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🏠</span><span>Nazaj</span></button>
            <button onClick={() => { setMenuOpen(false); handleReset(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🔄</span><span>Nova igra</span></button>
            <button onClick={() => { setMenuOpen(false); setShowInfo(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"><span className="text-2xl">📖</span><span>Navodila</span></button>
          </DropdownMenuContent>
        </DropdownMenu>
        <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Navodila za igro Spomin" content="Ta igra je super za vadbo spomina in izgovorjave besed!

Klikni na dve ploščici in poskusi najti pravi par (sliko in besedo).

Ko najdeš par, se odpre okno z izgovorjavo – poslušaj in ponovi besedo na glas.

Če jo pravilno izgovoriš, se par obdrži!

Igra je končana, ko odkriješ vse pare in pravilno izgovoriš vse besede." />
        <MemoryPairDialog isOpen={showPairDialog} onClose={handlePairDialogContinue} onContinue={handlePairDialogContinue} onUnmatch={handlePairUnmatch} pairNumber={matchedPairs.length} totalPairs={totalPairs} imageUrl={currentMatchedPair?.image_url || null} word={currentMatchedPair?.word || null} audioUrl={currentMatchedPair?.audio_url || null} />
        <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={() => navigate("/govorne-igre/spomin")}><div /></MemoryExitConfirmationDialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
      <div className="relative z-10 container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4">
        <div className="px-4">
          <div className="w-full max-w-4xl mx-auto">
            {isLoading && <div className="text-lg text-muted-foreground">Nalaganje igre...</div>}
            {error && (<div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center"><h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3><p className="text-sm text-red-500">Poskusite znova kasneje.</p><Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Poskusi znova</Button></div>)}
            {!isLoading && !error && cards.length > 0 && (<><MemoryProgressIndicator matchedPairs={matchedPairs.length} totalPairs={totalPairs} /><div className="mt-8"><MemoryGrid cards={cards} onCardClick={handleCardClick} isCheckingMatch={isCheckingMatch} /></div></>)}
            {!isLoading && !error && cards.length === 0 && (<div className="text-center p-10 border rounded-lg"><p className="text-muted-foreground">Ni kartic za prikaz.</p></div>)}
          </div>
        </div>
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild><Button className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm" size="icon"><Home className="h-7 w-7 text-white" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
          <button onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🏠</span><span>Nazaj</span></button>
          <button onClick={() => { setMenuOpen(false); handleReset(); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"><span className="text-2xl">🔄</span><span>Nova igra</span></button>
          <button onClick={() => { setMenuOpen(false); setShowInfo(true); }} className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"><span className="text-2xl">📖</span><span>Navodila</span></button>
        </DropdownMenuContent>
      </DropdownMenu>
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Navodila za igro Spomin" content="Ta igra je super za vadbo spomina in izgovorjave besed!

Klikni na dve ploščici in poskusi najti pravi par (sliko in besedo).

Ko najdeš par, se odpre okno z izgovorjavo – poslušaj in ponovi besedo na glas.

Če jo pravilno izgovoriš, se par obdrži!

Igra je končana, ko odkriješ vse pare in pravilno izgovoriš vse besede." />
      <MemoryPairDialog isOpen={showPairDialog} onClose={handlePairDialogContinue} onContinue={handlePairDialogContinue} onUnmatch={handlePairUnmatch} pairNumber={matchedPairs.length} totalPairs={totalPairs} imageUrl={currentMatchedPair?.image_url || null} word={currentMatchedPair?.word || null} audioUrl={currentMatchedPair?.audio_url || null} />
      <MemoryExitConfirmationDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={() => navigate("/govorne-igre/spomin")}><div /></MemoryExitConfirmationDialog>
    </div>
  );
}
