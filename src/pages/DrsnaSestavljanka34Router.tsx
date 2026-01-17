import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SlidingPuzzle34 } from "@/components/puzzle/SlidingPuzzle34";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { Home } from "lucide-react";

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
  const { recordGameCompletion } = useEnhancedProgress();
  const gameCompletedRef = useRef(false);

  const pool = imagesMap[letter] || imagesMap['r'];
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const currentImage = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [puzzleKey, pool]);
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${currentImage.filename}`;

  const handleComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameDialog(true);
  };

  const handleConfirmNewGame = () => {
    gameCompletedRef.current = false;
    setPuzzleKey(prev => prev + 1);
    setShowNewGameDialog(false);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleStarClaimed = () => {
    recordGameCompletion('sliding_puzzle', `sliding_puzzle_${letter}_3-4`);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const titleLetter = letter.toUpperCase();

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none"
      style={{
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main content */}
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          DRSNA SESTAVLJANKA - {titleLetter}
        </h1>
        
        <div className="w-full max-w-md">
          <SlidingPuzzle34 
            key={puzzleKey}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        </div>
      </div>

      {/* Floating Menu Button - Left */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          align="start"
          side="top"
          sideOffset={8}
        >
          <button
            onClick={handleBack}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Nazaj</span>
          </button>
          <button
            onClick={handleNewGame}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🔄</span>
            <span className="font-medium">Nova igra</span>
          </button>
          <button
            onClick={handleInstructions}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
          >
            <span className="text-xl">📖</span>
            <span className="font-medium">Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Instructions Modal */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
        type="sliding" 
      />

      {/* Puzzle Success Dialog */}
      <PuzzleSuccessDialog
        isOpen={showCompletion}
        onOpenChange={setShowCompletion}
        completedImage={currentImage}
        onStarClaimed={handleStarClaimed}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        title="Zapusti igro"
        description="Ali res želiš zapustiti igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={() => navigate("/govorne-igre/drsna-sestavljanka")}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* New Game Confirmation Dialog */}
      <ConfirmDialog
        open={showNewGameDialog}
        onOpenChange={setShowNewGameDialog}
        title="Nova igra"
        description="Ali res želiš začeti novo igro?"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleConfirmNewGame}
        onCancel={() => setShowNewGameDialog(false)}
      />
    </div>
  );
}
