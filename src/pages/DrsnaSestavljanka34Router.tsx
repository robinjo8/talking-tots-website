import { AppLayout } from "@/components/AppLayout";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { RotateCcw, BookOpen, Home } from "lucide-react";

// Images by letter (reused from 5-6 versions)
const cImages = [
  { filename: 'cedilo.png', word: 'CEDILO' },
  { filename: 'cekin.png', word: 'CEKIN' },
  { filename: 'cerkev.png', word: 'CERKEV' },
  { filename: 'cesta.png', word: 'CESTA' },
  { filename: 'cev.png', word: 'CEV' },
  { filename: 'cirkus.png', word: 'CIRKUS' },
  { filename: 'cisterna.png', word: 'CISTERNA' },
  { filename: 'cokla.png', word: 'COKLA' },
  { filename: 'copat.png', word: 'COPAT' },
  { filename: 'cvet.png', word: 'CVET' }
];

const rImages = [
  { filename: 'raca.png', word: 'RACA' },
  { filename: 'rak.png', word: 'RAK' },
  { filename: 'raketa.png', word: 'RAKETA' },
  { filename: 'ravnilo.png', word: 'RAVNILO' },
  { filename: 'rep.png', word: 'REP' },
  { filename: 'repa.png', word: 'REPA' },
  { filename: 'riba.png', word: 'RIBA' },
  { filename: 'robot.png', word: 'ROBOT' },
  { filename: 'roka.png', word: 'ROKA' },
  { filename: 'rolka.png', word: 'ROLKA' },
  { filename: 'ropotuljica.png', word: 'ROPOTULJICA' },
  { filename: 'roza.png', word: 'ROŽA' }
];

const lImages = [
  { filename: 'ladja.png', word: 'LADJA' },
  { filename: 'led.png', word: 'LED' },
  { filename: 'letalo.png', word: 'LETALO' },
  { filename: 'lev.png', word: 'LEV' },
  { filename: 'list.png', word: 'LIST' },
  { filename: 'lizika.png', word: 'LIZIKA' },
  { filename: 'lonec.png', word: 'LONEC' },
  { filename: 'lopar.png', word: 'LOPAR' },
  { filename: 'lubenica.png', word: 'LUBENICA' },
  { filename: 'luc.png', word: 'LUČ' }
];

const kImages = [
  { filename: 'kaca.png', word: 'KAČA' },
  { filename: 'kapa.png', word: 'KAPA' },
  { filename: 'kava.png', word: 'KAVA' },
  { filename: 'klavir.png', word: 'KLAVIR' },
  { filename: 'kljuc.png', word: 'KLJUČ' },
  { filename: 'klop.png', word: 'KLOP' },
  { filename: 'knjiga.png', word: 'KNJIGA' },
  { filename: 'kocka.png', word: 'KOCKA' },
  { filename: 'kokos.png', word: 'KOKOŠ' },
  { filename: 'kolo.png', word: 'KOLO' },
  { filename: 'kost.png', word: 'KOST' },
  { filename: 'kos.png', word: 'KOŠ' },
  { filename: 'kosara.png', word: 'KOŠARA' },
  { filename: 'koza.png', word: 'KOZA' },
  { filename: 'krava.png', word: 'KRAVA' },
  { filename: 'kruh.png', word: 'KRUH' },
  { filename: 'kumara.png', word: 'KUMARA' },
  { filename: 'kuza.png', word: 'KUŽA' }
];

const čImages = [
  { filename: 'caj.png', word: 'ČAJ' },
  { filename: 'casopis.png', word: 'ČASOPIS' },
  { filename: 'cebela.png', word: 'ČEBELA' },
  { filename: 'cebula.png', word: 'ČEBULA' },
  { filename: 'cesen.png', word: 'ČESEN' },
  { filename: 'cevlji.png', word: 'ČEVLJI' },
  { filename: 'cokolada.png', word: 'ČOKOLADA' },
  { filename: 'coln.png', word: 'ČOLN' },
  { filename: 'copic.png', word: 'ČOPIČ' },
  { filename: 'crke.png', word: 'ČRKE' }
];

const sImages = [
  { filename: 'sedem.png', word: 'SEDEM' },
  { filename: 'sir.png', word: 'SIR' },
  { filename: 'sladoled.png', word: 'SLADOLED' },
  { filename: 'slika.png', word: 'SLIKA' },
  { filename: 'slon.png', word: 'SLON' },
  { filename: 'smreka.png', word: 'SMREKA' },
  { filename: 'sneg.png', word: 'SNEG' },
  { filename: 'snezak.png', word: 'SNEŽAK' },
  { filename: 'sok.png', word: 'SOK' },
  { filename: 'sonce.png', word: 'SONCE' },
  { filename: 'sova.png', word: 'SOVA' },
  { filename: 'stol.png', word: 'STOL' },
  { filename: 'svetilka.png', word: 'SVETILKA' },
  { filename: 'svincnik.png', word: 'SVINČNIK' }
];

