import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, HelpCircle } from "lucide-react";
import { FortuneWheel } from "@/components/wheel/FortuneWheel";
import { useFortuneWheel } from "@/hooks/useFortuneWheel";
import { useWordProgress } from "@/hooks/useWordProgress";
import { WheelSuccessDialog } from "@/components/wheel/WheelSuccessDialog";
import { ProgressModal } from "@/components/wheel/ProgressModal";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const wordsDataK = [
  { word: "KAČA", image: "kaca.png", audio: "kaca.m4a" },
  { word: "KAPA", image: "kapa.png", audio: "kapa.m4a" },
  { word: "KAVA", image: "kava.png", audio: "kava.m4a" },
  { word: "KLAVIR", image: "klavir.png", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc.png", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop.png", audio: "klop.m4a" },
  { word: "KNJIGA", image: "knjiga.png", audio: "knjiga.m4a" },
  { word: "KOCKA", image: "kocka.png", audio: "kocka.m4a" },
  { word: "KOKOS", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOKOŠ", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOLAČ", image: "kolac.png", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo.png", audio: "kolo.m4a" },
  { word: "KOŠ", image: "kos.png", audio: "kos.m4a" },
  { word: "KOST", image: "kost.png", audio: "kost.m4a" },
  { word: "KOŠARA", image: "kosara.png", audio: "kosara.m4a" },
  { word: "KOZA", image: "koza.png", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec.png", audio: "kozarec.m4a" },
  { word: "KRAVA", image: "krava.png", audio: "krava.m4a" },
  { word: "KROF", image: "krof.png", audio: "krof.m4a" },
  { word: "KROG", image: "krog.png", audio: "krog.m4a" },
  { word: "KROŽNIK", image: "kroznik.png", audio: "kroznik.m4a" },
  { word: "KRUH", image: "kruh.png", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara.png", audio: "kumara.m4a" },
  { word: "KUŽA", image: "kuza.png", audio: "kuza.m4a" }
];

const wordsList = wordsDataK.map(w => w.word);

export default function ArtikulacijaVajeK() {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isSpinning, rotation, selectedWord, selectedIndex, showResult, spinWheel, resetWheel, closeResult } = useFortuneWheel({ wordsData: wordsDataK });
  const { progress, incrementProgress, getProgress, resetProgress, resetWordProgress } = useWordProgress('K', wordsList);

  const handleBack = () => { setMenuOpen(false); setShowExitConfirmation(true); };
  const handleConfirmExit = () => { navigate('/govorno-jezikovne-vaje/artikulacija'); };
  const handleNewGame = () => { setMenuOpen(false); setShowNewGameConfirmation(true); };
  const handleConfirmNewGame = () => { resetWheel(); resetProgress(); setShowNewGameConfirmation(false); };
  const handleInstructions = () => { setMenuOpen(false); setShowInstructions(true); };
  const handleRecordComplete = () => { if (selectedWord) incrementProgress(selectedWord.word); };
  const handleStarClaimed = () => { if (selectedWord) resetWordProgress(selectedWord.word); closeResult(); };

  const currentWordProgress = selectedWord ? getProgress(selectedWord.word) : 0;

  return (
    <div className="fixed inset-0 overflow-auto select-none" style={{ backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">KOLO SREČE - K</h1>
        <FortuneWheel segmentCount={wordsDataK.length} rotation={rotation} isSpinning={isSpinning} onSpin={spinWheel} selectedIndex={selectedIndex} />
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
          <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🏠</span><span className="font-medium">Nazaj</span></button>
          <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">🔄</span><span className="font-medium">Nova igra</span></button>
          <button onClick={handleInstructions} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"><span className="text-xl">📖</span><span className="font-medium">Navodila</span></button>
        </DropdownMenuContent>
      </DropdownMenu>

      <button onClick={() => setShowProgressModal(true)} className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><HelpCircle className="w-8 h-8 text-white" /></button>

      {selectedWord && <WheelSuccessDialog isOpen={showResult} onOpenChange={(open) => { if (!open) closeResult(); }} completedImage={{ filename: selectedWord.image, word: selectedWord.word, audio: selectedWord.audio }} pronunciationCount={currentWordProgress} onRecordComplete={handleRecordComplete} onStarClaimed={handleStarClaimed} />}
      <ProgressModal isOpen={showProgressModal} onClose={() => setShowProgressModal(false)} words={wordsDataK} progress={progress} letter="K" />
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} type="articulation" />
      <MemoryExitConfirmationDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation} onConfirm={handleConfirmExit}><div /></MemoryExitConfirmationDialog>
      <ConfirmDialog open={showNewGameConfirmation} onOpenChange={setShowNewGameConfirmation} title="Nova igra" description="Ali res želiš začeti novo igro? Ves napredek bo ponastavljen na začetno stanje." confirmText="Da" cancelText="Ne" onConfirm={handleConfirmNewGame} onCancel={() => setShowNewGameConfirmation(false)} />
    </div>
  );
}