const šImages = [
  { filename: 'sah.png', word: 'ŠAH' },
  { filename: 'sal.png', word: 'ŠAL' },
  { filename: 'scetka.png', word: 'ŠČETKA' },
  { filename: 'skarje.png', word: 'ŠKARJE' },
  { filename: 'skatla.png', word: 'ŠKATLA' },
  { filename: 'skoljka.png', word: 'ŠKOLJKA' },
  { filename: 'sopek.png', word: 'ŠOPEK' },
  { filename: 'sotor.png', word: 'ŠOTOR' },
  { filename: 'stampiljka.png', word: 'ŠTAMPILJKA' },
  { filename: 'storklja.png', word: 'ŠTORKLJA' }
];

const zImages = [
  { filename: 'zajec.png', word: 'ZAJEC' },
  { filename: 'zaslon.png', word: 'ZASLON' },
  { filename: 'zavesa.png', word: 'ZAVESE' },
  { filename: 'zebra.png', word: 'ZEBRA' },
  { filename: 'zlato.png', word: 'ZLATO' },
  { filename: 'zmaj.png', word: 'ZMAJ' },
  { filename: 'zob.png', word: 'ZOB' },
  { filename: 'zobotrebec.png', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.png', word: 'ZVEZDA' },
  { filename: 'zvocnik.png', word: 'ZVOČNIK' }
];

const žImages = [
  { filename: 'zaba.png', word: 'ŽABA' },
  { filename: 'zaga.png', word: 'ŽAGA' },
  { filename: 'zarnica.png', word: 'ŽARNICA' },
  { filename: 'zebelj.png', word: 'ŽEBELJ' },
  { filename: 'zelva.png', word: 'ŽELVA' },
  { filename: 'zerjav.png', word: 'ŽERJAV' },
  { filename: 'zirafa.png', word: 'ŽIRAFA' },
  { filename: 'zlica.png', word: 'ŽLICA' },
  { filename: 'zoga.png', word: 'ŽOGA' },
  { filename: 'zolna.png', word: 'ŽOLNA' }
];

const imagesMap: Record<string, { filename: string; word: string }[]> = {
  c: cImages,
  r: rImages,
  l: lImages,
  k: kImages,
  č: čImages,
  s: sImages,
  š: šImages,
  z: zImages,
  ž: žImages,
};

export default function DrsnaSestavljanka34Router() {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <DrsnaSestavljanka34Content />
    </AgeGatedRoute>
  );
}

function DrsnaSestavljanka34Content() {
  const { letter: rawLetter } = useParams();
  const letter = (rawLetter || 'r').toLowerCase();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);
  const effectiveFullscreen = isMobile;

  const pool = imagesMap[letter] || imagesMap['r'];
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const backgroundImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/47412.jpg";

  const currentImage = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [puzzleKey, pool]);
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;

  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setPuzzleKey(prev => prev + 1);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', `sliding_puzzle_${letter}_3-4`);
  };

  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          try {
            if ('orientation' in screen && 'lock' in screen.orientation) {
              (screen.orientation as any).lock('portrait').catch(() => {
                console.log('Screen orientation lock not supported');
              });
            }
          } catch (error) {
            console.log('Screen orientation lock not available');
          }
        } catch (error) {
          console.log('Fullscreen or orientation lock not supported:', error);
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

  const titleLetter = letter.toUpperCase();

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none touch-none overscroll-none">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        <div className="relative z-10 h-full flex items-center justify-center overflow-hidden">
          <div className="w-full px-4 my-[160px]">
            <SlidingPuzzle34 
              key={puzzleKey}
              imageUrl={imageUrl}
              onComplete={handleComplete}
              className="w-full h-full"
            />
          </div>
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            className="w-48 mb-2 ml-4 bg-white/95 backdrop-blur-sm border-2 border-orange-200 shadow-xl"
          >
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNewGame();
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowInstructions(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen relative">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        <div className="relative z-10 w-full bg-muted/30 flex justify-center items-center p-4 min-h-screen">
          <SlidingPuzzle34 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            className="w-48 mb-2 ml-4 bg-white/95 backdrop-blur-sm border-2 border-orange-200 shadow-xl"
          >
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNewGame();
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowInstructions(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="sliding" />
        <PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />
        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog}
          onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    </AppLayout>
  );
}
